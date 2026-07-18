# Architecture

**Status: first full draft (M0, 2026-07-18).** Structure is settled at the
level M1 needs; file names below are the intended layout and may shift
mechanically during scaffolding without a decision entry, but structural
changes (new dependencies, new client behaviors, schema changes) need one.

## System shape

A single-page static Astro 7 site (D-002, D-012). Everything renders at build
time; the browser receives HTML, CSS, two small vanilla scripts (theme,
sorting), fonts, and images. No framework runtime, no third-party scripts
(D-007), no server code.

```
astro.config.ts            site: https://www.meenan.dev, output: static
src/
  content.config.ts        projects collection definition (glob loader + zod)
  content/projects/*.json  one entry per project (D-009 catalog)
  pages/
    index.astro            the landing page
    404.astro              styled error page (D-010)
  layouts/Base.astro       <head> (meta/OG/fonts), theme pre-paint script,
                           header, footer
  components/
    Header.astro           wordmark, profile links, theme toggle
    Hero.astro             skyline art + H1 + subheading
    ProjectGrid.astro      sort control + card list
    ProjectCard.astro      image, title, badge, blurb, link row
    ThemeToggle.astro      three-state control + its script
  scripts/sort.ts          card re-ordering (D-011)
  styles/tokens.css        both-theme token set (from webai, D-013 deltas)
  styles/global.css        reset, base typography, layout primitives
  assets/                  hero art (dark/light), card images, OG image
public/
  favicon.svg / .ico, robots.txt, licenses/ (font OFL texts)
scripts/deploy.sh          rsync dist/ into the live docroot (D-014)
tests/smoke.spec.ts        Playwright smoke (D-008)
```

## Content model (D-009)

Defined in `src/content.config.ts` with the content-layer glob loader and a
zod schema (current Astro collections API, checked 2026-07-18). One JSON
entry per project:

```ts
const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published: z.coerce.date(),        // "created" date; drives default sort
      status: z.enum(["launched", "beta", "in-development"]),
      blurb: z.string().max(280),        // AI-generated, owner-reviewed
      image: image(),                    // through the Astro asset pipeline
      imageAlt: z.string().default(""),  // decorative by default
      links: z.object({
        site: z.string().url().optional(),
        github: z.string().url().optional(),
        blog: z.string().url().optional(),
      }),
    }),
});
```

The launch catalog is the four projects in D-009. Adding a project = one JSON
entry + one image; the build fails on schema violations.

## Client behaviors — the only two scripts

**Theme (D-010, D-013):** a head-inline `is:inline` pre-paint script reads
localStorage key `meenan-theme` (`"light" | "dark" | "system"`, anything else
→ system), resolves system via `matchMedia`, and sets `data-theme` +
`color-scheme` on `<html>` before first paint. The toggle control updates
storage and `data-theme`; System tracks media-query changes, explicit choices
don't. All styling branches on `[data-theme]` in CSS only.

**Sorting (D-011):** cards carry `data-published` (ISO 8601) and
`data-title` (lowercased, for `localeCompare`). `sort.ts` listens to the
segmented control and re-appends the card nodes in the chosen order
(newest-first default; title A–Z). Not persisted. The control is rendered
`hidden` and revealed by the script, so a JS-free page shows the default
order with no dead control.

## Styling (D-013)

Semantic CSS custom properties in `tokens.css` — values copied from webai's
`src/styles/global.css` (both themes, AA-validated), with the design-brief
deltas (16px base scale, `--neon-*` naming). Components use Astro scoped
styles consuming tokens; no hardcoded visual values. Fonts self-hosted via
`@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`, with
OFL texts under `public/licenses/`.

## SEO & discoverability (D-010)

`Base.astro` emits title ("Patrick Meenan's Project Playground"), meta
description, canonical URL, and Open Graph/Twitter card tags pointing at a
generated share image in `src/assets/`. `@astrojs/sitemap` (single-URL
sitemap) + static `robots.txt`. Favicon: SVG (theme-aware via
`prefers-color-scheme` inside the SVG) with an ICO fallback.

## Checks & deploy (D-008, D-012, D-014)

`pnpm check` = `format:check` (Biome) + `lint` (ESLint) + `typecheck`
(`astro check`) + `build` + `test:e2e` (Playwright smoke: page renders, four
cards, title-sort re-orders, both themes apply without flash). Run locally
before every handoff — there is no CI.

`scripts/deploy.sh` rsyncs `dist/` straight into the live docroot
`plex:/var/www/meenan.dev/www/` with `--delete` (D-014), matching the other
meenan.dev sites. No staging, symlink swap, or rollback: this is a low-volume
personal page on a LAN host, so git is the recovery path if a deploy goes bad.
A build-missing guard keeps `--delete` from wiping the site. Deploys are
owner-initiated (`pnpm deploy` builds first).

## Open architecture questions

None. The M0 open questions are all resolved (D-011 closed the last one).
New questions get logged in [features.md](features.md) as they arise.
