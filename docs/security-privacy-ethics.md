# Security, Privacy, And Ethics

AgilaEye is a research prototype for first-level screening. It must avoid
collecting private data, overclaiming model certainty, or encouraging unsafe use.

## Privacy Rules

- Do not collect private Facebook videos.
- Do not scrape social media platforms.
- Do not capture the user's screen in v1.
- Do not use webcam input.
- Do not store personal user data.
- Do not perform facial biometric verification.
- Use only publicly available research dataset videos for the pilot.

## Dataset Rules

- Follow the terms of the source dataset.
- Keep downloaded data local and ignored.
- Record source dataset and category in the manifest.
- Do not commit videos, frames, heatmaps, or model weights.
- Do not redistribute dataset files through this repo.

## User-Facing Claim Rules

Allowed wording:

- "AI-likelihood"
- "Likely AI-Generated"
- "Likely Authentic"
- "first-level screening"
- "visual cues"
- "not a final authenticity decision"

Avoid wording that implies proof, certainty, source attribution, or creator
identity.

## Bias And Limitations

The 100-video pilot subset may not generalize to:

- New video generators.
- Heavily compressed uploads.
- Long videos.
- Different languages or regions.
- Non-dataset social-media videos.
- Real adversarial manipulation.

Reports and UI copy should state this limitation clearly.

## Operational Risks

- Model files may be large.
- Dataset access may change.
- Timing results depend on hardware.
- Grad-CAM heatmaps can be visually persuasive even when the model is wrong.
- False positives and false negatives are expected.

## Acceptance

Before public presentation:

- UI copy avoids certainty.
- README states the current prototype simulation status.
- Evaluation report states dataset size and limitations.
- No private or large data files are committed.
- Any screenshots of videos respect dataset/license requirements.

