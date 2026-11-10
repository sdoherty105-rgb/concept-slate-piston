"use client";

import { useEffect, useState } from "react";

/**
 * The home page is prerendered, so any time passed in from the server is the
 * build time. This hook starts from that value (so hydration matches) and then
 * moves to the visitor's clock straight away, ticking once a minute.
 */
export function useNow(initialIso: string) {
  const [iso, setIso] = useState(initialIso);
  useEffect(() => {
    const tick = () => setIso(new Date().toISOString());
    const soon = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(soon);
      window.clearInterval(id);
    };
  }, []);
  return new Date(iso);
}
