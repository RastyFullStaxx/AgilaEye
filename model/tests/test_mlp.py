import unittest

from agileeye_detector.mlp import run_mlp_inference
from agileeye_detector.knn import KnnModel, load_knn_model, predict_knn_probability, save_knn_model
from agileeye_detector.pilot_mlp import predict_probability, train_mlp, with_threshold


class MlpModelTest(unittest.TestCase):
    def test_mlp_predicts_authentic_for_stable_features(self):
        prediction = run_mlp_inference(
            {
                "textureInstability": 0.12,
                "objectBoundaryDrift": 0.08,
                "interactionMismatch": 0.05,
                "motionIrregularity": 0.1,
                "compressionNoise": 0.16,
                "naturalContinuity": 0.9,
            }
        )

        self.assertEqual(prediction.mode, "authentic")
        self.assertLess(prediction.score, 50)

    def test_mlp_predicts_ai_generated_for_artifact_features(self):
        prediction = run_mlp_inference(
            {
                "textureInstability": 0.88,
                "objectBoundaryDrift": 0.46,
                "interactionMismatch": 0.25,
                "motionIrregularity": 0.74,
                "compressionNoise": 0.34,
                "naturalContinuity": 0.18,
            }
        )

        self.assertEqual(prediction.mode, "ai-generated")
        self.assertGreaterEqual(prediction.score, 50)

    def test_pilot_mlp_learns_tiny_separable_dataset(self):
        model = train_mlp(
            features=[
                [0.1, 0.1, 0.0],
                [0.2, 0.1, 0.0],
                [0.8, 0.9, 0.4],
                [0.9, 0.8, 0.5],
            ],
            labels=[0, 0, 1, 1],
            feature_names=["a", "b", "c"],
            seed=42,
            hidden_units=4,
            epochs=300,
            learning_rate=0.04,
        )

        self.assertLess(predict_probability(model, [0.1, 0.1, 0.0]), 0.5)
        self.assertGreaterEqual(predict_probability(model, [0.9, 0.8, 0.5]), 0.5)

    def test_pilot_mlp_can_record_validation_selected_threshold(self):
        model = train_mlp(
            features=[
                [0.1, 0.1, 0.0],
                [0.9, 0.8, 0.5],
            ],
            labels=[0, 1],
            feature_names=["a", "b", "c"],
            seed=7,
            hidden_units=2,
            epochs=20,
            learning_rate=0.02,
            model_version="pilot-test",
        )
        tuned = with_threshold(model, 0.42, model_version="pilot-test-tuned")

        self.assertEqual(tuned.threshold, 0.42)
        self.assertEqual(tuned.model_version, "pilot-test-tuned")
        self.assertEqual(tuned.hidden_weights, model.hidden_weights)

    def test_knn_probability_follows_nearest_labeled_neighbors(self):
        model = KnnModel(
            feature_names=["a", "b"],
            references=[
                ([0.0, 0.0], 0),
                ([0.1, 0.0], 0),
                ([1.0, 1.0], 1),
                ([0.9, 1.0], 1),
            ],
            means=[0.5, 0.5],
            stds=[0.5, 0.5],
            k=3,
            distance_power=2.0,
            feature_weights=[1.0, 1.0],
            threshold=0.5,
            model_version="knn-test",
        )

        self.assertLess(predict_knn_probability(model, [0.05, 0.0]), 0.5)
        self.assertGreaterEqual(predict_knn_probability(model, [0.95, 1.0]), 0.5)

    def test_knn_model_round_trips_to_json(self):
        model = KnnModel(
            feature_names=["a"],
            references=[([0.0], 0), ([1.0], 1)],
            means=[0.5],
            stds=[0.5],
            k=1,
            distance_power=1.0,
            feature_weights=[1.0],
            threshold=0.4,
            model_version="knn-roundtrip",
        )
        path = "/tmp/agileeye-knn-roundtrip.json"

        save_knn_model(model, path, {"test": True})
        loaded = load_knn_model(path)

        self.assertEqual(loaded.model_version, "knn-roundtrip")
        self.assertEqual(loaded.threshold, 0.4)
        self.assertGreaterEqual(predict_knn_probability(loaded, [1.0]), 0.4)


if __name__ == "__main__":
    unittest.main()
