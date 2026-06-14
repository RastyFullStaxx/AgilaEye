# ADR-0003: PyTorch MobileNetV3 Baseline

## Status

Accepted

## Context

The source plan allows TensorFlow, Keras, or PyTorch and proposes lightweight
feature extraction. Choosing a first stack prevents duplicated scaffolds and
unclear model artifacts.

## Decision

Use Python + PyTorch + torchvision for the first real detector scaffold. The v1
baseline is pretrained MobileNetV3-Small as a frozen feature extractor, temporal
average pooling, and a shallow MLP binary classifier.

## Consequences

- Python docs and future scripts should assume PyTorch unless this ADR is
  replaced.
- The first model is simple enough for limited-resource development.
- Alternative baselines can be added later behind the same sidecar result
  contract.

