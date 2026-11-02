"use client";

import type { BookDay } from "@/lib/workshop-time";
import { useBooking } from "./booking-context";
import { Scheduler } from "./scheduler";

export function HomeScheduler({ days }: { days: BookDay[] }) {
  const { prefill, setPrefill } = useBooking();
  return <Scheduler days={days} value={prefill?.slot ?? ""} onChange={(slot) => setPrefill({ slot })} />;
}
