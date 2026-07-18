# Feature matrix

The scope ledger for the M0 planning conversations. Three tiers:

- **Confirmed** — stated project scope. Milestone assignment happens in
  [plan.md](plan.md) as the plan firms up.
- **Proposed** — candidate additions awaiting a yes/no from the project owner.
- **Open questions** — things that shape architecture and need an answer
  during M0.

Status legend: `confirmed` · `proposed` · `rejected (D-NNN)`

## Page structure

| Feature | Status | Notes |
| --- | --- | --- |
| Single landing page | confirmed | The whole site, for now (D-004) |
| Header with profile links: GitHub, blog, Twitter/X, Bluesky | confirmed | Exact URLs to confirm — open question 1 |
| Graphical hero header — futuristic, engaging | confirmed | Direction settled in the M0 design task; see open question 5 |
| Short subheading explaining what the site is | confirmed | Copy drafted during M0 design task |
| 404 page | proposed | Static hosts serve a default otherwise; one extra styled page is cheap |
| Footer (copyright, license, "built with" note) | proposed | Conventional close for a landing page; keeps header lean |

## Project cards

| Feature | Status | Notes |
| --- | --- | --- |
| Card per project: image, short description | confirmed | |
| Card links: project website, GitHub repo, blog post | confirmed | Each link optional per project — not every project has all three |
| Sortable by publish date and by title | confirmed | Client-side, no reload; default order is open question 3 |
| Project content as an Astro content collection (typed schema) | proposed | Adding a project = adding one entry; schema catches missing fields at build time |
| Project status badge (active / archived / experiment) | proposed | Honest signal for older projects; trivial schema field |
| Tag/technology filter | proposed | Only worth it if the catalog grows past ~10 projects; defer otherwise |

## Visual design & accessibility

| Feature | Status | Notes |
| --- | --- | --- |
| Automatic dark/light via `prefers-color-scheme` | confirmed | (D-005) |
| Style aligned with golemine / parallax / webai / blog family | confirmed | (D-005); which sibling anchors the palette is open question 5 |
| WCAG AA contrast in both themes | confirmed | Follows from the family design rules (D-005) |
| `prefers-reduced-motion` disables non-essential animation | proposed | Family convention (golemine non-negotiable §0.5); hero graphics likely animate |
| Manual theme override toggle (in addition to automatic) | proposed | Automatic is confirmed; a toggle is a common nicety but adds JS + storage |
| Optimized responsive images (Astro assets: modern formats, srcset) | proposed | Card images dominate page weight; Astro does this nearly for free |

## Delivery & operations

| Feature | Status | Notes |
| --- | --- | --- |
| Static Astro build, rsync deploy to `plex:/var/www/meenan.dev/www/` | confirmed | (D-002) |
| Deploy script (build + rsync, with a smoke check) | proposed | Simplify webai's `scripts/deploy.sh` transactional pattern rather than re-derive |
| SEO/meta: title, description, Open Graph/Twitter card, favicon | proposed | The whole point is being found and shared; needs an OG image |
| Sitemap.xml + robots.txt | proposed | One-line Astro integration |
| Analytics | proposed | Owner stance unknown — open question 4; sibling repos are strictly no-telemetry |
| CI checks | proposed | Owner asked for light process; minimal set (or none) is open question 6 |

## Open questions (answer during M0)

1. **What are the exact profile URLs?** GitHub, blog (blog.patrickmeenan.com),
   Twitter/X, and Bluesky handles need confirming with the owner — not guessed.
   *(M0 feature triage)*
2. **What is the content model and initial project list?** Which projects are
   on the page at launch (golemine? parallax? WebAI? WebPageTest-era work?),
   what fields a project entry carries (title, dates, description, image,
   links, status), and where card images come from. This shapes the collection
   schema and the card component. *(M0 content-model task)*
3. **How is sorting implemented and what is the default order?** Minimal
   vanilla JS over server-rendered cards vs. a framework island; default sort
   (newest-first by publish date?); whether the choice persists. Riskiest
   architectural call because it decides whether the site needs a client
   framework at all. *(M0 feature triage + architecture draft)*
4. **Analytics: none, or something privacy-preserving?** Sibling projects are
   strictly no-telemetry; the owner hasn't stated a stance for this site.
   *(M0 feature triage)*
5. **Which visual direction anchors the design?** The family spans webai's
   "Neon horizon" (Tokyo Night + neon), golemine's warm-gold "Lode", and the
   blog's look. "Futuristic, engaging hero" suggests Neon horizon-adjacent,
   but the owner picks. *(M0 design task)*
6. **What is the minimal toolchain?** Owner ruled out heavy scaffolding; the
   floor is probably format/lint/typecheck + build. Are Playwright/Vitest, CI,
   and a license audit wanted at all? *(M0 toolchain decision)*
7. **Hero graphic: what asset, from where?** Illustration vs. generated art vs.
   CSS/SVG composition; licensing of any sourced art must satisfy D-003.
   *(M0 design task)*
