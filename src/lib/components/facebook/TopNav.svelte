<script lang="ts">
  const navItems = [
    { label: "Home", icon: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" },
    { label: "Watch", icon: "M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm5 4v5l5-2.5L10 9z" },
    { label: "Groups", icon: "M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a5 5 0 0 1 10 0H2zm10 0a5 5 0 0 1 10 0H12z" }
  ];
</script>

<header class="fixed left-0 right-0 top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_10px_rgba(15,23,42,0.06)] backdrop-blur">
  <div class="mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
    <div class="flex items-center gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-full bg-primary text-xl font-bold text-white">f</div>
      <div class="hidden h-10 min-w-[220px] items-center gap-2 rounded-full bg-slate-100 px-4 text-sm text-slate-500 sm:flex">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m21 21-4.3-4.3" />
          <circle cx="11" cy="11" r="7" />
        </svg>
        <span>Search Facebook</span>
      </div>
    </div>

    <nav class="hidden items-center gap-7 md:flex">
      {#each navItems as item, index}
        <button
          class={`grid h-12 w-20 place-items-center border-b-2 transition ${
            index === 0 ? "border-primary text-primary" : "border-transparent text-slate-500 hover:bg-slate-50"
          }`}
          aria-label={item.label}
          title={item.label}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d={item.icon} />
          </svg>
        </button>
      {/each}
    </nav>

    <div class="flex justify-end gap-2">
      {#each ["apps", "messages", "alerts"] as label}
        <button
          class="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          aria-label={label}
          title={label}
        >
          <span class="h-2 w-2 rounded-full bg-slate-700"></span>
        </button>
      {/each}
      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-950 ring-2 ring-white"></div>
    </div>
  </div>
</header>
