import { describe, expect, it } from "vitest";
import { getMockResult } from "../mockResults";

describe("mockResults", () => {
  it("contains the required authentic result copy and details", () => {
    const result = getMockResult("authentic");

    expect(result.score).toBe(18);
    expect(result.likelihoodLabel).toBe("AI-likelihood");
    expect(result.classification).toBe("Likely Authentic");
    expect(result.bullets).toEqual([
      "Consistent facial texture",
      "Stable lighting and shadows",
      "Natural eye and mouth details"
    ]);
    expect(result.details).toMatchObject({
      frameConsistency: "Stable",
      facialTexture: "Consistent",
      lightingShadowCoherence: "Stable",
      temporalArtifactSignal: "Low",
      decision: "Likely Authentic"
    });
  });

  it("contains the required AI-generated result copy and details", () => {
    const result = getMockResult("ai-generated");

    expect(result.score).toBe(82);
    expect(result.likelihoodLabel).toBe("AI-likelihood");
    expect(result.classification).toBe("Likely AI-Generated");
    expect(result.bullets).toEqual([
      "Temporal flicker around facial edges",
      "Inconsistent lighting transitions",
      "Mild lip-sync mismatch",
      "Background deformation artifacts"
    ]);
    expect(result.details).toMatchObject({
      frameConsistency: "Irregular",
      facialTexture: "Suspicious",
      lightingShadowCoherence: "Inconsistent",
      temporalArtifactSignal: "Elevated",
      decision: "Likely AI-Generated"
    });
  });
});
