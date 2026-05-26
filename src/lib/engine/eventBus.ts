import type {
  DetectorEvent,
  DetectorEventPayload,
  DetectorListener,
  DetectorSnapshot
} from "./types";

export function createEventBus() {
  const listeners = new Set<DetectorListener>();

  return {
    emit(event: DetectorEvent, snapshot: DetectorSnapshot, payload?: DetectorEventPayload) {
      listeners.forEach((listener) => listener(event, snapshot, payload));
    },
    subscribe(listener: DetectorListener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
