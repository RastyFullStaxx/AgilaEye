<script lang="ts">
  import type { DetectorSnapshot, ResultMode } from "../../engine/types";

  export let snapshot: DetectorSnapshot;
  export let onForceActive: () => void;
  export let onInterrupt: () => void;
  export let onResume: () => void;
  export let onRestartScan: () => void;
  export let onResultModeChange: (mode: ResultMode) => void;

  let open = false;
</script>

<div class="fixed bottom-4 left-4 z-40">
  {#if open}
    <div class="mb-2 w-[260px] rounded-xl border border-slate-200 bg-white p-3 shadow-detector">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <p class="text-sm font-extrabold text-slate-950">Demo Controls</p>
          <p class="text-[11px] font-medium text-slate-500">{snapshot.state}</p>
        </div>
        <button
          class="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
          aria-label="Hide demo controls"
          on:click={() => (open = false)}
        >
          x
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button class="rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" on:click={onForceActive}>
          Force active
        </button>
        <button class="rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" on:click={onInterrupt}>
          Interrupt
        </button>
        <button class="rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" on:click={onResume}>
          Resume
        </button>
        <button
          class="rounded-md bg-primary px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={snapshot.state !== "RESULT_AUTHENTIC" && snapshot.state !== "RESULT_AI_GENERATED"}
          on:click={onRestartScan}
        >
          Restart scan
        </button>
      </div>

      <div class="mt-3 rounded-lg bg-slate-100 p-1">
        <div class="grid grid-cols-2 gap-1">
          <button
            class={`rounded-md px-3 py-2 text-xs font-bold transition ${
              snapshot.resultMode === "authentic" ? "bg-white text-authentic shadow-sm" : "text-slate-500"
            }`}
            on:click={() => onResultModeChange("authentic")}
          >
            Authentic
          </button>
          <button
            class={`rounded-md px-3 py-2 text-xs font-bold transition ${
              snapshot.resultMode === "ai-generated" ? "bg-white text-generated shadow-sm" : "text-slate-500"
            }`}
            on:click={() => onResultModeChange("ai-generated")}
          >
            AI-generated
          </button>
        </div>
      </div>
    </div>
  {/if}

  <button
    class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 shadow-soft transition hover:bg-slate-50"
    on:click={() => (open = !open)}
  >
    Demo Controls
  </button>
</div>
