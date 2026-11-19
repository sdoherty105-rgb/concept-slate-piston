import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { business } from "@/lib/data";
import { bookDays } from "@/lib/workshop-time";

export const metadata: Metadata = {
  title: "Book a bay",
  description: "Demonstration bay scheduler for a fictional workshop. Nothing is sent. An OFF/SHIFT Studio concept.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; symptom?: string }>;
}) {
  const sp = await searchParams;
  const days = bookDays(new Date());
  return (
    <section className="block" data-layout="bay-grid" aria-labelledby="book-title">
      <p className="kicker">Book</p>
      <h1 id="book-title">Book a bay</h1>
      <p className="lede">
        Choose a free cell, then tell us about the car. This form stays in your browser. Slate Piston is not a real workshop, and the phone number {business.phone} is invented.
      </p>
      <BookingForm days={days} defaultService={sp.service ?? ""} defaultSymptom={sp.symptom ?? ""} />
    </section>
  );
}
