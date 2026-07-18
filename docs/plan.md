# Plan

**This is a living document.** Milestones will be re-scoped, re-ordered, split,
or added as planning conversations and findings come in. That churn is
expected; what is *not* allowed is silent change. Scope changes get a
decision-log entry; progress is reflected here by checking boxes and updating
status lines as work lands.

Check a box only when the item is done and verified; partially done items stay
unchecked, optionally with a note.

**Status legend:** `pending` · `in progress` · `done` · `parked`

## M0 — Plan the plan  `done` (2026-07-18)

Goal: turn the initial feature list into a settled vision, feature matrix,
design direction, content model, and milestone ladder.

- [x] Repo scaffolding for the AI-directed workflow (this scaffold).
- [x] Feature triage: owner resolved every `proposed` row and the original
      open questions on 2026-07-18 (D-006..D-010).
- [x] Content model: launch catalog (four projects), entry fields, status
      values, and the AI-generated image/blurb approach settled (D-009);
      collection schema drafted in architecture.md.
- [x] Design direction: Neon horizon anchor with AI hero art (D-006);
      wordmark "Patrick Meenan's Project Playground", neon workshop skyline
      motif, and subheading intent settled with the owner; design brief
      written ([design-brief.md](design-brief.md)), adopting webai's
      AA-validated both-theme tokens with recorded deltas (D-013).
- [x] Sorting spike: vanilla module script re-ordering server-rendered cards
      via data attributes, no persistence — verified against current Astro
      client-script docs (D-011).
- [x] Toolchain decisions: Astro 7 (pinned at install), pnpm/Node 24, Biome
      format + ESLint lint, TS strict, Playwright smoke, no framework/no
      Tailwind, simplified transactional deploy — grounded in current Astro
      releases and webai's production pins (D-012).
- [x] First full draft of architecture.md, including the content collection
      schema.
- [x] Provisional ladder rewritten into M1–M4 below with exit criteria.

**Exit criteria: met 2026-07-18** — all checklist items done; every
features.md `proposed` row resolved and all open questions answered
(D-006..D-013); design brief exists; architecture.md first draft written;
toolchain decided; M1–M4 have scopes and exit criteria.

## M1 — Toolchain, shell, and deploy  `pending`

Goal: a deployed, themed, empty-but-real page — proving the riskiest
substrate (tokens, theming, deploy path) with the smallest real page.

- [ ] Scaffold the Astro 7 project per D-012 (pnpm, exact pins, TS strict,
      Biome + ESLint, Playwright), starting from webai's configs minus
      React/Tailwind. Update the AGENTS.md repository-layout table.
- [ ] `src/styles/tokens.css` from webai's values + design-brief deltas
      (16px base scale, `--neon-*`); fonts self-hosted with OFL texts in
      `public/licenses/`.
- [ ] `Base.astro` layout: head meta, theme pre-paint script, three-state
      theme toggle, header/footer skeleton.
- [ ] Playwright smoke test v1: page renders, both themes apply, toggle
      persists across reload, no pre-paint flash.
- [ ] `scripts/deploy.sh` (stage → swap → curl smoke → rollback) and a first
      placeholder deploy to https://www.meenan.dev/.

**Exit criteria:** `pnpm check` green locally; placeholder page live at
https://www.meenan.dev/ rendering correctly in dark, light, and system with
a working persisted toggle and no theme flash; deploy script rolls back on a
forced smoke failure (tested once); AGENTS.md layout table updated.

## M2 — Landing page structure  `pending`

Goal: the full page minus the cards.

- [ ] Header: wordmark, profile links (D-010 URLs) with inline SVG icons,
      theme toggle placement.
- [ ] Hero: generate the neon workshop skyline art (dark + light opaque
      renders per the design brief), H1, subheading copy for owner review.
- [ ] Footer per the design brief; styled 404 page.
- [ ] Extend the smoke test: header links present, hero renders in both
      themes, 404 served.

**Exit criteria:** page structure live-deployable with owner-approved hero
art and copy in both themes; hero image pair within the ~350 KiB budget; all
four profile links correct; AA spot-checks pass on header/hero/footer text;
smoke green.

## M3 — Project cards  `pending`

Goal: the catalog works end-to-end.

- [ ] Content collection (`content.config.ts` + JSON entries) per the
      architecture schema, seeded with two projects.
- [ ] Generate card image + blurb for those two projects from their local
      assets and blog posts (D-009 pipeline), owner-reviewed.
- [ ] `ProjectCard.astro` (image, title, status badge, blurb, link row) and
      `ProjectGrid.astro` with the sort control.
- [ ] `sort.ts` per D-011; control hidden without JS.
- [ ] Extend the smoke test: card count, title-sort re-orders the grid,
      badge/link presence.

**Exit criteria:** two real cards live with working sort (newest default,
title A–Z) and no reload; page fully readable with JS disabled in default
order; both themes AA on card surfaces; smoke green.

## M4 — Full content, polish, and launch  `pending`

Goal: all four projects, discoverable, accessible, launched.

- [ ] Remaining two project entries with generated images/blurbs,
      owner-reviewed (full D-009 catalog).
- [ ] SEO package: meta description, OG/Twitter tags + generated share image,
      favicon (SVG + ICO), `@astrojs/sitemap`, robots.txt (D-010).
- [ ] Accessibility pass per the design-brief definition of done: keyboard
      path, focus visibility, reduced motion, 200% zoom, narrow viewports,
      forced colors.
- [ ] Final both-theme contrast verification on every surface.
- [ ] Production deploy; verify OG rendering with a card-validator check and
      links from the live page.

**Exit criteria:** all four cards live at https://www.meenan.dev/ with
correct links; SEO meta present and share image renders in a link preview;
accessibility checklist done with issues fixed or logged; full `pnpm check`
green; owner sign-off on the live page.
