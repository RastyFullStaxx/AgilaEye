"""Preprocess AgileEye manifest videos into feature rows."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

from .manifest import load_manifest
from .video_features import FEATURE_NAMES, extract_video_features

FIELDNAMES = [
    "video_id",
    "source_path",
    "binary_label",
    "split",
    "anomaly_category",
    "quality_status",
    *FEATURE_NAMES,
]


def preprocess_manifest(manifest: str | Path, out: str | Path) -> None:
    rows = load_manifest(manifest)
    output_rows: list[dict[str, str]] = []

    for row in rows:
        features = extract_video_features(row.source_path)
        output_rows.append(
            {
                "video_id": row.video_id,
                "source_path": row.source_path,
                "binary_label": row.binary_label,
                "split": row.split,
                "anomaly_category": row.anomaly_category,
                "quality_status": row.quality_status,
                **{name: str(features.values[index]) for index, name in enumerate(features.names)},
            }
        )

    output_path = Path(out)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(output_rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract AgileEye pilot video features.")
    parser.add_argument("--manifest", default="data/processed/manifests/pilot-100.csv")
    parser.add_argument("--out", default="data/processed/manifests/pilot-100.features.csv")
    args = parser.parse_args()
    preprocess_manifest(args.manifest, args.out)
    print(f"Wrote features to {args.out}")


if __name__ == "__main__":
    main()
