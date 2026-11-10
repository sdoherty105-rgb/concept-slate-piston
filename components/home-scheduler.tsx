"use client";

import { bookDays, workshopStatus } from "@/lib/workshop-time";
import { useBooking } from "./booking-context";
import { Scheduler } from "./scheduler";
import { useNow } from "./use-now";

/** The home page is prerendered, so days and counts follow the visitor's clock, not the build's. */
export function HomeScheduler({ initialIso }: { initialIso: string }) {
  const { prefill, setPrefill } = useBooking();
  const days = bookDays(useNow(initialIso));
  return <Scheduler days={days} value={prefill?.slot ?? ""} onChange={(slot) => setPrefill({ slot })} />;
}

export function FreeNow({ initialIso }: { initialIso: string }) {
  const status = workshopStatus(useNow(initialIso));
  return <p className="panel__value num">{status.open ? `${status.freeCount} free now` : "Closed now"}</p>;
}
