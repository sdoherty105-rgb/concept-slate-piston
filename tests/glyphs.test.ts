import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Decorative / icon glyphs that must not appear in user-facing source (use inline SVG when needed). */
const FORBIDDEN_UNICODE = /[\u2190-\u2193\u21D2\u27A1\u25B6-\u25C0\u2713\u2714\u2605\u2606\u2022\u00B7\u2192\u27F6]/;

const ROOTS = ["app", "components", "lib"];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(tsx|ts|css)$/.test(name)) out.push(path);
  }
  return out;
}

function stripNoise(line: string): string {
  return line.replace(/\/\/.*$/, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

describe("no decorative text glyphs in UI source", () => {
  it("app, components and lib contain no arrow, bullet, tick or star characters", () => {
    const hits: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(root)) {
        const lines = readFileSync(file, "utf8").split("\n");
        lines.forEach((line, i) => {
          const trimmed = stripNoise(line);
          if (trimmed.includes("=>")) return;
          if (FORBIDDEN_UNICODE.test(trimmed)) {
            hits.push(`${file}:${i + 1}: ${trimmed.trim()}`);
          }
          if (/content:\s*["'][^"']*[→←↑↓•·✓★]/.test(trimmed)) {
            hits.push(`${file}:${i + 1}: ${trimmed.trim()}`);
          }
        });
      }
    }
    expect(hits).toEqual([]);
  });
});
