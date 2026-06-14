"""Small AgileEye MLP used by the local sidecar prototype."""

from __future__ import annotations

from dataclasses import dataclass
from math import exp, isnan
from typing import Literal, TypedDict

ResultMode = Literal["authentic", "ai-generated"]
FeatureName = Literal[
    "textureInstability",
    "objectBoundaryDrift",
    "interactionMismatch",
    "motionIrregularity",
    "compressionNoise",
    "naturalContinuity",
]


class FeatureVector(TypedDict):
    textureInstability: float
    objectBoundaryDrift: float
    interactionMismatch: float
    motionIrregularity: float
    compressionNoise: float
    naturalContinuity: float


@dataclass(frozen=True)
class MlpPrediction:
    mode: ResultMode
    score: int
    probability: float
    threshold: float
    hidden_activations: list[float]
    strongest_feature: FeatureName
    model_version: str


FEATURE_ORDER: list[FeatureName] = [
    "textureInstability",
    "objectBoundaryDrift",
    "interactionMismatch",
    "motionIrregularity",
    "compressionNoise",
    "naturalContinuity",
]

MODEL_VERSION = "AgileEye-MLP-Sidecar-v1"
AI_THRESHOLD = 0.5

HIDDEN_WEIGHTS = [
    [1.2, 0.1, 0.1, 0.35, 0.4, -0.65],
    [0.2, 1.35, 0.1, 0.5, 0.15, -0.55],
    [0.15, 0.25, 1.45, 0.85, 0.1, -0.45],
    [0.15, 0.1, 0.15, 0.85, 0.65, -0.3],
    [-0.45, -0.3, -0.25, -0.3, 0.05, 0.9],
]
HIDDEN_BIAS = [-0.24, -0.18, -0.18, -0.14, 0.0]
OUTPUT_WEIGHTS = [0.7, 0.65, 0.75, 0.58, -0.78]
OUTPUT_BIAS = -0.9


def _clamp_feature(value: float) -> float:
    if isnan(value):
        return 0.0

    return min(1.0, max(0.0, value))


def _relu(value: float) -> float:
    return max(0.0, value)


def _sigmoid(value: float) -> float:
    return 1.0 / (1.0 + exp(-value))


def _dot(values: list[float], weights: list[float]) -> float:
    return sum(value * weights[index] for index, value in enumerate(values))


def vectorize_features(features: FeatureVector) -> list[float]:
    return [_clamp_feature(float(features[feature_name])) for feature_name in FEATURE_ORDER]


def strongest_anomaly_feature(features: FeatureVector) -> FeatureName:
    anomaly_features = [feature_name for feature_name in FEATURE_ORDER if feature_name != "naturalContinuity"]
    return max(anomaly_features, key=lambda feature_name: float(features[feature_name]))


def run_mlp_inference(features: FeatureVector) -> MlpPrediction:
    inputs = vectorize_features(features)
    hidden_activations = [
        _relu(_dot(inputs, weights) + HIDDEN_BIAS[index])
        for index, weights in enumerate(HIDDEN_WEIGHTS)
    ]
    logit = _dot(hidden_activations, OUTPUT_WEIGHTS) + OUTPUT_BIAS
    probability = _sigmoid(logit)

    return MlpPrediction(
        mode="ai-generated" if probability >= AI_THRESHOLD else "authentic",
        score=round(probability * 100),
        probability=probability,
        threshold=AI_THRESHOLD,
        hidden_activations=hidden_activations,
        strongest_feature=strongest_anomaly_feature(features),
        model_version=MODEL_VERSION,
    )
