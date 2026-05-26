interface ViewportDetectorOptions {
  videoId: string;
  onVisibilityChange: (videoId: string, ratio: number) => void;
}

export function createViewportDetector(node: HTMLElement, options: ViewportDetectorOptions) {
  const thresholds = Array.from({ length: 21 }, (_, index) => index / 20);

  const observer = new IntersectionObserver(
    ([entry]) => {
      options.onVisibilityChange(options.videoId, entry?.intersectionRatio ?? 0);
    },
    {
      threshold: thresholds,
      root: null
    }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
