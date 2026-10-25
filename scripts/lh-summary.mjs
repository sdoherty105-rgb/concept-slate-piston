import { readdirSync, readFileSync, appendFileSync } from "node:fs";

const median = (nums) => {
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const dir = ".lighthouseci";
const byUrl = new Map();
for (const f of readdirSync(dir).filter((n) => n.startsWith("lhr-") && n.endsWith(".json"))) {
  const lhr = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const path = new URL(lhr.finalUrl).pathname;
  const c = lhr.categories;
  const row = {
    perf: c.performance.score * 100,
    a11y: c.accessibility.score * 100,
    bp: c["best-practices"].score * 100,
    lcp: lhr.audits["largest-contentful-paint"].numericValue,
    cls: lhr.audits["cumulative-layout-shift"].numericValue,
    tbt: lhr.audits["total-blocking-time"].numericValue,
  };
  if (!byUrl.has(path)) byUrl.set(path, []);
  byUrl.get(path).push(row);
}

const summary = [...byUrl.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([url, runs]) => ({
    url,
    runs: runs.length,
    perf: Math.round(median(runs.map((r) => r.perf))),
    a11y: Math.round(median(runs.map((r) => r.a11y))),
    bp: Math.round(median(runs.map((r) => r.bp))),
    lcp: Math.round(median(runs.map((r) => r.lcp))),
    cls: median(runs.map((r) => r.cls)).toFixed(3),
    tbt: Math.round(median(runs.map((r) => r.tbt))),
  }));

const lines = [
  "| URL | Runs | Perf (median) | A11y (median) | BP (median) | LCP ms (median) | CLS (median) | TBT ms (median) |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...summary.map(
    (r) =>
      `| ${r.url} | ${r.runs} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.lcp} | ${r.cls} | ${r.tbt} |`,
  ),
];
console.log(lines.join("\n"));
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Lighthouse (mobile, median of runs)\n\n${lines.join("\n")}\n`);
}
