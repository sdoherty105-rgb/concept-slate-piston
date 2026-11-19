import { serviceById, urgencyLabel, type Symptom } from "@/lib/data";
import { BookLink } from "./book-link";

export function Readout({ symptom, plainLabel }: { symptom: Symptom; plainLabel?: string }) {
  const service = serviceById(symptom.service);
  const also = symptom.alsoRelevant ? serviceById(symptom.alsoRelevant.service) : null;
  const headingId = `readout-${symptom.id}`;
  const label = plainLabel ?? symptom.label;
  return (
    <article className="readout" aria-labelledby={headingId}>
      <header className="readout__head">
        <p className="kicker">Readout</p>
        <h3 id={headingId}>{label}</h3>
        <p className={`band band--${symptom.urgency}`}>
          <span className="band__name">{urgencyLabel[symptom.urgency]}</span>
          <span>{symptom.urgencyNote}</span>
        </p>
      </header>
      <div className="readout__body">
        <section aria-label={symptom.causesHeading}>
          <h4>{symptom.causesHeading}</h4>
          <ul className="causes">
            {symptom.causes.map((c) => (
              <li key={c.title}>
                <strong>{c.title}</strong>
                <span>{c.detail}</span>
              </li>
            ))}
          </ul>
          <p className="readout__checks">
            <strong>What we check. </strong>
            {symptom.checks}
          </p>
        </section>
        <aside className="match" aria-label="Matching service">
          <h4>Matching service</h4>
          <p className="match__name">{service.name}</p>
          <p className="match__price">
            From <strong className="num">{service.from}</strong> <span>({service.fromNote})</span>
          </p>
          <p className="demo-line">Demonstration price band. Not a quote.</p>
          <BookLink service={symptom.service} symptom={symptom.bookingNote} symptomId={symptom.id} className="btn-lime">
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
