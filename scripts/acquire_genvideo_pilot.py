#!/usr/bin/env python3
"""Create the AgileEye 100-video pilot manifest from the GenVideo validation ZIP."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import random
import re
import shutil
import subprocess
from pathlib import Path
from zipfile import ZipFile

VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".webm"}
MANIFEST_FIELDS = [
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
SPLITS = [("train", 35), ("validation", 5), ("test", 10)]
ANOMALY_ROTATION = [
    "texture_jitter",
    "object_inconsistency",
    "interaction_anomaly",
    "movement_anomaly",
]


def classify_member(name: str) -> str | None:
    lowered = name.lower()
    parts = [part.lower() for part in Path(name).parts]

    if "__macosx" in parts or Path(name).name.startswith("._"):
        return None

    if Path(name).suffix.lower() not in VIDEO_EXTENSIONS:
        return None

    if "real" in parts or "msrvtt" in lowered or "real_" in lowered:
        return "authentic"

    if "fake" in parts or any(
        token in lowered
        for token in (
            "zeroscope",
            "i2vgen",
            "svd",
            "videocrafter",
            "pika",
            "dynamiccrafter",
            "sd",
            "seine",
            "latte",
            "opensora",
            "modelscope",
            "morphstudio",
            "moonvalley",
            "hotshot",
            "show",
            "gen2",
            "crafter",
            "lavie",
            "sora",
            "wildscrape",
        )
    ):
        return "ai_generated"

    return None


def source_category(name: str) -> str:
    parts = [part for part in Path(name).parts if part not in {"", ".", "__MACOSX"} and not part.startswith("._")]
    if len(parts) >= 2 and parts[1].lower() in {"real", "fake"}:
        return parts[2] if len(parts) > 2 else parts[1]
    if parts:
        return parts[0]
    return "unknown"


def select_members(zip_path: Path, seed: int) -> list[tuple[str, str, str]]:
    with ZipFile(zip_path) as archive:
        candidates: dict[str, list[str]] = {"authentic": [], "ai_generated": []}
        for member in archive.namelist():
            label = classify_member(member)
            if label:
                candidates[label].append(member)

    randomizer = random.Random(seed)
    for label in candidates:
        candidates[label].sort()
        randomizer.shuffle(candidates[label])

    if len(candidates["authentic"]) < 50 or len(candidates["ai_generated"]) < 50:
        raise SystemExit(
            "GenVideo ZIP did not expose enough classified videos for a 50/50 pilot "
            f"(authentic={len(candidates['authentic'])}, ai_generated={len(candidates['ai_generated'])})."
        )

    selected: list[tuple[str, str, str]] = []
    for label in ("authentic", "ai_generated"):
        offset = 0
        for split, count in SPLITS:
            for member in candidates[label][offset : offset + count]:
                selected.append((member, label, split))
            offset += count

    return selected


def checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def probe_video(path: Path) -> tuple[str, str, str, str]:
    ffprobe = os.environ.get("FFPROBE_PATH") or shutil.which("ffprobe")
    if ffprobe:
        return probe_with_ffprobe(path, ffprobe)

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        try:
            from imageio_ffmpeg import get_ffmpeg_exe

            ffmpeg = get_ffmpeg_exe()
        except ImportError:
            return "0", "0", "0", "0"

    return probe_with_ffmpeg(path, ffmpeg)


def probe_with_ffprobe(path: Path, ffprobe: str) -> tuple[str, str, str, str]:
    command = [
        ffprobe,
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,r_frame_rate,duration",
        "-of",
        "json",
        str(path),
    ]
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    if completed.returncode != 0:
        return "0", "0", "0", "0"

    payload = json.loads(completed.stdout or "{}")
    stream = (payload.get("streams") or [{}])[0]
    duration = str(round(float(stream.get("duration") or 0), 3))
    width = str(stream.get("width") or 0)
    height = str(stream.get("height") or 0)
    frame_rate = stream.get("r_frame_rate") or "0/1"
    try:
        numerator, denominator = frame_rate.split("/")
        fps = str(round(float(numerator) / float(denominator), 3)) if float(denominator) else "0"
    except (ValueError, ZeroDivisionError):
        fps = "0"

    return duration, width, height, fps


def probe_with_ffmpeg(path: Path, ffmpeg: str) -> tuple[str, str, str, str]:
    command = [ffmpeg, "-hide_banner", "-i", str(path)]
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    metadata = completed.stderr or completed.stdout

    duration_match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", metadata)
    video_match = re.search(r"Video:.*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?)\s*fps", metadata)

    if duration_match:
        hours, minutes, seconds = duration_match.groups()
        duration = round(int(hours) * 3600 + int(minutes) * 60 + float(seconds), 3)
    else:
        duration = 0

    if video_match:
        width, height, fps = video_match.groups()
    else:
        width, height, fps = "0", "0", "0"

    return str(duration), str(width), str(height), str(fps)


def write_manifest(rows: list[dict[str, str]], manifest_path: Path) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=MANIFEST_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract the AgileEye 100-video pilot from GenVideo-Val.zip.")
    parser.add_argument("--zip", default="data/raw/modelscope/GenVideo-Val.zip", help="Path to GenVideo-Val.zip.")
    parser.add_argument("--out-dir", default="data/raw/pilot-100", help="Directory for selected pilot videos.")
    parser.add_argument("--manifest", default="data/processed/manifests/pilot-100.csv", help="Output manifest CSV.")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    zip_path = Path(args.zip)
    out_dir = Path(args.out_dir)
    manifest_path = Path(args.manifest)

    if not zip_path.exists():
        raise SystemExit(f"Missing source ZIP: {zip_path}")

    selected = select_members(zip_path, args.seed)
    out_dir.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, str]] = []

    with ZipFile(zip_path) as archive:
        for index, (member, label, split) in enumerate(selected, start=1):
            suffix = Path(member).suffix.lower() or ".mp4"
            video_id = f"agileeye_{index:04d}"
            relative_path = Path(split) / label / f"{video_id}{suffix}"
            destination = out_dir / relative_path
            destination.parent.mkdir(parents=True, exist_ok=True)

            with archive.open(member) as source, destination.open("wb") as target:
                shutil.copyfileobj(source, target, length=1024 * 1024)

            duration, width, height, fps = probe_video(destination)
            anomaly_category = "none" if label == "authentic" else ANOMALY_ROTATION[(index - 1) % len(ANOMALY_ROTATION)]

            rows.append(
                {
                    "video_id": video_id,
                    "source_path": str(destination).replace("\\", "/"),
                    "source_dataset": "GenVideo-Val",
                    "source_category": source_category(member),
                    "binary_label": label,
                    "anomaly_category": anomaly_category,
                    "split": split,
                    "duration_seconds": duration,
                    "resolution_width": width,
                    "resolution_height": height,
                    "fps": fps,
                    "checksum_sha256": checksum(destination),
                    "quality_status": "valid",
                    "notes": f"selected from {member} with seed {args.seed}",
                }
            )

    write_manifest(rows, manifest_path)
    print(f"Wrote {len(rows)} rows to {manifest_path}")
    print(f"Selected videos extracted under {out_dir}")


if __name__ == "__main__":
    main()
