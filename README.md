# www.meenan.dev

**Patrick Meenan's Project Playground** — the landing page for
[www.meenan.dev](https://www.meenan.dev/): a catalog of Patrick's development
projects as display cards (image, short description, and links to each
project's website, GitHub repo, and blog post), sortable by publish date and
title, with links to Patrick's profiles.

Key properties:

- **Static Astro site** — no server code; built and rsync-deployed as plain
  static files.
- **Single landing page** with a graphical hero header and a project-card grid.
- **Automatic dark/light mode** via `prefers-color-scheme`, styled to match
  the family of sibling projects (golemine, parallax, WebAI, and
  [blog.patrickmeenan.com](https://blog.patrickmeenan.com)).

Features beyond that confirmed scope are being triaged — see
[docs/features.md](docs/features.md) for what is proposed versus settled.

Almost all code is written by AI agents working from the project
documentation, directed and reviewed by a human. Licensed under
[Apache-2.0](LICENSE).

## Status

**Pre-code; planning complete (M0 done).** Scope, design direction, content
model, toolchain, and milestones are settled; no application code exists yet.
Next up: M1 — toolchain, shell, and first deploy. See
[docs/plan.md](docs/plan.md).

## Start here

- [AGENTS.md](AGENTS.md) — the agent rulebook and doc map
- [docs/vision.md](docs/vision.md) — why this exists and what success means
- [docs/features.md](docs/features.md) — confirmed scope, proposals, open questions
- [docs/plan.md](docs/plan.md) — milestones and current status
- [docs/workflow.md](docs/workflow.md) — how agents and the human collaborate
- [docs/rough-edges.md](docs/rough-edges.md) — findings log
