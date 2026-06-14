import { get } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDetectorController } from "../detectorMachine";

function createController() {
  const controller = createDetectorController();
  return {
    controller,
    snapshot: () => get({ subscribe: controller.subscribe })
  };
}

describe("detectorMachine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("starts in NO_ACTIVE_VIDEO", () => {
    const { controller, snapshot } = createController();

    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");
    expect(snapshot().result).toBeNull();

    controller.destroy();
  });

  it("waits for the startup delay before activating a visible video", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);

    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");

    vi.advanceTimersByTime(699);
    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");

    vi.advanceTimersByTime(1);
    expect(snapshot().state).toBe("IDLE_DETECTED");
    expect(snapshot().activeVideoId).toBe("main-video");

    controller.destroy();
  });

  it("runs the default visible-video flow into an authentic result", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);

    vi.advanceTimersByTime(700);
    expect(snapshot().state).toBe("IDLE_DETECTED");

    vi.advanceTimersByTime(800);
    expect(snapshot().state).toBe("SCANNING");

    vi.advanceTimersByTime(3000);
    expect(snapshot().state).toBe("RESULT_AUTHENTIC");
    expect(snapshot().result).toMatchObject({
      score: 19,
      likelihoodLabel: "AI-likelihood",
      classification: "Likely Authentic"
    });

    controller.destroy();
  });

  it("cancels scanning on interruption and never shows a stale result", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);
    vi.advanceTimersByTime(1500);

    expect(snapshot().state).toBe("SCANNING");

    controller.updateVisibility("main-video", 0.2);
    expect(snapshot().state).toBe("INTERRUPTED");
    expect(snapshot().result).toBeNull();

    vi.advanceTimersByTime(5000);
    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");
    expect(snapshot().result).toBeNull();

    controller.destroy();
  });

  it("restarts the full flow when the video becomes visible again", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);
    vi.advanceTimersByTime(1500);
    controller.updateVisibility("main-video", 0.1);
    vi.advanceTimersByTime(220);

    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");

    controller.updateVisibility("main-video", 0.82);
    expect(snapshot().state).toBe("IDLE_DETECTED");

    vi.advanceTimersByTime(800);
    expect(snapshot().state).toBe("SCANNING");

    vi.advanceTimersByTime(3000);
    expect(snapshot().state).toBe("RESULT_AUTHENTIC");

    controller.destroy();
  });

  it("allows rescan only after a result while the video is active", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);

    controller.restartScan();
    expect(snapshot().state).toBe("NO_ACTIVE_VIDEO");

    vi.advanceTimersByTime(4500);
    expect(snapshot().state).toBe("RESULT_AUTHENTIC");

    controller.restartScan();
    expect(snapshot().state).toBe("SCANNING");
    expect(snapshot().result).toBeNull();

    controller.destroy();
  });

  it("uses the alternate AI-generated result mode", () => {
    const { controller, snapshot } = createController();

    controller.setResultMode("ai-generated");
    controller.dispatch("APP_READY");
    controller.updateVisibility("main-video", 0.8);
    vi.advanceTimersByTime(4500);

    expect(snapshot().state).toBe("RESULT_AI_GENERATED");
    expect(snapshot().result).toMatchObject({
      score: 82,
      likelihoodLabel: "AI-likelihood",
      classification: "Likely AI-Generated"
    });

    controller.destroy();
  });

  it("uses the active embedded video profile when scanning a different feed video", () => {
    const { controller, snapshot } = createController();

    controller.dispatch("APP_READY");
    controller.updateVisibility("synthetic-city-walk", 0.8);
    vi.advanceTimersByTime(4500);

    expect(snapshot().state).toBe("RESULT_AI_GENERATED");
    expect(snapshot().activeVideoId).toBe("synthetic-city-walk");
    expect(snapshot().result).toMatchObject({
      videoId: "synthetic-city-walk",
      score: 86,
      classification: "Likely AI-Generated",
      anomalyCategory: "texture_jitter"
    });

    controller.destroy();
  });
});
