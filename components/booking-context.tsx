"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ServiceId } from "@/lib/data";

export type Prefill = {
  service?: ServiceId;
  symptom?: string;
  symptomId?: string;
  slot?: string;
  stamp: number;
};

type Patch = Partial<Omit<Prefill, "stamp">>;

type Ctx = {
  prefill: Prefill | null;
  setPrefill: (p: Patch) => void;
};

const BookingContext = createContext<Ctx>({ prefill: null, setPrefill: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setState] = useState<Prefill | null>(null);
  const setPrefill = useCallback((p: Patch) => {
    setState((cur) => ({
      service: p.service ?? cur?.service,
      symptom: p.symptom ?? cur?.symptom,
      symptomId: p.symptomId ?? cur?.symptomId,
      slot: p.slot ?? cur?.slot,
      stamp: Date.now(),
    }));
  }, []);
  const value = useMemo(() => ({ prefill, setPrefill }), [prefill, setPrefill]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);
