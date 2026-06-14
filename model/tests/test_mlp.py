import unittest

from agileeye_detector.mlp import run_mlp_inference
from agileeye_detector.pilot_mlp import predict_probability, train_mlp


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


if __name__ == "__main__":
    unittest.main()
