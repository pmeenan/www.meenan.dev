# Design brief — look-and-feel direction (M0)

The M0 design deliverable: the direction the M1 shell is built from. The
binding token values live in webai's `Design.md` (adopted by D-013 with the
deltas below); this brief records what carries over, what differs, and the
page-specific design direction. Where this brief and webai's Design.md
conflict, the deltas here win for this site.

## Intent

**A neon workshop, open for visitors.** The site is "Patrick Meenan's Project
Playground" — the front door to a collection of tools and projects built for
fun or personal use (most with the help of AI) that others may find useful.
It shares webai's "Neon horizon" DNA — near-black indigo, cool neutrals,
disciplined electric accents — but where webai is a measurement instrument,
this page is a *showcase*: slightly warmer in voice, slightly bolder with the
neon, still professional and polished. Playful in name and imagery, precise
in execution.

## Foundation: adopt webai's design system (D-013)

webai's `Design.md` provides complete, AA-validated OKLCH token tables for
**both** themes (verified 2026-07-18 — contrast ratios documented per pairing,
including the light-theme accent derivations that the original brief warned
about). Adopt wholesale:

- **Color tokens** — the full semantic set (`--bg`, `--surface`,
  `--surface-raised`, text tiers, borders, `--accent` electric cyan family,
  focus ring, selection, status colors + soft variants) in both themes, from
  `webai/src/styles/global.css`. Copy the values; do not re-derive.
- **Data/neon palette** (`--chart-*` cyan/blue/violet/magenta/green/amber) —
  renamed `--neon-*` here, since this site has no charts. Usage rules below.
- **Typography** — Inter Variable (UI) + JetBrains Mono Variable (data),
  self-hosted via fontsource, both SIL OFL-1.1. Weights 400/500/600, 700 for
  display type.
- **Spacing, radius, elevation, motion tokens** — webai's scales verbatim
  (controls 6px radius, cards 8px; surface steps before shadows; 80–320ms
  durations, compositor-safe properties only).
- **Accessibility contract** — AA split rule (4.5:1 all text including labels;
  3:1 large text and non-text indicators), keyboard path, visible focus
  (2px `--focus-ring` + offset), `prefers-reduced-motion` removes
  non-essential animation, forced-colors usable, 200% zoom works.

## Deltas from webai (the load-bearing differences)

1. **System-default theming.** First visit follows `prefers-color-scheme`
   (owner: "automatic dark/light" — D-005). webai's dark-first default does
   *not* carry over. The toggle is three-state Light / System / Dark,
   localStorage key `meenan-theme`, resolved by a head-inline pre-paint script
   that sets `data-theme` and `color-scheme` before first paint; invalid or
   missing storage resolves to System. Implemented in vanilla JS (no Radix —
   this site ships no framework, D-011/D-012): a labelled segmented control
   or cycle button with a visible state.
2. **Landing-page type scale.** webai's data-dense 14px base is wrong for a
   showcase page. Base body text is **16px/24** here; the rest of the scale
   shifts up accordingly (blurbs 16px, card titles ~20–24px, hero display
   type 40–56px bold). Keep webai's tracking rules (-0.015em headings).
   Prose measure ≤ 72ch.
3. **No mascot.** The hero identity is a **neon workshop skyline** (owner,
   2026-07-18): a futuristic horizon of glowing structures suggesting projects
   under construction — cranes of light, scaffolded neon frames, a workbench
   city. No characters, no logos, no readable signage or UI in the art.
4. **Neon usage.** webai reserves neon for chart data. Here the neon set is
   for the hero art, card imagery accents, and the status badges — still
   never for text, controls, or page chrome. Cyan `--accent` remains rare:
   links, the active sort control, focus. Bounded glow is allowed on the hero
   and card imagery only.
5. **Mono usage.** JetBrains Mono marks project metadata — publish dates and
   status badge labels — as "catalog data." Everything else is Inter.

## Page-specific direction

### Header

Slim sticky-optional bar (static is fine for a one-pager): wordmark left,
profile icon links + theme toggle right. Profile links (GitHub, blog,
Twitter/X, Bluesky — D-010) use inline lucide SVG icons (ISC license, copied
into the repo as static SVG — no icon runtime dependency), `currentColor`,
with accessible names; external links marked `rel="me noopener"`.

### Wordmark & hero copy

- **Wordmark / page title:** "Patrick Meenan's Project Playground" (owner,
  2026-07-18). In the header the wordmark may compress to "Project
  Playground" if the full phrase crowds small viewports; the `<title>` and
  hero H1 carry the full name.
- **Subheading — owner's canonical intent, verbatim:** "Collection of tools
  and projects that I built for fun or for my own use that others may find
  useful (most, if not all, with the help of AI)." Drafted polish (owner
  reviews at M2 commit): *"Tools and projects I built for fun or my own use —
  most of them with the help of AI — that you might find useful too."*
- Voice: first person, factual, warm, sentence case. Energy from the visuals,
  not exclamation marks.

### Hero art

AI-generated neon workshop skyline, produced per theme as **opaque renders**
(webai's hard-won D-018 lesson: glowing artwork color-keyed to transparency
fringes — use opaque per-theme WebP composed on/near the theme background,
presented as a bounded illustration; never naive transparency). Dark and
light variants are separate generations/gradings, not filters. Decorative
(`alt=""`); copy carries the meaning; quiet space reserved for the H1 +
subheading. Target ≤ ~350 KiB for the pair at 2x. Generation masters stay
out of the repo.

### Project cards

- Card = `--surface` on `--bg`, 8px radius, resting shadow, hairline
  `--border`; hover lifts to `--surface-raised` + floating shadow (transform/
  opacity only; disabled under reduced motion).
- Content top-to-bottom: generated image (fixed aspect ratio, ~16:9,
  Astro-optimized), title (Inter 600), status badge, blurb (2–3 lines),
  link row.
- **Status badges** (D-009 value set) map to status tokens: Launched →
  `--success` on `--success-soft`; Beta → `--info` on `--info-soft`;
  In-Development → `--warning` on `--warning-soft`. Text label always (mono,
  compact tracking) — hue is never the sole carrier.
- Link row: up to three labelled icon links — Site, GitHub, Blog post —
  omitted individually when absent. Real `<a>` elements, underline on hover,
  AA contrast, distinguishable focus.
- Card images follow the hero rule: per-theme opaque variants only if the art
  needs it; otherwise one image that sits acceptably on both themes inside
  the card's own surface.

### Sort control

A small labelled segmented control above the grid: "Newest" (default) /
"Title". Active state uses `--accent` (one of its few appearances). Operable
by keyboard, visible focus, announced state (`aria-pressed` or radio
semantics). Without JavaScript the control is hidden and the grid renders in
default newest-first order.

### Footer

Quiet single row: © Patrick Meenan · Apache-2.0 · "Built with Astro, by AI
agents under human direction" (or similar) · no tracking of any kind (D-007).

### 404

Same shell, dimmed hero treatment or none, one line + link home. Minimal.

## What M1 must produce from this brief

`src/styles/tokens.css` (webai values + the deltas above) · fonts wired ·
theme pre-paint script + toggle · base layout with header/footer skeleton ·
both themes AA-spot-checked in a real browser · the UI definition-of-done
below applied to every M2+ surface.

**UI definition of done (per surface):** both themes + System render without
flash or illegible states; AA per the split rule; full keyboard path with
visible focus; reduced motion respected; works at 200% zoom and narrow
viewports; no hardcoded values outside tokens; images have correct alt
semantics (decorative art `alt=""`).
