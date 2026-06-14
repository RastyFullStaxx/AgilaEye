# AgileEye

AgileEye is the repository, research system, and current Tauri/Svelte prototype
product name shown in the desktop app.

AgileEye is a polished front-end prototype for a lightweight explainable
AI-generated video detector during Facebook-style video browsing. The MVP scope
uses embedded feed videos scanned by a deterministic local MLP model that
reports SOP-style performance metrics. There is no PyTorch sidecar inference,
Facebook integration, screen capture, scraping, or dataset download in the MVP.

## Current Status

- Svelte 5 + Vite + Tailwind CSS front end.
- Tauri v2 desktop shell with minimal Rust backend.
- Embedded Facebook-style video feed.
- Simulated detector state machine and result panels.
- Deterministic feature vectors and a local MLP classifier for per-video scan
  outputs.
- SOP metrics panel for accuracy, precision, recall, F1-score, and average
  inference time across the embedded evaluation set.
- No screen capture, scraping, browser extension injection, webcam access,
  Facebook integration, dataset download, PyTorch inference, or video frame
  analysis.

## Quick Commands

```bash
npm install
npm run dev
npm run check
npm run test
npm run build
npm run ci
```

Development server:

```bash
npm run dev
```

Open `http://127.0.0.1:1420/`.

If the browser shows stale Vite errors such as `504 (Outdated Optimize Dep)`,
start with a fresh optimized dependency cache:

```bash
npm run dev:fresh
```

If port `1420` is occupied during a presentation, use the backup port:

```bash
npm run dev:alt
```

Then open `http://127.0.0.1:1421/`.

For the desktop shell:

```bash
npm run tauri dev
```

Rust/Cargo is required for Tauri commands.

Local detector sidecar smoke test:

```bash
PYTHONPATH=model python3 -m agileeye_detector.infer --video-id synthetic-city-walk
PYTHONPATH=model python3 -m unittest discover -s model/tests
```

Dataset pilot acquisition after downloading `GenVideo-Val.zip`:

```bash
FFPROBE_PATH="$(node -e 'console.log(require("@ffprobe-installer/ffprobe").path)')" \
  python3 scripts/acquire_genvideo_pilot.py \
  --zip data/raw/modelscope/GenVideo-Val.zip \
  --out-dir data/raw/pilot-100 \
  --manifest data/processed/manifests/pilot-100.csv
```

Dataset-backed pilot MLP pipeline:

```bash
npm run data:validate
npm run ml:pipeline
npm run ml:infer:sample
```

## Documentation Map

- `CONTEXT.md` - domain vocabulary, naming policy, goals, constraints, and
  non-goals.
- `docs/agileeye-system-progress-tracker.md` - living readiness tracker,
  phase checklist, blockers, and update log.
- `docs/adr/0006-simulated-embedded-video-mvp.md` - current MVP scope decision.
- `docs/source-plan-summary.md` - implementation-friendly summary of
  `docs/AgileEye.docx`.
- `docs/pre-mortem.md` - failure modes and guardrails before scaffolding.
- `docs/architecture.md` - current and target modules, interfaces, and data flow.
- `docs/scaffolding-roadmap.md` - phased path from simulation to research
  prototype.
- `docs/dataset-acquisition.md` - GenVideo/GenVideo-100K pilot subset strategy.
- `docs/data-manifest-schema.md` - required CSV fields for reproducibility.
- `docs/preprocessing.md` - frame sampling, resizing, quality checks, and split
  rules.
- `docs/modeling.md` - PyTorch MobileNetV3-Small baseline plan.
- `docs/explainability.md` - Grad-CAM and template-based explanation mapping.
- `docs/evaluation.md` - classification, timing, and report expectations.
- `docs/ui-integration.md` - future Python sidecar contract and UI seam.
- `docs/security-privacy-ethics.md` - dataset, user privacy, and claim limits.
- `docs/runbooks/` - future operator steps for dataset download, training, and
  evaluation.
- `docs/adr/` - accepted architecture decisions.

## Model Status

The working models currently in the repo are:

- App demo MLP: `src/lib/engine/mlpModel.ts`
- Embedded sidecar MLP: `model/agileeye_detector/mlp.py`
- Dataset-backed pilot MLP: `model/agileeye_detector/pilot_mlp.py`
- Preprocessing command: `python3 -m agileeye_detector.preprocess`
- Training command: `python3 -m agileeye_detector.train`
- Evaluation command: `python3 -m agileeye_detector.evaluate`
- Sidecar command: `python3 -m agileeye_detector.infer`

The dataset-backed pilot MLP scores ffmpeg-derived visual features from the
100-video pilot set and emits the documented detector result contract. The
MobileNetV3-Small-plus-MLP model remains the next heavier baseline once PyTorch
is added.

## Data And Artifact Policy

The MVP should not download a dataset or create trained model artifacts. If a
future research extension does that, do not commit downloaded videos, sampled
frames, trained model weights, Grad-CAM image outputs, or large evaluation
reports. Local generated paths are ignored:

- `data/raw/`
- `data/processed/`
- `artifacts/models/`
- `artifacts/explanations/`
- `reports/evaluation/`

Only small curated fixtures may be committed later, and only after documenting
why they are safe, minimal, and required for tests or examples.
