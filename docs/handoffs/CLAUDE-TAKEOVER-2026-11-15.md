# Claude Code takeover: Slate Piston (concept-slate-piston) — 15 Nov 2026

> Handoff written by **Grok Bot "Chief"** (OFF/SHIFT coordinator) on 15 Nov 2026, about 10:25 PM AWST (UTC+8), under Stephen Doherty's owner directive on [offshift-studio Issue #84, comment 6895682139](https://github.com/sdoherty105-rgb/offshift-studio/issues/84#issuecomment-6895682139) and his chat instruction t499u (10:11 PM AWST, 15 Nov 2026).
> This file is documentation only. No design, code or tests were changed by this handoff commit.
> Where there is no direct evidence, this file says **UNKNOWN / NOT ACCESSIBLE**.

## 1. Repository, PR, branch and current owner

| Item | Value |
|---|---|
| Repo | [sdoherty105-rgb/concept-slate-piston](https://github.com/sdoherty105-rgb/concept-slate-piston) |
| Draft PR | [#3](https://github.com/sdoherty105-rgb/concept-slate-piston/pull/3) — `Redesign Slate Piston as a workshop console` (draft, open) |
| Base | `main` |
| Branch | `redesign/2026-11` (existing; keep using it) |
| Verified code head (before this file) | `dbe5b6896a10f412a7d96eedf455a498d34b88a1` — "Give the concept-label and enquiry links a 24px target." (committed 10 Nov 2026, 10:12 PM AWST) |
| Directive's last-seen SHA | `dbe5b6896a10f412a7d96eedf455a498d34b88a1` — **matches** the verified head (re-checked with `gh api repos/sdoherty105-rgb/concept-slate-piston/branches/redesign/2026-11` at ~10:15 PM AWST) |
| Branch tip after this handoff | the docs-only commit that adds this file (parent = `dbe5b68`) |
| CI on the code head | **Green** — [run 42831907125](https://github.com/sdoherty105-rgb/concept-slate-piston/actions/runs/42831907125) (pull_request) and [run 42831894474](https://github.com/sdoherty105-rgb/concept-slate-piston/actions/runs/42831894474) (push), 10 Nov 2026 ~10:13 PM AWST, both success (jobs: Build and test, Lighthouse CI (mobile)). |
| Live deployed SHA / version | **UNKNOWN / NOT VERIFIED TODAY** as a Git SHA. Cloudflare Worker `concept-slate-piston` active version `ef2b5816-087f-4702-9292-f41dfd3a1967`, manual `wrangler` deploy, 25 Oct 2026 ~10:27 PM AWST. README (10 Nov) says live = `main` `effcddc` (pre-redesign). |
| Previous implementation owner | Cursor cloud agent `bc-b8e635db-8b62-5189-8ada-b6a73f8bdd3a` (run #3) |
| Previous owner status | **STOPPED — status `error`** (Chief, CloudAgent status check ~10:12 PM AWST 15 Nov). No run is active. Its final run started ~9:45 PM AWST, read files only, and errored before making any edit. Cursor usage is exhausted; Stephen said **do not restart it and do not enable on-demand usage**. |
| New implementation owner | **Claude Code — pending takeover.** One implementation owner at a time (see section 7). |

### Deploy-trigger check (done before pushing this file)
- `.github/workflows/ci.yml` (the only workflow on this branch) triggers on `push` to any branch and `pull_request`. It contains **no deploy step**: the OpenNext job only builds the Worker bundle (`opennextjs-cloudflare build`), and there is no `wrangler deploy` / `versions upload` anywhere in the workflow. `package.json` has no deploy script.
- `wrangler.jsonc`: Worker name `concept-slate-piston`, no routes or secrets in the file.
- Cloudflare (read-only API check by Chief, 15 Nov 2026 ~10:20 PM AWST): the Worker `concept-slate-piston` has **no Workers Builds (Git) triggers**. Its active deployment is version `ef2b5816-087f-4702-9292-f41dfd3a1967`, deployed with `wrangler` (manual) on **25 Oct 2026 at about 10:27 PM AWST**. So pushes to any branch of this repo do not build or deploy on Cloudflare.
- Live deployed SHA: **UNKNOWN / NOT VERIFIED TODAY** from Cloudflare (Cloudflare records a version ID, not a Git SHA). The repo README (checked 10 Nov 2026) says the live demo serves **`main` at `effcddc`**, the pre-redesign design, not this branch.
- Decision for this handoff commit: committed straight to `redesign/2026-11` as a fast-forward (one new file only), with `[skip ci]` in the commit message because it is documentation-only. The last code commit's CI result stands (see below). Claude's first real fix push will run CI normally.

## 2. Independent review findings (Phil, Issue #84 quality gate) — copied faithfully

Source: Phil's read-only quality gate, report `/workspace/concept-review/issue84/REPORT.md` on the Grok Bot box (Phil's summary sent 15 Nov 2026 at about 9:41 PM AWST). Tested SHA: **`dbe5b6896a10f412a7d96eedf455a498d34b88a1`** — identical to the verified code head. Method: `npm ci && npm run build`, `next start`, Playwright 1.65.1 (Chromium headless shell) and @axe-core/playwright (wcag2a/2aa/21a/21aa/22aa) at 390, 768 and 1440.

**Verdict: NEEDS SPECIFIC FIXES**

Matrix row from the report:

| Concept | Tested SHA | 390/768/1440 | Centrepiece | Reduced motion | Keyboard/focus | Contrast (axe) | Overflow | Disclosure/mock pricing/noindex | Demo forms | Overall |
|---|---|---|---|---|---|---|---|---|---|---|
| Slate Piston | dbe5b68 | FAIL-minor (390 hotspots overlap) | PASS (6-symptom gauge and job panel) | PASS | FAIL (390 focus hidden under the fixed tabbar) | FAIL (serious label-content-name-mismatch on `.rail__mark`, 1440, all routes; contrast itself is clean) | PASS | PASS | PASS | **NEEDS SPECIFIC FIXES** |

Checks that **passed** on this concept at every route and width (must stay passing): HTTP 200; `x-robots-tag: noindex` header plus meta noindex; fictional disclosure visible in the first viewport; mock prices labelled; skip link first in tab order and working; visible focus ring; no horizontal overflow at 390/768/1440; zero console errors; zero failed requests; demo forms make no non-GET or external requests and say nothing was sent.

### Findings and exact fixes (verbatim from the report)
1. **`components/rail.tsx:71`.** `aria-label="Slate Piston, home"` on the visible "SP" link triggers axe *label-content-name-mismatch* (**serious**) on every route at 1440. Fix: `aria-label="SP, Slate Piston home"`, or drop aria-label and add `<span class="visually-hidden">Slate Piston home</span>`.
2. **Overlapping hotspots at 390.** `app/globals.css` `.hotspot` (line 455, 44px) together with the positions in `components/vehicle-views.tsx` lines 67–74 make hotspots 01/02 and 03/04 overlap. Fix: inside `@media (max-width: 600px)` add `.hotspot { width: 28px; height: 28px; font-size: 11px; }`. The `.hotlist` links already give large targets. *(Severity: FAIL-minor.)*
3. **Focus hidden under the tabbar at 390.** Focused links ("Open no-start inspection", "Open logbook service", "Workshop") end up under the fixed `.tabbar`. Fix: change `app/globals.css:767` to `html { scroll-padding-top: 16px; scroll-padding-bottom: 88px; }` (152px on pages with `.summary-strip`). *(Severity: FAIL, keyboard/focus.)*

### Screenshot evidence
**Phil's captures are on the Grok Bot box, not on GitHub** (box path `/workspace/concept-review/issue84/slate-piston/dbe5b68/`). Files there:
`home-390.png`, `home-768.png`, `home-1440.png` (+ `-reduced` at 390/1440), `prices-390/768/1440.png`, `book-390/768/1440.png`, `services_brakes-390/768/1440.png` (each with `-reduced` variants), `kbd-first-tab-390.png`, `kbd-first-tab-1440.png`, `kbd-tab6-390.png`, `kbd-tab6-1440.png`, `generic.json`, and `journey/`.

Ask the coordinator (Chief) for copies if you need to see them; you can reproduce every finding yourself with the repro steps in section 4.

In-repo captures from the earlier redesign work (pre-dating these findings) are under [`docs/screens/`](https://github.com/sdoherty105-rgb/concept-slate-piston/tree/dbe5b6896a10f412a7d96eedf455a498d34b88a1/docs/screens) at `dbe5b68` (`docs/screens/before/` and `docs/screens/after/`: home, prices, book, brakes, no-start, logbook, warning-light, pull, general, not-found at 390/768/1440).

Not verified by Phil (applies here too): real iPhone/Safari; Lighthouse was not re-run by Phil (CI Lighthouse is the record); live Cloudflare site not checked; 768 got generic captures only (journeys ran at 390 and 1440).

## 3. Status of each fix: FIXED vs IN PROGRESS vs NOT STARTED

Evidence: GitHub branch head (unchanged since the review) and the full Cursor transcript of `bc-b8e635db-8b62-5189-8ada-b6a73f8bdd3a` (copy on the Grok Bot box at `/workspace/cloud-agent-transcripts/bc-b8e635db-8b62-5189-8ada-b6a73f8bdd3a.jsonl`), read from the last prompt mentioning "issue #84 quality gate" to the end.

| # | Fix | Status | Evidence |
|---|---|---|---|
| 1 | `rail.tsx:71` aria-label "SP, Slate Piston home" | **NOT STARTED** | Final run only read `components/rail.tsx`, `components/vehicle-views.tsx`, `app/globals.css` and `e2e/site.spec.ts`, ran `git status` (clean, on `dbe5b68`), and errored. No edit tool call. |
| 2 | `.hotspot` 28px / 11px at ≤600px | **NOT STARTED** | as above |
| 3 | html scroll-padding top 16 / bottom 88 (152 with summary strip) | **NOT STARTED** | as above |

FIXED and committed on GitHub for these findings: **none.**

Notes the Cursor agent recorded while reading (not verified by Chief; check them yourself): the current base rule is `html { … scroll-padding-top: 80px; }` at line 48 and the ≤600px override `html { scroll-padding-top: 16px; }` is at line 767; the summary strip is in the DOM but only shown on mobile, so it planned `html:has(.summary-strip) { scroll-padding-bottom: 152px; }` inside the mobile media query; `e2e/site.spec.ts` ~line 267 expects **zero** `summary-strip` elements before a symptom is picked, so the 152px rule must only apply when the strip is actually rendered/visible.

**Uncommitted Cursor VM/worktree state: UNKNOWN / NOT ACCESSIBLE.** The Cursor VM (`/agent/repos/concept-slate-piston`) cannot be reached, nothing from the final run was committed or pushed (the GitHub head is still `dbe5b68`), and no Cursor agent store for this ID is mounted. Treat any in-VM edits as **lost**; they do **not** exist on GitHub. Redo the work from `dbe5b68`.

## 4. Claude's checklist (smallest approved change set)

- [ ] **S1 Home link name.** `components/rail.tsx:71`: change `aria-label="Slate Piston, home"` to `aria-label="SP, Slate Piston home"` (or remove aria-label and add visually hidden "Slate Piston home" text after "SP").
  - Repro: axe at 1440 on any route → `label-content-name-mismatch` on `.rail__mark`.
  - Accept: axe at 1440 on every route reports no `label-content-name-mismatch`; the link's accessible name starts with "SP"; visible "SP" unchanged. Update any e2e assertion on the old name if one exists.
- [ ] **S2 Hotspots (390).** `app/globals.css`, inside `@media (max-width: 600px)`: `.hotspot { width: 28px; height: 28px; font-size: 11px; }`. Only adjust positions in `components/vehicle-views.tsx` 67–74 if they still collide.
  - Accept: at 390 hotspots 01/02 and 03/04 no longer overlap (bounding boxes do not intersect); desktop hotspots unchanged; `.hotlist` links still work as the large targets.
- [ ] **S3 Focus vs tab bar (390).** `app/globals.css:767`: `html { scroll-padding-top: 16px; scroll-padding-bottom: 88px; }`, and 152px bottom on pages where `.summary-strip` is shown.
  - Accept: at 390, tabbing to "Open no-start inspection", "Open logbook service" and "Workshop" leaves each focused link fully visible above the fixed `.tabbar` (and above the summary strip when shown); the e2e test at ~line 267 still passes.

**Global acceptance for this concept**
- [ ] Only the files listed above change (plus new screenshots under `docs/screens/` and, if needed, a focused test for the fix).
- [ ] Local: `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run cf:build`, `npx playwright test`, `npx lhci autorun` all pass.
- [ ] axe (wcag2a/2aa/21a/21aa/22aa) at 390/768/1440: zero serious/critical violations on every route.
- [ ] GitHub CI on the new head is green on every job: Build and test, Lighthouse CI (mobile).
- [ ] Lighthouse gates unchanged and passing (Performance >= 0.90, Accessibility >= 0.95, Best Practices >= 0.95, LCP <= 2500 ms, CLS <= 0.1, as in `lighthouserc.json`).
- [ ] Screenshots at 390/768/1440 committed under `docs/screens/` and linked in a PR #3 comment that lists the new head SHA and each CI job conclusion by name.
- [ ] PR #3 is still a **draft**; nothing merged or deployed.

**Explicitly out of scope:** console layout, rail, tab bar design, colours, typography, copy, symptom gauge/job panel behaviour, vehicle artwork, Lighthouse thresholds, README deploy text, any other concept.

## 5. Visual direction and must-preserve details

- Approved direction: **"Workshop console"** — dark, app-like diagnostic console. IBM Plex Sans + IBM Plex Mono; palette carbon `#0E1114` / lime `#C6F135` (plus the existing day theme `html[data-theme="day"]`).
- Navigation: vertical rail on desktop, fixed tab bar on phone.
- Centrepiece: 6-symptom gauge and job panel; vehicle views with numbered hotspots plus the `.hotlist` list of large targets.
- 24px minimum targets on concept-label and enquiry links (just added at `dbe5b68`) stay.
- Assets/provenance per `docs/ASSETS.md`.

Rules for every concept:
- Keep `noindex` (the `x-robots-tag: noindex` header **and** the meta robots tag) on every route.
- Keep the fictional-business disclosure visible in the first viewport on every route.
- Keep every form mock-only: no network send (no non-GET or external request), and the success state must keep saying nothing was sent.
- Keep mock/demo price labelling.
- Keep the skip link as the first tab stop, a visible focus ring everywhere, zero console errors, zero failed requests, and no horizontal overflow at 390/768/1440.
- Keep reduced-motion behaviour as it is.
- Keep the Lighthouse CI gates exactly as configured in the repo (`lighthouserc.json`). Do **not** lower any threshold.
- `demoLive` is a flag in the OFF/SHIFT studio site (`sdoherty105-rgb/offshift-studio`), not in this repo. It stays `false`; nothing in this handoff touches it.
- No new creative direction. The approved redesign on `redesign/2026-11` is the direction; only the listed fixes are in scope.

## 6. Safe execution recipe

```bash
# 1. Clone and check out the EXISTING branch (do not create a new one)
git clone https://github.com/sdoherty105-rgb/concept-slate-piston.git
cd concept-slate-piston
git checkout redesign/2026-11
git pull --ff-only origin redesign/2026-11

# 2. Verify you are on the expected code before editing.
#    The branch tip will be the docs-only handoff commit that added THIS file;
#    its parent must be the verified code head dbe5b68.
git log -3 --oneline
git merge-base --is-ancestor dbe5b6896a10f412a7d96eedf455a498d34b88a1 HEAD && echo "OK: dbe5b68 is in history"
git diff --stat dbe5b6896a10f412a7d96eedf455a498d34b88a1 HEAD   # must show ONLY docs/handoffs/CLAUDE-TAKEOVER-2026-11-15.md
# If the tip has moved beyond the handoff commit, STOP and report: someone else is working on it.

# 3. Install and run the repo's own checks (Node 22, as in CI)
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run cf:build                    # build only, does not deploy
npx playwright install --with-deps chromium   # first time only
npx playwright test
npx lhci autorun                    # uses lighthouserc.json
node scripts/lh-summary.mjs
```
Note: CI here runs on **every push**, so each push to `redesign/2026-11` starts CI (build/test/Lighthouse only; it never deploys).
- Screenshots: capture 390, 768 and 1440 (plus the specific repro views below) **before and after** the change and commit them under `docs/screens/` (follow the existing naming in that folder). Attach or link them in PR #3.
- Avoid conflicts: one concept at a time; only you edit this branch while you hold ownership. `git pull --ff-only` before each commit; never force-push.
- Avoid accidental live deployments: CI here never deploys (checked below) and the Cloudflare Worker has no Git build trigger, so pushing to `redesign/2026-11` is safe. Never run `wrangler deploy` / `wrangler versions upload`, and never push to `main`.

## 7. Ownership, handoff time and review gates

- Handoff owner: **Grok Bot "Chief"** (coordinator), 15 Nov 2026, about 10:25 PM AWST (UTC+8).
- Source evidence: GitHub API (branch, PR, workflow runs) at ~10:15 PM AWST; Cloudflare API read-only (Worker deployments, Workers Builds triggers) at ~10:20 PM AWST; Phil's report `/workspace/concept-review/issue84/REPORT.md`; Cursor transcript `/workspace/cloud-agent-transcripts/bc-b8e635db-8b62-5189-8ada-b6a73f8bdd3a.jsonl`; Stephen's directive (Issue #84 comment 6895682139) and chat t499u.
- **One implementation owner at a time.** Cursor ownership is stopped (status `error`, not restarted, will not be restarted). Claude Code becomes the only implementation owner once Stephen hands it this URL. Before coding, Claude confirms: the branch tip is this handoff commit (or its verified successor), no other agent has pushed since, and the PR is still a draft.
- Work on **one concept at a time**.
- After Claude pushes: **independent re-test by Phil** (Issue #84 quality gate, re-run at the new SHA) and **Engineer review**, then **Stephen's explicit acceptance**. Merge and deploy each need Stephen's **separate, explicit approval**. Approval to build is not approval to merge or deploy.

## 8. Prohibitions

- **No merge** of PR #3 or anything else. The PR stays a **draft**.
- **No deployment** of any kind: no `wrangler deploy`, no `wrangler versions upload`, no `npm run cf:preview` against a remote, no dashboard deploys.
- **No enabling `demoLive`** (it stays `false` in offshift-studio) and no edits to the offshift-studio repo from this task.
- **No client or Mandy work** (BAH/BAH2 are protected and out of scope).
- **No credentials or secrets** created, changed, printed or committed. No Cloudflare settings, DNS or Workers Builds changes.
- **No paid Cursor runs**: do not restart or resume the Cursor cloud agents listed above. Cursor usage is exhausted and Stephen said not to restart them or enable on-demand usage.
- **No unrelated refactors**, dependency upgrades, design changes, copy changes, or threshold changes.
- **No force-push, no history rewrite, no branch deletion.** Fast-forward commits only.
- No outreach or contact with anyone outside the repo.
