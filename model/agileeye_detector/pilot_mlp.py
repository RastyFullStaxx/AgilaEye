"""Trainable shallow MLP for the AgileEye 100-video pilot."""

from __future__ import annotations

import json
import math
import random
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Scaler:
    means: list[float]
    stds: list[float]


@dataclass(frozen=True)
class PilotModel:
    feature_names: list[str]
    scaler: Scaler
    hidden_weights: list[list[float]]
    hidden_bias: list[float]
    output_weights: list[float]
    output_bias: float
    threshold: float
    model_version: str


def sigmoid(value: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-60.0, min(60.0, value))))


def relu(value: float) -> float:
    return max(0.0, value)


def dot(values: list[float], weights: list[float]) -> float:
    return sum(value * weights[index] for index, value in enumerate(values))


def fit_scaler(rows: list[list[float]]) -> Scaler:
    feature_count = len(rows[0])
    means = [sum(row[index] for row in rows) / len(rows) for index in range(feature_count)]
    stds = []
    for index, mean in enumerate(means):
        variance = sum((row[index] - mean) ** 2 for row in rows) / len(rows)
        stds.append(max(variance**0.5, 1e-6))
    return Scaler(means=means, stds=stds)


def transform(values: list[float], scaler: Scaler) -> list[float]:
    return [(value - scaler.means[index]) / scaler.stds[index] for index, value in enumerate(values)]


def predict_probability(model: PilotModel, values: list[float]) -> float:
    scaled = transform(values, model.scaler)
    hidden = [
        relu(dot(scaled, weights) + model.hidden_bias[index])
        for index, weights in enumerate(model.hidden_weights)
    ]
    return sigmoid(dot(hidden, model.output_weights) + model.output_bias)


def train_mlp(
    features: list[list[float]],
    labels: list[int],
    feature_names: list[str],
    seed: int = 42,
    hidden_units: int = 8,
    epochs: int = 450,
    learning_rate: float = 0.035,
    threshold: float = 0.5,
    model_version: str = "AgileEye-Pilot-MLP-v1",
) -> PilotModel:
    randomizer = random.Random(seed)
    scaler = fit_scaler(features)
    scaled_features = [transform(row, scaler) for row in features]
    feature_count = len(feature_names)
    hidden_weights = [
        [randomizer.uniform(-0.25, 0.25) for _ in range(feature_count)]
        for _ in range(hidden_units)
    ]
    hidden_bias = [0.0 for _ in range(hidden_units)]
    output_weights = [randomizer.uniform(-0.25, 0.25) for _ in range(hidden_units)]
    output_bias = 0.0

    for _epoch in range(epochs):
        order = list(range(len(scaled_features)))
        randomizer.shuffle(order)
        for row_index in order:
            values = scaled_features[row_index]
            label = labels[row_index]
            hidden_raw = [dot(values, weights) + hidden_bias[index] for index, weights in enumerate(hidden_weights)]
            hidden = [relu(value) for value in hidden_raw]
            probability = sigmoid(dot(hidden, output_weights) + output_bias)
            error = probability - label

            previous_output_weights = output_weights[:]
            for hidden_index in range(hidden_units):
                output_weights[hidden_index] -= learning_rate * error * hidden[hidden_index]
            output_bias -= learning_rate * error

            for hidden_index in range(hidden_units):
                if hidden_raw[hidden_index] <= 0:
                    continue
                hidden_error = error * previous_output_weights[hidden_index]
                for feature_index in range(feature_count):
                    hidden_weights[hidden_index][feature_index] -= learning_rate * hidden_error * values[feature_index]
                hidden_bias[hidden_index] -= learning_rate * hidden_error

    return PilotModel(
        feature_names=feature_names,
        scaler=scaler,
        hidden_weights=hidden_weights,
        hidden_bias=hidden_bias,
        output_weights=output_weights,
        output_bias=output_bias,
        threshold=threshold,
        model_version=model_version,
    )


def with_threshold(model: PilotModel, threshold: float, model_version: str | None = None) -> PilotModel:
    return PilotModel(
        feature_names=model.feature_names,
        scaler=model.scaler,
        hidden_weights=model.hidden_weights,
        hidden_bias=model.hidden_bias,
        output_weights=model.output_weights,
        output_bias=model.output_bias,
        threshold=threshold,
        model_version=model_version or model.model_version,
    )


def save_model(model: PilotModel, path: str | Path, metadata: dict[str, object]) -> None:
    payload = {
        "model_version": model.model_version,
        "threshold": model.threshold,
        "feature_names": model.feature_names,
        "scaler": {"means": model.scaler.means, "stds": model.scaler.stds},
        "hidden_weights": model.hidden_weights,
        "hidden_bias": model.hidden_bias,
        "output_weights": model.output_weights,
        "output_bias": model.output_bias,
        "metadata": metadata,
    }
    model_path = Path(path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    model_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def load_model(path: str | Path) -> PilotModel:
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    scaler = Scaler(means=payload["scaler"]["means"], stds=payload["scaler"]["stds"])
    return PilotModel(
        feature_names=payload["feature_names"],
        scaler=scaler,
        hidden_weights=payload["hidden_weights"],
        hidden_bias=payload["hidden_bias"],
        output_weights=payload["output_weights"],
        output_bias=payload["output_bias"],
        threshold=payload["threshold"],
        model_version=payload["model_version"],
    )
