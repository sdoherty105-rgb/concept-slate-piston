import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = "docs/screens";
mkdirSync(out, { recursive: true });

const sizes = [
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
const pages = [
  { name: "home", path: "/" },
  { name: "pricing", path: "/pricing" },
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
  await page.getByRole("radio", { name: /squeal or grind when braking/i }).check({ force: true });
  await page.locator("#diagnose").screenshot({ path: `${out}/diagnostics-${s.name}.png` });
  await ctx.close();
}
await browser.close();
