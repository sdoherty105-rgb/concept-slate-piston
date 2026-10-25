import Link from "next/link";
import { business, CONCEPT_LABEL, CONCEPT_URL, navLinks } from "@/lib/data";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link prefetch={false} href="/" className="brand" aria-label={`${business.name}, home`}>
            <LogoMark />
            <span className="brand__text">
              <span className="brand__name">SLATE PISTON</span>
              <span className="brand__sub">{business.descriptor}</span>
            </span>
          </Link>
          <p className="footer-note">
            Slate Piston is not a real business. The services, prices, address and contact details on this site are
            invented for demonstration.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="footer-heading">Explore</h2>
          <ul className="footer-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link prefetch={false} href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link prefetch={false} href="/pricing">Full pricing guide</Link>
            </li>
            <li>
              <Link prefetch={false} href="/#book">Book a service</Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="footer-heading">Workshop</h2>
          <address className="footer-address">
            {business.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <a href={business.phoneHref}>{business.phone}</a>
            <span>{business.email}</span>
          </address>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          <a href={CONCEPT_URL} rel="noopener noreferrer">
            {CONCEPT_LABEL}
          </a>
        </p>
        <p>
          Concept design and build by{" "}
          <a href="https://offshiftstudio.com.au" rel="noopener noreferrer">
            OFF/SHIFT Studio
          </a>
          , Perth.
        </p>
      </div>
    </footer>
  );
}
