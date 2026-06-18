import type { ResultMode } from "./types";

export type FeatureName =
  | "lumaMean"
  | "lumaStd"
  | "redGreenDelta"
  | "blueGreenDelta"
  | "temporalLumaDelta"
  | "temporalColorDelta"
  | "edgeEnergy";

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

const FEATURE_ORDER: FeatureName[] = [
  "lumaMean",
  "lumaStd",
  "redGreenDelta",
  "blueGreenDelta",
  "temporalLumaDelta",
  "temporalColorDelta",
  "edgeEnergy"
];

const MODEL_VERSION = "AgileEye-Pilot-MLP-v2";
const AI_THRESHOLD = 0.45;

const scalerMeans = [
  0.27275454802403665,
  0.265998311957129,
  0.04740012941560553,
  0.045155972126573844,
  0.0040617564084307195,
  0.004209043949212339,
  0.018297302917916043
];

const scalerStds = [
  0.11961093653659792,
  0.08061739131412156,
  0.049023911420323946,
  0.04483677284002819,
  0.007730256190255553,
  0.00891244069983464,
  0.011064784745044751
];

const hiddenWeights = [
  [-2.3824307170050356, -0.09088047174521749, 0.41234753450809647, 2.1888907120784076, -0.18449670605289575, -1.663697036916993, -0.7218776510707492],
  [0.9317933490991767, -0.5528342223859989, 1.8481847827634525, -0.45626918823128587, -1.168110087181842, -0.07016225892799106, -1.1950392819757263],
  [0.2780825635293921, 0.06782568623961352, -0.8049251484908738, 2.686964044401025, -1.5480943208433022, 1.314563002465305, 1.6992597333380008],
  [3.7266454180603037, -2.6601259341905865, 0.9526983105221384, 0.5665347410606142, 0.5154819352980604, -0.24384679028518136, 1.4404729333244723],
  [0.027240389793405432, 0.05434653391873822, 0.005998803024181912, -0.0002054643210376114, -0.04939260064818944, -0.04317785101568273, 0.0117356730066786],
  [-0.45511231322118734, -0.3165968427796737, 0.12817650283208598, 0.3607781535021663, 0.45600687872627343, 0.49353270293965074, -0.08109340520766975]
];

const hiddenBias = [
  -1.9218744488940784,
  0.390243270147045,
  -1.6024224251374395,
  0.15285806437798335,
  -0.0684204303748261,
  -0.26165555337197616
];

const outputWeights = [
  -3.587341230151232,
  2.332508150243307,
  3.899563372970434,
  -4.162770077115434,
  -0.0063115225100821,
  -0.8494302714562344
];

const outputBias = 0.6577076277396285;

function normalizeFeature(value: number, index: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return (value - scalerMeans[index]) / scalerStds[index];
}

function relu(value: number): number {
  return Math.max(0, value);
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-Math.max(-60, Math.min(60, value))));
}

function dot(values: number[], weights: number[]): number {
  return values.reduce((sum, value, index) => sum + value * weights[index], 0);
}

export function vectorizeFeatures(features: FeatureVector): number[] {
  return FEATURE_ORDER.map((featureName, index) => normalizeFeature(features[featureName], index));
}

export function getStrongestAnomalyFeature(features: FeatureVector): FeatureName {
  return FEATURE_ORDER.reduce((strongest, featureName) =>
    features[featureName] > features[strongest] ? featureName : strongest
  );
}

export function runMlpInference(features: FeatureVector): MlpPrediction {
  const input = vectorizeFeatures(features);
  const hiddenActivations = hiddenWeights.map((weights, index) => relu(dot(input, weights) + hiddenBias[index]));
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
