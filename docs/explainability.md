# Explainability

AgilaEye explanations should help users understand model cues without implying
forensic certainty.

## Method

Use Grad-CAM as the primary explainability method for v1:

- Generate heatmaps for one to three representative frames.
- Prefer frames with high AI-likelihood contribution or high confidence.
- Store generated heatmaps under `artifacts/explanations/`.
- Reference heatmap paths in sidecar JSON.

## Anomaly Categories

Supported categories:

- `object_inconsistency`
- `texture_jitter`
- `interaction_anomaly`
- `movement_anomaly`
- `none`

AI-generated videos should receive one dominant anomaly category during dataset
preparation. Authentic videos should use `none`.

## Template Mapping

Explanation text should be deterministic and template-based.

Examples:

- Object inconsistency: "The model focused on object regions with inconsistent
  shape, boundary, or visual attributes across sampled frames."
- Texture jitter: "The model focused on texture regions with unstable or
  flickering surface details across sampled frames."
- Interaction anomaly: "The model focused on areas where objects or subjects
  appear to interact unnaturally."
- Movement anomaly: "The model focused on frame-to-frame motion cues that appear
  less consistent with natural video."
- None: "The sampled frames showed relatively stable visual consistency cues."

## Copy Rules

Use:

- "may indicate"
- "the model focused on"
- "visual cues"
- "first-level screening"
- "not a final authenticity decision"

Avoid:

- "proves"
- "definitely fake"
- "verified real"
- "forensic result"
- unsupported claims about the video source or creator.

## Acceptance

An explanation is acceptable when:

- It has a corresponding prediction.
- It references one anomaly category.
- It uses a template, not free-form generated text.
- It references representative frames or heatmaps when available.
- It includes non-forensic wording.

