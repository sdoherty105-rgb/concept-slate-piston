"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ServiceId } from "@/lib/data";

export type Prefill = { service?: ServiceId; symptom?: string; stamp: number };

type Ctx = {
  prefill: Prefill | null;
  setPrefill: (p: { service?: ServiceId; symptom?: string }) => void;
};

const BookingContext = createContext<Ctx>({ prefill: null, setPrefill: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setState] = useState<Prefill | null>(null);
  const setPrefill = useCallback((p: { service?: ServiceId; symptom?: string }) => {
    setState({ ...p, stamp: Date.now() });
  }, []);
  const value = useMemo(() => ({ prefill, setPrefill }), [prefill, setPrefill]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);
