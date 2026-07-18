# Plan

**This is a living document.** Milestones will be re-scoped, re-ordered, split,
or added as planning conversations and findings come in. That churn is
expected; what is *not* allowed is silent change. Scope changes get a
decision-log entry; progress is reflected here by checking boxes and updating
status lines as work lands.

Check a box only when the item is done and verified; partially done items stay
unchecked, optionally with a note.

**Status legend:** `pending` · `in progress` · `done` · `parked`

## M0 — Plan the plan  `in progress`

Goal: turn the initial feature list into a settled vision, feature matrix,
design direction, content model, and milestone ladder — through planning
conversations with the project owner plus small spikes where a decision needs
evidence. Proportional to the project: this is a one-page site, so M0 is a
short milestone, not a research program.

- [x] Repo scaffolding for the AI-directed workflow (this scaffold).
- [ ] Feature triage: walk features.md with the owner; promote or reject every
      `proposed` row; answer open questions 1, 4, and 6; record significant
      calls in decisions.md.
- [ ] Content model: settle the project-entry schema and the initial project
      list with the owner (open question 2); collect or identify card images.
- [ ] Design direction: pick the visual anchor within the family (open
      question 5), settle the hero concept and asset approach (open question
      7), and write a short design brief the M1 shell builds from — grounded
      in a current read of the sibling design docs and the blog's styling.
- [ ] Sorting spike: confirm against current Astro docs how sortable
      server-rendered cards are best done with minimal JS (open question 3);
      output is a decision entry, not code.
- [ ] Toolchain decisions: Astro version, package manager, formatter/linter,
      check commands, deploy script approach — verified against current Astro
      releases, not training knowledge. Record in decisions.md.
- [ ] First full draft of architecture.md.
- [ ] Rewrite the provisional ladder below into real milestones with exit
      criteria.

**Exit criteria:** every checklist item above is checked; every `proposed` row
in features.md is resolved **and every features.md open question answered**,
with decision-log entries for the significant calls; the design brief exists;
architecture.md first draft reviewed; toolchain decided; M1+ milestones have
scopes and exit criteria. Nothing on this list is optional — M0 is not done
while any item above remains open.

## Provisional milestone ladder  `pending — to be rewritten in M0`

Ordered by risk: toolchain, deploy path, and the styled shell before content
breadth. Sketch only — do not start work from these entries, and note that they
freely reference `proposed` features.md rows; nothing here pre-empts the M0
triage.

- **M1 — Scaffolding, shell, and deploy.** Astro project with the decided
  toolchain and check commands; base layout with theme tokens (dark/light) per
  the design brief; deploy script; a placeholder page deployed to
  https://www.meenan.dev/ end-to-end. Proves the riskiest substrate (design
  tokens + deploy) with the smallest real page.
- **M2 — Landing page structure.** Header with profile links, hero graphic and
  subheading, footer if confirmed — the full page minus the cards.
- **M3 — Project cards.** Content collection with the settled schema, card
  component with image/description/links, sorting by date and title, seeded
  with 2–3 real projects.
- **M4 — Content, polish, and launch.** Full initial project list with images;
  SEO/meta and any confirmed extras (404, sitemap); accessibility and
  both-theme contrast verification; final deploy and launch check.
