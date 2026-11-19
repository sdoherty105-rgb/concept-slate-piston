import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="block">
      <p className="kicker">404</p>
      <h1>No page at this address</h1>
      <p className="lede">The console, the price bands and the bay scheduler are still here.</p>
      <p>
        <Link className="btn-lime" href="/">
          Back to diagnose
        </Link>
      </p>
    </section>
  );
}
