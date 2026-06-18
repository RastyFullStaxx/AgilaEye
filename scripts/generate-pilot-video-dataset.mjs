import { performance } from "node:perf_hooks";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = `${repoRoot}/data/processed/manifests/pilot-100.csv`;
const featuresPath = `${repoRoot}/data/processed/manifests/pilot-100.features.csv`;
const modelPath = `${repoRoot}/artifacts/models/agileeye-pilot-mlp-v2.json`;
const allPredictionsPath = `${repoRoot}/reports/evaluation/pilot-mlp-v2-all/predictions.csv`;
const outputPath = `${repoRoot}/src/lib/engine/pilotVideoDataset.ts`;

const featureMap = {
  luma_mean: "lumaMean",
  luma_std: "lumaStd",
  red_green_delta: "redGreenDelta",
  blue_green_delta: "blueGreenDelta",
  temporal_luma_delta: "temporalLumaDelta",
  temporal_color_delta: "temporalColorDelta",
  edge_energy: "edgeEnergy"
};

const featureNames = Object.keys(featureMap);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""]))
  );
}

function dot(values, weights) {
  return values.reduce((sum, value, index) => sum + value * weights[index], 0);
}

function relu(value) {
  return Math.max(0, value);
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-Math.max(-60, Math.min(60, value))));
}

function predict(model, values) {
  const scaled = values.map((value, index) => (value - model.scaler.means[index]) / model.scaler.stds[index]);
  const hidden = model.hidden_weights.map((weights, index) => relu(dot(scaled, weights) + model.hidden_bias[index]));
  return sigmoid(dot(hidden, model.output_weights) + model.output_bias);
}

function toResultMode(label) {
  return label === "ai_generated" ? "ai-generated" : "authentic";
}

function publicVideoSrc(sourcePath) {
  return `/${sourcePath.replace(/^data\/raw\//, "videos/")}`;
}

function titleFromId(videoId) {
  const number = videoId.replace("agileeye_", "");
  return `AgileEye ${number}`;
}

function bodyFor(row) {
  const split = row.split === "test" ? "testing" : row.split === "validation" ? "validation" : "training";
  const label = row.binary_label === "ai_generated" ? "AI-generated" : "authentic";
  return `${label} ${split} sample from the 100-video AgileEye pilot dataset.`;
}

function accentFor(row) {
  if (row.binary_label === "authentic") {
    return row.split === "test" ? "green" : "blue";
  }

  return row.split === "test" ? "red" : "amber";
}

const manifestRows = parseCsv(readFileSync(manifestPath, "utf-8"));
const featureRows = parseCsv(readFileSync(featuresPath, "utf-8"));
const model = JSON.parse(readFileSync(modelPath, "utf-8"));
const featureById = new Map(featureRows.map((row) => [row.video_id, row]));
let reportPredictionById = new Map();

try {
  const reportRows = parseCsv(readFileSync(allPredictionsPath, "utf-8"));
  reportPredictionById = new Map(reportRows.map((row) => [row.video_id, row]));
} catch {
  reportPredictionById = new Map();
}

const generatedRows = manifestRows.map((row) => {
  const featureRow = featureById.get(row.video_id);
  if (!featureRow) {
    throw new Error(`Missing feature row for ${row.video_id}`);
  }

  const featureValues = featureNames.map((name) => Number(featureRow[name]));
  const start = performance.now();
  const probability = predict(model, featureValues);
  const inferenceTimeMs = performance.now() - start;
  const reportPrediction = reportPredictionById.get(row.video_id);
  const predictedLabel = probability >= model.threshold ? "ai-generated" : "authentic";
  const features = Object.fromEntries(
    featureNames.map((name) => [featureMap[name], Number(featureRow[name])])
  );

  return {
    id: row.video_id,
    sourcePath: row.source_path,
    videoSrc: publicVideoSrc(row.source_path),
    author: row.binary_label === "ai_generated" ? "Synthetic Watch Desk" : "AgileEye Field Sample",
    meta: row.split === "test" ? "Model testing" : "Model development",
    body: bodyFor(row),
    domain: row.source_dataset,
    headline: row.source_category,
    subhead: `${row.split} split - ${row.duration_seconds}s - ${row.resolution_width}x${row.resolution_height}`,
    videoTitle: titleFromId(row.video_id),
    accent: accentFor(row),
    groundTruth: toResultMode(row.binary_label),
    predictedMode: predictedLabel,
    aiLikelihood: probability,
    score: Math.round(probability * 100),
    split: row.split,
    features,
    inferenceTimeMs: reportPrediction ? Number(reportPrediction.inference_time_ms) : inferenceTimeMs,
    anomalyCategory: row.anomaly_category,
    durationSeconds: Number(row.duration_seconds),
    resolution: `${row.resolution_width}x${row.resolution_height}`,
    fps: Number(row.fps),
    checksumSha256: row.checksum_sha256,
    sourceCategory: row.source_category
  };
});

const header = [
  "import type { AnomalyCategory, ResultMode } from \"./types\";",
  "import type { FeatureVector } from \"./mlpModel\";",
  "",
  "export type PilotSplit = \"train\" | \"validation\" | \"test\";",
  "",
  "export interface PilotVideoDatasetRow {",
  "  id: string;",
  "  sourcePath: string;",
  "  videoSrc: string;",
  "  author: string;",
  "  meta: string;",
  "  body: string;",
  "  domain: string;",
  "  headline: string;",
  "  subhead: string;",
  "  videoTitle: string;",
  "  accent: \"blue\" | \"amber\" | \"red\" | \"green\";",
  "  groundTruth: ResultMode;",
  "  predictedMode: ResultMode;",
  "  aiLikelihood: number;",
  "  score: number;",
  "  split: PilotSplit;",
  "  features: FeatureVector;",
  "  inferenceTimeMs: number;",
  "  anomalyCategory: AnomalyCategory;",
  "  durationSeconds: number;",
  "  resolution: string;",
  "  fps: number;",
  "  checksumSha256: string;",
  "  sourceCategory: string;",
  "}",
  "",
  "// Generated by scripts/generate-pilot-video-dataset.mjs from the local 100-video pilot manifest.",
  "export const pilotVideoDataset = "
].join("\n");

writeFileSync(outputPath, `${header}${JSON.stringify(generatedRows, null, 2)} satisfies PilotVideoDatasetRow[];\n`, "utf-8");

console.log(`Wrote ${relative(repoRoot, outputPath)} with ${generatedRows.length} pilot videos.`);
