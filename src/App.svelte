<script lang="ts">
  import { onMount } from "svelte";
  import FacebookMockPage from "./lib/components/facebook/FacebookMockPage.svelte";
  import DemoControls from "./lib/components/detector/DemoControls.svelte";
  import DetailsModal from "./lib/components/detector/DetailsModal.svelte";
  import { createDetectorController } from "./lib/engine/detectorMachine";
  import type { DetectorSnapshot, ResultMode } from "./lib/engine/types";

  const detector = createDetectorController();

  let snapshot: DetectorSnapshot = detector.snapshot;
  let detailsOpen = false;

  onMount(() => {
    const unsubscribe = detector.subscribe((nextSnapshot) => {
      snapshot = nextSnapshot;
      if (!nextSnapshot.result) {
        detailsOpen = false;
      }
    });

    detector.dispatch("APP_READY");

    return () => {
      unsubscribe();
      detector.destroy();
    };
  });

  function handleResultModeChange(mode: ResultMode) {
    detector.setResultMode(mode);
  }
</script>

<FacebookMockPage
  {snapshot}
  onVisibilityChange={detector.updateVisibility}
  onViewDetails={() => (detailsOpen = true)}
  onRescan={detector.restartScan}
/>

<DemoControls
  snapshot={snapshot}
  onForceActive={detector.forceActive}
  onInterrupt={detector.interrupt}
  onResume={detector.resume}
  onRestartScan={detector.restartScan}
  onResultModeChange={handleResultModeChange}
/>

{#if detailsOpen && snapshot.result}
  <DetailsModal result={snapshot.result} onClose={() => (detailsOpen = false)} />
{/if}
