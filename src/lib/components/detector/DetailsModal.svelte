<script lang="ts">
  import type { DetectorResult } from "../../engine/types";
  import DetectorIcon from "./DetectorIcon.svelte";

  export let result: DetectorResult;
  export let onClose: () => void;

  $: rows = [
    ["Frame consistency", result.details.frameConsistency],
    ["Facial texture", result.details.facialTexture],
    ["Lighting/shadow coherence", result.details.lightingShadowCoherence],
    ["Temporal artifact signal", result.details.temporalArtifactSignal],
    ["Decision", result.details.decision]
  ];
</script>

<div class="fixed inset-0 z-50 grid place-items-center px-4">
  <button
    class="absolute inset-0 bg-slate-950/35"
    aria-label="Close details"
    on:click={onClose}
  ></button>

  <div
    class="relative w-full max-w-md animate-fade-scale rounded-xl border border-slate-200 bg-white p-5 shadow-detector"
    role="dialog"
    aria-modal="true"
    aria-labelledby="details-title"
  >
    <div class="flex items-start gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-full bg-blue-50">
        <DetectorIcon size={24} />
      </div>
      <div class="min-w-0 flex-1">
        <h2 id="details-title" class="text-base font-extrabold text-slate-950">HaribonEye details</h2>
        <p class="mt-1 text-sm leading-5 text-slate-600">{result.details.summary}</p>
      </div>
      <button
        class="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
        aria-label="Close details"
        on:click={onClose}
      >
        x
      </button>
    </div>

    <div class="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
      {#each rows as row}
        <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm">
          <span class="font-medium text-slate-500">{row[0]}</span>
          <span class="font-bold text-slate-900">{row[1]}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
