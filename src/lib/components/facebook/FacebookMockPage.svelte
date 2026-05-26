<script lang="ts">
  import type { DetectorSnapshot } from "../../engine/types";
  import FeedColumn from "./FeedColumn.svelte";
  import LeftSidebar from "./LeftSidebar.svelte";
  import RightSidebar from "./RightSidebar.svelte";
  import TopNav from "./TopNav.svelte";

  export let snapshot: DetectorSnapshot;
  export let onVisibilityChange: (videoId: string, ratio: number) => void;
  export let onViewDetails: () => void;
  export let onRescan: () => void;
</script>

<div class="min-h-screen bg-page text-ink">
  <TopNav />

  <main class="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 pt-[68px] lg:grid-cols-[260px_minmax(540px,660px)_300px]">
    <LeftSidebar />
    <FeedColumn
      {snapshot}
      {onVisibilityChange}
      {onViewDetails}
      {onRescan}
    />
    <RightSidebar />
  </main>
</div>
