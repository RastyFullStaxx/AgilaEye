# AgilaEye Context

## Identity

AgilaEye is the repository and system name for a lightweight explainable
AI-generated video detection research prototype.

HaribonEye is the current Tauri/Svelte prototype product name shown in the app.
Use AgilaEye when writing repo, system, architecture, dataset, and research
docs. Use HaribonEye only when referring to the current app shell, UI branding,
or existing Tauri product name.

## Product Aim

AgilaEye investigates whether a lightweight, explainable detector can act as a
near-real-time first-level screening aid for AI-generated videos in a simulated
Facebook-style browsing environment.

The system should help ordinary users understand that a visible video may have
synthetic-media signals. It should not claim definitive forensic truth.

## Current State

The app is currently a polished simulation:

- Svelte/Tauri interface with a Facebook-style feed.
- Detector overlay with idle, scanning, result, detail, and demo-control states.
- State machine timing and interruption behavior.
- Mock authentic and AI-generated result payloads.

There is no real model, dataset pipeline, frame extraction, Grad-CAM output,
screen capture, browser automation, or Facebook integration yet.

## Target Research Flow

The planned v1 research flow is:

1. Acquire a reproducible 100-video pilot subset from official GenVideo or
   GenVideo-100K sources.
2. Record every selected video in a manifest.
3. Sample eight frames per video.
4. Resize frames to 224x224.
5. Extract features using pretrained MobileNetV3-Small in PyTorch.
6. Aggregate frame features with temporal average pooling.
7. Train a shallow binary classifier.
8. Evaluate accuracy, precision, recall, F1-score, and inference time.
9. Generate Grad-CAM explanations for representative frames.
10. Map explanations to template text and anomaly categories.
11. Expose future local inference through a Python sidecar JSON contract.
12. Feed the result contract into the existing Svelte/Tauri detector UI.

## Users

- Social media users who need understandable first-level screening while
  browsing videos.
- Student researchers evaluating feasibility, performance, and explanation
  quality.
- Future developers extending the prototype into a real detector pipeline.

## Non-Goals

- No forensic-grade authenticity decision.
- No direct Facebook integration.
- No scraping or platform automation.
- No private user-video collection.
- No audio detection, metadata forensics, source tracing, or facial biometric
  verification.
- No large multimodal reasoning model for v1.
- No browser-side model runtime for v1.

## Research Defaults

- Dataset target: 100 videos, 50 authentic and 50 AI-generated.
- Split: 70 training, 10 validation, 20 testing, assigned at video level.
- Random seed: 42.
- Model stack: Python, PyTorch, torchvision.
- Baseline model: frozen MobileNetV3-Small feature extractor plus shallow MLP.
- Frame sampling: eight uniformly spaced frames per video.
- Input size: 224x224.
- Initial threshold: 0.50.
- Explanation method: Grad-CAM for one to three representative frames.
- Explanation categories: object inconsistency, texture jitter, interaction
  anomaly, movement anomaly, and none for authentic videos.

## Shared Terms

- Active video: the feed video currently visible enough to be analyzed.
- AI-likelihood score: probability-like model output shown as a percentage.
- Anomaly category: dominant visible defect category used for explanation
  mapping, not the binary training label.
- Dataset manifest: CSV source of truth for selected videos, labels, splits,
  quality status, and checksums.
- Detector sidecar: future local Python command that performs inference and
  emits JSON for the app.
- Explanation mapping: deterministic template process that turns model evidence
  and anomaly category into user-readable text.
- First-level screening: supportive warning layer, not a final judgment.
- Representative frame: sampled frame selected for explanation or heatmap
  display.
