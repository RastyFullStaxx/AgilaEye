"""Command-line inference entrypoint for the AgileEye detector sidecar."""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path
from typing import Any

from .catalog import ANOMALY_BY_FEATURE, EMBEDDED_FEATURES
from .mlp import FeatureVector, run_mlp_inference
from .pilot_mlp import load_model, predict_probability
from .video_features import extract_video_features

NON_FORENSIC_NOTICE = "This is a first-level screening result, not a final authenticity decision."


def _load_features(features_json: str | None, video_id: str | None) -> tuple[str, FeatureVector]:
    if features_json:
        path = Path(features_json)
        payload = json.loads(path.read_text(encoding="utf-8"))
        resolved_id = str(payload.get("video_id") or path.stem)
        features = payload.get("features", payload)
        return resolved_id, features

    resolved_id = video_id or "main-video"
    if resolved_id not in EMBEDDED_FEATURES:
        raise SystemExit(f"Unknown video id '{resolved_id}'. Use --features-json for custom features.")

    return resolved_id, EMBEDDED_FEATURES[resolved_id]


def _build_result(video_id: str, features: FeatureVector, inference_time_ms: float) -> dict[str, Any]:
    prediction = run_mlp_inference(features)
    anomaly_category = "none" if prediction.mode == "authentic" else ANOMALY_BY_FEATURE[prediction.strongest_feature]

    return {
        "video_id": video_id,
        "prediction_label": "Likely AI-Generated" if prediction.mode == "ai-generated" else "Likely Authentic",
        "result_mode": prediction.mode,
        "ai_likelihood": prediction.probability,
        "score": prediction.score,
        "threshold": prediction.threshold,
        "explanation_summary": (
            "The MLP score is driven by stable continuity cues."
            if prediction.mode == "authentic"
            else f"The MLP score is driven most by {prediction.strongest_feature}."
        ),
        "anomaly_category": anomaly_category,
        "representative_frames": [],
        "heatmap_paths": [],
        "inference_time_ms": inference_time_ms,
        "model_version": prediction.model_version,
        "non_forensic_notice": NON_FORENSIC_NOTICE,
    }


def _build_artifact_result(video_path: str, model_path: str, inference_time_ms: float) -> dict[str, Any]:
    model = load_model(model_path)
    features = extract_video_features(video_path)
    probability = predict_probability(model, features.values)
    mode = "ai-generated" if probability >= model.threshold else "authentic"
    strongest_index = max(range(len(features.values)), key=lambda index: abs(features.values[index]))
    strongest_feature = features.names[strongest_index]

    return {
        "video_id": Path(video_path).stem,
        "prediction_label": "Likely AI-Generated" if mode == "ai-generated" else "Likely Authentic",
        "result_mode": mode,
        "ai_likelihood": probability,
        "score": round(probability * 100),
        "threshold": model.threshold,
        "explanation_summary": (
            "The pilot MLP score stayed below the AI-generated threshold."
            if mode == "authentic"
            else f"The pilot MLP score was most associated with {strongest_feature}."
        ),
        "anomaly_category": "none" if mode == "authentic" else "texture_jitter",
        "representative_frames": [],
        "heatmap_paths": [],
        "inference_time_ms": inference_time_ms,
        "model_version": model.model_version,
        "non_forensic_notice": NON_FORENSIC_NOTICE,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Run AgileEye sidecar MLP inference.")
    parser.add_argument("--video", help="Video path for pilot model inference.")
    parser.add_argument("--video-id", help="Embedded sample id to evaluate.")
    parser.add_argument("--features-json", help="Path to a JSON feature vector or object with {video_id, features}.")
    parser.add_argument("--model", help="Optional trained pilot MLP JSON artifact.")
    parser.add_argument("--out", help="Optional path to write result JSON.")
    args = parser.parse_args()

    start = time.perf_counter()
    if args.model and args.video:
        result = _build_artifact_result(args.video, args.model, 0.0)
        result["inference_time_ms"] = (time.perf_counter() - start) * 1000.0
    else:
        video_id, features = _load_features(args.features_json, args.video_id or (Path(args.video).stem if args.video else None))
        inference_time_ms = (time.perf_counter() - start) * 1000.0
        result = _build_result(video_id, features, inference_time_ms)
    serialized = json.dumps(result, indent=2)

    if args.out:
        Path(args.out).write_text(serialized + "\n", encoding="utf-8")
    else:
        print(serialized)


if __name__ == "__main__":
    main()
