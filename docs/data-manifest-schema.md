# Data Manifest Schema

The dataset manifest is the source of truth for every selected pilot video. It
should be a CSV file generated during dataset acquisition and reused by
preprocessing, training, evaluation, and explanation scripts.

## Required CSV Fields

| Field | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | Stable repository-local ID, for example `agilaeye_0001`. |
| `source_path` | Yes | Local path under `data/raw/` or an operator-provided source path. |
| `source_dataset` | Yes | Dataset name, such as `GenVideo` or `GenVideo-100K`. |
| `source_category` | Yes | Original source or generator category when available. |
| `binary_label` | Yes | `authentic` or `ai_generated`. |
| `anomaly_category` | Yes | `none`, `object_inconsistency`, `texture_jitter`, `interaction_anomaly`, or `movement_anomaly`. |
| `split` | Yes | `train`, `validation`, or `test`. |
| `duration_seconds` | Yes | Video duration after probing. |
| `resolution_width` | Yes | Source width in pixels. |
| `resolution_height` | Yes | Source height in pixels. |
| `fps` | Yes | Source frames per second when available. |
| `checksum_sha256` | Yes | SHA-256 checksum of the source video file. |
| `quality_status` | Yes | `valid`, `excluded_unreadable`, `excluded_too_short`, or `excluded_other`. |
| `notes` | Yes | Free-text note for manual selection, exclusion, or source details. |

## Label Rules

- `binary_label` is the training target.
- `anomaly_category` supports explanation mapping and should not become a
  hidden multiclass training target in v1.
- Authentic videos use `anomaly_category=none`.
- AI-generated videos must use one dominant anomaly category.

## Split Rules

- Split at video level before frame extraction.
- Do not place frames from one source video in multiple splits.
- Use seed 42 for the pilot selection and split.
- Preserve class balance across splits:
  - Train: 35 authentic, 35 AI-generated.
  - Validation: 5 authentic, 5 AI-generated.
  - Test: 10 authentic, 10 AI-generated.

## Example Row

```csv
video_id,source_path,source_dataset,source_category,binary_label,anomaly_category,split,duration_seconds,resolution_width,resolution_height,fps,checksum_sha256,quality_status,notes
agilaeye_0001,data/raw/genvideo/example.mp4,GenVideo-100K,Pika,ai_generated,texture_jitter,train,3.0,1088,640,24,examplechecksum,valid,selected by seed 42 pilot sampler
```

## Validation Checks

A manifest validator should fail when:

- Required fields are missing.
- Labels are not balanced for the pilot target.
- Split counts do not match 70/10/20.
- A video ID appears more than once.
- A checksum is blank for a valid video.
- An authentic video has an AI anomaly category.
- An AI-generated video has `anomaly_category=none`.

