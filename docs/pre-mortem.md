# Pre-Mortem

This pre-mortem names the ways AgilaEye could fail before scaffolding begins.
Each risk has a concrete mitigation doc or acceptance check.

## Failure Modes

| Failure mode | Why it matters | Mitigation |
| --- | --- | --- |
| Naming drift between AgilaEye and HaribonEye | Future docs, package names, screenshots, and app text become inconsistent. | `CONTEXT.md` and ADR-0001 define AgilaEye as the repo/system and HaribonEye as the current app product name. |
| Dataset source cannot be downloaded or requires unexpected access | Scaffolding stalls or silently switches to an incompatible dataset. | `docs/dataset-acquisition.md` requires source verification before download and records fallback rules. |
| Large videos or model files get committed | Repo becomes slow, expensive, or unusable. | `.gitignore`, `docs/dataset-acquisition.md`, and runbooks ban committed data/artifacts by default. |
| Pilot subset is not reproducible | Reported metrics cannot be recreated. | `docs/data-manifest-schema.md` requires stable IDs, checksums, split, and seed. |
| Frames from one video leak across splits | Metrics become artificially high. | `docs/preprocessing.md` requires video-level splitting before frame extraction. |
| Model claims become too strong | Users may treat a lightweight detector as forensic proof. | `docs/security-privacy-ethics.md` and `docs/ui-integration.md` require probabilistic wording. |
| Explanation text invents reasons | The UI may imply evidence the model did not provide. | `docs/explainability.md` requires template mapping from Grad-CAM plus manifest anomaly category. |
| Python ML logic leaks into Svelte components | The app becomes hard to test and hard to package. | `docs/architecture.md` and ADR-0004 preserve the detector sidecar seam. |
| The state machine is bypassed during real inference | Scroll interruption and demo behavior regress. | `docs/ui-integration.md` keeps the current state machine as the UI interaction seam. |
| The dataset pipeline and app UI evolve separately | Results shown in the app no longer match research evidence. | `docs/evaluation.md` and `docs/ui-integration.md` share one result contract. |
| Packaging assumes Python is already present | Desktop prototype works only on developer machines. | `docs/scaffolding-roadmap.md` defers packaging until sidecar requirements are explicit. |
| Generated reports are not comparable | Future experiments cannot be compared to the pilot. | `docs/evaluation.md` standardizes metric names, split references, and threshold reporting. |

## Acceptance Checks

Before dataset or ML scaffolding starts:

- Every roadmap phase has a linked doc.
- Every ADR has a clear status and decision.
- Dataset docs name storage paths that are ignored by git.
- Manifest docs include labels, splits, source category, checksum, and quality
  status.
- UI docs include the sidecar JSON contract.
- Ethics docs prohibit private video collection and definitive authenticity
  claims.
- References include official GenVideo/DeMamba sources.

Before real inference is connected to the UI:

- `npm run ci` passes.
- A sample sidecar JSON file validates against the documented result contract.
- The UI still handles scan interruption and active-video changes.
- The result copy uses first-level screening language.

