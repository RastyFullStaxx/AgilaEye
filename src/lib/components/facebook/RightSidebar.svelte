<script lang="ts">
  const contacts = ["Meta AI", "Ejay Buscato", "Roanne Maye Dinglasa", "Rochelle Mendoza", "Neomi"];
</script>

<aside class="sticky top-[68px] hidden h-[calc(100vh-80px)] overflow-hidden xl:block">
  <section>
    <h2 class="mb-3 text-sm font-semibold text-slate-500">Sponsored</h2>
    <div class="space-y-3">
      <div class="grid grid-cols-[116px_1fr] gap-3 rounded-lg p-2 transition hover:bg-white/80">
        <div class="h-24 rounded-md bg-[radial-gradient(circle_at_35%_35%,#f4b23a,transparent_28%),linear-gradient(135deg,#6b4d2f,#1f2937)]"></div>
        <div class="self-center text-xs font-semibold text-slate-800">
          Century Park Hotel Tsukiji Matale starting at P1499...
          <p class="mt-1 font-normal text-slate-500">stardeals.ph</p>
        </div>
      </div>
      <div class="grid grid-cols-[116px_1fr] gap-3 rounded-lg p-2 transition hover:bg-white/80">
        <div class="h-24 rounded-md bg-[linear-gradient(135deg,#fff7ed,#dbeafe_55%,#fee2e2)]">
          <div class="m-3 h-4 w-16 rounded bg-generated/80"></div>
          <div class="mx-3 mt-4 h-6 rounded bg-primary/80"></div>
        </div>
        <div class="self-center text-xs font-semibold text-slate-800">
          Students save 70% on Creative Cloud Pro.
          <p class="mt-1 font-normal text-slate-500">adobe.com</p>
        </div>
      </div>
    </div>
  </section>

  <section class="mt-5 border-t border-slate-300/70 pt-4">
    <h2 class="mb-3 text-sm font-semibold text-slate-500">Birthdays</h2>
    <div class="flex gap-3 rounded-lg p-2 text-xs text-slate-700">
      <div class="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-bold">BD</div>
      <p><strong>Kirk X Alfonso</strong> and <strong>JehShiel PreciousGifts</strong> have birthdays today.</p>
    </div>
  </section>

  <section class="mt-5 border-t border-slate-300/70 pt-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-slate-500">Contacts</h2>
      <div class="flex gap-2 text-slate-400">
        <span class="h-4 w-4 rounded-full border border-slate-400"></span>
        <span class="h-4 w-4 rounded-full border border-slate-400"></span>
      </div>
    </div>
    <div class="space-y-2">
      {#each contacts as contact, index}
        <div class="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-slate-600">
          <div class={`h-8 w-8 rounded-full ${index === 0 ? "bg-violet-200" : "bg-slate-300"}`}></div>
          <span>{contact}</span>
        </div>
      {/each}
    </div>
  </section>
</aside>
