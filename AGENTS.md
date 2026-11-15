# AGENTS.md — concept-slate-piston

This repository follows the **canonical OFF/SHIFT agent operating policy**:
**https://github.com/sdoherty105-rgb/offshift-studio/blob/main/AGENTS.md**

Read that policy before doing anything here. If this file and the canonical policy ever disagree, the canonical policy wins. Repo-specific rules may add constraints but never weaken it.

## Core boundary (summary)

1. **Plan first, then wait.** For new or resumed work, write the scope, impacted areas, risks and acceptance tests, report the plan, and **await Stephen's explicit approval before any change**. Prior chats, specs or old PRs are not approval.
2. **No merge or deploy without separate approval.** Approval to build is not approval to merge, deploy, run migrations or production SQL, change configuration or credentials, send outreach, delete branches or close PRs. Each needs Stephen's separate, explicit approval.
3. **Protected work.** Mandy / BAH / BAH2 work and everything underway on 15 November 2026 (homepage mobile motion with 3D desktop, the onboarding portal including offshift-studio PR #65, the enquiry funnel / Ask OFF/SHIFT including related PRs) are protected. Do not touch them without a new, explicit scope approval.
4. **One owner per task.** Never start competing edits in a second agent or worktree. Record handoffs on the GitHub issue/PR, and never paste secrets or client personal data.

## Deployment note

No auto-deploy workflow was found on `main` in this repo (CI only); its Cloudflare Worker is deployed manually. Treat any deploy as a production change.
