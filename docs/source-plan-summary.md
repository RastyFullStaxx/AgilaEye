# Source Plan Summary

This file translates `docs/AgileEye.docx` into implementation-ready guidance for
the AgilaEye repository. The source document remains the research plan of record;
this summary exists so future scaffolding work can start from clear engineering
defaults instead of re-reading the whole DOCX.

## Research Goal

Build and evaluate a lightweight explainable AI-generated video detector for a
Facebook-style browsing scenario. The detector is a first-level screening aid,
not a forensic authenticity system.

The prototype should balance:

- Classification performance.
- Inference time.
- Resource efficiency.
- User-readable explanations.
- Practical behavior when the active video changes during browsing.

## Scope

In scope:

- Visual-frame analysis only.
- A controlled Facebook-style simulated browsing workflow.
- A small balanced pilot dataset.
- Lightweight model development.
- Grad-CAM visual explanations.
- Template-based explanation text.
- Evaluation with classification and timing metrics.

Out of scope:

- Audio analysis.
- Metadata forensics.
- Source tracing.
- Facial biometric verification.
- Private Facebook-video collection.
- Real Facebook integration.
- Commercial detector comparison.
- Large multimodal or transformer-based flagship models.

## Dataset Plan

Use a reproducible 100-video pilot subset from the official GenVideo or
GenVideo-100K ecosystem:

- 50 authentic videos.
- 50 AI-generated videos.
- Video-level stratified split.
- 70 training videos.
- 10 validation videos.
- 20 testing videos.
- Fixed random seed: 42.

Every selected video must be listed in the dataset manifest. The manifest is the
source of truth for labels, source category, split, anomaly category, quality
status, and checksum.

## Preprocessing Plan

Each video should be standardized before training or testing:

- Open the video with OpenCV or an equivalent video reader.
- Sample eight uniformly spaced frames.
- Resize sampled frames to 224x224.
- Normalize according to MobileNetV3 requirements.
- Repeat available frames or reduce interval only when short videos cannot
  supply eight unique positions.
- Exclude unreadable or corrupted videos and record the exclusion.
- Do not use audio, metadata, biometric, or source-tracing features.

## Model Plan

The v1 model path is Python + PyTorch:

- Use pretrained MobileNetV3-Small as a frozen frame-level feature extractor.
- Extract one feature vector per sampled frame.
- Aggregate frame vectors with temporal average pooling.
- Train a shallow MLP binary classifier.
- Output an AI-likelihood score.
- Use initial threshold 0.50 unless validation results justify a documented
  change.

The model should be judged as a lightweight feasibility baseline, not as a
state-of-the-art detector.

## Explanation Plan

Use Grad-CAM as the primary explainability method:

- Generate heatmaps for one to three representative frames.
- Prefer frames with high AI-likelihood contribution or high confidence.
- Map visual evidence to one dominant anomaly category.
- Generate short deterministic explanation text from templates.

Anomaly categories:

- Object inconsistency.
- Texture jitter.
- Interaction anomaly.
- Movement anomaly.
- None, for authentic videos or low AI-likelihood results.

Explanations must be phrased as observed model cues, not certainty claims.

## Evaluation Plan

Measure:

- Accuracy.
- Precision.
- Recall.
- F1-score.
- Average inference time.
- Optional model size and memory notes when available.

The test split must contain videos not used in training or validation. Never
split frames from one video across multiple splits.

## UI Expectations

The current Svelte/Tauri prototype already models the intended browsing flow:

- Detect active video.
- Show idle detector overlay.
- Start scanning.
- Interrupt scan if the user scrolls away.
- Show result panel.
- Offer details.

The future real detector should keep this interaction model and replace only the
mock result source through an adapter seam.

