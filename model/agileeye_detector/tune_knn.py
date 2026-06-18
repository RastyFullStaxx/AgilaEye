"""Tune a weighted kNN AgileEye pilot model using development data only."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from .evaluate import classification_metrics
from .knn import KnnModel, fit_scaler, predict_knn_probability, save_knn_model
from .video_features import FEATURE_NAMES


def load_rows(path: str | Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    with Path(path).open(newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            rows.append(
                {
                    "video_id": row["video_id"],
                    "split": row["split"],
                    "label": row["binary_label"],
                    "target": 1 if row["binary_label"] == "ai_generated" else 0,
                    "features": [float(row[name]) for name in FEATURE_NAMES],
                }
            )
    return rows


def make_feature_weight_sets() -> list[list[float]]:
    feature_count = len(FEATURE_NAMES)
    weights = [[1.0 for _ in range(feature_count)]]
    for index in range(feature_count):
        boosted = [1.0 for _ in range(feature_count)]
        boosted[index] = 2.0
        weights.append(boosted)
    for index in range(feature_count):
        reduced = [1.0 for _ in range(feature_count)]
        reduced[index] = 0.5
        weights.append(reduced)
    return weights


def evaluate_model(model: KnnModel, rows: list[dict[str, object]], threshold: float) -> dict[str, float | int]:
    prediction_rows = []
    for row in rows:
        probability = predict_knn_probability(model, row["features"])  # type: ignore[arg-type]
        prediction_rows.append(
            {
                "true_label": row["label"],
                "predicted_label": "ai_generated" if probability >= threshold else "authentic",
            }
        )
    return classification_metrics(prediction_rows)


def tune(features_path: str | Path, out_path: str | Path, report_path: str | Path) -> None:
    rows = load_rows(features_path)
    train_rows = [row for row in rows if row["split"] == "train"]
    validation_rows = [row for row in rows if row["split"] == "validation"]
    references = [
        (row["features"], row["target"])  # type: ignore[arg-type]
        for row in train_rows
    ]
    means, stds = fit_scaler([row["features"] for row in train_rows])  # type: ignore[list-item]

    candidates = []
    for k in range(1, 22, 2):
        for distance_power in [0.0, 1.0, 2.0, 3.0]:
            for feature_weights in make_feature_weight_sets():
                base_model = KnnModel(
                    feature_names=FEATURE_NAMES,
                    references=references,
                    means=means,
                    stds=stds,
                    k=k,
                    distance_power=distance_power,
                    feature_weights=feature_weights,
                    threshold=0.5,
                    model_version="AgileEye-Pilot-KNN-v1",
                )
                for threshold_index in range(1, 100):
                    threshold = threshold_index / 100
                    metrics = evaluate_model(base_model, validation_rows, threshold)
                    candidates.append(
                        {
                            "k": k,
                            "distance_power": distance_power,
                            "feature_weights": feature_weights,
                            "threshold": threshold,
                            "validation_metrics": metrics,
                        }
                    )

    def selection_key(candidate: dict[str, object]) -> tuple[float, float, float, float, float, int, float]:
        metrics = candidate["validation_metrics"]  # type: ignore[assignment]
        threshold = float(candidate["threshold"])
        return (
            float(metrics["f1_score"]),  # type: ignore[index]
            float(metrics["accuracy"]),  # type: ignore[index]
            float(metrics["recall"]),  # type: ignore[index]
            float(metrics["precision"]),  # type: ignore[index]
            -abs(threshold - 0.5),
            -int(candidate["k"]),
            -float(candidate["distance_power"]),
        )

    selected = max(candidates, key=selection_key)
    tuned_model = KnnModel(
        feature_names=FEATURE_NAMES,
        references=references,
        means=means,
        stds=stds,
        k=int(selected["k"]),
        distance_power=float(selected["distance_power"]),
        feature_weights=selected["feature_weights"],  # type: ignore[arg-type]
        threshold=float(selected["threshold"]),
        model_version="AgileEye-Pilot-KNN-v1",
    )
    save_knn_model(
        tuned_model,
        out_path,
        {
            "features_path": str(features_path),
            "train_video_count": len(train_rows),
            "validation_video_count": len(validation_rows),
            "threshold_selection": "best validation F1, then accuracy, recall, precision, closest-to-0.50 threshold, smaller k",
            "model_family": "standard-library weighted k-nearest-neighbor over ffmpeg-derived video features",
        },
    )

    report = {
        "selected_model": {
            "model_version": tuned_model.model_version,
            "threshold": tuned_model.threshold,
            "k": tuned_model.k,
            "distance_power": tuned_model.distance_power,
            "feature_weights": tuned_model.feature_weights,
            "validation_metrics": selected["validation_metrics"],
        },
        "candidate_count": len(candidates),
        "top_candidates": sorted(candidates, key=selection_key, reverse=True)[:10],
    }
    report_file = Path(report_path)
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote tuned kNN model to {out_path}")
    print(f"Wrote kNN tuning report to {report_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Tune AgileEye pilot kNN on the development split.")
    parser.add_argument("--features", default="data/processed/manifests/pilot-100.features.csv")
    parser.add_argument("--out", default="artifacts/models/agileeye-pilot-knn-v1.json")
    parser.add_argument("--report", default="reports/evaluation/pilot-knn-v1-tuning.json")
    args = parser.parse_args()
    tune(args.features, args.out, args.report)


if __name__ == "__main__":
    main()
