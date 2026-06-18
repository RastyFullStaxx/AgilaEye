"""Small weighted k-nearest-neighbor scorer for AgileEye pilot features."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class KnnModel:
    feature_names: list[str]
    references: list[tuple[list[float], int]]
    means: list[float]
    stds: list[float]
    k: int
    distance_power: float
    feature_weights: list[float]
    threshold: float
    model_version: str


def fit_scaler(rows: list[list[float]]) -> tuple[list[float], list[float]]:
    feature_count = len(rows[0])
    means = [sum(row[index] for row in rows) / len(rows) for index in range(feature_count)]
    stds = []
    for index, mean in enumerate(means):
        variance = sum((row[index] - mean) ** 2 for row in rows) / len(rows)
        stds.append(max(variance**0.5, 1e-9))
    return means, stds


def scale(values: list[float], means: list[float], stds: list[float]) -> list[float]:
    return [(value - means[index]) / stds[index] for index, value in enumerate(values)]


def weighted_distance(left: list[float], right: list[float], feature_weights: list[float]) -> float:
    return sum(feature_weights[index] * (left[index] - right[index]) ** 2 for index in range(len(left))) ** 0.5


def predict_knn_probability(model: KnnModel, values: list[float]) -> float:
    scaled_values = scale(values, model.means, model.stds)
    neighbors = sorted(
        (
            weighted_distance(scale(reference, model.means, model.stds), scaled_values, model.feature_weights),
            label,
        )
        for reference, label in model.references
    )[: model.k]

    if model.distance_power == 0:
        return sum(label for _distance, label in neighbors) / len(neighbors)

    weighted_labels = []
    for distance, label in neighbors:
        weight = 1 / ((distance + 1e-9) ** model.distance_power)
        weighted_labels.append((weight, label))

    return sum(weight * label for weight, label in weighted_labels) / sum(weight for weight, _label in weighted_labels)


def save_knn_model(model: KnnModel, path: str | Path, metadata: dict[str, object]) -> None:
    payload = {
        "model_version": model.model_version,
        "threshold": model.threshold,
        "feature_names": model.feature_names,
        "references": model.references,
        "means": model.means,
        "stds": model.stds,
        "k": model.k,
        "distance_power": model.distance_power,
        "feature_weights": model.feature_weights,
        "metadata": metadata,
    }
    model_path = Path(path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    model_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def load_knn_model(path: str | Path) -> KnnModel:
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    return KnnModel(
        feature_names=payload["feature_names"],
        references=[(reference, label) for reference, label in payload["references"]],
        means=payload["means"],
        stds=payload["stds"],
        k=payload["k"],
        distance_power=payload["distance_power"],
        feature_weights=payload["feature_weights"],
        threshold=payload["threshold"],
        model_version=payload["model_version"],
    )
