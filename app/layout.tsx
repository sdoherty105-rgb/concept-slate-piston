import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BookingProvider } from "@/components/booking-context";
import { Shell } from "@/components/shell";
import "./globals.css";

const label = localFont({
  src: "./fonts/BarlowSemiCondensed-600.woff2",
  weight: "600",
  variable: "--font-label",
  display: "swap",
  preload: false,
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

const mono = localFont({
  src: "./fonts/IBMPlexMono-500.woff2",
  weight: "500",
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

const body = localFont({
  src: [
    { path: "./fonts/IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Slate Piston: workshop console, Welshpool WA",
    template: "%s | Slate Piston",
  },
  description:
    "A fictional independent workshop console. Tell us what the car is doing, read a fixed price band, and choose a demonstration bay. An OFF/SHIFT Studio concept.",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1822",
  colorScheme: "dark",
};

const boot = "document.documentElement.classList.add('js');try{if(localStorage.getItem('slate-theme')==='day')document.documentElement.dataset.theme='day'}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nowIso = new Date().toISOString();
  return (
    <html lang="en-AU" className={`${label.variable} ${mono.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BookingProvider>
          <Shell nowIso={nowIso}>{children}</Shell>
        </BookingProvider>
      </body>
    </html>
  );
}
