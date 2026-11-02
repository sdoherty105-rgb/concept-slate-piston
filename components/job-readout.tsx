"use client";

import Link from "next/link";
import { serviceById, symptomById } from "@/lib/data";
import { parseSlot, workshopStatus } from "@/lib/workshop-time";
import { useBooking } from "./booking-context";

export function JobReadout({ initialIso }: { initialIso: string }) {
  const { prefill } = useBooking();
  const symptom = prefill?.symptomId ? symptomById(prefill.symptomId) : undefined;
  const service = prefill?.service ? serviceById(prefill.service) : symptom ? serviceById(symptom.service) : undefined;
  const slot = prefill?.slot ? parseSlot(prefill.slot) : null;
  const next = workshopStatus(new Date(initialIso));
  const price = service?.from ?? "Idle";
  const cause = symptom?.causes[0]?.title ?? "Not chosen";
  const bay = slot ? `${slot.bay.name}` : next.nextSlot;

  const body = (
    <>
      <p className="ticket__row">
        <span className="kicker">Symptom</span>
        <strong>{prefill?.symptom ?? "Not chosen"}</strong>
      </p>
      <p className="ticket__row">
        <span className="kicker">Likely cause</span>
        <strong>{cause}</strong>
      </p>
      <p className="ticket__row">
        <span className="kicker">From</span>
        <strong className="num">{service ? service.from : "Select a symptom"}</strong>
      </p>
      <p className="ticket__row">
        <span className="kicker">{slot ? "Bay" : "Next free bay"}</span>
        <strong className="num">{bay}</strong>
      </p>
      {slot && (
        <p className="ticket__row">
          <span className="kicker">Day</span>
          <strong className="num">{slot.label}</strong>
        </p>
      )}
      <p className="demo-line">Demonstration job. Prices and bays are not a live booking.</p>
      <Link prefetch={false} href="/book" className="btn-lime">
        Book
      </Link>
    </>
  );

  return (
    <>
      <aside className="dock" aria-label="Job readout">
        <div className="panel dock__panel">
          <div className="panel__bar">
            <h2 className="panel__label">Job</h2>
            <p className="panel__value num">{service ? price : "Idle"}</p>
          </div>
          <div className="panel__body ticket">{body}</div>
        </div>
      </aside>
      <div className="summary-strip">
        <p>
          <span className="kicker">From</span>
          <strong className="num">{service ? price : "No job yet"}</strong>
        </p>
        <Link prefetch={false} href="/book" className="btn-lime">
          Book
        </Link>
      </div>
    </>
  );
}
