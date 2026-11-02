"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONCEPT_LABEL, CONCEPT_URL } from "@/lib/data";
import { workshopStatus } from "@/lib/workshop-time";
import { DaylightToggle } from "./daylight-toggle";

export function StatusBar({ initialIso }: { initialIso: string }) {
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

  const status = workshopStatus(new Date(iso));

  return (
    <header className="status">
      <Link prefetch={false} href="/" className="status__brand">
        <span className="status__name">Slate Piston</span>
        <span className="status__sub">Workshop console</span>
      </Link>
      <div className="status__metrics" aria-label="Demonstration workshop status, Perth time">
        <p>
          <span className="kicker">Bays free</span>
          <strong className="num">{status.freeCount}</strong>
        </p>
        <p>
          <span className="kicker">Next slot</span>
          <strong className="num">{status.nextSlot}</strong>
        </p>
        <p>
          <span className="kicker">Open until</span>
          <strong className="num">{status.openUntil}</strong>
        </p>
      </div>
      <p className="status__demo">Demonstration data</p>
      <DaylightToggle />
      <p className="concept-label" data-testid="concept-label">
        <a href={CONCEPT_URL}>{CONCEPT_LABEL}</a>
      </p>
    </header>
  );
}
