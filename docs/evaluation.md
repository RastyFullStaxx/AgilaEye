# Evaluation

Evaluation should answer whether the lightweight detector is feasible as a
near-real-time first-level screening aid.

## Required Metrics

Classification metrics:

- Accuracy.
- Precision.
- Recall.
- F1-score.

Lightweight deployment metric:

- Average inference time per video.

Optional metrics:

- Median inference time.
- Model artifact size.
- Peak memory estimate.
- Confusion matrix.

## Evaluation Rules

- Evaluate on video-level predictions.
- Use only the held-out test split for final metrics.
- Report the threshold used.
- Report the model version or run ID.
- Report manifest path or hash.
- Report hardware used for timing.
- Do not tune threshold on the test split.

## Report Outputs

Generated outputs should live under:

```text
reports/evaluation/
  <run-id>/
    metrics.json
    predictions.csv
    summary.md
```

These generated reports are ignored by git unless a small final report is
explicitly curated.

## `metrics.json` Shape

Future evaluation tooling should emit:

```json
{
  "run_id": "pilot-100-baseline-001",
  "model_version": "mobilenetv3-small-mlp-001",
  "manifest": "data/processed/manifests/pilot-100.processed.csv",
  "threshold": 0.5,
  "accuracy": 0.0,
  "precision": 0.0,
  "recall": 0.0,
  "f1_score": 0.0,
  "average_inference_time_ms": 0.0,
  "test_video_count": 20,
  "hardware": "to be recorded"
}
```

## Acceptance

Evaluation is complete when:

- Metrics are computed from the test split only.
- Report references the dataset manifest and model artifact.
- Prediction rows include video ID, true label, predicted label, score, and
  inference time.
- Summary copy states that results come from a 100-video pilot study.

