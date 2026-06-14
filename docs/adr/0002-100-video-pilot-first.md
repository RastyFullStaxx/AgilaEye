# ADR-0002: 100-Video Pilot First

## Status

Accepted

## Context

The source plan calls for a limited, balanced pilot study. Full GenVideo-scale
work would introduce large downloads, storage cost, long training time, and more
failure modes before the pipeline is proven.

## Decision

Build the first real dataset scaffold around a reproducible 100-video pilot
subset:

- 50 authentic videos.
- 50 AI-generated videos.
- Seed 42.
- Video-level 70/10/20 train/validation/test split.

Use official GenVideo or GenVideo-100K sources as the preferred source path.

## Consequences

- The first implementation optimizes for reproducibility and feasibility.
- Metrics must be described as pilot-study results.
- Expanding the dataset later requires a new roadmap phase or ADR.

