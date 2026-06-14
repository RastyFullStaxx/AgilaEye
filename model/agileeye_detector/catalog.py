"""Embedded AgileEye evaluation samples for the sidecar prototype."""

from __future__ import annotations

from .mlp import FeatureVector

EMBEDDED_FEATURES: dict[str, FeatureVector] = {
    "main-video": {
        "textureInstability": 0.12,
        "objectBoundaryDrift": 0.08,
        "interactionMismatch": 0.05,
        "motionIrregularity": 0.1,
        "compressionNoise": 0.16,
        "naturalContinuity": 0.9,
    },
    "synthetic-city-walk": {
        "textureInstability": 0.88,
        "objectBoundaryDrift": 0.46,
        "interactionMismatch": 0.25,
        "motionIrregularity": 0.74,
        "compressionNoise": 0.34,
        "naturalContinuity": 0.18,
    },
    "campus-interview": {
        "textureInstability": 0.18,
        "objectBoundaryDrift": 0.12,
        "interactionMismatch": 0.08,
        "motionIrregularity": 0.2,
        "compressionNoise": 0.4,
        "naturalContinuity": 0.82,
    },
    "product-orbit": {
        "textureInstability": 0.42,
        "objectBoundaryDrift": 0.9,
        "interactionMismatch": 0.25,
        "motionIrregularity": 0.55,
        "compressionNoise": 0.22,
        "naturalContinuity": 0.25,
    },
    "community-event": {
        "textureInstability": 0.35,
        "objectBoundaryDrift": 0.18,
        "interactionMismatch": 0.2,
        "motionIrregularity": 0.72,
        "compressionNoise": 0.86,
        "naturalContinuity": 0.48,
    },
    "avatar-gesture": {
        "textureInstability": 0.62,
        "objectBoundaryDrift": 0.45,
        "interactionMismatch": 0.95,
        "motionIrregularity": 0.88,
        "compressionNoise": 0.3,
        "naturalContinuity": 0.14,
    },
}

ANOMALY_BY_FEATURE = {
    "textureInstability": "texture_jitter",
    "objectBoundaryDrift": "object_inconsistency",
    "interactionMismatch": "interaction_anomaly",
    "motionIrregularity": "movement_anomaly",
    "compressionNoise": "movement_anomaly",
    "naturalContinuity": "none",
}
