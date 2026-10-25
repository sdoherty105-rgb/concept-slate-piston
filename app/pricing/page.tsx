import Link from "next/link";
import type { Metadata } from "next";
import { BookLink } from "@/components/book-link";
import { PriceTable } from "@/components/price-table";
import { pricing, serviceById, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing guide",
  description:
    "Starting prices for servicing, diagnostics, brakes, suspension and performance work at Slate Piston, a fictional workshop concept by OFF/SHIFT Studio.",
};

const rules = [
  {
    title: "The quote is the price",
    body: "Your quote is itemised, in writing, and held for 7 days. If the job grows, we stop and ask before we spend your money.",
  },
  {
    title: "Labour is a flat rate",
    body: "Labour is $145 per hour, GST included, charged in 15-minute blocks. Fixed-price jobs on this page already include it.",
  },
  {
    title: "Parts are shown, not hidden",
    body: "Parts are quoted line by line at the price we pay plus a stated margin. Ask for the old ones back and we will bag them.",
  },
  {
    title: "Diagnostics are credited",
    body: "If you approve the repair within 7 days of a scan or diagnostic inspection, its fee comes off the repair price.",
  },
];

const moves = [
  "The make, model and age of the car. Some jobs take twice as long on one car as on another.",
  "Part quality. We usually quote a good-value option and a premium one, and tell you the difference.",
  "What the inspection finds. A quoted brake job can grow if a caliper has seized.",
  "Access and rust. Seized bolts take time, and we tell you before the clock starts on them.",
];

export default function PricingPage() {
  return (
    <>
      <section className="page-hero theme-dark" aria-labelledby="pricing-page-title">
        <div className="container">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li>
                <Link prefetch={false} href="/">Home</Link>
              </li>
              <li aria-current="page">Pricing guide</li>
            </ol>
          </nav>
          <p className="eyebrow">Transparent pricing</p>
          <h1 id="pricing-page-title" className="h-display h-display--xl h-display--page">
            Priced in the open.
          </h1>
          <p className="lead">
            Every price below is a starting point for a fictional service, GST included. Here is how we reach the number
            on your quote, and what can move it.
          </p>
          <div className="btn-row">
            <BookLink className="btn btn--primary">Book a service</BookLink>
          </div>
        </div>
      </section>

      <section className="section theme-light" aria-labelledby="rules-title">
        <div className="container">
          <h2 id="rules-title" className="h-display h-display--md">
            How we quote
          </h2>
          <ul className="rule-grid">
            {rules.map((r) => (
              <li key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section theme-dark" aria-labelledby="all-prices-title">
        <div className="container">
          <h2 id="all-prices-title" className="h-display h-display--md">
            Starting prices by service
          </h2>
          {services.map((s) => (
            <div key={s.id} className="price-group">
              <h3>{s.name}</h3>
              <PriceTable rows={pricing.filter((r) => r.category === s.id)} caption={`${serviceById(s.id).name} prices`} />
            </div>
          ))}
        </div>
      </section>

      <section className="section theme-light" aria-labelledby="moves-title">
        <div className="container two-col">
          <div>
            <h2 id="moves-title" className="h-display h-display--md">
              What moves the price
            </h2>
            <ul className="ticks">
              {moves.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="callout">
            <h3>Ready to start?</h3>
            <p>Book an inspection. You get the quote in writing before any work begins.</p>
            <BookLink className="btn btn--primary">Book a service</BookLink>
          </div>
        </div>
      </section>
    </>
  );
}
