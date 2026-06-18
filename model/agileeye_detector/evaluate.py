"""Evaluate the AgileEye pilot MLP on the held-out test split."""

from __future__ import annotations

import argparse
import csv
import json
import platform
import time
from pathlib import Path

from .knn import load_knn_model, predict_knn_probability
from .pilot_mlp import load_model, predict_probability
from .video_features import FEATURE_NAMES


def classification_metrics(rows: list[dict[str, object]]) -> dict[str, float | int]:
    tp = sum(1 for row in rows if row["true_label"] == "ai_generated" and row["predicted_label"] == "ai_generated")
    tn = sum(1 for row in rows if row["true_label"] == "authentic" and row["predicted_label"] == "authentic")
    fp = sum(1 for row in rows if row["true_label"] == "authentic" and row["predicted_label"] == "ai_generated")
    fn = sum(1 for row in rows if row["true_label"] == "ai_generated" and row["predicted_label"] == "authentic")
    total = len(rows)
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if precision + recall else 0.0
    return {
        "accuracy": (tp + tn) / total if total else 0.0,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "true_positive": tp,
        "true_negative": tn,
        "false_positive": fp,
        "false_negative": fn,
    }


def row_matches_split(row_split: str, requested_split: str) -> bool:
    if requested_split == "all":
        return True
    if requested_split == "development":
        return row_split in {"train", "validation"}
    if requested_split == "testing":
        return row_split == "test"
    return row_split == requested_split


def evaluate(features_path: str | Path, model_path: str | Path, out_dir: str | Path, split: str = "test") -> None:
    model_payload = json.loads(Path(model_path).read_text(encoding="utf-8"))
    if "references" in model_payload:
        model = load_knn_model(model_path)
        probability_fn = predict_knn_probability
    else:
        model = load_model(model_path)
        probability_fn = predict_probability
    report_dir = Path(out_dir)
    report_dir.mkdir(parents=True, exist_ok=True)
    prediction_rows: list[dict[str, object]] = []

    with Path(features_path).open(newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            if not row_matches_split(row["split"], split):
                continue
            values = [float(row[name]) for name in FEATURE_NAMES]
            start = time.perf_counter()
            probability = probability_fn(model, values)
            elapsed_ms = (time.perf_counter() - start) * 1000.0
            predicted_label = "ai_generated" if probability >= model.threshold else "authentic"
            prediction_rows.append(
                {
                    "video_id": row["video_id"],
                    "split": row["split"],
                    "true_label": row["binary_label"],
                    "predicted_label": predicted_label,
                    "ai_likelihood": probability,
                    "score": round(probability * 100),
                    "inference_time_ms": elapsed_ms,
                }
            )

    metrics = classification_metrics(prediction_rows)
    metrics_payload = {
        "run_id": report_dir.name,
        "model_version": model.model_version,
        "model_artifact": str(model_path),
        "features": str(features_path),
        "threshold": model.threshold,
        "split": split,
        "video_count": len(prediction_rows),
        "test_video_count": len(prediction_rows) if split in {"test", "testing"} else 0,
        "average_inference_time_ms": (
            sum(float(row["inference_time_ms"]) for row in prediction_rows) / len(prediction_rows)
            if prediction_rows
            else 0.0
        ),
        "hardware": platform.platform(),
        **metrics,
    }

    with (report_dir / "predictions.csv").open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(prediction_rows[0].keys()))
        writer.writeheader()
        writer.writerows(prediction_rows)

    (report_dir / "metrics.json").write_text(json.dumps(metrics_payload, indent=2) + "\n", encoding="utf-8")
    (report_dir / "summary.md").write_text(
        "\n".join(
            [
                "# AgileEye Pilot MLP Evaluation",
                "",
                f"- Model: `{model.model_version}`",
                f"- Split: {split}",
                f"- Videos: {len(prediction_rows)}",
                f"- Accuracy: {metrics_payload['accuracy']:.3f}",
                f"- Precision: {metrics_payload['precision']:.3f}",
                f"- Recall: {metrics_payload['recall']:.3f}",
                f"- F1-score: {metrics_payload['f1_score']:.3f}",
                f"- Average inference time: {metrics_payload['average_inference_time_ms'] / 1000:.6f} seconds",
                f"- Threshold: {model.threshold}",
                "",
                "These results come from the 100-video AgileEye pilot study and are not forensic proof.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote evaluation report to {report_dir}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate AgileEye pilot MLP.")
    parser.add_argument("--features", default="data/processed/manifests/pilot-100.features.csv")
    parser.add_argument("--model", default="artifacts/models/agileeye-pilot-mlp-v1.json")
    parser.add_argument("--out-dir", default="reports/evaluation/pilot-mlp-v1")
    parser.add_argument("--split", default="test")
    args = parser.parse_args()
    evaluate(args.features, args.model, args.out_dir, args.split)


if __name__ == "__main__":
    main()
