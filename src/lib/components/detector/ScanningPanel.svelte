<script lang="ts">
  import DetectorIcon from "./DetectorIcon.svelte";

  export let progress = 0;
</script>

<div class="detector-card animate-fade-scale w-[194px] rounded-xl p-3">
  <div class="flex items-center gap-2">
    <DetectorIcon size={18} compact />
    <div class="min-w-0 flex-1">
      <p class="text-[12px] font-bold text-slate-900">AI Detector</p>
    </div>
    <button
      class="grid h-6 w-6 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label="Minimize detector"
      title="Minimize detector"
    >
      x
    </button>
  </div>

  <div class="mt-4 grid place-items-center">
    <div
      class="grid h-14 w-14 place-items-center rounded-full"
      style={`background: conic-gradient(#1877F2 ${Math.max(progress, 12)}%, #E2E8F0 0);`}
    >
      <div class="h-10 w-10 rounded-full bg-white"></div>
    </div>
    <p class="mt-3 text-center text-[13px] font-bold text-slate-900">Scanning video...</p>
    <p class="text-center text-[11px] font-medium text-slate-500">Analyzing frames</p>
    <div class="mt-2 flex items-center gap-1">
      {#each [0, 1, 2, 3] as index}
        <span
          class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary"
          style={`animation-delay: ${index * 130}ms`}
        ></span>
      {/each}
    </div>
  </div>

  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100">
    <div class="h-full rounded-full bg-primary transition-all duration-200" style={`width: ${progress}%`}></div>
  </div>
  <div class="relative mt-1 h-1 overflow-hidden rounded-full bg-transparent">
    <div class="absolute inset-y-0 w-16 animate-progress-line rounded-full bg-primary/40"></div>
  </div>
</div>
