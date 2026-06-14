# AgileEye Context

## Identity

AgileEye is the repository and system name for a lightweight explainable
AI-generated video detection simulation prototype.

AgileEye is also the current Tauri/Svelte prototype product name shown in the
app. Use AgileEye consistently for repository, system, architecture,
evaluation, research docs, package metadata, and UI branding.

## Product Aim

AgileEye demonstrates how a lightweight, explainable detector could feel inside
a simulated Facebook-style browsing environment. The MVP uses embedded videos,
deterministic feature vectors, and a local MLP classifier so users can
repeatedly scroll, scan, inspect results, and review SOP-style performance
metrics.

The system should help ordinary users understand that a visible video may have
synthetic-media signals. It should not claim definitive forensic truth.

## Current State

The app is a polished simulation:

- Svelte/Tauri interface with a Facebook-style feed.
- Detector overlay with idle, scanning, result, detail, and demo-control states.
- State machine timing and interruption behavior.
- Embedded video posts with deterministic features.
- Local MLP classifier that produces authentic and AI-generated scan outputs.
- SOP metrics computed from the embedded evaluation set.

There is no dataset-trained PyTorch model, frame extraction, Grad-CAM output,
screen capture, browser automation, or Facebook integration in the MVP.

## Target MVP Flow

1. Render a simulated Facebook-style feed with embedded videos.
2. Detect the active video using viewport visibility.
3. Run the existing scan state machine.
4. Run the active embedded video's features through the local MLP classifier.
5. Show AI-likelihood, classification, explanation bullets, frame count, and
   simulated inference time.
6. Let users scan repeatedly by scrolling through videos and using Rescan.
7. Display SOP performance metrics computed from the embedded evaluation set:
   accuracy, precision, recall, F1-score, and average inference time.

## Users

- Social media users who need understandable first-level screening while
  browsing videos.
- Student researchers evaluating interface feasibility, performance reporting,
  and explanation clarity in a controlled simulation.
- Future developers extending or replacing the simulated detector.

## Non-Goals

- No forensic-grade authenticity decision.
- No direct Facebook integration.
- No scraping or platform automation.
- No private user-video collection.
- No audio detection, metadata forensics, source tracing, or facial biometric
  verification.
- No large multimodal reasoning model for MVP completion.
- No heavyweight browser-side model runtime for MVP completion.
- No dataset download or model training for MVP completion.
- No Python sidecar for MVP completion.

## MVP Defaults

- Evaluation target: fixed embedded-video set.
- Metric source: deterministic ground-truth labels plus MLP predictions.
- Frame sampling shown in UI: eight simulated frames per scan.
- AI-likelihood threshold: 0.50.
- Explanation method: deterministic explanation bullets and details per video.
- Explanation categories: object inconsistency, texture jitter, interaction
  anomaly, movement anomaly, and none for authentic videos.
- Metrics shown from SOP: accuracy, precision, recall, F1-score, and average
  inference time.

## Shared Terms

- Active video: the feed video currently visible enough to be analyzed.
- AI-likelihood score: probability-like simulated output shown as a percentage.
- Anomaly category: dominant visible defect category used for explanation
  mapping.
- Embedded evaluation set: fixed in-code list of videos, ground-truth labels,
  predicted labels, scores, simulated inference times, and explanation details.
- Detector simulation: local deterministic MLP module that returns the scan
  result for the active embedded video.
- Explanation mapping: deterministic process that turns the video profile into
  user-readable text.
- First-level screening: supportive warning layer, not a final judgment.
- Representative frame count: the eight simulated frames reported for each scan.
