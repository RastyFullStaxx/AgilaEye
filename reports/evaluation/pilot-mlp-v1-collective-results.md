# AgileEye Pilot MLP Collective Results

These results come from the 100-video AgileEye pilot set using
`AgileEye-Pilot-MLP-v1` at threshold `0.5`. Model development includes the train
and validation splits (`n=80`). Model testing uses the held-out test split
(`n=20`). Results are video-level screening outputs, not forensic proof.

## Performance of the Lightweight AI-Based Model in Classifying Videos as AI-Generated or Authentic

| Phase | Accuracy | Precision | Recall | F1-Score |
| --- | ---: | ---: | ---: | ---: |
| Model Development | 96.25% | 95.12% | 97.50% | 96.30% |
| Model Testing | 70.00% | 70.00% | 70.00% | 70.00% |

## Performance of the Lightweight AI-Based Model Based on Inference Time

| Phase | Inference Time (seconds) |
| --- | ---: |
| Model Development | 0.000014 |
| Model Testing | 0.000018 |

## Per-Video Logs

- All 100 videos: `reports/evaluation/pilot-mlp-v1-all/predictions.csv`
- Model development: `reports/evaluation/pilot-mlp-v1-development/predictions.csv`
- Model testing: `reports/evaluation/pilot-mlp-v1-testing/predictions.csv`
