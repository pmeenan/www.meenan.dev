# Architecture

**Status: skeleton.** The first full draft is an M0 exit criterion; what is
written here now is the load-bearing shape already settled, so drafting can
build on it rather than re-derive it.

## Fixed points (from decisions)

- **Astro static site generation** (D-002). The build output is plain static
  files; there is no server runtime, no backend API, no accounts.
- **Deploy is rsync** to `plex:/var/www/meenan.dev/www/`, served at
  https://www.meenan.dev/ (D-002). The server is the same nginx host family as
  webai.meenan.dev; response headers are configurable at deploy time but
  nothing here is expected to need special headers.
- **One page** (D-004). All content renders on the landing page; the only
  client-side behaviors are card sorting and whatever theme handling the
  design requires.
- **Dark/light theming is automatic** via `prefers-color-scheme`, both themes
  first-class, AA contrast (D-005). The sibling projects implement this with
  semantic CSS custom-property tokens; this site is expected to follow the
  same token approach.
- **Apache-2.0 with permissive-only dependencies and assets** (D-003) — this
  constrains fonts (SIL OFL is fine), any sourced hero/card artwork, and every
  npm dependency.

## Expected shape (to be validated in the M0 draft)

Where a bullet below leans on a `proposed` features.md row, it is a design
assumption to confirm during feature triage, not settled scope.

- **Content model:** each project is an entry in an Astro content collection
  (typed schema — proposed) with roughly: title, publish date, short
  description, image, optional links (site, GitHub, blog post), and possibly a
  status field. The card grid renders from the collection at build time.
- **Sorting:** cards are fully server-rendered; a small vanilla script re-sorts
  the existing DOM nodes by `data-` attributes (date, title). No client
  framework expected — the M0 sorting spike confirms this (features.md open
  question 3).
- **Styling:** semantic design tokens as CSS custom properties with a
  `prefers-color-scheme` media query switching the theme, mirroring the
  sibling repos' approach; whether Tailwind sits on top follows the M0
  toolchain decision.
- **Images:** card images live in the repo and go through Astro's asset
  pipeline for modern formats and responsive sizes (proposed).
- **Deploy:** a simplified version of webai's `scripts/deploy.sh` (build →
  rsync → smoke-check, proposed), pointed at the `www` directory.

## Open architecture questions

See [features.md](features.md) open questions — 2 (content model), 3 (sorting
implementation), 6 (toolchain), and 7 (hero asset) are the architecture-shaping
ones. No purely technical questions beyond those yet.
