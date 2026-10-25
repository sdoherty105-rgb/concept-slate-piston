import Link from "next/link";
import { business, navLinks } from "@/lib/data";
import { LogoMark } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { BookLink } from "./book-link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link prefetch={false} href="/" className="brand" aria-label={`${business.name}, home`}>
          <LogoMark />
          <span className="brand__text">
            <span className="brand__name">SLATE PISTON</span>
            <span className="brand__sub">Independent workshop</span>
          </span>
        </Link>
        <nav aria-label="Main" className="desktop-nav">
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link prefetch={false} href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <BookLink className="btn btn--primary btn--small">Book a service</BookLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
