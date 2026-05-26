import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { getMockResult } from "../../../engine/mockResults";
import type { DetectorSnapshot } from "../../../engine/types";
import DemoControls from "../DemoControls.svelte";
import DetailsModal from "../DetailsModal.svelte";
import IdleBadge from "../IdleBadge.svelte";
import ResultPanel from "../ResultPanel.svelte";
import ScanningPanel from "../ScanningPanel.svelte";

const baseSnapshot: DetectorSnapshot = {
  state: "RESULT_AUTHENTIC",
  progress: 100,
  resultMode: "authentic",
  result: getMockResult("authentic"),
  activeVideoId: "main-video",
  isActiveVideoVisible: true,
  lastEvent: "SCAN_COMPLETED",
  visibilityRatio: 0.8
};

describe("detector components", () => {
  it("renders the idle badge copy", () => {
    render(IdleBadge);

    expect(screen.getByText("AI Detector")).toBeInTheDocument();
    expect(screen.getByText("Active video detected")).toBeInTheDocument();
    expect(screen.getByText("Monitoring")).toBeInTheDocument();
  });

  it("renders the scanning panel copy and progress", () => {
    render(ScanningPanel, { progress: 42 });

    expect(screen.getByText("AI Detector")).toBeInTheDocument();
    expect(screen.getByText("Scanning video...")).toBeInTheDocument();
    expect(screen.getByText("Analyzing frames")).toBeInTheDocument();
  });

  it("renders the authentic result panel and fires result actions", async () => {
    const onViewDetails = vi.fn();
    const onRescan = vi.fn();

    render(ResultPanel, {
      result: getMockResult("authentic"),
      onViewDetails,
      onRescan
    });

    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("AI-likelihood")).toBeInTheDocument();
    expect(screen.getByText("Likely Authentic")).toBeInTheDocument();
    expect(screen.getByText("Consistent facial texture")).toBeInTheDocument();
    expect(screen.getByText("Stable lighting and shadows")).toBeInTheDocument();
    expect(screen.getByText("Natural eye and mouth details")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "View details" }));
    await fireEvent.click(screen.getByRole("button", { name: "Rescan" }));

    expect(onViewDetails).toHaveBeenCalledTimes(1);
    expect(onRescan).toHaveBeenCalledTimes(1);
  });

  it("renders authentic details modal rows", () => {
    render(DetailsModal, {
      result: getMockResult("authentic"),
      onClose: vi.fn()
    });

    expect(screen.getByText("The detector found stable visual consistency cues.")).toBeInTheDocument();
    expect(screen.getByText("Frame consistency")).toBeInTheDocument();
    expect(screen.getAllByText("Stable")).toHaveLength(2);
    expect(screen.getByText("Consistent")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Likely Authentic")).toBeInTheDocument();
  });

  it("renders AI-generated details modal rows", () => {
    render(DetailsModal, {
      result: getMockResult("ai-generated"),
      onClose: vi.fn()
    });

    expect(
      screen.getByText("The detector found multiple visual inconsistencies commonly associated with AI-generated videos.")
    ).toBeInTheDocument();
    expect(screen.getByText("Irregular")).toBeInTheDocument();
    expect(screen.getByText("Suspicious")).toBeInTheDocument();
    expect(screen.getByText("Inconsistent")).toBeInTheDocument();
    expect(screen.getByText("Elevated")).toBeInTheDocument();
    expect(screen.getByText("Likely AI-Generated")).toBeInTheDocument();
  });

  it("exposes demo controls for presentation backup", async () => {
    const onForceActive = vi.fn();
    const onInterrupt = vi.fn();
    const onResume = vi.fn();
    const onRestartScan = vi.fn();
    const onResultModeChange = vi.fn();

    render(DemoControls, {
      snapshot: baseSnapshot,
      onForceActive,
      onInterrupt,
      onResume,
      onRestartScan,
      onResultModeChange
    });

    await fireEvent.click(screen.getByRole("button", { name: "Demo Controls" }));
    await fireEvent.click(screen.getByRole("button", { name: "Force active" }));
    await fireEvent.click(screen.getByRole("button", { name: "Interrupt" }));
    await fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    await fireEvent.click(screen.getByRole("button", { name: "Restart scan" }));
    await fireEvent.click(screen.getByRole("button", { name: "AI-generated" }));

    expect(onForceActive).toHaveBeenCalledTimes(1);
    expect(onInterrupt).toHaveBeenCalledTimes(1);
    expect(onResume).toHaveBeenCalledTimes(1);
    expect(onRestartScan).toHaveBeenCalledTimes(1);
    expect(onResultModeChange).toHaveBeenCalledWith("ai-generated");
  });
});
