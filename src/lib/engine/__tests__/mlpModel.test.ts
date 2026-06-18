import { describe, expect, it } from "vitest";
import { featureOrder, runMlpInference, vectorizeFeatures, type FeatureVector } from "../mlpModel";

const authenticFeatures: FeatureVector = {
  lumaMean: 0.6000834111242153,
  lumaStd: 0.40811484276340076,
  redGreenDelta: 0.035365611088185325,
  blueGreenDelta: 0.16105697161677165,
  temporalLumaDelta: 0.011470143814222114,
  temporalColorDelta: 0.012375809698879534,
  edgeEnergy: 0.023808236261713207
};

const generatedFeatures: FeatureVector = {
  lumaMean: 0.21621451204114456,
  lumaStd: 0.25201073243791877,
  redGreenDelta: 0.020465051254876954,
  blueGreenDelta: 0.0027719681622649164,
  temporalLumaDelta: 0.002183945419685727,
  temporalColorDelta: 0.003773663483250454,
  edgeEnergy: 0.015845971726975543
};

describe("mlpModel", () => {
  it("vectorizes features in the stable model order", () => {
    expect(featureOrder).toEqual([
      "lumaMean",
      "lumaStd",
      "redGreenDelta",
      "blueGreenDelta",
      "temporalLumaDelta",
      "temporalColorDelta",
      "edgeEnergy"
    ]);
    expect(vectorizeFeatures(authenticFeatures)[0]).toBeCloseTo(2.736613160787553);
    expect(vectorizeFeatures(authenticFeatures)).toHaveLength(7);
  });

  it("classifies low-anomaly authentic features below threshold", () => {
    const prediction = runMlpInference(authenticFeatures);

    expect(prediction).toMatchObject({
      mode: "authentic",
      score: 1,
      threshold: 0.45,
      strongestFeature: "lumaMean",
      modelVersion: "AgileEye-Pilot-MLP-v2"
    });
    expect(prediction.hiddenActivations).toHaveLength(6);
  });

  it("classifies high-anomaly generated features above threshold", () => {
    const prediction = runMlpInference(generatedFeatures);

    expect(prediction).toMatchObject({
      mode: "ai-generated",
      score: 67,
      threshold: 0.45,
      strongestFeature: "lumaStd",
      modelVersion: "AgileEye-Pilot-MLP-v2"
    });
  });
});
