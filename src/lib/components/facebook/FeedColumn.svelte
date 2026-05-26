<script lang="ts">
  import type { DetectorSnapshot } from "../../engine/types";
  import PlaceholderPost from "./PlaceholderPost.svelte";
  import VideoPostCard from "./VideoPostCard.svelte";

  export let snapshot: DetectorSnapshot;
  export let onVisibilityChange: (videoId: string, ratio: number) => void;
  export let onViewDetails: () => void;
  export let onRescan: () => void;
</script>

<section class="feed-scrollbar mx-auto w-full max-w-[660px] space-y-4 pb-24">
  <PlaceholderPost compact title="Research Circle PH" body="New notes from the media literacy pilot group are ready for review." />
  <VideoPostCard
    {snapshot}
    {onVisibilityChange}
    {onViewDetails}
    {onRescan}
  />
  <PlaceholderPost
    title="UP Digital Society"
    body="Panel discussion highlights: classroom-ready tools should be explainable, lightweight, and respectful of privacy."
  />
  <PlaceholderPost
    title="Civic Media Lab"
    body="Field observers are comparing examples of authentic, edited, and synthetic videos in social feeds."
  />
  <PlaceholderPost
    title="AgilaEye Pilot Notes"
    body="A second mock video appears here so scrolling can interrupt and restart the detector demonstration."
    video
  />
</section>
