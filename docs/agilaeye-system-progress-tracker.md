# AgilaEye System Progress Tracker

Last updated: 2026-06-14

Owner: AgilaEye / HaribonEye implementation team

Purpose: this is the living control document for system readiness. Update it
whenever a phase item is completed, a blocker is found, a dataset assumption
changes, a model run is produced, a release is pushed, or an implementation
decision changes.

## How To Update This Tracker

Status keys:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked or at-risk
- `[?]` Needs research, product, or implementation decision

Update rules:

- Add a dated line to the Update Log for every meaningful change.
- Keep percentages conservative. A feature is not research-ready until it is
  reproducible, documented, tested, and tied to a manifest, model artifact, or
  report.
- Separate "front-end simulation works" from "real detector works."
- Separate "dataset source documented" from "dataset downloaded and validated."
- Do not mark model work complete until the exact manifest, split, seed,
  threshold, model version, hardware, and metrics are recorded.
- Do not mark explainability complete until Grad-CAM outputs and template text
  are traceable to representative frames and anomaly categories.
- Do not mark UI integration complete if PyTorch, preprocessing, or sidecar
  details are leaking into Svelte components instead of crossing the documented
  adapter seam.
- Do not commit downloaded videos, sampled frames, trained weights, generated
  heatmaps, or large evaluation reports.

## Executive Summary

Current overall assessment:

- Overall research-prototype completion: 24%
- Documentation and scaffolding-plan readiness: 98%
- Local simulated app/demo readiness: 92%
- Dataset acquisition readiness: 8%
- Preprocessing pipeline readiness: 0%
- Baseline model readiness: 0%
- Explainability pipeline readiness: 0%
- Evaluation/reporting readiness: 4%
- Python sidecar integration readiness: 0%
- Public/production detector readiness: 3%

Plain answer to "is AgilaEye ready to download the dataset and become a real
detector?":

The repo is now ready for a disciplined dataset and ML scaffold to begin, but it
is not yet a real AI-generated video detector. The current HaribonEye app is a
strong local Svelte/Tauri simulation with a working detector overlay, state
machine, mock results, tests, and CI. The documentation foundation now defines
the research defaults, dataset policy, pre-mortem risks, manifest schema,
preprocessing rules, PyTorch MobileNetV3-Small baseline, Grad-CAM explanation
strategy, evaluation outputs, Python sidecar contract, ethics limits, runbooks,
and ADRs.

The next real implementation step is Phase 1: create the Python dataset tooling
and a dry-run/download/import path for a reproducible 100-video pilot subset
from official GenVideo or GenVideo-100K sources. Nothing has been downloaded,
preprocessed, trained, evaluated, or connected to the UI yet. The app remains
demo-ready for simulated behavior and documentation-ready for scaffolding; it is
not research-result-ready or production-ready.

## Evidence Consulted

Repository and docs reviewed:

- `README.md`
- `CONTEXT.md`
- `AGENTS.md`
- `docs/AgileEye.docx`
- `docs/source-plan-summary.md`
- `docs/pre-mortem.md`
- `docs/architecture.md`
- `docs/scaffolding-roadmap.md`
- `docs/dataset-acquisition.md`
- `docs/data-manifest-schema.md`
- `docs/preprocessing.md`
- `docs/modeling.md`
- `docs/explainability.md`
- `docs/evaluation.md`
- `docs/ui-integration.md`
- `docs/security-privacy-ethics.md`
- `docs/references.md`
- `docs/runbooks/dataset-download.md`
- `docs/runbooks/training.md`
- `docs/runbooks/evaluation.md`
- `docs/adr/0001-naming-policy.md`
- `docs/adr/0002-100-video-pilot-first.md`
- `docs/adr/0003-pytorch-mobilenetv3-baseline.md`
- `docs/adr/0004-python-sidecar-integration.md`
- `docs/adr/0005-template-based-explanation-mapping.md`
- `package.json`
- `.github/workflows/ci.yml`
- `.gitignore`
- `src/App.svelte`
- `src/lib/engine/types.ts`
- `src/lib/engine/detectorMachine.ts`
- `src/lib/engine/mockResults.ts`
- `src/lib/engine/eventBus.ts`
- `src/lib/engine/useViewportDetector.ts`
- `src/lib/components/facebook/**`
- `src/lib/components/detector/**`
- `src-tauri/tauri.conf.json`
- `src-tauri/src/lib.rs`
- `scripts/run-vitest.mjs`
- `scripts/clean-vite-cache.mjs`

Verification highlights through 2026-06-14:

- `[x]` `npm ci` completed after Rollup's optional native dependency was missing
  from the existing `node_modules`.
- `[x]` `npm run ci` passed after the documentation foundation pass:
  `svelte-check` clean, 15 Vitest tests passed, and Vite production build
  completed.
- `[x]` `npm run check` passed as part of CI.
- `[x]` `npm run test` passed as part of CI.
- `[x]` `npm run build` passed as part of CI.
- `[x]` Internal markdown path sanity check found no missing documented internal
  paths.
- `[x]` Data/model/report artifact guardrails were added to `.gitignore`.
- `[!]` `npm ci` reported existing audit findings: 5 moderate, 1 high, and 1
  critical. No dependency upgrades were applied during the docs pass.
- `[!]` `AGENTS.md` is ignored by `.gitignore`; local future-agent guidance was
  updated but will not appear in normal `git status` unless the ignore policy is
  changed.

Current inventory:

- 1 Tauri v2 desktop shell.
- 1 Svelte/Vite app entrypoint.
- 26 TypeScript/Svelte source files under `src`.
- 3 test files.
- 15 passing tests.
- 2 helper scripts under `scripts`.
- 21 markdown docs under `docs`.
- 5 ADRs.
- 3 runbooks.
- 1 source DOCX research plan.
- 0 Python dataset scripts.
- 0 Python model scripts.
- 0 dataset manifests.
- 0 downloaded dataset videos.
- 0 processed frame outputs.
- 0 trained model artifacts.
- 0 generated Grad-CAM outputs.
- 0 evaluation reports.

## Current Functional Map

### Functioning Now For Demo

- `[x]` Local Svelte/Vite app builds and runs.
- `[x]` Tauri v2 shell is configured with the HaribonEye product name.
- `[x]` Facebook-style mock browsing environment exists.
- `[x]` Detector overlay has idle, scanning, result, details, rescan, and demo
  control surfaces.
- `[x]` Detector state machine handles startup gating, active-video visibility,
  idle-to-scan transition, progress, completion, interruption, reset, and
  rescan.
- `[x]` Mock authentic and AI-generated result payloads exist.
- `[x]` Component and state-machine tests exist and pass.
- `[x]` CI workflow runs install, Svelte diagnostics, tests, and production
  build.
- `[x]` Documentation foundation defines target dataset, model, explainability,
  evaluation, sidecar, and ethics rules.
- `[x]` Pre-mortem guardrails identify the main ways the project can fail before
  scaffolding.

### Partially Functioning

- `[~]` Project identity: AgilaEye/HaribonEye naming is now documented, but some
  existing UI/app metadata still says HaribonEye while repo/package paths say
  AgilaEye.
- `[~]` Data hygiene: `.gitignore` protects future generated paths, but no
  validator or pre-commit check exists yet to prevent accidental large files.
- `[~]` Result contract: the future sidecar JSON shape is documented, but no
  TypeScript adapter or fixture file exists yet.
- `[~]` Evaluation design: metrics and report shape are documented, but no
  evaluation command exists.
- `[~]` Runbooks: dataset, training, and evaluation runbooks exist, but they are
  not executable yet.

### Not Functioning Yet For The Real Detector

- `[ ]` Python project/package scaffold.
- `[ ]` Dataset download/import command.
- `[ ]` Dry-run dataset source validator.
- `[ ]` GenVideo or GenVideo-100K local data acquisition.
- `[ ]` 100-video pilot subset manifest.
- `[ ]` Video-level stratified split implementation.
- `[ ]` Video probing, checksum generation, and quality status validation.
- `[ ]` Frame sampling and preprocessing.
- `[ ]` PyTorch MobileNetV3-Small feature extraction.
- `[ ]` Temporal average pooling implementation.
- `[ ]` Shallow MLP classifier.
- `[ ]` Training command.
- `[ ]` Model artifact metadata.
- `[ ]` Grad-CAM generation.
- `[ ]` Template-based explanation output implementation.
- `[ ]` Evaluation command and report generation.
- `[ ]` Python sidecar inference command.
- `[ ]` Tauri command invocation for the sidecar.
- `[ ]` Svelte adapter from sidecar JSON to `DetectorResult`.
- `[ ]` Error handling for sidecar missing, invalid JSON, timeout, missing model,
  or missing video.
- `[ ]` Packaging plan for Python runtime and model artifacts.

## End-To-End Readiness: Simulation To Real Detector

| Stage | Current readiness | What works now | What blocks the next level |
| --- | ---: | --- | --- |
| Product/research alignment | 95% | Context, source-plan summary, ADRs, and roadmap are documented. | Keep tracker updated as implementation choices change. |
| Local app shell | 92% | Svelte/Tauri app builds, tests pass, and demo UI works. | Need packaging review and dependency audit cleanup before wider distribution. |
| Detector interaction model | 90% | State machine models active video, scan, interruption, result, and rescan. | Needs real sidecar timing/error states without breaking current behavior. |
| Mock result UI | 88% | Authentic and AI-generated result panels and details exist. | Needs adapter from sidecar JSON and non-forensic copy review with real outputs. |
| Dataset acquisition | 8% | Official sources, storage policy, runbook, and manifest requirements documented. | No downloader/importer, source validation, manifest, or local dataset yet. |
| Data manifest | 12% | Required CSV schema and validation rules documented. | No manifest generator or validator exists. |
| Preprocessing | 0% | Eight-frame/224x224/MobileNetV3 defaults documented. | No Python video reader, sampler, quality checks, or processed outputs. |
| Baseline model | 0% | PyTorch MobileNetV3-Small baseline selected by ADR. | No Python package, model code, training loop, artifacts, or metrics. |
| Explainability | 0% | Grad-CAM and template mapping documented. | No heatmap generator, frame selection, or explanation output implementation. |
| Evaluation/reporting | 4% | Metrics and report shape documented. | No evaluation command, predictions CSV, metrics JSON, or summary report. |
| Python sidecar | 0% | Command and JSON contract documented. | No sidecar module, timeout handling, or fixture outputs. |
| UI real-detector integration | 0% | Adapter seam and state-machine preservation rules documented. | No Tauri invocation, adapter, feature flag, or sidecar error UI. |
| Packaging/release | 5% | Tauri shell exists and packaging concerns are identified. | Python runtime, model artifact, setup, and clean-machine workflow are unresolved. |

Minimum simulated-demo path today:

1. Install dependencies.
2. Run `npm run dev`.
3. Open `http://127.0.0.1:1420/`.
4. Use the Facebook-style mock feed.
5. Let the detector overlay enter idle/scanning/result states.
6. Toggle result mode through demo controls.
7. Open the details modal.
8. Run `npm run ci` to verify the current app.

Minimum research-scaffold path still needed:

1. Add Python package structure.
2. Add dataset source dry-run and download/import command.
3. Generate and validate the 100-video pilot manifest.
4. Add frame sampling and preprocessing.
5. Train the MobileNetV3-Small + MLP baseline.
6. Evaluate on the test split.
7. Generate Grad-CAM explanations.
8. Produce sidecar JSON fixtures.

Minimum real-detector demo path still needed:

1. Run local sidecar inference on one selected video.
2. Convert sidecar JSON to the existing `DetectorResult` shape.
3. Add UI feature flag for mock versus sidecar result source.
4. Preserve interruption behavior when inference is slow or cancelled.
5. Show first-level screening copy with representative frame/heatmap details.

Minimum public release path still needed:

1. Resolve npm audit findings or document accepted risk.
2. Package or document Python runtime requirements.
3. Package model artifacts without committing large files.
4. Add clean-machine setup and smoke test.
5. Confirm dataset/license limits for screenshots and demo videos.
6. Add release checklist and recovery steps for missing sidecar/model artifacts.

## Phase Plan

### Phase 0: Documentation Baseline And Repo Guardrails

Current completion: 100%

Goal: make the repo decision-complete enough for dataset and ML scaffolding to
begin without ambiguity.

What is already done:

- `[x]` `README.md` documents current simulation status and next research track.
- `[x]` `CONTEXT.md` defines identity, naming, users, goals, non-goals, and
  defaults.
- `[x]` `docs/source-plan-summary.md` normalizes the DOCX plan.
- `[x]` `docs/pre-mortem.md` records failure modes and mitigations.
- `[x]` `docs/architecture.md` defines current and target modules.
- `[x]` `docs/scaffolding-roadmap.md` defines implementation phases.
- `[x]` Dataset, manifest, preprocessing, modeling, explainability, evaluation,
  UI integration, ethics, references, and runbook docs exist.
- `[x]` ADRs exist for naming, pilot dataset scope, PyTorch baseline, sidecar
  integration, and explanation mapping.
- `[x]` `.gitignore` protects local generated data/model/report paths.
- `[x]` `npm run ci` passed after docs were added.
- `[x]` This progress tracker exists.

Remaining:

- `[!]` Decide whether `AGENTS.md` should remain ignored or be tracked.
- `[!]` Review existing npm audit findings.

### Phase 1: Dataset Acquisition Scaffold

Current completion: 0%

Goal: create reproducible local acquisition tooling for the 100-video pilot
subset.

Planned work:

- `[ ]` Add Python package scaffold for dataset tooling.
- `[ ]` Add dependency/environment file for Python tooling.
- `[ ]` Add dry-run command to verify official source paths and local storage.
- `[ ]` Add download/import command for official GenVideo or GenVideo-100K
  sources.
- `[ ]` Add manifest generator with stable video IDs.
- `[ ]` Add checksum calculation.
- `[ ]` Add fixed-seed selection with seed 42.
- `[ ]` Add stratified video-level 70/10/20 split.
- `[ ]` Add manifest validator for schema, balance, and split counts.
- `[ ]` Add tests for manifest validation and split preservation.

Acceptance:

- `[ ]` Manifest has 100 selected rows.
- `[ ]` Class counts are 50 authentic and 50 AI-generated.
- `[ ]` Split counts are 70 train, 10 validation, and 20 test.
- `[ ]` Every valid row has checksum and quality status.
- `[ ]` No downloaded videos are staged for commit.

### Phase 2: Preprocessing Scaffold

Current completion: 0%

Goal: convert manifest videos into deterministic frame samples.

Planned work:

- `[ ]` Add video probing for duration, resolution, FPS, and readability.
- `[ ]` Add eight-frame uniform sampling.
- `[ ]` Add 224x224 resizing.
- `[ ]` Add MobileNetV3-compatible normalization.
- `[ ]` Add fallback behavior for very short videos.
- `[ ]` Add exclusion handling for missing/corrupted/unreadable videos.
- `[ ]` Write processed outputs under `data/processed/`.
- `[ ]` Write updated processed manifest.
- `[ ]` Add tests for normal, short, missing, and corrupted video cases.

Acceptance:

- `[ ]` Each valid video has expected sampled frame references.
- `[ ]` Split assignment never changes during preprocessing.
- `[ ]` Exclusions are recorded without silently dropping rows.
- `[ ]` No sampled frames are staged for commit.

### Phase 3: Baseline Model

Current completion: 0%

Goal: train the first lightweight PyTorch baseline.

Planned work:

- `[ ]` Add PyTorch dataset loader from processed manifest.
- `[ ]` Add MobileNetV3-Small frozen feature extractor.
- `[ ]` Add temporal average pooling.
- `[ ]` Add shallow MLP classifier.
- `[ ]` Add training command.
- `[ ]` Add validation loop.
- `[ ]` Add model artifact metadata.
- `[ ]` Record threshold policy.
- `[ ]` Add unit tests for output shapes and split usage.

Acceptance:

- `[ ]` Training reads only the training split.
- `[ ]` Validation does not touch the test split.
- `[ ]` Artifact has run ID, model version, manifest reference, threshold, and
  hardware notes.
- `[ ]` No model artifact is staged for commit.

### Phase 4: Evaluation And Reporting

Current completion: 0%

Goal: produce reproducible pilot metrics and report outputs.

Planned work:

- `[ ]` Add evaluation command.
- `[ ]` Add video-level prediction export.
- `[ ]` Add accuracy, precision, recall, and F1-score computation.
- `[ ]` Add average inference-time measurement.
- `[ ]` Add `metrics.json`.
- `[ ]` Add `predictions.csv`.
- `[ ]` Add `summary.md`.
- `[ ]` Add tests for metric calculation.

Acceptance:

- `[ ]` Evaluation uses only the test split.
- `[ ]` Report references manifest, model version, seed, threshold, and hardware.
- `[ ]` Metrics are video-level, not frame-level.
- `[ ]` Reports stay under ignored paths unless deliberately curated.

### Phase 5: Explainability

Current completion: 0%

Goal: produce traceable Grad-CAM and template-based explanations.

Planned work:

- `[ ]` Add Grad-CAM implementation for the chosen PyTorch model.
- `[ ]` Add representative frame selection.
- `[ ]` Write heatmaps under `artifacts/explanations/`.
- `[ ]` Add anomaly-category to explanation-template mapping.
- `[ ]` Add authentic/low-risk explanation templates.
- `[ ]` Add explanation JSON fields for sidecar compatibility.
- `[ ]` Add tests for template mapping and copy safety.

Acceptance:

- `[ ]` Explanation references prediction, category, and representative frames.
- `[ ]` Generated copy avoids certainty language.
- `[ ]` Authentic videos use `none` or consistency-based explanation.
- `[ ]` Heatmaps are not staged for commit.

### Phase 6: Python Sidecar Inference

Current completion: 0%

Goal: expose local inference through the documented JSON contract.

Planned work:

- `[ ]` Add `agilaeye_detector.infer` module.
- `[ ]` Implement `--video <path> --out <json>` command.
- `[ ]` Load model artifact and preprocessing config.
- `[ ]` Run one-video preprocessing and inference.
- `[ ]` Generate or reference explanation outputs.
- `[ ]` Write JSON contract fields.
- `[ ]` Add timeout/error response conventions.
- `[ ]` Add fixture JSON for UI adapter tests.

Acceptance:

- `[ ]` One local video can produce a valid sidecar JSON file.
- `[ ]` Invalid input produces a documented error shape.
- `[ ]` Sidecar output includes non-forensic notice.
- `[ ]` Sidecar logic remains outside Svelte components.

### Phase 7: UI Integration

Current completion: 0%

Goal: connect sidecar results to the existing UI without breaking the state
machine.

Planned work:

- `[ ]` Add TypeScript type for sidecar JSON.
- `[ ]` Add adapter from sidecar JSON to `DetectorResult`.
- `[ ]` Add feature flag or demo control for mock versus sidecar source.
- `[ ]` Add Tauri invocation path or documented interim local bridge.
- `[ ]` Add sidecar success fixture test.
- `[ ]` Add sidecar timeout/failure tests.
- `[ ]` Preserve scan interruption semantics.
- `[ ]` Update details modal to show representative frame/heatmap references
  when available.

Acceptance:

- `[ ]` Existing Svelte tests still pass.
- `[ ]` UI can display a sidecar-backed result.
- `[ ]` Timeout and invalid JSON do not show stale results.
- `[ ]` User-facing copy remains first-level screening language.

### Phase 8: Packaging, Demo Operations, And Release Readiness

Current completion: 5%

Goal: make the real-detector prototype runnable on a clean machine with clear
limits.

Planned work:

- `[ ]` Decide Python runtime packaging strategy.
- `[ ]` Decide model artifact distribution strategy.
- `[ ]` Document clean-machine setup.
- `[ ]` Add local smoke test checklist.
- `[ ]` Add missing sidecar/model artifact recovery messages.
- `[ ]` Review npm audit findings.
- `[ ]` Review dataset license/screenshot constraints.
- `[ ]` Add release checklist.

Acceptance:

- `[ ]` Clean-machine setup succeeds with documented prerequisites.
- `[ ]` App gives helpful errors when sidecar/model is missing.
- `[ ]` Package size and artifact handling are documented.
- `[ ]` Demo videos/screenshots comply with source terms.

## Critical Cross-Cutting Blockers

- `[!]` No real dataset has been downloaded or validated.
- `[!]` No Python scaffold exists yet.
- `[!]` No real model exists yet.
- `[!]` No manifest exists yet, so no reproducible experiment can run.
- `[!]` No sidecar exists, so the app cannot perform real inference.
- `[!]` Packaging Python with Tauri is unresolved.
- `[!]` Existing npm audit findings need review before public release.
- `[!]` `AGENTS.md` is ignored, so local agent guidance may not travel with the
  repo unless intentionally tracked.

## Recommended Execution Order

### Immediate Stabilization Sprint

1. Decide whether to track `AGENTS.md`.
2. Review npm audit findings and record whether to fix now or defer.
3. Add a lightweight markdown link/check script if docs continue growing.
4. Add sample sidecar JSON fixture based on `docs/ui-integration.md`.

### Dataset Scaffold Sprint

1. Create Python project layout.
2. Add dataset manifest generator and validator.
3. Add official source dry-run.
4. Add fixed-seed pilot selector.
5. Produce the first validated 100-row manifest.

### Preprocessing And Model Sprint

1. Add video probe and frame sampler.
2. Add processed manifest output.
3. Add MobileNetV3-Small feature extraction.
4. Add temporal pooling and shallow MLP training.
5. Produce first local model artifact.

### Evaluation And Explanation Sprint

1. Add evaluation command.
2. Produce metrics JSON, predictions CSV, and summary report.
3. Add Grad-CAM for representative frames.
4. Add template explanation output.
5. Produce sidecar-compatible inference JSON.

### UI Integration Sprint

1. Add sidecar result TypeScript type.
2. Add sidecar-to-`DetectorResult` adapter.
3. Add mock/sidecar source switch.
4. Add timeout and failure handling.
5. Preserve all current detector state-machine tests.

### Packaging And Presentation Sprint

1. Document clean-machine setup.
2. Decide Python/model packaging.
3. Add release checklist.
4. Confirm dataset/demo media permissions.
5. Prepare final presentation flow with clear simulation versus real-inference
   labels.

## Update Log

- 2026-06-14: Created documentation foundation for AgilaEye, including context,
  source-plan summary, pre-mortem, architecture, roadmap, dataset/ML/UI/ethics
  docs, runbooks, ADRs, references, and data/artifact ignore rules.
- 2026-06-14: Refreshed dependencies with `npm ci` after Rollup optional native
  dependency was missing from the existing install.
- 2026-06-14: Verified `npm run ci`: Svelte diagnostics passed, 15 tests passed,
  and Vite production build passed.
- 2026-06-14: Added this system progress tracker as the living control document
  for AgilaEye readiness.

