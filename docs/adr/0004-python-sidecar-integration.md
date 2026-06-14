# ADR-0004: Python Sidecar Integration

## Status

Accepted

## Context

The existing Svelte/Tauri app is a polished UI simulation. PyTorch inference,
video preprocessing, and Grad-CAM are better kept in Python for v1. Running the
model directly in the browser or rewriting the app around Python would increase
integration risk.

## Decision

Introduce real inference through a local Python sidecar command that writes JSON
for the app:

```bash
python -m agilaeye_detector.infer --video <path> --out <json>
```

The Svelte/Tauri app should keep the existing detector state machine and adapt
sidecar JSON into the current detector result shape.

## Consequences

- UI behavior remains testable without PyTorch.
- ML implementation can evolve independently behind a small JSON interface.
- Packaging must later address Python runtime and model artifact distribution.

