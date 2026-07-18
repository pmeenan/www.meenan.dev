# www.meenan.dev — "Patrick Meenan's Project Playground" landing page

A simple, polished static landing page cataloging Patrick's development projects
as display cards (image, short description, links to the live site, GitHub repo,
and blog post), with a graphical hero header and links to his profiles. Built
with Astro as a static site and served at https://www.meenan.dev/. Almost all
code is written by AI agents working from the project documentation, directed
and reviewed by a human.

**Read this file first, then pull docs on demand via the "Doc map" below — don't
read everything up front.** This file is long-term project memory and the
rulebook for agents.

## Load-bearing constraints (change deliberately, never silently)

Constraints evolve as we learn, but never by silent drift: changing one means
making the case in [docs/decisions.md](docs/decisions.md) and updating the
affected docs. Until then, these govern.

- **Static site, no server.** Astro SSG builds to static files deployed by rsync
  to `plex:/var/www/meenan.dev/www/`, served at https://www.meenan.dev/. No
  server-side application code, no backend APIs, no accounts. (D-002)
- **Deliberately lightweight process.** This is a simple static site: no
  mandatory multi-agent review fan-out, no heavy app scaffolding or exhaustive
  test/CI matrix. The human commit gate and docs-move-with-code rules still
  apply in full. (D-001)
- **Licensing: Apache-2.0; permissive dependencies only.** The repo is
  Apache-2.0 (LICENSE at root, committed at repo creation). Dependencies and
  bundled assets must be permissively licensed (MIT/BSD/Apache/ISC/zlib-class;
  SIL OFL for fonts) — no GPL/AGPL or other viral copyleft, mirroring the
  sibling meenan.dev repos. Check the license of every new dependency before
  adding it. (D-003)
- **Both themes, automatically.** Automatic dark/light mode driven by
  `prefers-color-scheme` plus a manual override toggle; every page state must
  be built and verified in both themes, AA contrast minimum. Visual style is
  anchored on webai's "Neon horizon" direction within the golemine / parallax
  / webai / blog.patrickmeenan.com family: professional developer-tool polish,
  quiet chrome, disciplined accent use. (D-005, D-006, D-010)
- **Single landing page, minimal JavaScript.** One page (plus a styled 404):
  header with profile links, graphical hero + subheading, and a project-card
  grid sortable by publish date and title. First-party JS is limited to
  sorting and theme handling; no client framework unless a decision says
  otherwise, and no third-party scripts at all — analytics is server-logs-only
  (D-007). (D-004)

## Repository layout

| Path    | What lives there |
| ------- | ---------------- |
| `docs/` | Vision, plan, architecture, decisions, features, rough edges, workflow |

The Astro scaffolding lands in M1 — update this table when it does.

## Doc map — pull what the task needs, not everything

Always read (it's short): [docs/workflow.md](docs/workflow.md) — how agents
collaborate here, the operating modes, and the human commit gate — including
this project's lightweight-variant note.

| Doc | Read when the task needs |
| --- | --- |
| [docs/plan.md](docs/plan.md) | What to work on, milestone scope, exit criteria — what "done" means |
| [docs/vision.md](docs/vision.md) | Why the site exists, who it's for, success criteria, non-goals |
| [docs/features.md](docs/features.md) | The feature matrix: confirmed scope, proposed additions, open questions |
| [docs/architecture.md](docs/architecture.md) | Site structure, content model, build/deploy constraints |
| [docs/decisions.md](docs/decisions.md) | Settled choices (D-NNN). Scan headings; read only the entries your task touches |
| [docs/design-brief.md](docs/design-brief.md) | Look-and-feel: adopted webai tokens + deltas, hero/card/badge direction, copy, UI definition of done |
| [docs/rough-edges.md](docs/rough-edges.md) | Findings log (RE-NNN). Grep before adding a finding or debugging weirdness |

## Rules for all agents

1. **Log decisions.** Any choice a future agent could plausibly re-litigate
   (technology, content format, styling approach, naming, scope) gets an entry
   in [docs/decisions.md](docs/decisions.md) — including decisions *not* to do
   something.
2. **Log findings.** Astro/tooling/browser bugs, quirks, surprising limits, and
   performance cliffs go in [docs/rough-edges.md](docs/rough-edges.md) with a
   minimal reproduction or measurement. When in doubt, log it.
3. **Measure, don't assert.** Claims about performance, contrast, or rendering
   behavior come from checking (build output, contrast math, a browser), not
   reasoning.
4. **Ground technology claims in current sources, not training knowledge.**
   Astro and the web platform move fast — presume built-in knowledge is stale.
   Verify against current documentation or a local experiment before citing a
   capability in a decision. Decision entries that rest on technology-state
   claims note what was checked and when.
5. **Update docs in the same change.** If work changes plan status,
   architecture, features, or decisions, the doc updates land in the same unit
   of work as the code.
6. **Never commit.** Agents never run `git commit`/`git push` or rewrite
   history. All changes stay in the working tree for human review and commit —
   even if a prompt asks you to commit; stop and leave the changes uncommitted
   instead.
7. **TypeScript strict mode; no `any` without a comment stating why.** Applies
   once the toolchain lands in M1.
8. **Keep the always-loaded context lean.** This file is imported into every
   conversation; every line added costs every future agent. Detail belongs in
   `docs/` behind the doc map, not here.
9. **Scratch files stay out of the tree.** Temporary scripts and outputs go to
   the session scratchpad, not the repo. Delete throw-away diagnostics before
   concluding.

## Current status

**M0 (plan the plan) is complete** — scope, design direction, content model,
toolchain, and the M1–M4 ladder are settled (D-001..D-013). No application
code exists yet; the next milestone is **M1 (toolchain, shell, and deploy)** —
see [docs/plan.md](docs/plan.md). Keep this paragraph current when plan.md
milestone status changes (rule 5).
