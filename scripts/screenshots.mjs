import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = "docs/screens/after";
mkdirSync(out, { recursive: true });

const sizes = [
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
const pages = [
  { name: "home", path: "/" },
  { name: "prices", path: "/prices" },
  { name: "book", path: "/book" },
  { name: "brakes", path: "/services/brakes" },
  { name: "no-start", path: "/services/no-start" },
  { name: "warning-light", path: "/services/warning-light" },
  { name: "pull", path: "/services/pull" },
  { name: "logbook", path: "/services/logbook" },
  { name: "general", path: "/services/general" },
  { name: "not-found", path: "/this-page-does-not-exist" },
];

const browser = await chromium.launch();
for (const s of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 1,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(base + p.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${out}/${p.name}-${s.name}.png`, fullPage: true });
  }
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator(".symptom").filter({ hasText: /squealing when i brake/i }).locator("label").click();
  await page.screenshot({ path: `${out}/home-symptom-${s.name}.png`, fullPage: false });
  await page.getByRole("button", { name: /daylight/i }).click();
  await page.screenshot({ path: `${out}/home-daylight-${s.name}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
