"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ServiceId } from "@/lib/data";
import { useBooking } from "./booking-context";

type Props = {
  service?: ServiceId;
  symptom?: string;
  className?: string;
  children: ReactNode;
};

export function BookLink({ service, symptom, className, children }: Props) {
  const { setPrefill } = useBooking();
  return (
    <Link
      prefetch={false}
      href="/#book"
      className={className}
      onClick={() => {
        if (service || symptom) setPrefill({ service, symptom });
      }}
    >
      {children}
    </Link>
  );
}
