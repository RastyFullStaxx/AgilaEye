# Scaffolding Roadmap

This roadmap moves AgilaEye from a polished simulation to a documented,
reproducible research prototype.

## Current MVP Scope Update

ADR-0006 supersedes the dataset/Python sidecar track for MVP completion. The
active completion target is now a simulated Facebook-style feed with embedded
videos, deterministic scan outputs, and SOP metrics computed from the embedded
evaluation set. Dataset download, PyTorch training, Grad-CAM file generation,
and Python sidecar integration are parked as research-extension work.

## Phase 0: Documentation Baseline

Status: current pass.

Deliverables:

- Context, architecture, pre-mortem, roadmap, and source-plan summary.
- ADRs for naming, dataset scope, model stack, sidecar integration, and
  explanation mapping.
- Dataset, preprocessing, modeling, evaluation, UI integration, ethics, and
  runbook docs.
- Git ignore rules for local data and generated artifacts.

Acceptance:

- `npm run ci` still passes.
- Every future phase has a corresponding doc.
- No dataset, frame, model, or report artifacts are added.

## Phase 1: Dataset Acquisition Scaffold

Deliverables:

- Python project structure for dataset tooling.
- Download or import script that supports official GenVideo/GenVideo-100K
  sources.
- Manifest generation command.
- Fixed-seed 100-video pilot selection.
- Dry-run mode that validates expected paths without downloading large data.

Acceptance:

- Manifest contains 50 authentic and 50 AI-generated rows.
- Split counts are 70/10/20 at video level.
- Checksums and quality statuses are present.
- Downloaded data stays under ignored paths.

## Phase 2: Preprocessing Scaffold

Deliverables:

- Frame sampling command.
- Video quality checks.
- Processed frame layout under `data/processed/`.
- Unit tests for short videos, unreadable files, and split preservation.

Acceptance:

- Each valid video has up to eight sampled frame references.
- Frames are 224x224.
- Exclusions are recorded in the manifest.
- No frame from one video appears in multiple splits.

## Phase 3: Baseline Model

Deliverables:

- PyTorch MobileNetV3-Small feature extractor.
- Temporal average pooling.
- Shallow MLP classifier.
- Training command.
- Model artifact output under `artifacts/models/`.

Acceptance:

- Training reads only the training split.
- Validation can adjust threshold only with a recorded reason.
- Test split remains untouched until final evaluation.
- Model artifact has a version or run ID.

## Phase 4: Evaluation And Reporting

Deliverables:

- Evaluation command.
- Accuracy, precision, recall, F1-score, and inference-time reporting.
- Report output under `reports/evaluation/`.
- Minimal machine-readable result summary.

Acceptance:

- Report references manifest, split, seed, model version, and threshold.
- Metrics are computed on video-level predictions.
- Generated reports are ignored unless deliberately curated.

## Phase 5: Explainability

Deliverables:

- Grad-CAM generation for selected representative frames.
- Heatmap output under `artifacts/explanations/`.
- Template-based explanation mapping.
- Explanation correctness checks against anomaly category labels.

Acceptance:

- AI-generated examples map to one of the four anomaly categories.
- Authentic examples use low-risk consistency templates.
- Explanations avoid certainty language.

## Phase 6: Python Sidecar Inference

Deliverables:

- Local inference command:

```bash
python -m agilaeye_detector.infer --video <path> --out <json>
```

- JSON result contract.
- Timeout and error response conventions.
- Fixture outputs for UI tests.

Acceptance:

- Sidecar can infer one local video and write JSON.
- JSON includes prediction, score, threshold, explanation, frame/heatmap
  references, inference time, and non-forensic notice.
- Errors do not crash the UI adapter.

## Phase 7: UI Integration

Deliverables:

- TypeScript adapter from sidecar JSON to detector UI result.
- Feature flag or demo mode to switch mock and sidecar sources.
- State machine remains the owner of visibility, interruption, progress, and
  rescan behavior.

Acceptance:

- Existing Svelte tests still pass.
- UI handles sidecar success, timeout, and failure.
- Copy continues to present results as first-level screening.

## Phase 8: Packaging Review

Deliverables:

- Packaging strategy for the Python sidecar.
- Hardware and dependency notes.
- Tauri command invocation plan.
- Release checklist.

Acceptance:

- A clean machine can run the app with documented setup.
- Missing Python/model artifacts produce helpful errors.
- Package size and model artifact handling are documented.
