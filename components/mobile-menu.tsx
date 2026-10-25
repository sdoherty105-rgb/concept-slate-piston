"use client";

import Link from "next/link";
import { useRef } from "react";
import { navLinks } from "@/lib/data";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details className="mobile-menu" ref={ref}>
      <summary>
        <span className="mobile-menu__label">Menu</span>
        <span className="mobile-menu__bars" aria-hidden="true" />
      </summary>
      <nav aria-label="Main">
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link prefetch={false} href={l.href} onClick={() => ref.current?.removeAttribute("open")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
