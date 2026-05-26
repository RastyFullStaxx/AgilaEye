<script lang="ts">
  export let size = 24;
  export let compact = false;
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 28 28"
  fill="none"
  aria-hidden="true"
  class={compact ? "drop-shadow-sm" : ""}
>
  <path
    d="M14 2.8 23 6.2v6.6c0 5.7-3.7 10.5-9 12.4-5.3-1.9-9-6.7-9-12.4V6.2L14 2.8Z"
    fill="#1877F2"
  />
  <path
    d="M8.6 13.6c1.4-2.4 3.2-3.6 5.4-3.6s4 1.2 5.4 3.6c-1.4 2.4-3.2 3.6-5.4 3.6s-4-1.2-5.4-3.6Z"
    fill="white"
  />
  <circle cx="14" cy="13.6" r="2.05" fill="#0F172A" />
  <path d="M18.8 7.7 20.9 7l-.7 2.2" stroke="#F4B23A" stroke-width="1.3" stroke-linecap="round" />
</svg>
