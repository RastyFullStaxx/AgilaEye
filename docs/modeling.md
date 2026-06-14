# Modeling

AgileEye v1 now has a working lightweight pilot MLP baseline and a documented
path to a heavier PyTorch MobileNetV3 baseline. The goal is feasibility and
reproducibility, not state-of-the-art performance.

## Stack

Current lightweight sidecar:

- Python standard library.
- Shallow MLP over deterministic feature vectors.
- Contract-compatible JSON output from `agileeye_detector.infer`.

Current dataset-backed pilot baseline:

- Python standard library.
- ffmpeg frame sampling via `@ffmpeg-installer/ffmpeg`.
- Seven visual/statistical video features.
- Trainable shallow MLP saved as JSON under `artifacts/models/`.
- Held-out test evaluation under `reports/evaluation/`.

Dataset-trained research extension:

- Python.
- PyTorch.
- torchvision.
- scikit-learn for metrics and split helpers when useful.
- OpenCV or equivalent for video/frame loading.

## Current Pilot MLP Architecture

The current working pilot model uses:

- Eight sampled frames per video.
- 224x224 RGB frame normalization for feature extraction.
- Video-level features: luminance mean/std, color deltas, temporal deltas, and
  edge energy.
- Standard-library shallow MLP with ReLU hidden layer and sigmoid output.
- Default threshold `0.50`.

Commands:

```bash
npm run data:validate
npm run ml:pipeline
npm run ml:infer:sample
```

Generated outputs:

- `data/processed/manifests/pilot-100.features.csv`
- `artifacts/models/agileeye-pilot-mlp-v1.json`
- `reports/evaluation/pilot-mlp-v1/metrics.json`
- `reports/evaluation/pilot-mlp-v1/predictions.csv`
- `reports/evaluation/pilot-mlp-v1/summary.md`

## PyTorch Baseline Architecture

The next heavier baseline should use:

- Pretrained MobileNetV3-Small as a frozen feature extractor.
- One feature vector per sampled frame.
- Temporal average pooling across the eight frame vectors.
- Shallow MLP binary classifier.
- Output score interpreted as AI-likelihood.

## Training Inputs

- Processed frame samples from `data/processed/`.
- Dataset manifest with train/validation/test split.
- Binary labels only: `authentic` and `ai_generated`.

The anomaly category should not be used as a training label in v1. It supports
explanation mapping.

## Threshold

Default threshold is 0.50.

If validation results show a better precision/recall balance, the threshold may
change only when the training report records:

- Previous threshold.
- New threshold.
- Validation metric used.
- Reason for change.

Do not choose a threshold on the test split.

## Artifacts

Write model artifacts under `artifacts/models/`.

Each artifact should have:

- Model version or run ID.
- Manifest path or hash.
- Training configuration.
- Threshold.
- Date/time.
- Notes about hardware used.

Do not commit model artifacts by default.

## Future Extension Points

Possible later baselines include:

- EfficientNet frame classifier with temporal pooling.
- ShuffleNetV2 with temporal pooling.
- TSM-MobileNetV2.
- Compact 3D CNN.
- MoViNet-A0.

Adding a new baseline should not change the v1 result contract. It should add a
new model adapter behind the Python sidecar.
