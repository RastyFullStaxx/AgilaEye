# Preprocessing

Preprocessing turns selected manifest videos into model-ready frame samples. It
must be deterministic, lightweight, and safe to repeat.

## Inputs

- Dataset manifest CSV.
- Source videos under `data/raw/` or another documented local path.
- Fixed preprocessing configuration.

## Defaults

- Frames per video: 8.
- Sampling strategy: uniformly spaced across the full video.
- Output frame size: 224x224.
- Normalization: torchvision MobileNetV3-compatible normalization.
- Split source: manifest `split` field.

## Processing Steps

1. Load the manifest.
2. Probe each source video for readability, duration, resolution, and FPS.
3. Skip rows whose source file is missing or unreadable.
4. Compute eight target frame positions.
5. Read target frames.
6. If a video is too short, repeat available frames or reduce the interval.
7. Resize each frame to 224x224.
8. Normalize frames for MobileNetV3.
9. Write processed outputs under `data/processed/`.
10. Record quality status and any exclusions.

## Current Command

The current working preprocessing command writes compact video-level features
for the pilot MLP:

```bash
npm run ml:preprocess
```

Output:

```text
data/processed/manifests/pilot-100.features.csv
```

The current implementation extracts eight frames through ffmpeg and computes
video-level luminance, color, temporal, and edge-energy features. The heavier
MobileNetV3 tensor preprocessing path remains a future extension.

## Output Layout

Recommended local layout:

```text
data/processed/
  manifests/
    pilot-100.csv
    pilot-100.processed.csv
  frames/
    train/<video_id>/frame_000.jpg
    validation/<video_id>/frame_000.jpg
    test/<video_id>/frame_000.jpg
```

Generated processed data must remain ignored by git.

## Quality Rules

- Unreadable videos are excluded and recorded as `excluded_unreadable`.
- Videos with fewer readable frames than expected may be kept only when the
  sampling fallback is documented.
- Split assignment must never change during preprocessing.
- Preprocessing must not inspect labels to choose different frame positions.
- Audio and metadata must not be used as model features.

## Test Scenarios

Future preprocessing tests should cover:

- Normal video with eight sampled frames.
- Very short video using fallback behavior.
- Missing source path.
- Corrupted or unreadable file.
- Manifest split preservation.
- Repeated run with identical output for the same seed and inputs.
