import { runMlpInference, type FeatureVector, type MlpPrediction } from "./mlpModel";
import type { AnomalyCategory, DetectorResult, PerformanceMetrics, ResultMode } from "./types";
import { pilotVideoDataset, type PilotSplit } from "./pilotVideoDataset";

export interface SimulatedVideoPost {
  id: string;
  author: string;
  meta: string;
  body: string;
  domain: string;
  headline: string;
  subhead: string;
  videoTitle: string;
  videoSrc: string;
  accent: "blue" | "amber" | "red" | "green";
  groundTruth: ResultMode;
  split: PilotSplit;
  predictedMode: ResultMode;
  aiLikelihood: number;
  score: number;
  features: FeatureVector;
  inferenceTimeMs: number;
  anomalyCategory: AnomalyCategory;
  sourcePath: string;
  sourceCategory: string;
  durationSeconds: number;
  resolution: string;
  fps: number;
  bullets: string[];
  details: DetectorResult["details"];
}

export interface PerVideoPerformanceRow {
  videoId: string;
  split: PilotSplit;
  trueLabel: ResultMode;
  predictedLabel: ResultMode;
  aiLikelihood: number;
  score: number;
  inferenceTimeMs: number;
  correct: boolean;
}

export interface SplitPerformanceMetrics {
  modelDevelopment: PerformanceMetrics;
  modelTesting: PerformanceMetrics;
}

const NON_FORENSIC_NOTICE = "First-level screening only. Not a final authenticity decision.";

const anomalyBullets: Record<AnomalyCategory, string[]> = {
  none: ["Low synthetic artifact signal", "Stable sampled-frame features", "Consistent visual statistics"],
  object_inconsistency: ["Object-boundary feature pattern", "Shape consistency cue reviewed", "AI-likelihood above threshold"],
  texture_jitter: ["Texture variation cue reviewed", "Frame-level surface statistics checked", "AI-likelihood above threshold"],
  interaction_anomaly: ["Interaction cue category reviewed", "Subject-scene consistency checked", "AI-likelihood above threshold"],
  movement_anomaly: ["Motion-related cue category reviewed", "Temporal feature pattern checked", "AI-likelihood above threshold"]
};

function detailsForVideo(mode: ResultMode, anomalyCategory: AnomalyCategory): DetectorResult["details"] {
  if (mode === "authentic") {
    return {
      summary: "The lightweight pilot model kept this video below the AI-likelihood threshold during the eight-frame scan.",
      frameConsistency: "Stable",
      facialTexture: "Consistent",
      lightingShadowCoherence: "Stable",
      temporalArtifactSignal: "Low",
      decision: "Likely Authentic"
    };
  }

  return {
    summary: `The lightweight pilot model flagged this video using ${anomalyCategory.replace(/_/g, " ")} cues from the sampled frames.`,
    frameConsistency: "Irregular",
    facialTexture: anomalyCategory === "texture_jitter" ? "Suspicious" : "Reviewed",
    lightingShadowCoherence: anomalyCategory === "object_inconsistency" ? "Inconsistent" : "Borderline",
    temporalArtifactSignal: "Elevated",
    decision: "Likely AI-Generated"
  };
}

export const simulatedVideoPosts: SimulatedVideoPost[] = pilotVideoDataset.map((video) => ({
  ...video,
  bullets: video.predictedMode === "authentic" ? anomalyBullets.none : anomalyBullets[video.anomalyCategory],
  details: detailsForVideo(video.predictedMode, video.anomalyCategory)
}));

function modeToClassification(mode: ResultMode): DetectorResult["classification"] {
  return mode === "authentic" ? "Likely Authentic" : "Likely AI-Generated";
}

export function getSimulatedVideoPost(videoId: string | null | undefined): SimulatedVideoPost {
  return simulatedVideoPosts.find((video) => video.id === videoId) ?? simulatedVideoPosts[0];
}

export function getPredictedModeForVideo(videoId: string | null | undefined): ResultMode {
  return getSimulatedVideoPost(videoId).predictedMode;
}

export function runSimulatedVideoModel(videoId: string | null | undefined): MlpPrediction {
  return runMlpInference(getSimulatedVideoPost(videoId).features);
}

export function getSimulatedResultForVideo(
  videoId: string | null | undefined,
  overrideMode?: ResultMode
): DetectorResult {
  const video = getSimulatedVideoPost(videoId);
  const prediction = runMlpInference(video.features);
  const mode = overrideMode ?? prediction.mode;
  const score = overrideMode ? (mode === "authentic" ? 18 : 82) : prediction.score;

  return {
    mode,
    score,
    likelihoodLabel: "AI-likelihood",
    classification: modeToClassification(mode),
    bullets: overrideMode && overrideMode !== prediction.mode ? [`Presentation override: ${modeToClassification(mode)}`] : video.bullets,
    videoId: video.id,
    videoTitle: video.videoTitle,
    groundTruth: video.groundTruth,
    anomalyCategory: mode === "authentic" ? "none" : video.anomalyCategory,
    inferenceTimeMs: video.inferenceTimeMs,
    frameSampleCount: 8,
    modelVersion: prediction.modelVersion,
    nonForensicNotice: NON_FORENSIC_NOTICE,
    details:
      overrideMode && overrideMode !== prediction.mode
        ? {
            summary: "This result was manually overridden for presentation backup.",
            frameConsistency: mode === "authentic" ? "Stable" : "Irregular",
            facialTexture: mode === "authentic" ? "Consistent" : "Suspicious",
            lightingShadowCoherence: mode === "authentic" ? "Stable" : "Inconsistent",
            temporalArtifactSignal: mode === "authentic" ? "Low" : "Elevated",
            decision: modeToClassification(mode)
          }
        : video.details
  };
}

export function calculatePerformanceMetrics(videos: SimulatedVideoPost[] = simulatedVideoPosts): PerformanceMetrics {
  const counts = videos.reduce(
    (accumulator, video) => {
      const predictionMode = video.predictedMode;

      if (video.groundTruth === "ai-generated" && predictionMode === "ai-generated") {
        accumulator.truePositive += 1;
      } else if (video.groundTruth === "authentic" && predictionMode === "authentic") {
        accumulator.trueNegative += 1;
      } else if (video.groundTruth === "authentic" && predictionMode === "ai-generated") {
        accumulator.falsePositive += 1;
      } else {
        accumulator.falseNegative += 1;
      }

      accumulator.totalInferenceTime += video.inferenceTimeMs;
      return accumulator;
    },
    {
      truePositive: 0,
      trueNegative: 0,
      falsePositive: 0,
      falseNegative: 0,
      totalInferenceTime: 0
    }
  );

  const sampleSize = videos.length;
  const accuracy = sampleSize === 0 ? 0 : (counts.truePositive + counts.trueNegative) / sampleSize;
  const precisionDenominator = counts.truePositive + counts.falsePositive;
  const recallDenominator = counts.truePositive + counts.falseNegative;
  const precision = precisionDenominator === 0 ? 0 : counts.truePositive / precisionDenominator;
  const recall = recallDenominator === 0 ? 0 : counts.truePositive / recallDenominator;
  const f1Denominator = precision + recall;

  return {
    sampleSize,
    accuracy,
    precision,
    recall,
    f1Score: f1Denominator === 0 ? 0 : (2 * precision * recall) / f1Denominator,
    averageInferenceTimeMs: sampleSize === 0 ? 0 : counts.totalInferenceTime / sampleSize,
    truePositive: counts.truePositive,
    trueNegative: counts.trueNegative,
    falsePositive: counts.falsePositive,
    falseNegative: counts.falseNegative
  };
}

export const sopPerformanceMetrics = calculatePerformanceMetrics();

export const splitPerformanceMetrics: SplitPerformanceMetrics = {
  modelDevelopment: calculatePerformanceMetrics(simulatedVideoPosts.filter((video) => video.split !== "test")),
  modelTesting: calculatePerformanceMetrics(simulatedVideoPosts.filter((video) => video.split === "test"))
};

export const perVideoPerformanceRows: PerVideoPerformanceRow[] = simulatedVideoPosts.map((video) => ({
  videoId: video.id,
  split: video.split,
  trueLabel: video.groundTruth,
  predictedLabel: video.predictedMode,
  aiLikelihood: video.aiLikelihood,
  score: video.score,
  inferenceTimeMs: video.inferenceTimeMs,
  correct: video.groundTruth === video.predictedMode
}));

export function formatMetricPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}
