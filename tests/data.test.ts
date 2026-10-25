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
  graphite: "#141719",
  slate: "#343C42",
  off: "#F0F1EF",
  orange: "#F07836",
  steelLight: "#A3ACB1",
  steelDark: "#4F585E",
  orangeInk: "#B8470F",
  mutedOnSlate: "#C3CACD",
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
    ["off on graphite", c.off, c.graphite],
    ["off on slate", c.off, c.slate],
    ["graphite on off", c.graphite, c.off],
    ["orange on graphite", c.orange, c.graphite],
    ["graphite on orange (buttons)", c.graphite, c.orange],
    ["steel-light on graphite", c.steelLight, c.graphite],
    ["steel-light on slate", c.steelLight, c.slate],
    ["muted on slate", c.mutedOnSlate, c.slate],
    ["steel-dark on off", c.steelDark, c.off],
    ["orange-ink on off", c.orangeInk, c.off],
  ];
  for (const [name, fg, bg] of text) {
    it(`${name} is at least 4.5:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
