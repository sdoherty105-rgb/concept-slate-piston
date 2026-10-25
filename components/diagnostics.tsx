"use client";

import { useEffect, useId, useRef, useState } from "react";
import { serviceById, symptoms, urgencyLabel, type Symptom, type Urgency } from "@/lib/data";
import { BookLink } from "./book-link";

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={`urgency urgency--${urgency}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        {urgency === "stop" && <path d="M4.2 1h5.6L13 4.2v5.6L9.8 13H4.2L1 9.8V4.2z" fill="currentColor" />}
        {urgency === "soon" && <path d="M7 1.2 13.2 12.4H.8z" fill="currentColor" />}
        {urgency === "routine" && <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />}
      </svg>
      {urgencyLabel[urgency]}
    </span>
  );
}

function Readout({ symptom, headingId }: { symptom: Symptom; headingId?: string }) {
  const service = serviceById(symptom.service);
  const also = symptom.alsoRelevant ? serviceById(symptom.alsoRelevant.service) : null;
  return (
    <article className="readout" aria-labelledby={headingId}>
      <header className="readout__head">
        <p className="eyebrow eyebrow--dark">Readout</p>
        <h3 id={headingId} className="readout__title">
          {symptom.label}
        </h3>
        <UrgencyBadge urgency={symptom.urgency} />
        <p className="readout__urgency">{symptom.urgencyNote}</p>
      </header>

      <div className="readout__body">
        <section aria-label={symptom.causesHeading}>
          <h4 className="readout__h">{symptom.causesHeading}</h4>
          <ol className="causes">
            {symptom.causes.map((c) => (
              <li key={c.title}>
                <strong>{c.title}</strong>
                <span>{c.detail}</span>
              </li>
            ))}
          </ol>
          <p className="readout__checks">
            <strong>What we check:</strong> {symptom.checks}
          </p>
        </section>

        <aside className="match" aria-label="Matching service">
          <h4 className="readout__h">Matching service</h4>
          <p className="match__name">{service.name}</p>
          <p className="match__price">
            From <strong>{service.from}</strong> <span>({service.fromNote})</span>
          </p>
          <BookLink service={symptom.service} symptom={symptom.bookingNote} className="btn btn--primary">
            Book a {service.short.toLowerCase()} inspection
          </BookLink>
          {also && symptom.alsoRelevant && (
            <p className="match__also">
              <strong>Also relevant: {also.short}.</strong> {symptom.alsoRelevant.note}
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}

export function Diagnostics() {
  const [selected, setSelected] = useState<string | null>(null);
  const groupId = useId();
  const current = symptoms.find((s) => s.id === selected) ?? null;
  const resultRef = useRef<HTMLDivElement>(null);

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
            {symptoms.map((s) => {
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

      <div className="dx__result js-only" ref={resultRef} aria-live="polite" aria-atomic="true" data-testid="dx-result">
        {current ? (
          <Readout symptom={current} headingId={`${groupId}-result-heading`} />
        ) : (
          <div className="readout readout--empty">
            <p className="eyebrow eyebrow--dark">Readout</p>
            <p className="readout__empty-title">Pick a symptom to start.</p>
            <p>
              You will see the likely causes, how urgent it is, what we would check, and the service that fits. It is a
              guide only. We confirm every diagnosis by inspection.
            </p>
          </div>
        )}
      </div>

      <div className="dx__all nojs-only">
        <p className="dx__nojs-note">
          Every symptom and its likely causes are listed below. Turn on JavaScript to pick one at a time.
        </p>
        {symptoms.map((s) => (
          <Readout key={s.id} symptom={s} headingId={`all-${s.id}`} />
        ))}
      </div>
    </div>
  );
}
