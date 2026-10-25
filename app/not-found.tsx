import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="section theme-dark">
      <div className="container prose-narrow">
        <p className="eyebrow">Error 404</p>
        <h1 className="h-display h-display--md">Nothing on this lift.</h1>
        <p className="lead">The page you wanted is not here. The workshop, the quotes and the booking form are.</p>
        <p>
          <Link prefetch={false} className="btn btn--primary" href="/">
            Back to the workshop
          </Link>
        </p>
      </div>
    </section>
  );
}
