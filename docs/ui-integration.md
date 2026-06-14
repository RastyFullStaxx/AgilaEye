# UI Integration

The existing Svelte/Tauri app should remain the interaction layer for the
detector. Real inference should be introduced through an adapter seam, not by
moving ML logic into Svelte components.

## Current UI Contract

The detector controller owns:

- Active-video visibility.
- Startup gating.
- Idle state.
- Scan progress.
- Scan interruption.
- Result state.
- Rescan.

This behavior should continue to work whether results come from mocks or a
future sidecar.

## Current Sidecar Command

The repository now includes a lightweight Python sidecar scaffold that mirrors
the app's local MLP over embedded feature vectors:

```bash
PYTHONPATH=model python3 -m agileeye_detector.infer --video-id synthetic-city-walk
```

It is useful for contract smoke tests and future Tauri invocation work. It is
not yet a frame-level PyTorch video model.

The trained pilot MLP sidecar path accepts a model artifact and a local video:

```bash
npm run ml:infer:sample
```

Equivalent command shape:

```bash
python3 -m agileeye_detector.infer \
  --model artifacts/models/agileeye-pilot-mlp-v1.json \
  --video data/raw/pilot-100/test/ai_generated/agileeye_0091.mp4
```

## Future Dataset-Trained Sidecar Command

Target command:

```bash
python -m agileeye_detector.infer --video <path> --out <json>
```

The sidecar should perform local inference and write a JSON result. Tauri can
later call this command or a wrapped equivalent.

## Sidecar Result JSON

Expected fields:

```json
{
  "video_id": "agileeye_0001",
  "prediction_label": "Likely AI-Generated",
  "result_mode": "ai-generated",
  "ai_likelihood": 0.82,
  "threshold": 0.5,
  "explanation_summary": "The model focused on texture regions with unstable surface details.",
  "anomaly_category": "texture_jitter",
  "representative_frames": ["data/processed/frames/test/agileeye_0001/frame_003.jpg"],
  "heatmap_paths": ["artifacts/explanations/run-001/agileeye_0001/frame_003.png"],
  "inference_time_ms": 842.5,
  "model_version": "mobilenetv3-small-mlp-001",
  "non_forensic_notice": "This is a first-level screening result, not a final authenticity decision."
}
```

## Adapter Rules

The TypeScript adapter should:

- Convert `ai_likelihood` from 0.0-1.0 to the existing percentage score.
- Map `result_mode` to the current `DetectorResult.mode`.
- Preserve non-forensic copy in details.
- Handle sidecar errors and timeouts without stale results.
- Keep the mock result source available for demos until real inference is stable.

## Failure States

The UI should eventually handle:

- Sidecar missing.
- Model artifact missing.
- Video path missing.
- Inference timeout.
- Invalid JSON.
- Heatmap unavailable.

These should show supportive error or fallback states, not crash the app.

## Acceptance

Real UI integration is ready when:

- Existing detector state-machine tests still pass.
- Sidecar success, timeout, and invalid JSON are tested.
- Scanning can still be interrupted by active-video changes.
- Result copy remains probabilistic.
