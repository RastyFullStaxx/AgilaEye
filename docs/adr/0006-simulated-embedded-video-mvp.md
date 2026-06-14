# ADR-0006: Simulated Embedded-Video MVP

## Status

Accepted

## Context

Earlier planning documented a larger research extension with dataset download,
PyTorch training, Grad-CAM artifacts, and a Python sidecar. The current MVP goal
is narrower and more presentation-focused: AgileEye should work inside a
simulated Facebook-style environment where embedded videos are scanned by a
small local MLP repeatedly and SOP performance metrics are visible.

## Decision

Complete the MVP as a deterministic embedded-video simulation:

- Render a fixed Facebook-style feed with embedded videos.
- Detect the active video through viewport visibility.
- Use the existing scan state machine.
- Return deterministic per-video scan results from local TypeScript feature
  vectors and an MLP classifier.
- Compute SOP metrics from the embedded evaluation set.
- Display accuracy, precision, recall, F1-score, average inference time, and
  confusion counts in the UI.

Do not build dataset download, Python training, real inference, Grad-CAM file
generation, or Python sidecar integration for MVP completion.

## Consequences

- The app remains lightweight, demoable, and aligned with the requested scope.
- The codebase keeps a clean MLP-backed simulation module that can be replaced
  later.
- Earlier dataset and PyTorch docs become research-extension references, not MVP
  requirements.
- User-facing copy must keep saying first-level screening and simulation where
  appropriate.
