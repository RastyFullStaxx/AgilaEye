<script lang="ts">
  import {
    formatMetricPercent,
    perVideoPerformanceRows,
    splitPerformanceMetrics,
    sopPerformanceMetrics
  } from "../../engine/simulatedVideoLibrary";
  import type { PerformanceMetrics } from "../../engine/types";

  const phaseRows: { label: string; metrics: PerformanceMetrics }[] = [
    { label: "Model Development", metrics: splitPerformanceMetrics.modelDevelopment },
    { label: "Model Testing", metrics: splitPerformanceMetrics.modelTesting }
  ];

  function formatSeconds(milliseconds: number): string {
    return `${(milliseconds / 1000).toFixed(6)}s`;
  }
</script>

<section class="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
  <div class="flex items-start justify-between gap-3">
    <div>
      <h2 class="text-sm font-extrabold text-slate-950">SOP Performance</h2>
      <p class="mt-1 text-xs leading-5 text-slate-500">
        Video-level pilot results from all 100 embedded samples.
      </p>
    </div>
    <div class="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-primary">
      logs={perVideoPerformanceRows.length}
    </div>
  </div>

  <div class="mt-4 overflow-hidden rounded-lg border border-slate-200">
    <div class="grid grid-cols-[1.25fr_repeat(4,minmax(54px,1fr))] bg-slate-950 px-3 py-2 text-[10px] font-extrabold uppercase text-white">
      <span>Phase</span>
      <span class="text-right">Accuracy</span>
      <span class="text-right">Precision</span>
      <span class="text-right">Recall</span>
      <span class="text-right">F1</span>
    </div>
    {#each phaseRows as row}
      <div class="grid grid-cols-[1.25fr_repeat(4,minmax(54px,1fr))] border-t border-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700">
        <span class="text-slate-950">{row.label}</span>
        <span class="text-right">{formatMetricPercent(row.metrics.accuracy)}</span>
        <span class="text-right">{formatMetricPercent(row.metrics.precision)}</span>
        <span class="text-right">{formatMetricPercent(row.metrics.recall)}</span>
        <span class="text-right">{formatMetricPercent(row.metrics.f1Score)}</span>
      </div>
    {/each}
  </div>

  <div class="mt-3 overflow-hidden rounded-lg border border-slate-200">
    <div class="grid grid-cols-[1fr_auto] bg-slate-100 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-500">
      <span>Phase</span>
      <span>Inference Time (seconds)</span>
    </div>
    {#each phaseRows as row}
      <div class="grid grid-cols-[1fr_auto] border-t border-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700">
        <span class="text-slate-950">{row.label}</span>
        <span>{formatSeconds(row.metrics.averageInferenceTimeMs)}</span>
      </div>
    {/each}
  </div>

  <div class="mt-3 grid grid-cols-4 gap-1 text-center text-[11px] font-bold">
    <div class="rounded bg-authentic/10 py-1 text-authentic">TP {sopPerformanceMetrics.truePositive}</div>
    <div class="rounded bg-slate-100 py-1 text-slate-600">TN {sopPerformanceMetrics.trueNegative}</div>
    <div class="rounded bg-warning/10 py-1 text-warning">FP {sopPerformanceMetrics.falsePositive}</div>
    <div class="rounded bg-generated/10 py-1 text-generated">FN {sopPerformanceMetrics.falseNegative}</div>
  </div>
</section>
