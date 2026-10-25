# Slate Piston — OFF/SHIFT concept 02

**An OFF/SHIFT concept — fictional demonstration.** Slate Piston is an invented independent automotive workshop in Welshpool, Perth. This repo holds the concept website. It is not a real business, it was not built for a client, and nothing here has been sold or delivered.

- Concept page: https://offshiftstudio.com.au/concepts/slate-piston
- Planned demo URL (not configured): slate-piston.offshiftstudio.com.au

## What it is

A Next.js (App Router, TypeScript) site, statically generated and built for Cloudflare Workers with OpenNext (`@opennextjs/cloudflare`). The goal of the design is to get service and repair bookings.

Pages:

- `/` hero, services, **diagnostics panel**, how a job works, pricing guide, demo booking form, hours and location, footer
- `/pricing` the full pricing guide: how quotes work, every price by service, what moves the price
- `robots.txt` (`Disallow: /`) and a branded 404

Signature interaction: the diagnostics panel. Pick a symptom, see the likely causes, the urgency, what the workshop would check and the matching service, then jump to the booking form with the service and symptom already filled in. Without JavaScript, every symptom is listed in full instead.

## Hard rules built in

- Concept label on every page, linking to the OFF/SHIFT concept page
- `noindex, nofollow` in the meta robots tag, in an `X-Robots-Tag` header (`next.config.ts`) and in `robots.txt`
- The booking form is demo-only. It validates in the browser, shows a success state that says it is a demo, has no `action`, and makes no network request
- No analytics or trackers, and no third-party requests. Fonts are self-hosted
- All imagery is original SVG/CSS. See `ASSETS.md`

## Develop

```bash
npm ci
npm run dev         # http://localhost:3000
npm run build && npm run start
npm run lint && npm run typecheck
npm run test        # vitest (data and palette contrast) + Playwright (pages, noindex, label, form)
npm run lhci        # Lighthouse CI, mobile (needs a built app and Chrome)
npm run cf:build    # OpenNext build for Cloudflare Workers. Does not deploy.
```

Playwright needs a browser once: `npx playwright install chromium`. Screenshots in `docs/screens` are produced with `node scripts/screenshots.mjs` against a running server.

## Deployment

Not deployed, and no domain is configured. `wrangler.jsonc` names the worker `concept-slate-piston` so a deploy is one step away when OFF/SHIFT decides to publish the concept.

## Design notes

Palette: graphite `#141719`, slate `#343C42`, off-white `#F0F1EF`, signal orange `#F07836`, steel `#737D83`. Contrast is checked in `tests/data.test.ts`. Orange is used as text only on graphite, and on light surfaces a darker orange (`#B8470F`) carries accents. Steel `#737D83` is kept for borders and decorative lines. Two lighter and darker steel tints carry small text on dark and light surfaces.

Fonts: Space Grotesk (display) and IBM Plex Sans (body).


## Visual redesign

The homepage uses a blue workshop shopfront, a bespoke vehicle elevation, a symptom-led entry point and open service rows. The charcoal/orange dashboard and repeated service-card panels have been replaced. Existing booking prefill, validation and no-network demo behaviour are retained.
