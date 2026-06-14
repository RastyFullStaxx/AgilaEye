# Runbook: Dataset Download

This runbook is for the future dataset scaffold. Do not run large downloads
until the dataset tooling exists and the official source access has been
verified.

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
3. Download or place source videos according to official terms.
4. Generate the manifest with stable IDs and checksums.
5. Select the 100-video pilot subset with seed 42.
6. Assign video-level stratified splits.
7. Validate manifest counts and required fields.
8. Check `git status --short` and confirm no raw data is staged.

## Success Criteria

- Manifest has 100 selected rows.
- Class counts are 50 authentic and 50 AI-generated.
- Split counts are 70 train, 10 validation, and 20 test.
- Every valid row has a checksum.
- Local downloaded files remain under ignored paths.

## Failure Handling

- If official access fails, record the failure and stop.
- If the source requires different terms or accounts, update
  `docs/dataset-acquisition.md`.
- If a substitute dataset is needed, create a new ADR before using it.

