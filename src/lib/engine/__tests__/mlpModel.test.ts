import { describe, expect, it } from "vitest";
import { featureOrder, runMlpInference, vectorizeFeatures, type FeatureVector } from "../mlpModel";

const authenticFeatures: FeatureVector = {
  textureInstability: 0.12,
  objectBoundaryDrift: 0.08,
  interactionMismatch: 0.05,
  motionIrregularity: 0.1,
  compressionNoise: 0.16,
  naturalContinuity: 0.9
};

const generatedFeatures: FeatureVector = {
  textureInstability: 0.62,
  objectBoundaryDrift: 0.45,
  interactionMismatch: 0.95,
  motionIrregularity: 0.88,
  compressionNoise: 0.3,
  naturalContinuity: 0.14
};

describe("mlpModel", () => {
  it("vectorizes features in the stable model order", () => {
    expect(featureOrder).toEqual([
      "textureInstability",
      "objectBoundaryDrift",
      "interactionMismatch",
      "motionIrregularity",
      "compressionNoise",
      "naturalContinuity"
    ]);
    expect(vectorizeFeatures(authenticFeatures)).toEqual([0.12, 0.08, 0.05, 0.1, 0.16, 0.9]);
  });

  it("classifies low-anomaly authentic features below threshold", () => {
    const prediction = runMlpInference(authenticFeatures);

    expect(prediction).toMatchObject({
      mode: "authentic",
      score: 19,
      threshold: 0.5,
      strongestFeature: "compressionNoise",
      modelVersion: "AgileEye-MLP-Sim-v1"
    });
    expect(prediction.hiddenActivations).toHaveLength(5);
  });

  it("classifies high-anomaly generated features above threshold", () => {
    const prediction = runMlpInference(generatedFeatures);

    expect(prediction).toMatchObject({
      mode: "ai-generated",
      score: 93,
      threshold: 0.5,
      strongestFeature: "interactionMismatch",
      modelVersion: "AgileEye-MLP-Sim-v1"
    });
  });
});
