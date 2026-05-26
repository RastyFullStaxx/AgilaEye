<script lang="ts">
  import type { DetectorSnapshot } from "../../engine/types";
  import IdleBadge from "./IdleBadge.svelte";
  import ResultPanel from "./ResultPanel.svelte";
  import ScanningPanel from "./ScanningPanel.svelte";

  export let snapshot: DetectorSnapshot;
  export let onViewDetails: () => void;
  export let onRescan: () => void;
</script>

{#if snapshot.state === "IDLE_DETECTED"}
  <div class="absolute bottom-7 right-7 z-20">
    <IdleBadge />
  </div>
{:else if snapshot.state === "SCANNING"}
  <div class="absolute bottom-6 right-6 z-20">
    <ScanningPanel progress={snapshot.progress} />
  </div>
{:else if snapshot.result && (snapshot.state === "RESULT_AUTHENTIC" || snapshot.state === "RESULT_AI_GENERATED")}
  <div class="absolute bottom-5 right-5 z-20">
    <ResultPanel result={snapshot.result} {onViewDetails} {onRescan} />
  </div>
{/if}
