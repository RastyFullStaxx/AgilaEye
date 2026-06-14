<script lang="ts">
  import { onMount } from "svelte";
  import FloatingDetectorOverlay from "../detector/FloatingDetectorOverlay.svelte";
  import { createViewportDetector } from "../../engine/useViewportDetector";
  import type { SimulatedVideoPost } from "../../engine/simulatedVideoLibrary";
  import type { DetectorSnapshot } from "../../engine/types";

  export let post: SimulatedVideoPost;
  export let snapshot: DetectorSnapshot;
  export let onVisibilityChange: (videoId: string, ratio: number) => void;
  export let onViewDetails: () => void;
  export let onRescan: () => void;

  let cardElement: HTMLElement;

  $: isActive = snapshot.activeVideoId === post.id;
  $: isScanning = isActive && snapshot.state === "SCANNING";
  $: toneClass =
    post.accent === "red"
      ? "from-generated to-rose-900"
      : post.accent === "amber"
        ? "from-eagle to-orange-700"
        : post.accent === "green"
          ? "from-authentic to-emerald-900"
          : "from-slate-950 to-primary";
  $: truthLabel = post.groundTruth === "authentic" ? "Authentic SOP sample" : "AI-generated SOP sample";

  onMount(() => {
    const detector = createViewportDetector(cardElement, {
      videoId: post.id,
      onVisibilityChange
    });

    return () => detector.destroy();
  });
</script>

<article bind:this={cardElement} class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
  <div class="flex items-start gap-3 px-4 py-3">
    <div class={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${toneClass}`}>
      <div class="h-5 w-5 rounded-full border-2 border-white/90"></div>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-1">
        <h1 class="truncate text-sm font-bold text-slate-900">{post.author}</h1>
        <span class="text-slate-400">·</span>
        <span class="text-xs text-slate-500">{post.meta}</span>
      </div>
      <p class="mt-1 text-[13px] leading-5 text-slate-700">
        {post.body}
      </p>
    </div>
    <button class="text-lg leading-none text-slate-400" aria-label="Close post">x</button>
  </div>

  <div class="relative bg-black">
    <div class="relative mx-auto aspect-[4/5] max-h-[540px] min-h-[430px] overflow-hidden bg-slate-900 sm:aspect-[16/13]">
      <video
        class="h-full w-full object-cover"
        src={post.videoSrc}
        aria-label={post.videoTitle}
        autoplay
        muted
        loop
        playsinline
      ></video>
      <div class="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3 text-white">
        <div>
          <p class="text-[11px] font-extrabold uppercase tracking-wide">{truthLabel}</p>
          <p class="mt-0.5 text-sm font-bold">{post.videoTitle}</p>
        </div>
        <div class="rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold backdrop-blur">
          8 frames
        </div>
      </div>
      <div class="video-grain absolute inset-0"></div>

      {#if isScanning}
        <div class="scan-sweep animate-scan-sweep"></div>
        <div class="absolute inset-0 bg-primary/5"></div>
      {/if}

      {#if isActive}
        <FloatingDetectorOverlay {snapshot} {onViewDetails} {onRescan} />
      {/if}
    </div>
  </div>

  <div class="px-4 py-3">
    <p class="text-[11px] uppercase tracking-wide text-slate-400">{post.domain}</p>
    <div class="mt-1 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-bold text-slate-900">{post.headline}</h2>
        <p class="text-xs text-slate-500">{post.subhead}</p>
      </div>
      <button class="rounded-md bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">Review</button>
    </div>
  </div>

  <div class="flex items-center gap-6 border-t border-slate-100 px-4 py-2 text-sm text-slate-500">
    <span>Scan target</span>
    <span>{post.inferenceTimeMs} ms</span>
    <span>{post.predictedMode === "authentic" ? "Low risk" : "Flagged"}</span>
    <div class="ml-auto flex -space-x-1">
      <span class="h-5 w-5 rounded-full bg-primary"></span>
      <span class="h-5 w-5 rounded-full bg-generated"></span>
    </div>
  </div>
</article>
