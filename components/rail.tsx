"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";

function Icon({ id }: { id: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" as const };
  if (id === "Diagnose") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" {...common} />
        <path d="M12 12 L16.5 8" {...common} />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (id === "Services") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" {...common} />
        <path d="M8 8h8M8 12h8M8 16h5" {...common} />
      </svg>
    );
  }
  if (id === "Prices") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" {...common} />
        <path d="M15 7v10" {...common} />
      </svg>
    );
  }
  if (id === "Book") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4" width="17" height="16" {...common} />
        <path d="M3.5 9h17M8 4v16M12.5 4v16M17 4v16" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" {...common} />
      <path d="M3 11h18M9 6v13M15 6v13" {...common} />
    </svg>
  );
}

function current(pathname: string, href: string) {
  if (href === "/prices") return pathname === "/prices";
  if (href === "/book") return pathname === "/book";
  if (href === "/#services") return pathname.startsWith("/services");
  if (href === "/#diagnose") return pathname === "/";
  return false;
}

export function Rail() {
  const pathname = usePathname();
  const items = navLinks.map((l) => (
    <li key={l.href}>
      <Link prefetch={false} href={l.href} aria-current={current(pathname, l.href) ? "page" : undefined}>
        <Icon id={l.label} />
        <span>{l.label}</span>
      </Link>
    </li>
  ));
  return (
    <>
      <nav className="rail" aria-label="Primary">
        <Link prefetch={false} href="/" className="rail__mark" aria-label="Slate Piston, home">
          SP
        </Link>
        <ul>{items}</ul>
      </nav>
      <nav className="tabbar" aria-label="Primary">
        <ul>{items}</ul>
      </nav>
    </>
  );
}
