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

---

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

## D-002: Static Astro site, rsync-deployed to www.meenan.dev  (2026-07-18, status: accepted)

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
