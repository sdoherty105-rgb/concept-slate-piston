"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ServiceId } from "@/lib/data";
import { useBooking } from "./booking-context";

type Props = {
  service?: ServiceId;
  symptom?: string;
  symptomId?: string;
  className?: string;
  children: ReactNode;
};

export function BookLink({ service, symptom, symptomId, className, children }: Props) {
  const { setPrefill } = useBooking();
  return (
    <Link
      prefetch={false}
      href="/book"
      className={className}
      onClick={() => {
        if (service || symptom || symptomId) setPrefill({ service, symptom, symptomId });
      }}
    >
      {children}
    </Link>
  );
}
