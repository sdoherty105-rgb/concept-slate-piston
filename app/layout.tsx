import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BookingProvider } from "@/components/booking-context";
import { ConceptBanner } from "@/components/concept-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const display = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  weight: "400 700",
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const body = localFont({
  src: [
    { path: "./fonts/IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Slate Piston — Independent automotive workshop, Welshpool WA",
    template: "%s | Slate Piston",
  },
  description:
    "Logbook servicing, diagnostics, brakes, suspension and performance work, quoted in writing and explained in plain language. A fictional concept by OFF/SHIFT Studio.",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#141719",
  colorScheme: "dark",
};

const jsFlag = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ConceptBanner />
        <BookingProvider>
          <Header />
          <main id="main">{children}</main>
        </BookingProvider>
        <Footer />
      </body>
    </html>
  );
}
