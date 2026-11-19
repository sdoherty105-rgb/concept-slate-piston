import Link from "next/link";
import { business, CONCEPT_LABEL, CONCEPT_URL, navLinks, STUDIO_CTA, STUDIO_ENQUIRY_URL } from "@/lib/data";

export function Footer() {
  return (
    <footer className="foot">
      <section className="foot__studio" aria-labelledby="studio-title">
        <div>
          <p className="kicker">A concept by OFF/SHIFT Studio</p>
          <h2 id="studio-title">{STUDIO_CTA}</h2>
          <p>
            Slate Piston is a made-up workshop. The symptom gauge, bay scheduler and booking flow show what OFF/SHIFT can
            build for a real one.
          </p>
        </div>
        <div className="foot__studio-links">
          <a className="btn-lime" href={STUDIO_ENQUIRY_URL}>
            Start a project with OFF/SHIFT
          </a>
          <a className="btn-line" href={CONCEPT_URL}>
            Back to the concept page
          </a>
        </div>
      </section>
      <div className="foot__grid">
        <div>
          <p className="status__name">Slate Piston</p>
          <p className="footer-note">
            Slate Piston is not a real business. Services, prices, bays, the address and the contact details are invented
            for this OFF/SHIFT Studio concept.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="kicker">Console</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link prefetch={false} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="kicker">Workshop</h2>
          <address>
            {business.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <a href={business.phoneHref}>{business.phone}</a>
            <span>{business.email}</span>
          </address>
        </div>
      </div>
      <p className="foot__end">
        <a href={CONCEPT_URL}>{CONCEPT_LABEL}</a>
        <span>
          Concept by{" "}
          <a href="https://offshiftstudio.com.au">OFF/SHIFT Studio</a>
        </span>
      </p>
    </footer>
  );
}
