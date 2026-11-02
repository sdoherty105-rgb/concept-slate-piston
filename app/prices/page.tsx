import type { Metadata } from "next";
import Link from "next/link";
import { PriceBoard } from "@/components/price-board";

export const metadata: Metadata = {
  title: "Price bands",
  description: "Demonstration price bands for a fictional workshop. Not a quote. An OFF/SHIFT Studio concept.",
};

const rules = [
  { title: "The quote is the price", body: "The written quote is itemised and held for 7 days. If the job grows, we stop and ask." },
  { title: "Labour is a flat rate", body: "Labour is $145 an hour, GST included, in 15-minute blocks. Fixed bands on this page already include it." },
  { title: "Parts at cost, on the quote", body: "Parts are listed at the price we pay plus a stated margin. They are not folded into the band on this page." },
  { title: "The scan can come off the repair", body: "Approve the repair within 7 days of a scan and the scan fee comes off the repair price." },
];

export default function PricesPage() {
  return (
    <section className="block" data-layout="price-table" aria-labelledby="prices-page-title">
      <p className="kicker">Prices</p>
      <h1 id="prices-page-title">Fixed price bands</h1>
      <p className="lede">
        Every figure on this page is a demonstration price for a fictional service, GST included. It is not a quote for your car.
      </p>
      <ul className="rule-list">
        {rules.map((rule) => (
          <li key={rule.title}>
            <h2>{rule.title}</h2>
            <p>{rule.body}</p>
          </li>
        ))}
      </ul>
      <PriceBoard variant="grouped" prefix="page-price" />
      <p className="lede">
        <Link href="/book">Book a bay</Link> after you have read the band. The inspection confirms the number.
      </p>
    </section>
  );
}
