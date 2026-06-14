import type { ResultMode } from "./types";

export type FeatureName =
  | "textureInstability"
  | "objectBoundaryDrift"
  | "interactionMismatch"
  | "motionIrregularity"
  | "compressionNoise"
  | "naturalContinuity";

export type FeatureVector = Record<FeatureName, number>;

export interface MlpPrediction {
  mode: ResultMode;
  score: number;
  probability: number;
  threshold: number;
  hiddenActivations: number[];
  strongestFeature: FeatureName;
  modelVersion: string;
}

interface DenseLayer {
  weights: number[][];
  bias: number[];
}

const FEATURE_ORDER: FeatureName[] = [
  "textureInstability",
  "objectBoundaryDrift",
  "interactionMismatch",
  "motionIrregularity",
  "compressionNoise",
  "naturalContinuity"
];

const MODEL_VERSION = "AgileEye-MLP-Sim-v1";
const AI_THRESHOLD = 0.5;

const hiddenLayer: DenseLayer = {
  weights: [
    [1.2, 0.1, 0.1, 0.35, 0.4, -0.65],
    [0.2, 1.35, 0.1, 0.5, 0.15, -0.55],
    [0.15, 0.25, 1.45, 0.85, 0.1, -0.45],
    [0.15, 0.1, 0.15, 0.85, 0.65, -0.3],
    [-0.45, -0.3, -0.25, -0.3, 0.05, 0.9]
  ],
  bias: [-0.24, -0.18, -0.18, -0.14, 0]
};

const outputWeights = [0.7, 0.65, 0.75, 0.58, -0.78];
const outputBias = -0.9;

function clampFeature(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function relu(value: number): number {
  return Math.max(0, value);
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function dot(values: number[], weights: number[]): number {
  return values.reduce((sum, value, index) => sum + value * weights[index], 0);
}

export function vectorizeFeatures(features: FeatureVector): number[] {
  return FEATURE_ORDER.map((featureName) => clampFeature(features[featureName]));
}

export function getStrongestAnomalyFeature(features: FeatureVector): FeatureName {
  const anomalyFeatures = FEATURE_ORDER.filter((featureName) => featureName !== "naturalContinuity");

  return anomalyFeatures.reduce((strongest, featureName) =>
    features[featureName] > features[strongest] ? featureName : strongest
  );
}

export function runMlpInference(features: FeatureVector): MlpPrediction {
  const input = vectorizeFeatures(features);
  const hiddenActivations = hiddenLayer.weights.map((weights, index) => relu(dot(input, weights) + hiddenLayer.bias[index]));
  const logit = dot(hiddenActivations, outputWeights) + outputBias;
  const probability = sigmoid(logit);
  const score = Math.round(probability * 100);

  return {
    mode: probability >= AI_THRESHOLD ? "ai-generated" : "authentic",
    score,
    probability,
    threshold: AI_THRESHOLD,
    hiddenActivations,
    strongestFeature: getStrongestAnomalyFeature(features),
    modelVersion: MODEL_VERSION
  };
}

export const featureOrder = FEATURE_ORDER;
