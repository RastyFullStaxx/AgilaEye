# ADR-0005: Template-Based Explanation Mapping

## Status

Accepted

## Context

The source plan requires user-readable explanations. Free-form generated
explanations could invent evidence, overstate certainty, or drift from the
manifest anomaly labels.

## Decision

Use Grad-CAM visual evidence plus deterministic templates mapped to one anomaly
category:

- Object inconsistency.
- Texture jitter.
- Interaction anomaly.
- Movement anomaly.
- None for authentic or low-risk results.

Do not use a large language model or free-form text generation for v1
explanations.

## Consequences

- Explanation output is traceable and easier to test.
- User-facing wording can consistently avoid forensic certainty.
- Future explanation methods must preserve the result contract or update this
  ADR.

