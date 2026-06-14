# Modeling

AgilaEye v1 uses a lightweight PyTorch baseline. The goal is feasibility and
reproducibility, not state-of-the-art performance.

## Stack

- Python.
- PyTorch.
- torchvision.
- scikit-learn for metrics and split helpers when useful.
- OpenCV or equivalent for video/frame loading.

## Baseline Architecture

The v1 model should use:

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

