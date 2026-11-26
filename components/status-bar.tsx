"use client";

import Link from "next/link";
import { CONCEPT_LABEL, CONCEPT_URL, STUDIO_CTA, STUDIO_ENQUIRY_URL } from "@/lib/data";
import { workshopStatus } from "@/lib/workshop-time";
import { DaylightToggle } from "./daylight-toggle";
import { useNow } from "./use-now";

export function StatusBar({ initialIso }: { initialIso: string }) {
  const status = workshopStatus(useNow(initialIso));
  const closed = !status.open;

  return (
    <header className="status">
      <Link prefetch={false} href="/" className="status__brand">
        <span className="status__name">Slate Piston</span>
        <span className="status__sub">Workshop console</span>
      </Link>
      <div className="status__metrics" aria-label="Demonstration workshop status, Perth time">
        <p>
          <span className="kicker">{closed ? "Bays tomorrow" : "Bays free"}</span>
          <strong className="num">{status.freeCount}</strong>
        </p>
        <p>
          <span className="kicker">{closed ? "Booking" : "Next slot"}</span>
          <strong className="num">{closed ? "Online" : status.nextSlot}</strong>
        </p>
        <p>
          <span className="kicker">{closed ? "Opens" : "Open until"}</span>
          <strong className="num">{closed ? status.opensAt : status.openUntil}</strong>
        </p>
      </div>
      <p className="status__demo">
        {closed
          ? `Closed now. Opens ${status.opensAt}. Book online for tomorrow.`
          : "Demo data, Perth clock"}
      </p>
      <DaylightToggle />
      <div className="studio">
        <p className="concept-label" data-testid="concept-label">
          <a href={CONCEPT_URL}>{CONCEPT_LABEL}</a>
        </p>
        <a className="studio__cta" href={STUDIO_ENQUIRY_URL} data-testid="studio-cta">
          {STUDIO_CTA}
        </a>
      </div>
    </header>
  );
}
