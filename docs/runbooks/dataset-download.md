# Runbook: Dataset Download

This runbook covers the current 100-video pilot acquisition flow. Generated
downloads and extracted videos must remain under ignored `data/` paths.

## Preconditions

- Read `docs/dataset-acquisition.md`.
- Confirm the official source URL is reachable.
- Confirm local disk space.
- Confirm the repo has no staged generated artifacts.
- Confirm `data/raw/` is ignored by git.

## Target

Create a local 100-video pilot source set:

- 50 authentic videos.
- 50 AI-generated videos.
- Source: official GenVideo or GenVideo-100K ecosystem.
- Seed: 42.

## Steps

1. Verify official source instructions:
   - https://github.com/chenhaoxing/DeMamba
   - https://modelscope.cn/datasets/cccnju/Gen-Video
   - https://modelscope.cn/datasets/cccnju/GenVideo-100K
2. Create local raw-data directories under `data/raw/`.
3. Download the official validation ZIP:

```bash
curl -L --fail --continue-at - \
  --output data/raw/modelscope/GenVideo-Val.zip \
  https://modelscope.cn/datasets/cccnju/Gen-Video/resolve/master/GenVideo-Val.zip
```

4. Generate the pilot subset and manifest:

```bash
FFPROBE_PATH="$(node -e 'console.log(require("@ffprobe-installer/ffprobe").path)')" \
  python3 scripts/acquire_genvideo_pilot.py \
  --zip data/raw/modelscope/GenVideo-Val.zip \
  --out-dir data/raw/pilot-100 \
  --manifest data/processed/manifests/pilot-100.csv
```

5. Validate manifest counts and required fields.
6. Check `git status --short` and confirm no raw data is staged.

## Success Criteria

- Manifest has 100 selected rows.
- Class counts are 50 authentic and 50 AI-generated.
- Split counts are 70 train, 10 validation, and 20 test.
- Every valid row has a checksum.
- Every valid row has duration, resolution, and fps populated by ffprobe.
- Local downloaded files remain under ignored paths.
- Expected generated paths:
  - `data/raw/modelscope/GenVideo-Val.zip`
  - `data/raw/pilot-100/train/`
  - `data/raw/pilot-100/validation/`
  - `data/raw/pilot-100/test/`
  - `data/processed/manifests/pilot-100.csv`

## Failure Handling

- If official access fails, record the failure and stop.
- If the source requires different terms or accounts, update
  `docs/dataset-acquisition.md`.
- If a substitute dataset is needed, create a new ADR before using it.
