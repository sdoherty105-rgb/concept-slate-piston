import { describe, expect, it } from "vitest";
import { pricing, process, serviceById, services, symptoms } from "../lib/data";

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const c = {
  carbon: "#0B1822",
  panel: "#122433",
  ink: "#E8EDF0",
  lime: "#C6F135",
  amber: "#FFB224",
  field: "#1B3144",
  muted: "#9FB7C8",
  day: "#DDE8EF",
  dayPanel: "#F6FAFC",
  dayInk: "#0B1822",
  dayMuted: "#324A5C",
  dayAmber: "#8A5A00",
  white: "#FFFFFF",
};

describe("content data", () => {
  it("has the five required services", () => {
    expect(services.map((s) => s.id)).toEqual(["logbook", "diagnostics", "brakes", "suspension", "performance"]);
  });

  it("maps every symptom to a real service with causes", () => {
    for (const s of symptoms) {
      expect(() => serviceById(s.service)).not.toThrow();
      const also = s.alsoRelevant;
      if (also) expect(() => serviceById(also.service)).not.toThrow();
      expect(s.causes.length).toBeGreaterThanOrEqual(3);
    }
    expect(symptoms.length).toBeGreaterThanOrEqual(6);
  });

  it("prices every service and has the four process steps", () => {
    for (const s of services) expect(pricing.some((p) => p.category === s.id)).toBe(true);
    expect(process.map((p) => p.title)).toEqual(["Inspect", "Quote", "Approve", "Repair"]);
  });
});

describe("palette contrast (WCAG AA)", () => {
  const text: [string, string, string][] = [
    ["ink on carbon", c.ink, c.carbon],
    ["ink on panel", c.ink, c.panel],
    ["ink on field", c.ink, c.field],
    ["lime on carbon", c.lime, c.carbon],
    ["carbon on lime", c.carbon, c.lime],
    ["amber on carbon", c.amber, c.carbon],
    ["amber on panel", c.amber, c.panel],
    ["muted on carbon", c.muted, c.carbon],
    ["muted on panel", c.muted, c.panel],
    ["day ink on day ground", c.dayInk, c.day],
    ["day ink on day panel", c.dayInk, c.dayPanel],
    ["day ink on white field", c.dayInk, c.white],
    ["day muted on day ground", c.dayMuted, c.day],
    ["day muted on day panel", c.dayMuted, c.dayPanel],
    ["day amber on day ground", c.dayAmber, c.day],
    ["day amber on day panel", c.dayAmber, c.dayPanel],
  ];
  for (const [name, fg, bg] of text) {
    it(`${name} is at least 4.5:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
