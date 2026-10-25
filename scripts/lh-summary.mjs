import { readdirSync, readFileSync, appendFileSync } from "node:fs";

const dir = ".lighthouseci";
const rows = [];
for (const f of readdirSync(dir).filter((n) => n.startsWith("lhr-") && n.endsWith(".json"))) {
  const lhr = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const c = lhr.categories;
  rows.push({
    url: new URL(lhr.finalUrl).pathname,
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c["best-practices"].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
    cls: lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3),
    tbt: Math.round(lhr.audits["total-blocking-time"].numericValue),
    seoFails: c.seo.auditRefs.filter((r) => lhr.audits[r.id].score === 0).map((r) => r.id).join(", ") || "none",
  });
}
rows.sort((a, b) => a.url.localeCompare(b.url));
const lines = [
  "| URL | Perf | A11y | Best practices | SEO | LCP ms | CLS | TBT ms | Failing SEO audits |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => `| ${r.url} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | ${r.seoFails} |`),
];
console.log(lines.join("\n"));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Lighthouse (mobile)\n\n${lines.join("\n")}\n`);
