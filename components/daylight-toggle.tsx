"use client";

import { useLayoutEffect, useState } from "react";

const KEY = "slate-theme";

function apply(day: boolean) {
  document.documentElement.dataset.theme = day ? "day" : "carbon";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", day ? "#E4E9ED" : "#0E1114");
}

export function DaylightToggle() {
  const [day, setDay] = useState(false);

  useLayoutEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(KEY) === "day";
    } catch {
      stored = false;
    }
    apply(stored);
    const id = window.setTimeout(() => setDay(stored), 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggle = () => {
    const next = !day;
    try {
      localStorage.setItem(KEY, next ? "day" : "carbon");
    } catch {
      /* private mode */
    }
    apply(next);
    setDay(next);
  };

  return (
    <button type="button" className="daylight" aria-pressed={day} onClick={toggle}>
      <span className="kicker">Daylight</span>
      <span className="num">{day ? "On" : "Off"}</span>
    </button>
  );
}
