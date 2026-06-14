# Runbook: Training

This runbook is for the future PyTorch training scaffold.

## Preconditions

- Dataset manifest exists and validates.
- Preprocessed frames exist under `data/processed/`.
- Train/validation/test split is video-level and fixed.
- No model artifacts are staged for commit.

## Target

Train the v1 lightweight baseline:

- Frozen MobileNetV3-Small feature extractor.
- Temporal average pooling.
- Shallow MLP classifier.
- Binary authentic versus AI-generated output.

## Steps

1. Load the processed manifest.
2. Confirm train and validation rows are present.
3. Load eight sampled frames per valid training video.
4. Extract frozen MobileNetV3-Small features.
5. Aggregate frame features with temporal average pooling.
6. Train the shallow MLP classifier.
7. Evaluate on the validation split.
8. Keep threshold 0.50 unless validation results justify a documented change.
9. Write model artifact and training metadata under `artifacts/models/`.
10. Confirm generated model files are ignored by git.

## Success Criteria

- Training completes without reading the test split.
- Artifact includes model version or run ID.
- Training metadata references manifest, seed, split, threshold, and hardware.
- Validation metrics are recorded.
- No model artifact is staged for commit.

## Failure Handling

- If training overfits severely, record it in the training report instead of
  changing the architecture silently.
- If threshold changes, document the validation metric and reason.
- If hardware is insufficient, record the hardware limit and stop before
  shrinking the dataset without approval.

