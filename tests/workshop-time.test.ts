import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { bookDays, slotTaken, workshopStatus } from "../lib/workshop-time";

describe("Perth workshop clock", () => {
  it("treats a Monday morning as open with two free bays", () => {
    const status = workshopStatus(new Date("2026-11-02T02:00:00Z"));
    expect(status.open).toBe(true);
    expect(status.openUntil).toBe("5:00 pm");
    expect(status.freeCount).toBe(2);
    expect(status.bays.filter((b) => b.state === "Free").map((b) => b.name)).toEqual(["Bay A", "Bay C"]);
  });

  it("closes the board on Sunday and shows tomorrow's bays, not zero", () => {
    const status = workshopStatus(new Date("2026-11-01T02:00:00Z"));
    expect(status.open).toBe(false);
    expect(status.openUntil).toBe("Closed");
    expect(status.freeCount).toBeGreaterThan(0);
    expect(status.nextSlot).toBe("Book online");
    expect(status.opensAt).toBe("7:30 am");
    expect(status.bays.some((b) => b.state === "Free")).toBe(true);
  });

  it("reads as open on a Tuesday at 10 am Perth", () => {
    const status = workshopStatus(new Date("2026-11-10T02:00:00Z"));
    expect(status.open).toBe(true);
    expect(status.freeCount).toBeGreaterThan(0);
  });

  it("reads as closed with friendly fields at 10 pm Perth on a weekday", () => {
    const status = workshopStatus(new Date("2026-11-10T14:00:00Z"));
    expect(status.open).toBe(false);
    expect(status.freeCount).toBeGreaterThan(0);
    expect(status.nextSlot).toBe("Book online");
    expect(status.opensAt).toBe("7:30 am");
  });

  it("offers seven open days and never a Sunday", () => {
    const days = bookDays(new Date("2026-11-01T02:00:00Z"));
    expect(days).toHaveLength(7);
    expect(days.some((d) => d.weekday === "Sun")).toBe(false);
    expect(days[0].iso).toBe("2026-11-02");
  });

  it("drops today from the grid once the workshop has closed for the day", () => {
    // Tuesday 10 Nov 2026, 6:00 pm Perth
    const days = bookDays(new Date("2026-11-10T10:00:00Z"));
    expect(days[0].iso).toBe("2026-11-11");
    // Tuesday 10 Nov 2026, 9:00 am Perth
    expect(bookDays(new Date("2026-11-10T01:00:00Z"))[0].iso).toBe("2026-11-10");
  });

  it("keeps Bay B free in the demonstration grid", () => {
    for (let day = 0; day < 7; day++) expect(slotTaken(day, 1)).toBe(false);
  });
});

describe("console stylesheet guardrails", () => {
  it("has no CSS gradients", () => {
    const css = readFileSync("app/globals.css", "utf8");
    expect(css).not.toMatch(/gradient\(/i);
    expect(css).toContain("--field:");
    expect(css).toContain("color: var(--ink)");
  });
});
