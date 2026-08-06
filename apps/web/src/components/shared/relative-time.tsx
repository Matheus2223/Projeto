"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/format";

export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Intentionally deferred to an effect: relativeTime() depends on
    // Date.now(), which must stay out of the initial render to avoid a
    // server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLabel(relativeTime(iso));
  }, [iso]);

  return <span className={className}>{label || " "}</span>;
}
