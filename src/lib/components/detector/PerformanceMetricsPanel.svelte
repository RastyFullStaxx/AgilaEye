<script lang="ts">
  import { formatMetricPercent, sopPerformanceMetrics } from "../../engine/simulatedVideoLibrary";

  const metrics = sopPerformanceMetrics;
  const metricRows = [
    ["Accuracy", formatMetricPercent(metrics.accuracy)],
    ["Precision", formatMetricPercent(metrics.precision)],
    ["Recall", formatMetricPercent(metrics.recall)],
    ["F1-score", formatMetricPercent(metrics.f1Score)]
  ];
</script>

<section class="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
  <div class="flex items-start justify-between gap-3">
    <div>
      <h2 class="text-sm font-extrabold text-slate-950">SOP Performance</h2>
      <p class="mt-1 text-xs leading-5 text-slate-500">
        Fixed embedded-video set, measured at video level.
      </p>
    </div>
    <div class="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-primary">
      n={metrics.sampleSize}
    </div>
  </div>

  <div class="mt-4 grid grid-cols-2 gap-2">
    {#each metricRows as row}
      <div class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
        <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">{row[0]}</p>
        <p class="mt-1 text-lg font-extrabold text-slate-950">{row[1]}</p>
      </div>
    {/each}
  </div>

  <div class="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
    Avg inference: {Math.round(metrics.averageInferenceTimeMs)} ms
  </div>

  <div class="mt-3 grid grid-cols-4 gap-1 text-center text-[11px] font-bold">
    <div class="rounded bg-authentic/10 py-1 text-authentic">TP {metrics.truePositive}</div>
    <div class="rounded bg-slate-100 py-1 text-slate-600">TN {metrics.trueNegative}</div>
    <div class="rounded bg-warning/10 py-1 text-warning">FP {metrics.falsePositive}</div>
    <div class="rounded bg-generated/10 py-1 text-generated">FN {metrics.falseNegative}</div>
  </div>
</section>
