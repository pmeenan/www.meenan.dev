# Decision log

Newest first. Every entry: what was decided, why, and what would reopen it.
Existing entries are never edited into a different decision — reversing or
amending one gets a *new* entry that supersedes it (a status-line annotation on
the old entry is fine). Entries that rest on claims about current technology
state must be grounded in current sources or local experiments — not training
knowledge — and note what was checked and when.

**Reading:** scan the D-NNN headings (or grep) and read only the entries your
task touches. Full read is for structural or cross-cutting work.

**Culling:** the log may be periodically pruned — superseded or moot entries
whose context no longer informs anything current are deleted outright; git
history is the archive. D-numbers are never reused.

Format:

```
## D-NNN: Title  (YYYY-MM-DD, status: accepted | proposed | superseded by D-MMM)
Decision / Context / Consequences / Reopen if
```

## D-016: Hero theme art via CSS background-image, not dual `<Image>` tags  (2026-07-18, status: accepted)

**Decision:** The hero renders each theme's art as a CSS `background-image` on a single `.hero-bg` element, scoped by `:global([data-theme="dark"|"light"])`. The optimized webp URLs are produced at build with `astro:assets` `getImage()` and injected into the scoped styles via `define:vars`.

**Context:** The first M2 implementation used two `<Image>` tags (dark + light) swapped with CSS `display:none`, both `loading="eager"`. A `display:none` `<img>` is still downloaded by browsers, so every visitor fetched ~150-185KB of off-theme art they never see (RE-003). Theme is dual-controlled (OS `prefers-color-scheme` plus a manual toggle that writes `data-theme`), which rules out a `<picture media="(prefers-color-scheme...)">` because that ignores the manual override. The pre-paint inline script in `Base.astro` always resolves `data-theme` to `dark` or `light` before first paint, so a `[data-theme]`-scoped `background-image` computes to exactly one URL on the rendered element and only that image is fetched. Measured after the change: a single hero webp is the computed background per theme, verified by an E2E assertion on `getComputedStyle().backgroundImage`.

**Consequences:** Roughly halves hero image transfer (one image instead of two) with no theme flash. Trade-off: drops `<Image>`'s responsive `srcset` for a single 1024px webp, acceptable because the art sits under an 0.88-opacity scrim as a subtle blueprint and the source is only 1024px square. Relies on `sharp` at build time (already a pinned dependency).

**Reopen if:** the hero art becomes prominent/unscrimmed and needs a responsive `srcset` per viewport, or the manual theme toggle is dropped (then `<picture>` + `prefers-color-scheme` becomes viable).

---

## D-015: Playwright runs E2E tests on custom port 4322 to prevent sibling port conflicts  (2026-07-18, status: accepted)

**Decision:** Playwright config is updated to use port `4322` for E2E tests (baseURL and webServer preview port).

**Context:** The default Astro port is `4321`. When sibling projects in the meenan.dev family (such as `webai`) are running local dev servers, Playwright's `reuseExistingServer: !isCI` setting mistakenly connects to the running sibling server instead of spinning up this site's built output, leading to confusing test failures (e.g., asserting the wrong H1 heading text).

**Consequences:** E2E tests are insulated from sibling workspace processes. No manual server shutdown is required before testing.

**Reopen if:** we need to coordinate ports across all local projects systematically.

---

## D-014: Plain rsync deploy — no staging, symlink swap, or rollback  (2026-07-18, status: accepted)

**Decision:** `scripts/deploy.sh` deploys by rsyncing `dist/` directly into the
live docroot `plex:/var/www/meenan.dev/www/` with `--delete` and a guard that
refuses to run when `dist/index.html` is missing (so a failed build can't let
`--delete` wipe the live site). No staging directory, no atomic symlink swap,
no curl smoke check, no rollback, and no `deploy-remote.sh`. This supersedes
the transactional deploy mechanism described in D-002, D-008, and D-012.

**Context:** Owner decision, 2026-07-18. The M1 implementation had grown into a
~410-line two-script transaction (coprocess two-phase commit, `renameat2` via
Python, durable fsync'd state, crash recovery, fault injection) — well beyond
what D-002/D-008/D-012 asked for, and a review found two real bugs in it (an
asset-check `set -e` abort logged as RE-001, plus a prune path-canonicalization
footgun). The owner's other hosted sites deploy with a single rsync (e.g.
waterfall-tools: `rsync -av --delete dist/ plex:/var/www/<site>/`).
www.meenan.dev is a very low-volume personal page on a LAN server, so the
atomicity a symlink swap buys (no mixed-state window mid-sync) and rollback
(git is the recovery path) are both judged not worth the complexity or the bug
surface.

**Consequences:** Deploy is one rsync; `deploy-remote.sh` is deleted and plex
no longer carries release dirs, `.www-previous`, or a deploy lock — `www/` is a
plain directory. A deploy briefly serves a mixed old/new state while rsync
runs; accepted for this site. A broken deploy is fixed by rebuilding from git
and re-running `pnpm deploy`. Avoiding concurrent deploys is the owner's
responsibility (single operator).

**Reopen if:** the site starts taking real traffic, or a deploy's mixed-state
window or the lack of rollback causes an actual problem.

## D-013: Adopt webai's design system with recorded deltas; wordmark and hero direction  (2026-07-18, status: accepted)

**Decision:** The site adopts webai's `Design.md` token system wholesale —
both-theme OKLCH color tokens, typography (Inter Variable + JetBrains Mono
Variable, self-hosted, SIL OFL-1.1), spacing/radius/elevation/motion scales,
and the AA accessibility contract — with the deltas recorded in
[design-brief.md](design-brief.md): System-default theming (not webai's
dark-first), a larger 16px-base landing-page type scale, no mascot (the hero
is a **neon workshop skyline**), neon reserved for hero/card imagery and
status badges instead of charts, and vanilla-JS theme toggle. The wordmark
and page title are **"Patrick Meenan's Project Playground"**; the subheading's
canonical intent (owner, verbatim): "Collection of tools and projects that I
built for fun or for my own use that others may find useful (most, if not
all, with the help of AI)."

**Context:** Owner choices 2026-07-18 (hero motif, wordmark, subheading
tone). webai's Design.md and `src/styles/global.css` were read 2026-07-18:
they contain complete AA-validated token tables for both themes, including
the light-theme accent derivations — so the light theme is a copy, not a
research problem. Hero/card art follows webai's D-018 lesson: opaque
per-theme renders, never naive color-keyed transparency.

**Consequences:** M1 copies token values from webai rather than deriving
them; drift between the two sites' foundations should be deliberate. The
playful name coexists with the family's precise execution rules — the brief
governs where they tension.

**Reopen if:** the owner wants a distinct visual identity from webai, or the
adopted tokens prove wrong for a content-light showcase page.

## D-012: Toolchain: Astro 7 + pnpm + Biome/ESLint + Playwright; no framework, no Tailwind  (2026-07-18, status: accepted; deploy mechanism amended by D-014)

**Decision:** Astro 7.x pinned exact at M1 install (no `^`), static output.
pnpm via corepack, Node 24 LTS (`>=24 <25`). TypeScript strict via
`astro check`. Biome for formatting; ESLint with `eslint-plugin-astro` for
linting (webai's proven split). Playwright for the D-008 smoke test. **No UI
framework integration** (no React) and **no Tailwind** — styling is plain CSS
with semantic custom-property tokens and Astro scoped styles; the JS surface
(sorting, theme toggle) is two small vanilla scripts (D-011). Fonts via
`@fontsource-variable` packages. No Vitest — there is no unit-testable logic
worth a second test runner; the Playwright smoke covers behavior. Deploy: a
simplified version of webai's transactional script — build → rsync to a
staging dir on `plex` → atomic swap into `/var/www/meenan.dev/www/` → curl
smoke check → rollback on failure.

**Context:** Verified 2026-07-18: Astro 7.0 shipped 2026-07-07 (Rust
compiler, Vite 8; github.com/withastro/astro/releases), and the sibling webai
repo pins Astro 7.1.1 / pnpm 11.14.0 / Node 24 / Biome 2.5.4 / ESLint 10 /
Playwright 1.61.1 in production — current, in-family, known-good pins to
start from. webai carries React+Tailwind because it is an app; this site is
one server-rendered page, so both were dropped under the D-001 lightweight
mandate. All named packages are MIT/ISC/OFL-class, satisfying D-003 (webai's
audited dependency set).

**Consequences:** Copying webai configs (biome.json, eslint.config.js,
tsconfig, playwright.config.ts) is the M1 starting point, minus
React/Tailwind pieces. `pnpm check` = format:check + lint + typecheck +
build + smoke. No CI runs it (D-008) — agents run it before handoff.

**Reopen if:** the site grows real component interactivity (revisit a
framework island), or styling at token scale proves unwieldy in plain CSS
(revisit Tailwind).

## D-011: Sorting: vanilla script re-orders server-rendered cards; no persistence  (2026-07-18, status: accepted)

**Decision:** Cards render fully at build time in default newest-first order
(D-009). A small vanilla TypeScript module (a standard Astro `<script>`,
bundled as an ES module) re-orders the existing card DOM nodes in place using
`data-published` (ISO date) and `data-title` (normalized for locale-aware
`localeCompare`) attributes when the sort control changes. No framework, no
island, no hydration. The sort choice is **not persisted** — each visit opens
newest-first; only the theme preference persists (D-010). With JavaScript
disabled, the control is hidden and the default order stands.

**Context:** M0 sorting spike, checked 2026-07-18 against current Astro docs
(docs.astro.build/en/guides/client-side-scripts/): Astro `<script>` tags are
processed/bundled as ES modules by default and plain vanilla JS manipulating
server-rendered DOM is the documented pattern for exactly this class of
interaction — no framework integration required. Persistence was considered
and rejected: newest-first is the owner's chosen presentation, and a
remembered sort adds state for negligible value on a four-card page.

**Consequences:** The sort script and card markup share a small data-attribute
contract — the architecture doc records it. Sorting is trivially covered by
the Playwright smoke test (click "Title", assert order).

**Reopen if:** the catalog grows enough that visitors plausibly return with a
preferred ordering, or filtering (rejected in D-010) is revisited.

## D-010: Page extras, header links, and SEO package; tag filter rejected  (2026-07-18, status: accepted)

**Decision:** In scope: a styled 404 page; a footer (copyright, license note,
"built with" line); a manual light/dark theme toggle (localStorage-persisted)
on top of the automatic `prefers-color-scheme` default; and the full
discoverability package — title/description meta, Open Graph/Twitter card
with a share image, favicon, sitemap.xml, and robots.txt. Header profile
links are: https://github.com/pmeenan, https://blog.patrickmeenan.com,
https://x.com/patmeenan, https://bsky.app/profile/patmeenan.com. A
technology-tag filter for the cards is **rejected** for launch.

**Context:** Owner triage, 2026-07-18. The tag filter is premature with four
projects; revisit if the catalog grows past roughly ten.

**Consequences:** The OG share image joins the AI art pipeline (D-009). The
theme toggle means the site ships a small amount of first-party JS beyond
sorting; the toggle's stored override must win over the media query in both
directions.

**Reopen if:** the catalog grows enough that filtering earns its place, or a
profile link changes.

## D-009: Project catalog content: four launch projects, AI-generated card art and blurbs, status badges, newest-first default  (2026-07-18, status: accepted)

**Decision:** Project entries live in the repo as a typed Astro content
collection; each card shows an AI-generated image and short blurb (generated
per project from its blog-post images and graphic assets), a status badge from
a fixed set (Launched / Beta / In-Development), and optional links (site,
GitHub, blog post). Cards default to newest-first by publish date; images are
served through the Astro asset pipeline (responsive, modern formats). The
launch catalog, as provided by the owner:

| Project | Created | Status | Site | GitHub | Blog post | Local assets |
| --- | --- | --- | --- | --- | --- | --- |
| Waterfall-Tools | 2026-04-12 | Launched | https://waterfall-tools.com/ | https://github.com/pmeenan/waterfall-tools | https://blog.patrickmeenan.com/2026/04/12/introducing-waterfall-tools/ | `~/src/waterfall-tools/` |
| Golemine | 2026-07-04 | Beta | https://golemine.com | https://github.com/pmeenan/golemine | — | `~/src/golemine/` |
| Parallax-web | 2026-07-11 | In-Development | https://parallax-web.com/ | https://github.com/pmeenan/parallax | https://blog.patrickmeenan.com/2026/07/11/can-i-create-a-aaa-quality-game-with-ai-on-the-web-platform | `~/src/parallax/` |
| webai | 2026-07-18 | In-Development | https://webai.meenan.dev/ | https://github.com/pmeenan/webai | — | `~/src/meenan.dev/webai/` |

**Context:** Owner triage, 2026-07-18 — the catalog data above is verbatim
from the owner. Golemine and webai have no blog post yet, which is why every
card link is optional (D-004). The exact collection schema is drafted in the
M0 architecture task from these fields.

**Consequences:** Adding a project = adding one entry plus generating its
image/blurb. Generated blurbs and images are content like any other — the
owner reviews them before commit. The generation itself is a content-authoring
step, not part of the build.

**Reopen if:** the owner wants hand-written blurbs/photography for some
project, or a status value outside the fixed set is needed.

## D-008: Toolchain: check floor plus a Playwright smoke test; no CI, no license-audit automation  (2026-07-18, status: accepted; deploy mechanism amended by D-014)

**Decision:** The check suite is format + lint + typecheck + build, plus a
minimal Playwright smoke test (page renders, cards present, sorting works,
both themes apply), all run locally before handoff. No GitHub Actions CI and
no license-audit script — D-003 is enforced by convention (check each
dependency's license when adding it). Deploys use a simplified version of
webai's transactional build → rsync → smoke-check script.

**Context:** Owner triage, 2026-07-18, applying the D-001 lightweight mandate.
Offered CI, Playwright, and a license audit; the owner selected only the
Playwright smoke test. Specific tool choices (Astro version, package manager,
formatter/linter) are settled in the M0 toolchain task against current
releases.

**Consequences:** Agents run the checks themselves before declaring work
review-ready (workflow.md) — there is no CI backstop. The smoke test is the
only automated verification of the site's actual behaviors, so it must stay
green and meaningful.

**Reopen if:** manual checks prove unreliable in practice, or the dependency
tree grows enough that hand-checking licenses stops being credible.

## D-007: No client-side analytics; server logs only  (2026-07-18, status: accepted)

**Decision:** The site ships no analytics or telemetry script of any kind.
Visit insight comes from the nginx access logs on the owner's own server
(optionally analyzed with a log tool), which requires nothing on the page.

**Context:** Owner triage, 2026-07-18. Matches the sibling projects'
no-telemetry posture while still giving visit counts, since the owner controls
the host.

**Consequences:** No third-party scripts, no cookies, no consent surface.
Outbound-click data (which card links get used) is not available; accepting
that is part of this decision.

**Reopen if:** the owner wants click-through data that logs can't provide.

## D-006: Design anchored on webai's "Neon horizon"; AI-generated hero art  (2026-07-18, status: accepted)

**Decision:** The visual direction anchors on webai's "Neon horizon"
(`webai/docs/design-brief.md`): near-black indigo canvas, cool
periwinkle-tinted neutrals, a rare electric-cyan accent, with the neon set
reserved for graphics — here, the hero and card imagery rather than chart
data. The hero graphic is AI-generated art, consistent with the card-image
pipeline (D-009). Family design rules carry over: semantic tokens, both
themes AA-verified, quiet chrome, `prefers-reduced-motion` disables
non-essential animation.

**Context:** Owner triage, 2026-07-18, choosing among the family's directions
(Neon horizon, golemine's "Lode", blog-aligned, or a new direction). Neon
horizon fits the "graphical, futuristic, engaging" hero brief and makes the
meenan.dev properties feel like one family. The webai brief was read
2026-07-18; note its palette anchors are dark-theme anchors — this site also
needs a first-class light theme derivation, which webai's M1 token work may
already provide to borrow from.

**Consequences:** The M0 design brief derives from webai's, not from scratch —
reuse its token thinking where possible. Neon stays out of chrome and text;
glow is bounded (hero and imagery only). Hero art must satisfy D-003
licensing (owner-generated AI art does).

**Reopen if:** the owner wants the front door visually distinct from webai, or
the light-theme derivation proves unworkable against the Neon horizon anchors.

## D-005: Automatic dark/light theming; visual style aligned with the meenan.dev family  (2026-07-18, status: accepted)

**Decision:** The site supports automatic dark and light themes driven by
`prefers-color-scheme`, both first-class, at WCAG AA contrast. The visual
style is professional and polished, aligned with the family of the owner's
other projects: golemine (`~/src/golemine`), parallax (`~/src/parallax`),
webai (`~/src/meenan.dev/webai`), and https://blog.patrickmeenan.com. The hero
header is graphical, futuristic, and engaging.

**Context:** Stated by the project owner at kickoff. The sibling repos carry
written design systems (golemine `docs/Design.md` "Lode"; webai
`docs/design-brief.md` "Neon horizon") sharing conventions: semantic
CSS-custom-property tokens, both-themes-always, AA minimum, quiet chrome with
disciplined accent use, `prefers-reduced-motion` respected. Which sibling
anchors this site's palette is deliberately left to the M0 design task
(features.md open question 5).

**Consequences:** Every visual change is built and verified in both themes.
The M0 design task must produce a short design brief before the M1 shell is
styled. "Aligned with the family" means reading the sibling design docs, not
inventing a new language.

**Reopen if:** the owner picks a direction that breaks from the family, or the
site grows needs (e.g., a manual theme toggle) that change the theming model.

## D-004: Single landing page: header, profile links, hero, subheading, sortable project cards  (2026-07-18, status: accepted)

**Decision:** The site is, for now, a single landing page containing: a header
with links to the owner's GitHub, blog, Twitter/X, and Bluesky profiles; a
graphical hero header with a short subheading describing the site; and a grid
of project cards (image, short description, links to project website, GitHub
repo, and blog post), sortable by publish date and title.

**Context:** Stated by the project owner at kickoff ("for now at least, it is
going to be a single landing page"). Exact profile URLs and the initial
project list are M0 open questions (features.md 1 and 2).

**Consequences:** No routing, no detail pages, no multi-page navigation.
Client JavaScript exists to serve sorting (and any theme handling) — nothing
else without a new decision. The page must remain readable with JS disabled.

**Reopen if:** the owner wants project detail pages, additional pages, or
per-project content beyond a card.

## D-003: Apache-2.0 license; permissive-only dependencies and assets  (2026-07-18, status: accepted)

**Decision:** The repository is licensed Apache-2.0. All dependencies and
bundled assets (fonts, artwork) must carry permissive, non-viral licenses:
MIT/BSD/Apache/ISC/zlib-class code, SIL OFL-class fonts. No GPL/AGPL or other
viral copyleft anywhere; no copyleft-licensed content copied into the site.

**Context:** The owner committed the Apache-2.0 LICENSE in the repo's initial
commit (2026-07-18, verified in git history). The permissive-dependency policy
mirrors the owner's sibling repos (webai, golemine), which state the same bar;
for a static site every dependency and asset is distributed to visitors, so
license compatibility is a shipping concern, not a formality. Whether the
policy gets automated enforcement (a license audit script/CI) is part of the
M0 toolchain decision (features.md open question 6).

**Consequences:** Check the license of every new dependency, font, and piece
of artwork before adding it — including hero/card imagery (features.md open
question 7).

**Reopen if:** the owner changes the repo license or wants an exception for a
specific asset.

## D-002: Static Astro site, rsync-deployed to www.meenan.dev  (2026-07-18, status: accepted; deploy mechanism amended by D-014)

**Decision:** The site is built with Astro as a fully static site (SSG) and
deployed by rsync to `plex:/var/www/meenan.dev/www/`, served at
https://www.meenan.dev/. No server-side application code, no backend APIs, no
accounts.

**Context:** Stated by the project owner at kickoff. The owner's webai project
uses the same stack and host (rsync to `plex:/var/www/meenan.dev/webai/`) with
a working transactional deploy script (`webai/scripts/deploy.sh`, verified
present 2026-07-18) that can be simplified for this site rather than
re-derived. Astro version and toolchain details are settled in M0 against
current releases.

**Consequences:** Everything must work as static files. Dynamic behavior is
client-side only. The server config is under the owner's control if headers
ever matter, but nothing should assume special headers.

**Reopen if:** the site needs server-side behavior, or hosting moves.

## D-001: AI-developed, human-directed workflow — lightweight variant  (2026-07-18, status: accepted)

**Decision:** The repo follows the owner's standard AI-directed workflow —
agents implement and review from project documentation; the human directs,
decides, and is the sole committer (agents never commit) — but in a
deliberately **lightweight variant**: no mandatory multi-agent review fan-out
and no heavy-duty app scaffolding. A single careful review pass with an
adversarial self-challenge is the default review; the subagent team structure
is reserved for genuinely large or risky changes.

**Context:** Stated by the project owner at kickoff: "We don't need the full
subagent review process and heavy-duty app scaffolding since it's just a
simple static website." The full process is documented in the sibling repos;
[workflow.md](workflow.md) here carries the same modes with the lightweight
adjustments called out at the top.

**Consequences:** Process weight stays proportional to a one-page site. The
non-negotiables survive intact: human-only commits, docs move with code,
decisions and findings get logged, verification before handoff.

**Reopen if:** the project grows enough (multiple pages, real interactivity)
that change risk justifies the full review structure.
