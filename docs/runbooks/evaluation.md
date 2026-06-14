# Runbook: Evaluation

## Current Pilot MLP Evaluation

Run:

```bash
npm run ml:evaluate
```

Inspect:

```text
reports/evaluation/pilot-mlp-v1/metrics.json
reports/evaluation/pilot-mlp-v1/predictions.csv
reports/evaluation/pilot-mlp-v1/summary.md
```

The current first-pass report uses only the held-out test split from
`data/processed/manifests/pilot-100.features.csv`.

## Future PyTorch Evaluation Scaffold

## Preconditions

- Model artifact exists under `artifacts/models/`.
- Processed manifest exists.
- Test split has not been used for training or threshold tuning.
- Evaluation output path under `reports/evaluation/` is ignored by git.

## Target

Generate a reproducible pilot evaluation report with:

- Accuracy.
- Precision.
- Recall.
- F1-score.
- Average inference time.

## Steps

1. Load model artifact and threshold.
2. Load processed manifest.
3. Select only test split rows.
4. Run video-level inference for each test video.
5. Record prediction, score, true label, and inference time.
6. Compute classification metrics.
7. Write `metrics.json`, `predictions.csv`, and `summary.md`.
8. Include manifest reference, seed, threshold, model version, and hardware.
9. Confirm generated report files are ignored unless deliberately curated.

## Success Criteria

- Test count is 20 videos.
- Metrics are computed at video level.
- Summary states that results are from a 100-video pilot.
- Inference-time metric includes hardware context.
- No generated report is staged by accident.

## Failure Handling

- If evaluation fails for a test video, record the video ID and reason.
- If invalid rows are discovered, update the manifest quality status and rerun
  from preprocessing.
- If results are poor, report them as pilot findings. Do not hide failed runs.
