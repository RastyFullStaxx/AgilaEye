<script lang="ts">
  export let bullets: string[] = [];
</script>

<ul class="space-y-1.5">
  {#each bullets as bullet}
    <li class="flex items-start gap-2 text-[11px] font-semibold leading-4 text-slate-700">
      <span class="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-authentic/10 text-authentic">
        <svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m2 6 2.3 2.3L10 3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span>{bullet}</span>
    </li>
  {/each}
</ul>
