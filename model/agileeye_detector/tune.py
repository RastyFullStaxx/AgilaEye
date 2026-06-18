"""Tune the AgileEye pilot MLP using the development split only."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from .evaluate import classification_metrics
from .pilot_mlp import PilotModel, predict_probability, save_model, train_mlp, with_threshold
from .video_features import FEATURE_NAMES


CandidateConfig = tuple[int, int, int, float]

DEFAULT_CANDIDATES: list[CandidateConfig] = [
    (42, 8, 600, 0.035),
    (42, 4, 300, 0.040),
    (7, 4, 250, 0.035),
    (13, 6, 300, 0.020),
    (71, 10, 250, 0.050),
    (101, 12, 300, 0.035),
]


def load_rows(path: str | Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    with Path(path).open(newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            rows.append(
                {
                    "video_id": row["video_id"],
                    "split": row["split"],
                    "label": row["binary_label"],
                    "features": [float(row[name]) for name in FEATURE_NAMES],
                }
            )
    return rows


def evaluate_model(model: PilotModel, rows: list[dict[str, object]], threshold: float) -> dict[str, float | int]:
    prediction_rows = []
    for row in rows:
        probability = predict_probability(model, row["features"])  # type: ignore[arg-type]
        prediction_rows.append(
            {
                "true_label": row["label"],
                "predicted_label": "ai_generated" if probability >= threshold else "authentic",
            }
        )
    return classification_metrics(prediction_rows)


def select_threshold(model: PilotModel, validation_rows: list[dict[str, object]]) -> tuple[float, dict[str, float | int]]:
    best_key: tuple[float, float, float, float, float] | None = None
    best_threshold = model.threshold
    best_metrics: dict[str, float | int] = {}

    for index in range(1, 100):
        threshold = index / 100
        metrics = evaluate_model(model, validation_rows, threshold)
        key = (
            float(metrics["f1_score"]),
            float(metrics["accuracy"]),
            float(metrics["recall"]),
            float(metrics["precision"]),
            -abs(threshold - 0.5),
        )
        if best_key is None or key > best_key:
            best_key = key
            best_threshold = threshold
            best_metrics = metrics

    return best_threshold, best_metrics


def tune(features_path: str | Path, out_path: str | Path, report_path: str | Path) -> None:
    rows = load_rows(features_path)
    train_rows = [row for row in rows if row["split"] == "train"]
    validation_rows = [row for row in rows if row["split"] == "validation"]

    candidates = []
    for seed, hidden_units, epochs, learning_rate in DEFAULT_CANDIDATES:
        model = train_mlp(
            [row["features"] for row in train_rows],  # type: ignore[list-item]
            [1 if row["label"] == "ai_generated" else 0 for row in train_rows],
            FEATURE_NAMES,
            seed=seed,
            hidden_units=hidden_units,
            epochs=epochs,
            learning_rate=learning_rate,
            model_version="AgileEye-Pilot-MLP-v2",
        )
        threshold, metrics = select_threshold(model, validation_rows)
        candidates.append(
            {
                "seed": seed,
                "hidden_units": hidden_units,
                "epochs": epochs,
                "learning_rate": learning_rate,
                "threshold": threshold,
                "validation_metrics": metrics,
                "model": model,
            }
        )

    def selection_key(candidate: dict[str, object]) -> tuple[float, float, float, float, float, int, int, float, int]:
        metrics = candidate["validation_metrics"]  # type: ignore[assignment]
        threshold = float(candidate["threshold"])
        return (
            float(metrics["f1_score"]),  # type: ignore[index]
            float(metrics["accuracy"]),  # type: ignore[index]
            float(metrics["recall"]),  # type: ignore[index]
            float(metrics["precision"]),  # type: ignore[index]
            -abs(threshold - 0.5),
            -int(candidate["hidden_units"]),
            -int(candidate["epochs"]),
            -float(candidate["learning_rate"]),
            -int(candidate["seed"]),
        )

    selected = max(candidates, key=selection_key)
    tuned_model = with_threshold(
        selected["model"],  # type: ignore[arg-type]
        float(selected["threshold"]),
        model_version="AgileEye-Pilot-MLP-v2",
    )
    save_model(
        tuned_model,
        out_path,
        {
            "features_path": str(features_path),
            "train_video_count": len(train_rows),
            "validation_video_count": len(validation_rows),
            "threshold_selection": "best validation F1, then accuracy, recall, precision, closest-to-0.50 threshold, smaller model",
            "selected_config": {
                "seed": selected["seed"],
                "hidden_units": selected["hidden_units"],
                "epochs": selected["epochs"],
                "learning_rate": selected["learning_rate"],
            },
            "model_family": "standard-library shallow MLP over ffmpeg-derived video features",
        },
    )

    report = {
        "selected_model": {
            "model_version": tuned_model.model_version,
            "threshold": tuned_model.threshold,
            "seed": selected["seed"],
            "hidden_units": selected["hidden_units"],
            "epochs": selected["epochs"],
            "learning_rate": selected["learning_rate"],
            "validation_metrics": selected["validation_metrics"],
        },
        "candidates": [
            {
                key: value
                for key, value in candidate.items()
                if key != "model"
            }
            for candidate in candidates
        ],
    }
    report_file = Path(report_path)
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote tuned model to {out_path}")
    print(f"Wrote tuning report to {report_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Tune AgileEye pilot MLP on the development split.")
    parser.add_argument("--features", default="data/processed/manifests/pilot-100.features.csv")
    parser.add_argument("--out", default="artifacts/models/agileeye-pilot-mlp-v2.json")
    parser.add_argument("--report", default="reports/evaluation/pilot-mlp-v2-tuning.json")
    args = parser.parse_args()
    tune(args.features, args.out, args.report)


if __name__ == "__main__":
    main()
