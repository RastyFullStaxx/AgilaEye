import { describe, expect, it } from "vitest";
import {
  calculatePerformanceMetrics,
  formatMetricPercent,
  perVideoPerformanceRows,
  getPredictedModeForVideo,
  getSimulatedResultForVideo,
  splitPerformanceMetrics,
  simulatedVideoPosts,
  sopPerformanceMetrics
} from "../simulatedVideoLibrary";

describe("simulatedVideoLibrary", () => {
  it("embeds the full 100-video pilot set in the scroll simulation", () => {
    expect(simulatedVideoPosts).toHaveLength(100);
    expect(simulatedVideoPosts.filter((video) => video.groundTruth === "authentic")).toHaveLength(50);
    expect(simulatedVideoPosts.filter((video) => video.groundTruth === "ai-generated")).toHaveLength(50);
    expect(simulatedVideoPosts.filter((video) => video.split !== "test")).toHaveLength(80);
    expect(simulatedVideoPosts.filter((video) => video.split === "test")).toHaveLength(20);
    expect(simulatedVideoPosts.every((video) => video.videoSrc.startsWith("/videos/pilot-100/"))).toBe(true);
  });

  it("logs one performance row per pilot video", () => {
    expect(perVideoPerformanceRows).toHaveLength(100);
    expect(perVideoPerformanceRows[0]).toMatchObject({
      videoId: "agileeye_0001",
      split: "train",
      trueLabel: "authentic",
      predictedLabel: "authentic"
    });
    expect(perVideoPerformanceRows.every((row) => row.inferenceTimeMs >= 0)).toBe(true);
  });

  it("computes SOP performance metrics from all embedded video predictions", () => {
    expect(sopPerformanceMetrics).toMatchObject({
      sampleSize: 100,
      truePositive: 46,
      trueNegative: 45,
      falsePositive: 5,
      falseNegative: 4
    });
    expect(formatMetricPercent(sopPerformanceMetrics.accuracy)).toBe("91%");
    expect(formatMetricPercent(sopPerformanceMetrics.precision)).toBe("90.2%");
    expect(formatMetricPercent(sopPerformanceMetrics.recall)).toBe("92%");
    expect(formatMetricPercent(sopPerformanceMetrics.f1Score)).toBe("91.1%");
  });

  it("computes model development and model testing metrics for SOP tables", () => {
    expect(splitPerformanceMetrics.modelDevelopment).toMatchObject({
      sampleSize: 80,
      accuracy: 0.9625,
      precision: 0.9512195121951219,
      recall: 0.975,
      f1Score: 0.9629629629629629
    });

    expect(splitPerformanceMetrics.modelTesting).toMatchObject({
      sampleSize: 20,
      accuracy: 0.7,
      precision: 0.7,
      recall: 0.7,
      f1Score: 0.7
    });
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
    expect(getPredictedModeForVideo("agileeye_0091")).toBe("ai-generated");

    const result = getSimulatedResultForVideo("agileeye_0091");

    expect(result).toMatchObject({
      mode: "ai-generated",
      score: 100,
      videoId: "agileeye_0091",
      videoTitle: "AgileEye 0091",
      groundTruth: "ai-generated",
      anomalyCategory: "interaction_anomaly",
      frameSampleCount: 8,
      modelVersion: "AgileEye-Pilot-MLP-v1"
    });
  });
});
