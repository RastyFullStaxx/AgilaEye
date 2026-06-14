"""Manifest loading and validation helpers for AgileEye."""

from __future__ import annotations

import csv
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

REQUIRED_FIELDS = [
    "video_id",
    "source_path",
    "source_dataset",
    "source_category",
    "binary_label",
    "anomaly_category",
    "split",
    "duration_seconds",
    "resolution_width",
    "resolution_height",
    "fps",
    "checksum_sha256",
    "quality_status",
    "notes",
]


@dataclass(frozen=True)
class ManifestRow:
    video_id: str
    source_path: str
    source_dataset: str
    source_category: str
    binary_label: str
    anomaly_category: str
    split: str
    duration_seconds: float
    resolution_width: int
    resolution_height: int
    fps: float
    checksum_sha256: str
    quality_status: str
    notes: str

    @property
    def label_value(self) -> int:
        return 1 if self.binary_label == "ai_generated" else 0


def load_manifest(path: str | Path) -> list[ManifestRow]:
    manifest_path = Path(path)
    with manifest_path.open(newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        missing = [field for field in REQUIRED_FIELDS if field not in (reader.fieldnames or [])]
        if missing:
            raise ValueError(f"Manifest is missing required fields: {', '.join(missing)}")

        rows = [
            ManifestRow(
                video_id=row["video_id"],
                source_path=row["source_path"],
                source_dataset=row["source_dataset"],
                source_category=row["source_category"],
                binary_label=row["binary_label"],
                anomaly_category=row["anomaly_category"],
                split=row["split"],
                duration_seconds=float(row["duration_seconds"]),
                resolution_width=int(float(row["resolution_width"])),
                resolution_height=int(float(row["resolution_height"])),
                fps=float(row["fps"]),
                checksum_sha256=row["checksum_sha256"],
                quality_status=row["quality_status"],
                notes=row["notes"],
            )
            for row in reader
        ]

    validate_manifest_rows(rows)
    return rows


def validate_manifest_rows(rows: list[ManifestRow]) -> None:
    ids = [row.video_id for row in rows]
    duplicate_ids = [video_id for video_id, count in Counter(ids).items() if count > 1]
    if duplicate_ids:
        raise ValueError(f"Duplicate video IDs: {', '.join(duplicate_ids)}")

    invalid_labels = sorted({row.binary_label for row in rows if row.binary_label not in {"authentic", "ai_generated"}})
    if invalid_labels:
        raise ValueError(f"Invalid labels: {', '.join(invalid_labels)}")

    invalid_splits = sorted({row.split for row in rows if row.split not in {"train", "validation", "test"}})
    if invalid_splits:
        raise ValueError(f"Invalid splits: {', '.join(invalid_splits)}")

    for row in rows:
        if row.quality_status == "valid" and not Path(row.source_path).exists():
            raise ValueError(f"Missing source video for {row.video_id}: {row.source_path}")
        if row.binary_label == "authentic" and row.anomaly_category != "none":
            raise ValueError(f"Authentic row {row.video_id} must use anomaly_category=none")
        if row.binary_label == "ai_generated" and row.anomaly_category == "none":
            raise ValueError(f"AI-generated row {row.video_id} must have an anomaly category")
