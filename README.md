# Slate Piston — OFF/SHIFT concept 03

**An OFF/SHIFT concept — fictional demonstration.** Slate Piston is an invented independent automotive workshop in Welshpool, Perth. This repo holds the concept website. It is not a real business, it was not built for a client, and nothing here has been sold or delivered.

- Concept page: https://offshiftstudio.com.au/concepts/slate-piston
- Demo URL: https://slate-piston.offshiftstudio.com.au (live; see Deployment for which build it serves)

## What it is

A Next.js (App Router, TypeScript) site, statically generated where it can be, and built for Cloudflare Workers with OpenNext (`@opennextjs/cloudflare`). The page is a workshop console: a left rail, a Perth-time status bar, a symptom gauge, and a job readout that follows you.

Pages:

- `/` console, four vehicle views, six specification sheets, price filter, job tracker, bay scheduler, floor plan
- `/services/[slug]` one inspection sheet per job
- `/prices` demonstration price bands
- `/book` bay scheduler plus the demo booking form
- `robots.txt` (`Disallow: /`) and a branded 404

Signature interaction: six plain-language symptoms move a gauge and write the likely cause, the price band and the next free bay. Without JavaScript the six symptoms are links to the matching sheet, and every readout is still on the page. The booking form checks answers in the browser, says it is a demonstration, has no `action`, and makes no network request.

Bay status and the seven-day grid are computed from Australia/Perth. They are labelled as demonstration data. They are not a live diary.

A daylight control switches the console to a light ground. The gauge face stays dark so the lime figures keep their contrast. `prefers-reduced-motion` and `prefers-contrast` are honoured.

## Hard rules built in

- Concept label on every page, in the status bar, linking to the OFF/SHIFT concept page, with a "Want a website like this?" link to https://offshiftstudio.com.au/?concept=slate-piston#contact. The footer repeats both, and so does the demo booking success screen
- `noindex, nofollow` in the meta robots tag, in an `X-Robots-Tag` header (`next.config.ts`) and in `robots.txt`
- The booking form is demo-only
- No analytics or trackers, and no third-party requests. Fonts are self-hosted
- Imagery is original line art plus one generated render. See `docs/ASSETS.md`

## Develop

```bash
npm ci
npm run dev         # http://localhost:3000
npm run build && npm run start
npm run lint && npm run typecheck
npm run test        # vitest + Playwright
npm run lhci        # Lighthouse CI, mobile (needs a built app and Chrome)
npm run cf:build    # OpenNext build for Cloudflare Workers. Does not deploy.
```

Playwright needs a browser once: `npx playwright install chromium`. Screenshots in `docs/screens` are produced with `node scripts/screenshots.mjs` against a running server.

## Deployment

Checked 2026-11-10:

- https://slate-piston.offshiftstudio.com.au is served by the Cloudflare Worker `concept-slate-piston` (see `wrangler.jsonc`). It currently serves the **older `main` design, commit `effcddc`** (PR #2, "blue workshop identity"). The Worker was last deployed on 2026-10-25 at 14:26 UTC, ten minutes after that merge.
- The workshop-console redesign lives on `redesign/2026-11` (draft PR #3) and is **not live yet**.
- Deploys are manual. CI (`.github/workflows/ci.yml`) only lints, tests, builds and runs `npm run cf:build`. It never runs `wrangler deploy`. Pushes to `redesign/2026-11` on 2026-11-02 left the live Worker unchanged.
- To ship the redesign, the owner merges PR #3 and runs `npm run cf:build && npx wrangler deploy` from `main`. Do not deploy from a feature branch.

The site is `noindex, nofollow` (meta, `X-Robots-Tag` and `robots.txt`) and stays that way when live.

## Design notes

Direction 03, the workshop console. Carbon `#0E1114`, panel `#161B20`, readout `#E8EDF0`, signal lime `#C6F135`, amber `#FFB224` for attention with a text label, coolant blue `#4DA3FF` as a secondary gauge arc. Daylight uses `#E4E9ED` and `#0E1114`. Contrast is checked in `tests/data.test.ts`.

Type: Barlow Semi Condensed for labels, IBM Plex Mono for figures, IBM Plex Sans for sentences. Space Grotesk is retired.
