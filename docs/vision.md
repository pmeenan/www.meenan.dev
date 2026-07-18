# Vision

## What this is

Patrick Meenan builds developer tools and experiments (golemine, parallax,
WebAI, and more) that today have no single front door — each lives at its own
URL or repo. www.meenan.dev — **"Patrick Meenan's Project Playground"**
(D-013) — is that front door: a single, polished landing page
that catalogs the projects as display cards — image, short description, and
links to the live site, the GitHub repo, and the blog post about it — plus a
graphical hero header, a one-line subheading explaining the site, and links to
Patrick's profiles (GitHub, blog, Twitter/X, Bluesky).

It is deliberately small: a static Astro site, one page, rsync-deployed to the
same host family as its sibling sites. The craft bar is high — professional,
visually engaging, automatic dark/light — but the engineering surface is
intentionally minimal.

## Who it's for

1. **Visitors following a link from Patrick's blog, talks, or social profiles**
   who want to see what he's building and jump to a specific project.
2. **Developers who found one project** (e.g., WebAI) and want to discover the
   rest of the catalog.
3. **Patrick himself** — a low-friction place to add a card when a new project
   ships (edit a content entry, rebuild, rsync).

## Success criteria

- The page loads fast as fully static HTML/CSS with minimal JavaScript: sorting
  and any theme handling are the only interactive behaviors, and the page is
  fully readable with JavaScript disabled (default sort order applies).
- Every project card shows an image, a short description, and working links to
  the project site, GitHub repo, and blog post — with any of the three links
  omittable for projects that lack one.
- Cards can be re-sorted by publish date and by title, client-side, without a
  page reload.
- Automatic dark/light mode follows `prefers-color-scheme`; both themes meet
  WCAG AA contrast (4.5:1 body text, 3:1 large text/UI), verified before launch.
- The visual style reads as part of the same family as golemine, parallax,
  webai, and blog.patrickmeenan.com — polished developer-tool aesthetic, not a
  generic template.
- Adding a new project requires only adding a content entry (plus its image)
  and redeploying — no layout or component changes.

## Non-goals

- **No backend, accounts, or dynamic serving** — it is a static site by
  decision (D-002); anything requiring a server is out.
- **No client-side analytics or third-party scripts** — visit insight comes
  from the server's access logs (D-007).
- **No multi-page content (for now)** — project detail pages, an about page, or
  hosted blog content are out of scope until a decision says otherwise; the
  blog stays at blog.patrickmeenan.com.
- **No CMS** — content lives in the repo as structured entries; editing files
  is the workflow.
- **No heavyweight process or test matrix** — the lightweight workflow variant
  (D-001) is deliberate; process weight must stay proportional to a one-page
  site.
