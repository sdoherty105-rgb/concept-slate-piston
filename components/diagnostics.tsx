"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type DiagnosticItem = { id: string; label: string; hint: string };

type Props = {
  items: DiagnosticItem[];
  panels: Record<string, ReactNode>;
};

export function Diagnostics({ items, panels }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const groupId = useId();
  const resultRef = useRef<HTMLDivElement>(null);
  const current = items.find((s) => s.id === selected) ?? null;

  useEffect(() => {
    if (!selected || !resultRef.current) return;
    if (window.matchMedia("(min-width: 62rem)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = resultRef.current.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.6 || rect.top < 0) {
      resultRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <div className="dx">
      <div className="dx__picker js-only">
        <fieldset>
          <legend className="dx__legend">What are you noticing?</legend>
          <div className="dx__options">
            {items.map((s) => {
              const id = `${groupId}-${s.id}`;
              return (
                <div className="dx__option" key={s.id}>
                  <input
                    type="radio"
                    name={`${groupId}-symptom`}
                    id={id}
                    value={s.id}
                    checked={selected === s.id}
                    onChange={() => setSelected(s.id)}
                  />
                  <label htmlFor={id}>
                    <span className="dx__hint">{s.hint}</span>
                    <span className="dx__label">{s.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="dx__result" ref={resultRef} data-testid="dx-result">
        <p className="sr-only" role="status" aria-live="polite">
          {current ? `Showing likely causes and the matching service for: ${current.label}.` : ""}
        </p>
        <div className="readout readout--empty js-only" data-active={selected === null}>
          <p className="eyebrow eyebrow--dark">Readout</p>
          <p className="readout__empty-title">Pick a symptom to start.</p>
          <p>
            You will see the likely causes, how urgent it is, what we would check, and the service that fits. It is a
            guide only. We confirm every diagnosis by inspection.
          </p>
        </div>
        <p className="dx__nojs-note nojs-only">
          Every symptom and its likely causes are listed below. Turn on JavaScript to pick one at a time.
        </p>
        {items.map((s) => (
          <div className="dx__panel" data-active={selected === s.id} key={s.id}>
            {panels[s.id]}
          </div>
        ))}
      </div>
    </div>
  );
}
