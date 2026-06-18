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
      truePositive: 49,
      trueNegative: 40,
      falsePositive: 10,
      falseNegative: 1
    });
    expect(formatMetricPercent(sopPerformanceMetrics.accuracy)).toBe("89%");
    expect(formatMetricPercent(sopPerformanceMetrics.precision)).toBe("83.1%");
    expect(formatMetricPercent(sopPerformanceMetrics.recall)).toBe("98%");
    expect(formatMetricPercent(sopPerformanceMetrics.f1Score)).toBe("89.9%");
  });

  it("computes model development and model testing metrics for SOP tables", () => {
    expect(splitPerformanceMetrics.modelDevelopment).toMatchObject({
      sampleSize: 80,
      accuracy: 0.9125,
      precision: 0.851063829787234,
      recall: 1,
      f1Score: 0.9195402298850576
    });

    expect(splitPerformanceMetrics.modelTesting).toMatchObject({
      sampleSize: 20,
      accuracy: 0.8,
      precision: 0.75,
      recall: 0.9,
      f1Score: 0.8181818181818182
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
    expect(getPredictedModeForVideo("agileeye_0092")).toBe("ai-generated");

    const result = getSimulatedResultForVideo("agileeye_0092");

    expect(result).toMatchObject({
      mode: "ai-generated",
      score: 67,
      videoId: "agileeye_0092",
      videoTitle: "AgileEye 0092",
      groundTruth: "ai-generated",
      anomalyCategory: "movement_anomaly",
      frameSampleCount: 8,
      modelVersion: "AgileEye-Pilot-MLP-v2"
    });
  });
});
