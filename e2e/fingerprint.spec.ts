import { expect, test, type Page } from "@playwright/test";

/**
 * Fingerprint test. Every OFF/SHIFT concept site must read as its own site,
 * so this renders the built pages at phone and desktop width and fails on the
 * things that mark the OFF/SHIFT studio site:
 *
 *   1. numbered list prefixes (01, 02, "1 /")
 *   2. uppercase text with letter-spacing above 0.08em
 *   3. the studio hex colours (#0F1114, #C9B89C, #F4F1EC)
 *   4. full-width 1px rules between rows
 *   5. a dark background paired with a sand accent
 *   6. pill buttons and links (radius of 999px or more)
 *
 * Only an element marked [data-footer-credit] is exempt. Never loosen a
 * threshold here to get green; fix the design instead.
 */

const ROUTES = ["/", "/prices", "/book", "/services/brakes"];
const SIZES = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 800 },
];

type Finding = { rule: string; where: string; detail: string };

async function scan(page: Page): Promise<Finding[]> {
  return page.evaluate(() => {
    const out: { rule: string; where: string; detail: string }[] = [];
    const vw = window.innerWidth;
    const STUDIO_RGB = ["rgb(15, 17, 20)", "rgb(201, 184, 156)", "rgb(244, 241, 236)"];
    const SAND = [201, 184, 156];

    const label = (el: Element) => {
      const cls = typeof (el as HTMLElement).className === "string" ? (el as HTMLElement).className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
    };
    const exempt = (el: Element) => Boolean(el.closest("[data-footer-credit]"));
    const parseRgb = (c: string) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const ownText = (el: Element) =>
      Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent ?? "")
        .join("")
        .replace(/\s+/g, " ")
        .trim();
    const effectiveBg = (el: Element) => {
      let node: Element | null = el;
      while (node) {
        const c = parseRgb(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0.6) return c;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };

    const all = Array.from(document.body.querySelectorAll("*")).filter((el) => !exempt(el) && visible(el));

    for (const el of all) {
      const tag = el.tagName.toLowerCase();
      if (["script", "style", "noscript", "path", "circle", "line", "rect", "svg", "g", "defs", "pattern", "title"].includes(tag)) continue;
      const cs = getComputedStyle(el);
      const text = ownText(el);

      // 1. numbered list prefixes
      if (text && (/^0\d\b/.test(text) || /^\d{1,2}\s*[/.)]\s/.test(text))) {
        out.push({ rule: "numbered-prefix", where: label(el), detail: text.slice(0, 40) });
      }
      if ((tag === "li" || tag === "ol") && /decimal|leading-zero/.test(cs.listStyleType) && tag === "li") {
        out.push({ rule: "numbered-prefix", where: label(el), detail: `list-style ${cs.listStyleType}` });
      }
      for (const pseudo of ["::before", "::after"]) {
        const content = getComputedStyle(el, pseudo).content;
        if (content && content !== "none" && content !== "normal" && (/counter\(/.test(content) || /^["']\s*0\d\b/.test(content))) {
          out.push({ rule: "numbered-prefix", where: `${label(el)}${pseudo}`, detail: content.slice(0, 40) });
        }
      }

      // 2. uppercase with letter-spacing above 0.08em
      if (text && /[A-Za-z]{3}/.test(text)) {
        const fs = parseFloat(cs.fontSize) || 16;
        const ls = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) || 0;
        const isUpper = cs.textTransform === "uppercase" || (text === text.toUpperCase() && /[A-Z]{3}/.test(text));
        if (isUpper && ls / fs > 0.08) {
          out.push({ rule: "tracked-caps", where: label(el), detail: `${text.slice(0, 40)} (${(ls / fs).toFixed(2)}em)` });
        }
      }

      // 3. studio colours in use
      for (const prop of ["color", "backgroundColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "fill", "stroke", "outlineColor"] as const) {
        const v = (cs as unknown as Record<string, string>)[prop];
        if (v && STUDIO_RGB.includes(v)) out.push({ rule: "studio-colour", where: label(el), detail: `${prop} ${v}` });
      }

      // 4. full-width 1px rules
      if (!["input", "select", "textarea", "button", "img", "picture", "video", "canvas", "summary", "details"].includes(tag)) {
        const r = el.getBoundingClientRect();
        if (r.width >= vw * 0.7) {
          const sides = ["Top", "Right", "Bottom", "Left"].map((d) => {
            const w = parseFloat((cs as unknown as Record<string, string>)[`border${d}Width`]);
            const st = (cs as unknown as Record<string, string>)[`border${d}Style`];
            const col = parseRgb((cs as unknown as Record<string, string>)[`border${d}Color`]);
            return w > 0 && st !== "none" && col !== null && col.a > 0.02 ? w : 0;
          });
          const boxed = sides[0] > 0 && sides[1] > 0 && sides[2] > 0 && sides[3] > 0;
          // A rule is a hairline on the top or bottom edge of a wide row, not a box drawn around something.
          if (!boxed && ((sides[0] > 0 && sides[0] <= 1.5) || (sides[2] > 0 && sides[2] <= 1.5))) {
            out.push({ rule: "hairline-rule", where: label(el), detail: `border-top ${sides[0]}px / border-bottom ${sides[2]}px on a ${Math.round(r.width)}px row` });
          }
          if (tag === "hr" || (r.height <= 2 && parseRgb(cs.backgroundColor)?.a)) {
            out.push({ rule: "hairline-rule", where: label(el), detail: `${tag} ${Math.round(r.width)}x${r.height}` });
          }
        }
      }

      // 6. pills
      if (tag === "a" || tag === "button") {
        const r = el.getBoundingClientRect();
        const radii = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius].map((v) =>
          v.endsWith("%") ? (parseFloat(v) / 100) * Math.min(r.width, r.height) : parseFloat(v),
        );
        const max = Math.max(...radii);
        if (max >= 999 || (r.width > r.height * 1.4 && r.height <= 90 && max >= r.height / 2 - 0.5 && max > 0)) {
          out.push({ rule: "pill", where: label(el), detail: `radius ${max}px on ${Math.round(r.width)}x${Math.round(r.height)}` });
        }
      }

      // 5. dark background with a sand accent
      if (text) {
        const fg = parseRgb(cs.color);
        if (fg) {
          const d = Math.hypot(fg.r - SAND[0], fg.g - SAND[1], fg.b - SAND[2]);
          const bg = effectiveBg(el);
          const warm = fg.r > fg.g && fg.g > fg.b && fg.r - fg.b >= 25;
          if (warm && d < 60 && lum(bg) < 0.12) out.push({ rule: "dark-plus-sand", where: label(el), detail: `text ${cs.color} on ${bg.r},${bg.g},${bg.b}` });
        }
      }
    }

    // 3b. the studio hex values anywhere in the shipped stylesheets
    const hexes = /#0f1114|#c9b89c|#f4f1ec|rgb\(\s*15\s*,?\s*17\s*,?\s*20\s*\)|rgb\(\s*201\s*,?\s*184\s*,?\s*156\s*\)|rgb\(\s*244\s*,?\s*241\s*,?\s*236\s*\)/i;
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const css = Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
        const m = css.match(hexes);
        if (m) out.push({ rule: "studio-colour", where: "stylesheet", detail: m[0] });
      } catch {
        /* cross-origin sheet */
      }
    }
    for (const style of Array.from(document.querySelectorAll("style"))) {
      const m = (style.textContent ?? "").match(hexes);
      if (m) out.push({ rule: "studio-colour", where: "inline <style>", detail: m[0] });
    }

    // 5b. a dark page paired with the sand accent: dark surface over a third of the viewport
    const sandText = out.some((f) => f.rule === "dark-plus-sand");
    if (sandText) out.push({ rule: "dark-plus-sand", where: "page", detail: "sand text on a dark surface" });

    return out;
  });
}

for (const size of SIZES) {
  test.describe(`fingerprint at ${size.width}px (${size.name})`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });
    // The repo's Playwright projects only differ in device; run this once, at our own two sizes.

    for (const route of ROUTES) {
      test(`${route} carries no OFF/SHIFT studio fingerprint`, async ({ page }, info) => {
        test.skip(info.project.name !== info.config.projects[0].name, "runs once, in the first project");
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        const findings = await scan(page);
        const seen = new Set<string>();
        const unique = findings.filter((f) => {
          const k = `${f.rule}|${f.where}|${f.detail}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        expect(unique, JSON.stringify(unique.slice(0, 40), null, 2)).toEqual([]);
      });
    }
  });
}
