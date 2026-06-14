# Dataset Acquisition

AgilaEye v1 uses a reproducible 100-video pilot subset from the official
GenVideo or GenVideo-100K ecosystem. This keeps the study feasible while still
aligning with AI-generated video detection research.

## Preferred Sources

- DeMamba / GenVideo GitHub: https://github.com/chenhaoxing/DeMamba
- GenVideo paper: https://arxiv.org/abs/2405.19707
- ModelScope Gen-Video dataset: https://modelscope.cn/datasets/cccnju/Gen-Video
- ModelScope GenVideo-100K dataset:
  https://modelscope.cn/datasets/cccnju/GenVideo-100K

Verify the current access instructions on the official source before writing or
running any download command.

## Pilot Subset

Target:

- 100 total videos.
- 50 authentic.
- 50 AI-generated.
- Fixed seed: 42.
- Video-level split: 70 train, 10 validation, 20 test.

The selected subset must be written to the dataset manifest before preprocessing
or training.

## Storage

Local generated paths:

- `data/raw/` - downloaded or manually placed source videos.
- `data/processed/` - sampled frames, intermediate manifests, processed arrays.
- `artifacts/models/` - trained model files.
- `artifacts/explanations/` - generated heatmaps and explanation assets.
- `reports/evaluation/` - generated evaluation outputs.

These paths are ignored by git. Do not commit their contents by default.

## Selection Rules

- Use official dataset labels where available.
- Keep authentic and AI-generated classes balanced.
- Prefer short videos that can be read reliably by the preprocessing tool.
- Do not use private user videos.
- Do not scrape Facebook or any social media platform.
- Record any manual selection reason in the manifest notes.

## Access Caveats

GenVideo sources may involve large files, separate real-video sources, external
terms, or account-based download flows. If access fails:

1. Record the attempted source and failure reason.
2. Do not silently switch to a new dataset.
3. Prefer GenVideo-100K as the next official lightweight source.
4. If both official paths are unavailable, create a new ADR before choosing a
   substitute dataset.

## Completion Criteria

Dataset acquisition is complete when:

- The manifest has exactly 100 selected rows.
- Labels are balanced 50/50.
- Train/validation/test split counts are 70/10/20.
- Every row has source path, label, source category, split, checksum, quality
  status, and notes.
- No data artifacts are staged for commit.

