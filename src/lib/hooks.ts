"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query through useSyncExternalStore so the value is
 * read during render rather than patched in after mount. The server snapshot
 * is always `false`, so SSR markup assumes the motion-capable, pointer-capable
 * case and clients correct on hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for touch / non-hover pointers. Cursor effects opt out. */
export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/**
 * Viewport narrower than the `lg` breakpoint. Pinned scroll-scrubbing needs
 * both the width for a side-by-side layout and a real pointer, so everything
 * below this falls back to the stepped/swipeable sequences.
 */
export function useIsNarrow(): boolean {
  return useMediaQuery("(max-width: 1023px)");
}

const noopSubscribe = () => () => {};

/** False during SSR and the first render, true afterwards. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
