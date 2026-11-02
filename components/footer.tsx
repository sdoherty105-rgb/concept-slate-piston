import Link from "next/link";
import { business, CONCEPT_LABEL, CONCEPT_URL, navLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="foot">
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
