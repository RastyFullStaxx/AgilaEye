<script lang="ts">
  import { onMount } from "svelte";
  import FloatingDetectorOverlay from "../detector/FloatingDetectorOverlay.svelte";
  import { createViewportDetector } from "../../engine/useViewportDetector";
  import type { DetectorSnapshot } from "../../engine/types";

  export let snapshot: DetectorSnapshot;
  export let onVisibilityChange: (videoId: string, ratio: number) => void;
  export let onViewDetails: () => void;
  export let onRescan: () => void;

  const videoId = "main-video";
  let cardElement: HTMLElement;

  onMount(() => {
    const detector = createViewportDetector(cardElement, {
      videoId,
      onVisibilityChange
    });

    return () => detector.destroy();
  });
</script>

<article bind:this={cardElement} class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
  <div class="flex items-start gap-3 px-4 py-3">
    <div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-slate-950 to-primary">
      <div class="h-5 w-5 rounded-full border-2 border-white/90"></div>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-1">
        <h1 class="truncate text-sm font-bold text-slate-900">Told You I Could Do It</h1>
        <span class="text-slate-400">·</span>
        <span class="text-xs text-slate-500">Sponsored</span>
      </div>
      <p class="mt-1 text-[13px] leading-5 text-slate-700">
        I'm looking for two eCommerce web developers to join my team. $2,500-$3,000/mo. Monthly.
      </p>
    </div>
    <button class="text-lg leading-none text-slate-400" aria-label="Close post">x</button>
  </div>

  <div class="relative bg-black">
    <div class="relative mx-auto aspect-[4/5] max-h-[540px] min-h-[430px] overflow-hidden bg-slate-900 sm:aspect-[16/13]">
      <div class="portrait-sheen absolute inset-0"></div>
      <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/60 to-transparent"></div>
      <div class="absolute left-1/2 top-[13%] h-[69%] w-[58%] -translate-x-1/2 rounded-[48%_48%_44%_44%] face-shape shadow-[inset_0_-22px_38px_rgba(91,42,36,0.2)]"></div>
      <div class="absolute left-[33%] top-[39%] h-7 w-16 rounded-full bg-white/80 shadow-inner">
        <div class="mx-auto mt-2 h-4 w-4 rounded-full bg-slate-900"></div>
      </div>
      <div class="absolute right-[33%] top-[39%] h-7 w-16 rounded-full bg-white/80 shadow-inner">
        <div class="mx-auto mt-2 h-4 w-4 rounded-full bg-slate-900"></div>
      </div>
      <div class="absolute left-1/2 top-[53%] h-12 w-7 -translate-x-1/2 rounded-full bg-[#bf7568]/70"></div>
      <div class="absolute left-1/2 top-[65%] h-7 w-32 -translate-x-1/2 rounded-b-full border-b-[10px] border-[#63342f]"></div>
      <div class="absolute bottom-0 left-[16%] right-[16%] h-24 rounded-t-[50%] bg-slate-500"></div>
      <div class="absolute inset-y-0 left-0 w-8 bg-black"></div>
      <div class="absolute inset-y-0 right-0 w-8 bg-black"></div>

      {#if snapshot.state === "SCANNING"}
        <div class="scan-sweep animate-scan-sweep"></div>
        <div class="absolute inset-0 bg-primary/5"></div>
      {/if}

      <FloatingDetectorOverlay {snapshot} {onViewDetails} {onRescan} />
    </div>
  </div>

  <div class="px-4 py-3">
    <p class="text-[11px] uppercase tracking-wide text-slate-400">apply.toldyoucoulddoit.com</p>
    <div class="mt-1 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-bold text-slate-900">Top 3 get paid trial weeks.</h2>
        <p class="text-xs text-slate-500">Looking for remote ecomm web devs!</p>
      </div>
      <button class="rounded-md bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">Apply now</button>
    </div>
  </div>

  <div class="flex items-center gap-6 border-t border-slate-100 px-4 py-2 text-sm text-slate-500">
    <span>Like 18</span>
    <span>Comment 7</span>
    <span>Share 3</span>
    <div class="ml-auto flex -space-x-1">
      <span class="h-5 w-5 rounded-full bg-primary"></span>
      <span class="h-5 w-5 rounded-full bg-generated"></span>
    </div>
  </div>
</article>
