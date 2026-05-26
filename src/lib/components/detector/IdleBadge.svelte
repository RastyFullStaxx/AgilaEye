<script lang="ts">
  import DetectorIcon from "./DetectorIcon.svelte";
</script>

<div class="detector-card animate-fade-scale flex min-w-[150px] items-center gap-3 rounded-2xl px-3 py-2">
  <div class="grid h-9 w-9 place-items-center rounded-full bg-blue-50">
    <DetectorIcon size={22} compact />
  </div>
  <div class="min-w-0">
    <p class="text-[13px] font-bold leading-4 text-slate-900">AI Detector</p>
    <p class="text-[11px] font-medium leading-4 text-slate-500">Active video detected</p>
    <div class="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-primary">
      <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
      Monitoring
    </div>
  </div>
</div>
