<script lang="ts">
  export let title: string;
  export let body: string;
  export let compact = false;
  export let video = false;
</script>

<article class="rounded-lg border border-slate-200 bg-white shadow-soft">
  <div class="flex items-center gap-3 px-4 py-3">
    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500"></div>
    <div>
      <h2 class="text-sm font-bold text-slate-900">{title}</h2>
      <p class="text-xs text-slate-500">Sponsored · Public</p>
    </div>
    <button class="ml-auto text-xl leading-none text-slate-400" aria-label="Post menu">...</button>
  </div>
  <p class="px-4 pb-3 text-sm leading-5 text-slate-700">{body}</p>

  {#if video}
    <div class="mx-4 mb-4 aspect-video rounded-md bg-[linear-gradient(135deg,#e0f2fe,#f8fafc_45%,#dbeafe)]">
      <div class="grid h-full place-items-center">
        <div class="grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-soft">
          <div class="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-primary"></div>
        </div>
      </div>
    </div>
  {:else if !compact}
    <div class="mx-4 mb-4 grid grid-cols-3 gap-2">
      <div class="h-24 rounded-md bg-slate-100"></div>
      <div class="h-24 rounded-md bg-blue-50"></div>
      <div class="h-24 rounded-md bg-slate-100"></div>
    </div>
  {/if}

  <div class="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
    <span>18 reactions</span>
    <span>7 comments</span>
  </div>
</article>
