<script lang="ts">
  import type { DetectorSnapshot } from "../../engine/types";
  import { simulatedVideoPosts } from "../../engine/simulatedVideoLibrary";
  import PlaceholderPost from "./PlaceholderPost.svelte";
  import VideoPostCard from "./VideoPostCard.svelte";

  export let snapshot: DetectorSnapshot;
  export let onVisibilityChange: (videoId: string, ratio: number) => void;
  export let onViewDetails: () => void;
  export let onRescan: () => void;
</script>

<section class="feed-scrollbar mx-auto w-full max-w-[660px] space-y-4 pb-24">
  <PlaceholderPost compact title="Research Circle PH" body="SOP pilot feed: scroll through embedded clips and let HaribonEye scan the active video." />

  {#each simulatedVideoPosts as post, index}
    <VideoPostCard
      {post}
      {snapshot}
      {onVisibilityChange}
      {onViewDetails}
      {onRescan}
    />

    {#if index === 1}
      <PlaceholderPost
        title="UP Digital Society"
        body="Panel discussion highlights: classroom-ready tools should be explainable, lightweight, and respectful of privacy."
      />
    {:else if index === 3}
      <PlaceholderPost
        title="AgilaEye Pilot Notes"
        body="The scanner reports SOP metrics from this fixed embedded-video set: accuracy, precision, recall, F1-score, and inference time."
        video
      />
    {/if}
  {/each}
</section>
