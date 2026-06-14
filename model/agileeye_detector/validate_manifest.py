"""Validate AgileEye pilot manifests from the command line."""

from __future__ import annotations

import argparse
from collections import Counter

from .manifest import load_manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate the AgileEye pilot manifest.")
    parser.add_argument("--manifest", default="data/processed/manifests/pilot-100.csv")
    parser.add_argument("--expect-pilot-100", action="store_true")
    args = parser.parse_args()

    rows = load_manifest(args.manifest)
    label_counts = Counter(row.binary_label for row in rows)
    split_counts = Counter(row.split for row in rows)
    label_split_counts = Counter((row.binary_label, row.split) for row in rows)

    if args.expect_pilot_100:
        expected_label_counts = Counter({"authentic": 50, "ai_generated": 50})
        expected_split_counts = Counter({"train": 70, "validation": 10, "test": 20})
        expected_label_split_counts = Counter(
            {
                ("authentic", "train"): 35,
                ("authentic", "validation"): 5,
                ("authentic", "test"): 10,
                ("ai_generated", "train"): 35,
                ("ai_generated", "validation"): 5,
                ("ai_generated", "test"): 10,
            }
        )
        if len(rows) != 100:
            raise SystemExit(f"Expected 100 rows, got {len(rows)}")
        if label_counts != expected_label_counts:
            raise SystemExit(f"Unexpected label counts: {dict(label_counts)}")
        if split_counts != expected_split_counts:
            raise SystemExit(f"Unexpected split counts: {dict(split_counts)}")
        if label_split_counts != expected_label_split_counts:
            raise SystemExit(f"Unexpected label/split counts: {dict(label_split_counts)}")

    print(f"Validated {len(rows)} manifest rows")
    print(f"Labels: {dict(label_counts)}")
    print(f"Splits: {dict(split_counts)}")


if __name__ == "__main__":
    main()
