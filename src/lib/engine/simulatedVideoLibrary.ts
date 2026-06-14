import { runMlpInference, type FeatureVector, type MlpPrediction } from "./mlpModel";
import type { AnomalyCategory, DetectorResult, PerformanceMetrics, ResultMode } from "./types";

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
  features: FeatureVector;
  inferenceTimeMs: number;
  anomalyCategory: AnomalyCategory;
  bullets: string[];
  details: DetectorResult["details"];
}

const NON_FORENSIC_NOTICE = "First-level screening only. Not a final authenticity decision.";

export const simulatedVideoPosts: SimulatedVideoPost[] = [
  {
    id: "main-video",
    author: "Told You I Could Do It",
    meta: "Sponsored",
    body: "Hiring post with a stable talking-head clip used as the first authentic baseline sample.",
    domain: "apply.toldyoucoulddoit.com",
    headline: "Top 3 get paid trial weeks.",
    subhead: "Looking for remote ecomm web devs.",
    videoTitle: "Recruitment announcement",
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    accent: "blue",
    groundTruth: "authentic",
    features: {
      textureInstability: 0.12,
      objectBoundaryDrift: 0.08,
      interactionMismatch: 0.05,
      motionIrregularity: 0.1,
      compressionNoise: 0.16,
      naturalContinuity: 0.9
    },
    inferenceTimeMs: 732,
    anomalyCategory: "none",
    bullets: ["Consistent frame texture", "Stable lighting and shadows", "Natural object boundaries"],
    details: {
      summary: "The simulated scan found stable visual consistency cues across the sampled frames.",
      frameConsistency: "Stable",
      facialTexture: "Consistent",
      lightingShadowCoherence: "Stable",
      temporalArtifactSignal: "Low",
      decision: "Likely Authentic"
    }
  },
  {
    id: "synthetic-city-walk",
    author: "Future Street Clips",
    meta: "Suggested reel",
    body: "A glossy street-walk clip with subtle surface shimmer and unnaturally smooth background motion.",
    domain: "futurestreet.example",
    headline: "Morning walk through a generated city.",
    subhead: "Motion cues are intentionally suspicious.",
    videoTitle: "Generated city walk",
    videoSrc: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    accent: "red",
    groundTruth: "ai-generated",
    features: {
      textureInstability: 0.88,
      objectBoundaryDrift: 0.46,
      interactionMismatch: 0.25,
      motionIrregularity: 0.74,
      compressionNoise: 0.34,
      naturalContinuity: 0.18
    },
    inferenceTimeMs: 804,
    anomalyCategory: "texture_jitter",
    bullets: ["Texture shimmer across frames", "Synthetic edge softness", "Elevated temporal artifact signal"],
    details: {
      summary: "The simulated scan focused on unstable texture regions and frame-to-frame shimmer.",
      frameConsistency: "Irregular",
      facialTexture: "Suspicious",
      lightingShadowCoherence: "Inconsistent",
      temporalArtifactSignal: "Elevated",
      decision: "Likely AI-Generated"
    }
  },
  {
    id: "campus-interview",
    author: "UP Digital Society",
    meta: "Public",
    body: "Short campus interview sample used to check whether ordinary authentic footage stays below threshold.",
    domain: "campusmedia.example",
    headline: "Students discuss media literacy.",
    subhead: "Authentic baseline with natural compression.",
    videoTitle: "Campus interview",
    videoSrc: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    accent: "green",
    groundTruth: "authentic",
    features: {
      textureInstability: 0.18,
      objectBoundaryDrift: 0.12,
      interactionMismatch: 0.08,
      motionIrregularity: 0.2,
      compressionNoise: 0.4,
      naturalContinuity: 0.82
    },
    inferenceTimeMs: 691,
    anomalyCategory: "none",
    bullets: ["Natural motion continuity", "Stable surface detail", "Low synthetic artifact signal"],
    details: {
      summary: "The simulated scan found natural frame-to-frame continuity and low artifact signal.",
      frameConsistency: "Stable",
      facialTexture: "Consistent",
      lightingShadowCoherence: "Stable",
      temporalArtifactSignal: "Low",
      decision: "Likely Authentic"
    }
  },
  {
    id: "product-orbit",
    author: "Civic Media Lab",
    meta: "Sponsored",
    body: "A product-shot style clip with object boundaries that drift during the scan window.",
    domain: "civicmedia.example",
    headline: "New verifier tools are coming.",
    subhead: "Generated product orbit sample.",
    videoTitle: "Generated product orbit",
    videoSrc: "https://media.w3.org/2010/05/video/movie_300.mp4",
    accent: "amber",
    groundTruth: "ai-generated",
    features: {
      textureInstability: 0.42,
      objectBoundaryDrift: 0.9,
      interactionMismatch: 0.25,
      motionIrregularity: 0.55,
      compressionNoise: 0.22,
      naturalContinuity: 0.25
    },
    inferenceTimeMs: 768,
    anomalyCategory: "object_inconsistency",
    bullets: ["Object edge drift", "Boundary shape inconsistency", "Mild lighting mismatch"],
    details: {
      summary: "The simulated scan focused on object boundaries that changed shape across sampled frames.",
      frameConsistency: "Uneven",
      facialTexture: "Not applicable",
      lightingShadowCoherence: "Inconsistent",
      temporalArtifactSignal: "Elevated",
      decision: "Likely AI-Generated"
    }
  },
  {
    id: "community-event",
    author: "Research Circle PH",
    meta: "Public",
    body: "A real event-style clip that the pilot scanner intentionally misflags to keep metrics honest.",
    domain: "researchcircle.example",
    headline: "Community workshop recap.",
    subhead: "Authentic sample with a false-positive scan.",
    videoTitle: "Community workshop",
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    accent: "blue",
    groundTruth: "authentic",
    features: {
      textureInstability: 0.35,
      objectBoundaryDrift: 0.18,
      interactionMismatch: 0.2,
      motionIrregularity: 0.72,
      compressionNoise: 0.86,
      naturalContinuity: 0.48
    },
    inferenceTimeMs: 826,
    anomalyCategory: "movement_anomaly",
    bullets: ["Compression confused the scanner", "Motion blur raised the score", "Review recommended before sharing"],
    details: {
      summary: "The simulated scan raised a false-positive warning because compression and motion blur looked suspicious.",
      frameConsistency: "Borderline",
      facialTexture: "Soft",
      lightingShadowCoherence: "Mostly stable",
      temporalArtifactSignal: "Moderate",
      decision: "Likely AI-Generated"
    }
  },
  {
    id: "avatar-gesture",
    author: "Synthetic Watch Desk",
    meta: "Suggested reel",
    body: "A generated avatar gesture clip with interaction timing that does not quite match the scene.",
    domain: "syntheticwatch.example",
    headline: "Avatar explains a viral claim.",
    subhead: "Generated interaction sample.",
    videoTitle: "Generated avatar gesture",
    videoSrc: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    accent: "red",
    groundTruth: "ai-generated",
    features: {
      textureInstability: 0.62,
      objectBoundaryDrift: 0.45,
      interactionMismatch: 0.95,
      motionIrregularity: 0.88,
      compressionNoise: 0.3,
      naturalContinuity: 0.14
    },
    inferenceTimeMs: 851,
    anomalyCategory: "interaction_anomaly",
    bullets: ["Gesture timing mismatch", "Unnatural subject-object interaction", "High AI-likelihood score"],
    details: {
      summary: "The simulated scan focused on interaction timing that appeared inconsistent with natural motion.",
      frameConsistency: "Irregular",
      facialTexture: "Suspicious",
      lightingShadowCoherence: "Inconsistent",
      temporalArtifactSignal: "High",
      decision: "Likely AI-Generated"
    }
  }
];

function modeToClassification(mode: ResultMode): DetectorResult["classification"] {
  return mode === "authentic" ? "Likely Authentic" : "Likely AI-Generated";
}

export function getSimulatedVideoPost(videoId: string | null | undefined): SimulatedVideoPost {
  return simulatedVideoPosts.find((video) => video.id === videoId) ?? simulatedVideoPosts[0];
}

export function getPredictedModeForVideo(videoId: string | null | undefined): ResultMode {
  return runSimulatedVideoModel(videoId).mode;
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
      const prediction = runMlpInference(video.features);

      if (video.groundTruth === "ai-generated" && prediction.mode === "ai-generated") {
        accumulator.truePositive += 1;
      } else if (video.groundTruth === "authentic" && prediction.mode === "authentic") {
        accumulator.trueNegative += 1;
      } else if (video.groundTruth === "authentic" && prediction.mode === "ai-generated") {
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

export function formatMetricPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}
