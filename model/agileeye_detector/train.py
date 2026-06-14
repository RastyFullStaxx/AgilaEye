"""Train the AgileEye pilot MLP from preprocessed feature rows."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

from .pilot_mlp import train_mlp, save_model
from .video_features import FEATURE_NAMES


def load_feature_rows(path: str | Path, split: str) -> tuple[list[list[float]], list[int], list[str]]:
    features: list[list[float]] = []
    labels: list[int] = []
    video_ids: list[str] = []
    with Path(path).open(newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            if row["split"] != split:
                continue
            features.append([float(row[name]) for name in FEATURE_NAMES])
            labels.append(1 if row["binary_label"] == "ai_generated" else 0)
            video_ids.append(row["video_id"])
    if not features:
        raise ValueError(f"No rows found for split={split}")
    return features, labels, video_ids


def main() -> None:
    parser = argparse.ArgumentParser(description="Train AgileEye pilot MLP.")
    parser.add_argument("--features", default="data/processed/manifests/pilot-100.features.csv")
    parser.add_argument("--out", default="artifacts/models/agileeye-pilot-mlp-v1.json")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--epochs", type=int, default=450)
    args = parser.parse_args()

    train_features, train_labels, train_ids = load_feature_rows(args.features, "train")
    model = train_mlp(train_features, train_labels, FEATURE_NAMES, seed=args.seed, epochs=args.epochs)
    save_model(
        model,
        args.out,
        {
            "features_path": args.features,
            "train_video_count": len(train_ids),
            "seed": args.seed,
            "epochs": args.epochs,
            "model_family": "standard-library shallow MLP over ffmpeg-derived video features",
        },
    )
    print(f"Wrote model artifact to {args.out}")


if __name__ == "__main__":
    main()
