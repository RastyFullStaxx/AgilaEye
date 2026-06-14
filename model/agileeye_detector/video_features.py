"""Video frame sampling and feature extraction for the AgileEye pilot model."""

from __future__ import annotations

import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

FRAME_SIZE = 224
FRAMES_PER_VIDEO = 8
FEATURE_NAMES = [
    "luma_mean",
    "luma_std",
    "red_green_delta",
    "blue_green_delta",
    "temporal_luma_delta",
    "temporal_color_delta",
    "edge_energy",
]


@dataclass(frozen=True)
class VideoFeatures:
    names: list[str]
    values: list[float]


def resolve_ffmpeg() -> str:
    ffmpeg = os.environ.get("FFMPEG_PATH") or shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("Missing ffmpeg. Set FFMPEG_PATH or install @ffmpeg-installer/ffmpeg.")
    return ffmpeg


def sample_video_rgb(video_path: str | Path, frame_count: int = FRAMES_PER_VIDEO, frame_size: int = FRAME_SIZE) -> list[bytes]:
    ffmpeg = resolve_ffmpeg()
    command = [
        ffmpeg,
        "-v",
        "error",
        "-i",
        str(video_path),
        "-vf",
        f"fps={frame_count},scale={frame_size}:{frame_size}:force_original_aspect_ratio=decrease,"
        f"pad={frame_size}:{frame_size}:(ow-iw)/2:(oh-ih)/2",
        "-frames:v",
        str(frame_count),
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-",
    ]
    completed = subprocess.run(command, capture_output=True, check=False)
    if completed.returncode != 0:
        raise RuntimeError(f"ffmpeg failed for {video_path}: {completed.stderr.decode(errors='ignore')}")

    frame_bytes = frame_size * frame_size * 3
    frames = [
        completed.stdout[index : index + frame_bytes]
        for index in range(0, len(completed.stdout), frame_bytes)
        if len(completed.stdout[index : index + frame_bytes]) == frame_bytes
    ]
    if not frames:
        raise RuntimeError(f"No frames decoded for {video_path}")

    while len(frames) < frame_count:
        frames.append(frames[-1])

    return frames[:frame_count]


def _mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _std(values: list[float], mean: float) -> float:
    return (sum((value - mean) ** 2 for value in values) / len(values)) ** 0.5 if values else 0.0


def _frame_stats(frame: bytes, frame_size: int) -> tuple[float, float, float, float, float]:
    luma_values: list[float] = []
    red_values: list[float] = []
    green_values: list[float] = []
    blue_values: list[float] = []
    edge_values: list[float] = []
    previous_luma = 0.0

    for pixel_index in range(0, len(frame), 3):
        red = frame[pixel_index] / 255.0
        green = frame[pixel_index + 1] / 255.0
        blue = frame[pixel_index + 2] / 255.0
        luma = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
        luma_values.append(luma)
        red_values.append(red)
        green_values.append(green)
        blue_values.append(blue)

        x = (pixel_index // 3) % frame_size
        if x > 0:
            edge_values.append(abs(luma - previous_luma))
        previous_luma = luma

    luma_mean = _mean(luma_values)
    return (
        luma_mean,
        _std(luma_values, luma_mean),
        abs(_mean(red_values) - _mean(green_values)),
        abs(_mean(blue_values) - _mean(green_values)),
        _mean(edge_values),
    )


def extract_video_features(video_path: str | Path) -> VideoFeatures:
    frames = sample_video_rgb(video_path)
    frame_stats = [_frame_stats(frame, FRAME_SIZE) for frame in frames]

    luma_means = [stats[0] for stats in frame_stats]
    luma_stds = [stats[1] for stats in frame_stats]
    red_green_deltas = [stats[2] for stats in frame_stats]
    blue_green_deltas = [stats[3] for stats in frame_stats]
    edge_values = [stats[4] for stats in frame_stats]
    temporal_luma = [abs(luma_means[index] - luma_means[index - 1]) for index in range(1, len(luma_means))]
    temporal_color = [
        abs(red_green_deltas[index] - red_green_deltas[index - 1])
        + abs(blue_green_deltas[index] - blue_green_deltas[index - 1])
        for index in range(1, len(red_green_deltas))
    ]

    values = [
        _mean(luma_means),
        _mean(luma_stds),
        _mean(red_green_deltas),
        _mean(blue_green_deltas),
        _mean(temporal_luma),
        _mean(temporal_color),
        _mean(edge_values),
    ]

    return VideoFeatures(names=FEATURE_NAMES, values=values)
