export type DetectorState =
  | "NO_ACTIVE_VIDEO"
  | "IDLE_DETECTED"
  | "SCANNING"
  | "RESULT_AUTHENTIC"
  | "RESULT_AI_GENERATED"
  | "INTERRUPTED";

export type DetectorEvent =
  | "APP_READY"
  | "VIDEO_ENTERED_VIEWPORT"
  | "VIDEO_BECAME_ACTIVE"
  | "VIDEO_LEFT_VIEWPORT"
  | "VIDEO_INTERRUPTED"
  | "ACTIVE_VIDEO_CHANGED"
  | "SCAN_STARTED"
  | "SCAN_PROGRESS"
  | "SCAN_COMPLETED"
  | "SCAN_CANCELLED"
  | "RESCAN_REQUESTED"
  | "RESET_OVERLAY";

export type ResultMode = "authentic" | "ai-generated";

export type AnomalyCategory =
  | "none"
  | "object_inconsistency"
  | "texture_jitter"
  | "interaction_anomaly"
  | "movement_anomaly";

export interface DetectorResult {
  mode: ResultMode;
  score: number;
  likelihoodLabel: "AI-likelihood";
  classification: "Likely Authentic" | "Likely AI-Generated";
  bullets: string[];
  videoId?: string;
  videoTitle?: string;
  groundTruth?: ResultMode;
  anomalyCategory?: AnomalyCategory;
  inferenceTimeMs?: number;
  frameSampleCount?: number;
  modelVersion?: string;
  nonForensicNotice?: string;
  details: {
    summary: string;
    frameConsistency: string;
    facialTexture: string;
    lightingShadowCoherence: string;
    temporalArtifactSignal: string;
    decision: string;
  };
}

export interface PerformanceMetrics {
  sampleSize: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  averageInferenceTimeMs: number;
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
}

export interface DetectorSnapshot {
  state: DetectorState;
  progress: number;
  resultMode: ResultMode;
  result: DetectorResult | null;
  activeVideoId: string | null;
  isActiveVideoVisible: boolean;
  lastEvent: DetectorEvent | null;
  visibilityRatio: number;
}

export interface DetectorEventPayload {
  videoId?: string;
  ratio?: number;
  progress?: number;
}

export type DetectorListener = (
  event: DetectorEvent,
  snapshot: DetectorSnapshot,
  payload?: DetectorEventPayload
) => void;
