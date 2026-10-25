import { serviceById, urgencyLabel, type Symptom, type Urgency } from "@/lib/data";
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

export function Readout({ symptom }: { symptom: Symptom }) {
  const service = serviceById(symptom.service);
  const also = symptom.alsoRelevant ? serviceById(symptom.alsoRelevant.service) : null;
  const headingId = `readout-${symptom.id}`;
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
