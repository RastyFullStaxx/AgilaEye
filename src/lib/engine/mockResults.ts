import type { DetectorResult, ResultMode } from "./types";

export const mockResults: Record<ResultMode, DetectorResult> = {
  authentic: {
    mode: "authentic",
    score: 18,
    likelihoodLabel: "AI-likelihood",
    classification: "Likely Authentic",
    bullets: [
      "Consistent facial texture",
      "Stable lighting and shadows",
      "Natural eye and mouth details"
    ],
    details: {
      summary: "The detector found stable visual consistency cues.",
      frameConsistency: "Stable",
      facialTexture: "Consistent",
      lightingShadowCoherence: "Stable",
      temporalArtifactSignal: "Low",
      decision: "Likely Authentic"
    }
  },
  "ai-generated": {
    mode: "ai-generated",
    score: 82,
    likelihoodLabel: "AI-likelihood",
    classification: "Likely AI-Generated",
    bullets: [
      "Temporal flicker around facial edges",
      "Inconsistent lighting transitions",
      "Mild lip-sync mismatch",
      "Background deformation artifacts"
    ],
    details: {
      summary:
        "The detector found multiple visual inconsistencies commonly associated with AI-generated videos.",
      frameConsistency: "Irregular",
      facialTexture: "Suspicious",
      lightingShadowCoherence: "Inconsistent",
      temporalArtifactSignal: "Elevated",
      decision: "Likely AI-Generated"
    }
  }
};

export function getMockResult(mode: ResultMode): DetectorResult {
  return mockResults[mode];
}
