# Architecture

AgilaEye is moving from a simulated detector prototype to a research-backed
prototype with a local Python detector sidecar. This document describes the
current modules, target modules, and the interfaces that should stay stable
during scaffolding.

## Current Modules

### Svelte/Tauri App

The existing app renders a Facebook-style feed and detector overlay.

- `src/App.svelte` creates the detector controller and wires state to UI.
- `src/lib/components/facebook/` renders the mock browsing environment.
- `src/lib/components/detector/` renders idle, scanning, result, details, and
  demo controls.
- `src-tauri/` provides the desktop shell and has no detector business logic.

### Detector State Machine

`src/lib/engine/detectorMachine.ts` is the interaction seam for detector
behavior. It manages:

- Startup activation delay.
- Active video visibility.
- Idle-to-scan delay.
- Scanning progress.
- Result display.
- Interruption and reset.
- Rescan.

This state machine should remain the UI authority even after real inference is
introduced.

### Mock Result Source

`src/lib/engine/mockResults.ts` currently supplies hardcoded result payloads.
Future work should replace this through an adapter, not by embedding Python or
model-specific assumptions in Svelte components.

## Target Modules

### Dataset Pipeline

The dataset pipeline prepares a reproducible pilot subset:

- Downloads or locates GenVideo/GenVideo-100K sources.
- Selects 100 videos with seed 42.
- Assigns video-level splits.
- Records metadata and checksums.
- Excludes unreadable files with reasons.

The dataset manifest is the pipeline interface.

### Preprocessing Module

The preprocessing module turns videos into model-ready frame tensors:

- Reads videos.
- Samples eight uniformly spaced frames.
- Resizes frames to 224x224.
- Normalizes frames for MobileNetV3.
- Writes local processed artifacts only under ignored paths.

The preprocessing interface should accept manifest rows and return processed
frame references or tensors plus quality status.

### Model Module

The model module trains and evaluates the v1 baseline:

- Frozen MobileNetV3-Small feature extractor.
- Temporal average pooling.
- Shallow MLP classifier.
- Binary authentic versus AI-generated output.
- Thresholded prediction with AI-likelihood score.

The trained model artifact belongs under `artifacts/models/`.

### Explainability Module

The explainability module generates user-readable evidence:

- Grad-CAM heatmaps for one to three representative frames.
- Anomaly category mapping from manifest labels.
- Template-based explanation summary.

Generated heatmaps belong under `artifacts/explanations/`.

### Evaluation Module

The evaluation module produces reproducible reports:

- Accuracy.
- Precision.
- Recall.
- F1-score.
- Average inference time.
- Threshold used.
- Split manifest reference.

Generated reports belong under `reports/evaluation/`.

### Python Detector Sidecar

The future sidecar is the local inference adapter between PyTorch and the app.
The intended command shape is:

```bash
python -m agilaeye_detector.infer --video <path> --out <json>
```

The sidecar must produce JSON compatible with the detector UI result contract.
It should not own Svelte UI state, visibility logic, or scroll interruption.

## Target Data Flow

```text
GenVideo source
  -> dataset manifest
  -> preprocessing
  -> sampled frames
  -> MobileNetV3 feature extraction
  -> temporal pooling
  -> MLP classifier
  -> prediction JSON
  -> Grad-CAM and explanation mapping
  -> evaluation reports
  -> Python sidecar result
  -> Svelte/Tauri detector state machine
  -> result panel and details modal
```

## Result Contract

Future sidecar output should include:

- `video_id`
- `prediction_label`: `Likely Authentic` or `Likely AI-Generated`
- `result_mode`: `authentic` or `ai-generated`
- `ai_likelihood`: number from 0.0 to 1.0
- `threshold`
- `explanation_summary`
- `anomaly_category`
- `representative_frames`
- `heatmap_paths`
- `inference_time_ms`
- `model_version`
- `non_forensic_notice`

The Svelte adapter can transform this into the existing `DetectorResult` shape.

## Module Rules

- Keep UI state in the Svelte detector controller.
- Keep model loading, preprocessing, and Grad-CAM in Python.
- Keep generated data and artifacts out of git.
- Keep report metrics tied to a manifest and model version.
- Keep user-facing copy probabilistic and supportive.

