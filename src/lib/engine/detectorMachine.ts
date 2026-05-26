import { writable } from "svelte/store";
import { createEventBus } from "./eventBus";
import { getMockResult } from "./mockResults";
import type {
  DetectorEvent,
  DetectorEventPayload,
  DetectorSnapshot,
  ResultMode
} from "./types";

const STARTUP_ACTIVE_DELAY_MS = 700;
const IDLE_TO_SCAN_DELAY_MS = 800;
const SCAN_DURATION_MS = 3000;
const INTERRUPTED_RESET_DELAY_MS = 220;

const initialSnapshot: DetectorSnapshot = {
  state: "NO_ACTIVE_VIDEO",
  progress: 0,
  resultMode: "authentic",
  result: null,
  activeVideoId: null,
  isActiveVideoVisible: false,
  lastEvent: null,
  visibilityRatio: 0
};

type TimeoutHandle = ReturnType<typeof setTimeout>;
type IntervalHandle = ReturnType<typeof setInterval>;

export function createDetectorController() {
  const store = writable<DetectorSnapshot>(initialSnapshot);
  const bus = createEventBus();

  let snapshot = initialSnapshot;
  let startupTimer: TimeoutHandle | null = null;
  let idleTimer: TimeoutHandle | null = null;
  let scanTimer: TimeoutHandle | null = null;
  let progressTimer: IntervalHandle | null = null;
  let resetTimer: TimeoutHandle | null = null;
  let activeVideoVisible = false;
  let activeVideoId: string | null = null;
  let resultMode: ResultMode = "authentic";
  let startupGateOpen = false;

  function setSnapshot(next: Partial<DetectorSnapshot>, event: DetectorEvent, payload?: DetectorEventPayload) {
    snapshot = {
      ...snapshot,
      ...next,
      lastEvent: event
    };
    store.set(snapshot);
    bus.emit(event, snapshot, payload);
  }

  function clearTimer(timer: TimeoutHandle | null) {
    if (timer) {
      clearTimeout(timer);
    }
  }

  function clearIntervalTimer(timer: IntervalHandle | null) {
    if (timer) {
      clearInterval(timer);
    }
  }

  function clearScanTimers() {
    clearTimer(idleTimer);
    clearTimer(scanTimer);
    clearIntervalTimer(progressTimer);
    idleTimer = null;
    scanTimer = null;
    progressTimer = null;
  }

  function clearAllTimers() {
    clearScanTimers();
    clearTimer(startupTimer);
    clearTimer(resetTimer);
    startupTimer = null;
    resetTimer = null;
  }

  function scheduleIdleToScan() {
    clearTimer(idleTimer);
    idleTimer = setTimeout(() => dispatch("SCAN_STARTED"), IDLE_TO_SCAN_DELAY_MS);
  }

  function startScan() {
    clearScanTimers();

    if (!activeVideoVisible) {
      dispatch("SCAN_CANCELLED");
      return;
    }

    setSnapshot(
      {
        state: "SCANNING",
        progress: 6,
        result: null,
        isActiveVideoVisible: true,
        activeVideoId
      },
      "SCAN_STARTED"
    );

    progressTimer = setInterval(() => {
      const nextProgress = Math.min(96, snapshot.progress + 7);
      dispatch("SCAN_PROGRESS", { progress: nextProgress });
    }, 220);

    scanTimer = setTimeout(() => {
      if (activeVideoVisible) {
        dispatch("SCAN_COMPLETED");
      } else {
        dispatch("SCAN_CANCELLED");
      }
    }, SCAN_DURATION_MS);
  }

  function completeScan() {
    clearScanTimers();

    if (!activeVideoVisible) {
      dispatch("SCAN_CANCELLED");
      return;
    }

    const result = getMockResult(resultMode);
    setSnapshot(
      {
        state: resultMode === "authentic" ? "RESULT_AUTHENTIC" : "RESULT_AI_GENERATED",
        progress: 100,
        result,
        resultMode,
        isActiveVideoVisible: true,
        activeVideoId
      },
      "SCAN_COMPLETED"
    );
  }

  function interrupt(event: DetectorEvent, payload?: DetectorEventPayload) {
    activeVideoVisible = false;
    clearAllTimers();
    setSnapshot(
      {
        state: "INTERRUPTED",
        progress: 0,
        result: null,
        isActiveVideoVisible: false,
        visibilityRatio: payload?.ratio ?? snapshot.visibilityRatio
      },
      event,
      payload
    );

    resetTimer = setTimeout(() => {
      dispatch("RESET_OVERLAY");
    }, INTERRUPTED_RESET_DELAY_MS);
  }

  function becomeActive(event: DetectorEvent, payload?: DetectorEventPayload) {
    activeVideoVisible = true;
    activeVideoId = payload?.videoId ?? activeVideoId ?? "main-video";
    clearAllTimers();
    setSnapshot(
      {
        state: "IDLE_DETECTED",
        progress: 0,
        result: null,
        activeVideoId,
        isActiveVideoVisible: true,
        visibilityRatio: payload?.ratio ?? snapshot.visibilityRatio
      },
      event,
      payload
    );
    scheduleIdleToScan();
  }

  function dispatch(event: DetectorEvent, payload?: DetectorEventPayload) {
    switch (event) {
      case "APP_READY": {
        clearAllTimers();
        startupGateOpen = false;
        setSnapshot(
          {
            state: "NO_ACTIVE_VIDEO",
            progress: 0,
            result: null,
            activeVideoId,
            isActiveVideoVisible: activeVideoVisible
          },
          event,
          payload
        );
        startupTimer = setTimeout(() => {
          startupGateOpen = true;
          if (activeVideoVisible) {
            dispatch("VIDEO_BECAME_ACTIVE", {
              videoId: activeVideoId ?? "main-video",
              ratio: snapshot.visibilityRatio
            });
          }
        }, STARTUP_ACTIVE_DELAY_MS);
        break;
      }
      case "VIDEO_ENTERED_VIEWPORT":
      case "VIDEO_BECAME_ACTIVE": {
        becomeActive(event, payload);
        break;
      }
      case "ACTIVE_VIDEO_CHANGED": {
        activeVideoId = payload?.videoId ?? activeVideoId;
        becomeActive(event, payload);
        break;
      }
      case "SCAN_STARTED": {
        startScan();
        break;
      }
      case "SCAN_PROGRESS": {
        if (snapshot.state === "SCANNING") {
          setSnapshot({ progress: payload?.progress ?? snapshot.progress }, event, payload);
        }
        break;
      }
      case "SCAN_COMPLETED": {
        completeScan();
        break;
      }
      case "VIDEO_LEFT_VIEWPORT":
      case "VIDEO_INTERRUPTED":
      case "SCAN_CANCELLED": {
        interrupt(event, payload);
        break;
      }
      case "RESCAN_REQUESTED": {
        if (
          activeVideoVisible &&
          (snapshot.state === "RESULT_AUTHENTIC" || snapshot.state === "RESULT_AI_GENERATED")
        ) {
          startScan();
        }
        break;
      }
      case "RESET_OVERLAY": {
        clearAllTimers();
        setSnapshot(
          {
            state: "NO_ACTIVE_VIDEO",
            progress: 0,
            result: null,
            activeVideoId: activeVideoVisible ? activeVideoId : null,
            isActiveVideoVisible: activeVideoVisible
          },
          event,
          payload
        );
        break;
      }
    }
  }

  function updateVisibility(videoId: string, ratio: number) {
    setSnapshot({ visibilityRatio: ratio }, snapshot.lastEvent ?? "APP_READY", { videoId, ratio });

    if (ratio >= 0.6) {
      const nextEvent = activeVideoId && activeVideoId !== videoId ? "ACTIVE_VIDEO_CHANGED" : "VIDEO_ENTERED_VIEWPORT";
      activeVideoId = videoId;
      activeVideoVisible = true;

      if (!startupGateOpen) {
        return;
      }

      if (
        nextEvent === "ACTIVE_VIDEO_CHANGED" ||
        snapshot.state === "NO_ACTIVE_VIDEO" ||
        snapshot.state === "INTERRUPTED"
      ) {
        dispatch(nextEvent, { videoId, ratio });
      }
      return;
    }

    if (ratio < 0.4 && activeVideoVisible && activeVideoId === videoId) {
      dispatch("VIDEO_LEFT_VIEWPORT", { videoId, ratio });
    }
  }

  function setResultMode(mode: ResultMode) {
    resultMode = mode;
    const result = getMockResult(mode);
    const state =
      snapshot.state === "RESULT_AUTHENTIC" || snapshot.state === "RESULT_AI_GENERATED"
        ? mode === "authentic"
          ? "RESULT_AUTHENTIC"
          : "RESULT_AI_GENERATED"
        : snapshot.state;

    setSnapshot(
      {
        resultMode: mode,
        state,
        result:
          snapshot.state === "RESULT_AUTHENTIC" || snapshot.state === "RESULT_AI_GENERATED"
            ? result
            : snapshot.result
      },
      snapshot.lastEvent ?? "APP_READY"
    );
  }

  return {
    snapshot,
    subscribe: store.subscribe,
    subscribeToEvents: bus.subscribe,
    dispatch,
    updateVisibility,
    setResultMode,
    forceActive() {
      activeVideoVisible = true;
      activeVideoId = activeVideoId ?? "main-video";
      dispatch("VIDEO_BECAME_ACTIVE", { videoId: activeVideoId, ratio: Math.max(snapshot.visibilityRatio, 0.8) });
    },
    interrupt() {
      dispatch("VIDEO_INTERRUPTED", { videoId: activeVideoId ?? "main-video", ratio: 0 });
    },
    resume() {
      activeVideoVisible = true;
      activeVideoId = activeVideoId ?? "main-video";
      dispatch("VIDEO_BECAME_ACTIVE", { videoId: activeVideoId, ratio: Math.max(snapshot.visibilityRatio, 0.8) });
    },
    restartScan() {
      dispatch("RESCAN_REQUESTED");
    },
    destroy() {
      clearAllTimers();
    }
  };
}
