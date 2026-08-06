"use client";

import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(total: number, step = 12) {
  const [visible, setVisible] = useState(Math.min(step, total));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset the visible count during render (not in an effect) whenever the
  // filtered list changes size, following React's "adjusting state when a
  // prop changes" pattern — avoids an extra render pass. Uses state (not a
  // ref) to track the previous key since refs must not be written at render time.
  const listKey = `${total}-${step}`;
  const [lastKey, setLastKey] = useState(listKey);
  if (lastKey !== listKey) {
    setLastKey(listKey);
    setVisible(Math.min(step, total));
  }

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + step, total));
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [total, step]);

  return { visible, sentinelRef };
}
