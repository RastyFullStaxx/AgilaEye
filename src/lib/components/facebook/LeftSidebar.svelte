<script lang="ts">
  const primary = ["Gem Rasty Espartero", "Friends", "Memories", "Saved", "Groups", "Reels", "Marketplace", "Feeds"];
  const shortcuts = [
    "Mental Health Support Group PH",
    "BENTAHAN NG COMPUTER 2ND HAND",
    "BATANGAS BEACH RESORTS",
    "IAM Worldwide - Negosyong Hindi ka Mag-iisa"
  ];
</script>

<aside class="sticky top-[68px] hidden h-[calc(100vh-80px)] overflow-hidden lg:block">
  <div class="space-y-1 text-[13px] font-semibold text-slate-700">
    {#each primary as item, index}
      <div class="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/80">
        <div class={`grid h-8 w-8 place-items-center rounded-full ${index === 0 ? "bg-gradient-to-br from-slate-700 to-slate-950" : "bg-slate-200"}`}>
          {#if index === 0}
            <span class="text-xs text-white">GE</span>
          {:else}
            <span class="h-3 w-3 rounded-sm bg-slate-500"></span>
          {/if}
        </div>
        <span class="truncate">{item}</span>
      </div>
    {/each}
  </div>

  <div class="mt-4 border-t border-slate-300/70 pt-4">
    <h2 class="px-2 text-sm font-semibold text-slate-500">Your shortcuts</h2>
    <div class="mt-2 space-y-2">
      {#each shortcuts as item, index}
        <div class="flex items-center gap-3 rounded-md px-2 py-1.5 text-[13px] font-semibold text-slate-700">
          <div class={`h-8 w-8 rounded-md ${index % 2 === 0 ? "bg-blue-100" : "bg-emerald-100"}`}></div>
          <span class="truncate">{item}</span>
        </div>
      {/each}
    </div>
  </div>

  <p class="absolute bottom-1 left-2 text-[11px] text-slate-500">Privacy · Terms · Advertising · More</p>
</aside>
