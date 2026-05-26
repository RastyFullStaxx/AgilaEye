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

export interface DetectorResult {
  mode: ResultMode;
  score: number;
  likelihoodLabel: "AI-likelihood";
  classification: "Likely Authentic" | "Likely AI-Generated";
  bullets: string[];
  details: {
    summary: string;
    frameConsistency: string;
    facialTexture: string;
    lightingShadowCoherence: string;
    temporalArtifactSignal: string;
    decision: string;
  };
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
