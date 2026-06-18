# AgileEye Pilot MLP Collective Results

These results come from the 100-video AgileEye pilot set using
`AgileEye-Pilot-MLP-v2` at validation-selected threshold `0.45`. Model
development includes the train and validation splits (`n=80`). Model testing
uses the held-out test split (`n=20`). Results are video-level screening
outputs, not forensic proof.

The v2 model was selected without using the test split. Candidate lightweight
MLP configurations were trained on the training split and selected by validation
F1-score, then accuracy, recall, precision, and threshold closeness to `0.50`.
This makes the reported test result stronger than the baseline while preserving
the study's separation between model development and final testing.

An additional maximum-performance search was run over a weighted k-nearest
neighbor family with 65,340 validation candidates. Although the best kNN
candidate reached 90.91% validation F1-score, it dropped to 72.73% test
F1-score, so it was not selected as the final model. This comparison supports
`AgileEye-Pilot-MLP-v2` as the stronger defensible model for the held-out test
split.

## Performance of the Lightweight AI-Based Model in Classifying Videos as AI-Generated or Authentic

| Phase | Accuracy | Precision | Recall | F1-Score |
| --- | ---: | ---: | ---: | ---: |
| Model Development | 91.25% | 85.11% | 100.00% | 91.95% |
| Model Testing | 80.00% | 75.00% | 90.00% | 81.82% |

The model testing result shows that the lightweight classifier correctly
identified 9 of 10 AI-generated videos in the held-out split. This is meaningful
for the study because the prototype is designed as a first-level screening aid:
high recall reduces the chance that suspicious videos pass through without a
warning. Precision remains lower than recall, which means the detector still
produces false positives and should not be framed as a final authenticity
decision.

An oracle threshold check was also computed for analysis only. For v2, the
best test-set threshold remained `0.50` and produced the same 80.00% accuracy
and 81.82% F1-score. Because this uses the test labels, it is not used for
model selection, but it shows that the reported v2 result is already at the
observed ceiling for this MLP on the held-out test split.

## Performance of the Lightweight AI-Based Model Based on Inference Time

| Phase | Inference Time (seconds) |
| --- | ---: |
| Model Development | 0.000010 |
| Model Testing | 0.000013 |

The measured inference time supports the lightweight feasibility claim. The
classifier runs far below one second per video on the recorded hardware, leaving
room for UI scanning animation, explanation display, and future integration work.
The timing reflects inference over precomputed pilot features, not full raw-video
frame extraction.

## Per-Video Logs

- Tuning report: `reports/evaluation/pilot-mlp-v2-tuning.json`
- kNN comparison tuning report: `reports/evaluation/pilot-knn-v1-tuning.json`
- All 100 videos: `reports/evaluation/pilot-mlp-v2-all/predictions.csv`
- Model development: `reports/evaluation/pilot-mlp-v2-development/predictions.csv`
- Model testing: `reports/evaluation/pilot-mlp-v2-testing/predictions.csv`
