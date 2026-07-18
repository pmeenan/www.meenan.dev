# Feature matrix

The scope ledger. Three tiers:

- **Confirmed** — settled scope. Milestone assignment happens in
  [plan.md](plan.md) as the plan firms up.
- **Proposed** — candidate additions awaiting a yes/no from the project owner.
- **Open questions** — things that shape architecture and need an answer
  during M0.

Status legend: `confirmed` · `proposed` · `rejected (D-NNN)`

**2026-07-18 triage:** the owner answered all seven original open questions
and M0 closed the sorting spike (D-011). No open questions remain; new ones
get added here as they arise.

## Page structure

| Feature | Status | Notes |
| --- | --- | --- |
| Single landing page | confirmed | The whole site, for now (D-004) |
| Header with profile links: GitHub, blog, Twitter/X, Bluesky | confirmed | URLs confirmed by owner (D-010): github.com/pmeenan, blog.patrickmeenan.com, x.com/patmeenan, bsky.app/profile/patmeenan.com |
| Graphical hero header — futuristic, engaging | confirmed | AI-generated hero art, Neon horizon direction (D-006) |
| Short subheading explaining what the site is | confirmed | Owner intent recorded verbatim in D-013; polished draft in [design-brief.md](design-brief.md), owner reviews at M2 |
| 404 page | confirmed | One styled error page (D-010) |
| Footer: copyright, license, "built with" note | confirmed | (D-010) |

## Project cards

| Feature | Status | Notes |
| --- | --- | --- |
| Card per project: image, short description | confirmed | Image and blurb AI-generated per project from its blog-post images and graphic assets (D-009) |
| Card links: project website, GitHub repo, blog post | confirmed | Each link optional per project — golemine and webai launch without blog posts (D-009) |
| Status badge: Launched / Beta / In-Development | confirmed | Fixed value set in the schema (D-009) |
| Sortable by publish date and by title | confirmed | Vanilla script re-orders server-rendered cards; default newest-first, not persisted (D-009, D-011) |
| Initial catalog: Waterfall-Tools, Golemine, Parallax-web, webai | confirmed | Full entry data in D-009 |
| Project entries as a typed Astro content collection | confirmed | Adding a project = adding one entry; schema catches missing fields at build time (D-009). Schema details land in the M0 architecture draft |
| Tag/technology filter | rejected (D-010) | Premature at 4 projects; revisit if the catalog grows past ~10 |

## Visual design & accessibility

| Feature | Status | Notes |
| --- | --- | --- |
| Automatic dark/light via `prefers-color-scheme` | confirmed | (D-005) |
| Manual theme override toggle (localStorage-persisted) | confirmed | On top of the automatic default (D-010) |
| Neon horizon design anchor (webai's direction) | confirmed | Near-black indigo canvas, rare electric-cyan accent, neon for hero/graphics (D-006) |
| WCAG AA contrast in both themes | confirmed | Family design rule (D-005) |
| `prefers-reduced-motion` disables non-essential animation | confirmed | Family design rule carried with the Neon horizon anchor (D-006) |
| Optimized responsive images via the Astro asset pipeline | confirmed | Card/hero images dominate page weight (D-009) |

## Delivery & operations

| Feature | Status | Notes |
| --- | --- | --- |
| Static Astro build, rsync deploy to `plex:/var/www/meenan.dev/www/` | confirmed | (D-002) |
| Deploy script: build + rsync + smoke check | confirmed | Simplify webai's `scripts/deploy.sh` transactional pattern (D-002, D-008) |
| SEO/meta: title, description, OG/Twitter card + share image, favicon, sitemap.xml, robots.txt | confirmed | Full package (D-010); OG image produced by the AI art pipeline |
| Checks: format + lint + typecheck + build, plus a Playwright smoke test | confirmed | Smoke test: page renders, cards present, sorting works, both themes apply (D-008) |
| GitHub Actions CI | rejected (D-008) | Checks run manually before handoff; keep the process light |
| License audit script | rejected (D-008) | D-003 enforced by convention: check each dependency's license by hand when adding it |
| Client-side analytics | rejected (D-007) | Server logs only — no analytics script of any kind |

## Open questions

*(none — all M0 questions resolved; see D-006..D-013)*
