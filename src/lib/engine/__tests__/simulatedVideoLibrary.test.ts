import { describe, expect, it } from "vitest";
import {
  calculatePerformanceMetrics,
  formatMetricPercent,
  getPredictedModeForVideo,
  getSimulatedResultForVideo,
  simulatedVideoPosts,
  sopPerformanceMetrics
} from "../simulatedVideoLibrary";

describe("simulatedVideoLibrary", () => {
  it("keeps the embedded SOP demo set balanced enough for the pilot scan loop", () => {
    expect(simulatedVideoPosts).toHaveLength(6);
    expect(simulatedVideoPosts.filter((video) => video.groundTruth === "authentic")).toHaveLength(3);
    expect(simulatedVideoPosts.filter((video) => video.groundTruth === "ai-generated")).toHaveLength(3);
  });

  it("computes SOP performance metrics from the embedded video predictions", () => {
    expect(sopPerformanceMetrics).toMatchObject({
      sampleSize: 6,
      truePositive: 3,
      trueNegative: 2,
      falsePositive: 1,
      falseNegative: 0
    });
    expect(formatMetricPercent(sopPerformanceMetrics.accuracy)).toBe("83.3%");
    expect(formatMetricPercent(sopPerformanceMetrics.precision)).toBe("75%");
    expect(formatMetricPercent(sopPerformanceMetrics.recall)).toBe("100%");
    expect(formatMetricPercent(sopPerformanceMetrics.f1Score)).toBe("85.7%");
    expect(Math.round(sopPerformanceMetrics.averageInferenceTimeMs)).toBe(779);
  });

  it("handles empty metric inputs without dividing by zero", () => {
    expect(calculatePerformanceMetrics([])).toEqual({
      sampleSize: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      averageInferenceTimeMs: 0,
      truePositive: 0,
      trueNegative: 0,
      falsePositive: 0,
      falseNegative: 0
    });
  });

  it("returns deterministic scan results for the active embedded video", () => {
    expect(getPredictedModeForVideo("synthetic-city-walk")).toBe("ai-generated");

    const result = getSimulatedResultForVideo("synthetic-city-walk");

    expect(result).toMatchObject({
      mode: "ai-generated",
      score: 86,
      videoId: "synthetic-city-walk",
      videoTitle: "Generated city walk",
      groundTruth: "ai-generated",
      anomalyCategory: "texture_jitter",
      frameSampleCount: 8,
      inferenceTimeMs: 804,
      modelVersion: "AgilaEye-SOP-Sim-v1"
    });
  });
});
