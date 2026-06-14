<script lang="ts">
  import type { DetectorResult } from "../../engine/types";
  import DetectorIcon from "./DetectorIcon.svelte";
  import ExplanationList from "./ExplanationList.svelte";

  export let result: DetectorResult;
  export let onViewDetails: () => void;
  export let onRescan: () => void;

  $: isAuthentic = result.mode === "authentic";
</script>

<div class="detector-card animate-fade-scale w-[198px] rounded-xl p-3">
  <div class="flex items-start gap-2">
    <DetectorIcon size={18} compact />
    <div class="min-w-0 flex-1">
      <p class="text-[12px] font-bold leading-4 text-slate-900">AI Detector</p>
      <div class="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
        <span class={`h-2 w-2 rounded-full ${isAuthentic ? "bg-authentic" : "bg-generated"}`}></span>
        Analysis complete
      </div>
    </div>
    <button
      class="grid h-6 w-6 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label="Close result"
      title="Close result"
    >
      x
    </button>
  </div>

  <div class="mt-2 text-center">
    {#if result.videoTitle}
      <p class="mb-1 truncate text-[11px] font-bold text-slate-500">{result.videoTitle}</p>
    {/if}
    <p class={`text-3xl font-extrabold leading-none ${isAuthentic ? "text-primary" : "text-generated"}`}>
      {result.score}%
    </p>
    <p class="mt-1 text-[12px] font-bold text-slate-800">{result.likelihoodLabel}</p>
  </div>

  <div
    class={`mt-3 rounded-md px-3 py-1.5 text-center text-[12px] font-extrabold ${
      isAuthentic ? "bg-authentic/10 text-authentic" : "bg-generated/10 text-generated"
    }`}
  >
    {result.classification}
  </div>

  <div class="mt-3">
    <ExplanationList bullets={result.bullets} />
  </div>

  {#if result.inferenceTimeMs || result.frameSampleCount}
    <div class="mt-3 grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-500">
      <div class="rounded-md bg-slate-100 px-2 py-1.5">
        {result.frameSampleCount ?? 8} frames
      </div>
      <div class="rounded-md bg-slate-100 px-2 py-1.5">
        {result.inferenceTimeMs ?? 0} ms
      </div>
    </div>
  {/if}

  <div class="mt-3 grid grid-cols-2 gap-2">
    <button
      class="rounded-md border border-primary/40 bg-white px-2 py-2 text-[11px] font-bold text-primary transition hover:bg-blue-50"
      on:click={onViewDetails}
    >
      View details
    </button>
    <button
      class="rounded-md bg-primary px-2 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-primaryDeep"
      on:click={onRescan}
    >
      Rescan
    </button>
  </div>
</div>
