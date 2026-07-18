# Rough edges — findings log

Astro, web-platform, tooling, and hosting bugs, quirks, surprising limits,
performance cliffs, and missing capabilities encountered while building
www.meenan.dev. Evidence-backed findings are a project output, not a side
effect.

**Before adding:** grep for the API/library involved to avoid duplicates.
**Before debugging weirdness:** check here first — it may be known.

Every entry needs: environment (versions, OS, browser where relevant), a
minimal reproduction or measurement, and observed vs. expected behavior.

Format:

```
## RE-NNN: Title  (YYYY-MM-DD, status: open | fixed-upstream | worked-around | wontfix)
Environment / Repro or measurement / Observed / Expected / Impact / Links
```

Newest first. RE-numbers are never reused.

## RE-003: `display:none` `<img>` (and `astro:assets` `<Image>`) still downloads; no runtime theme selection  (2026-07-18, status: worked-around)
Environment: Astro 7.1.1, Chromium / Firefox / Repro: Two `<Image>` tags (dark + light hero art) toggled with CSS `display:none`, both `loading="eager"`. / Observed: The built HTML ships both `<img loading="eager">` tags and browsers fetch the off-theme image too (a `display:none` `<img>` is still downloaded), so ~2x the hero art loads and the hidden theme competes with LCP. `astro:assets` `<Image>` resolves at build time and can't select a theme at runtime, and the manual `data-theme` toggle rules out `<picture media="(prefers-color-scheme...)">`. / Expected: Only the visible theme's image downloads. / Impact: ~150-185KB of wasted eager transfer per page load. / Workaround: Render the per-theme art as a `[data-theme]`-scoped CSS `background-image` built with `getImage()`, so only the computed background is fetched (D-016). / Links: None

---

## RE-002: Playwright tests reuse sibling dev server on default port 4321  (2026-07-18, status: worked-around)
Environment: Astro 7.x, Playwright 1.61.x, sibling repos (`webai`) / Repro: Running `pnpm check` locally when a sibling project's dev server is running on `127.0.0.1:4321`. / Observed: Playwright E2E checks run against the sibling project's content instead of building and running this project's local code. This happens because of `reuseExistingServer: true` on the default port. / Expected: The E2E tests should build and run against this project's own codebase. / Impact: Misleading test failures. / Workaround: Configured Playwright E2E suite to run on port `4322` via `--port 4322` in the preview server command (D-015).

---

## RE-001: Bash command substitution assignments with set -e and pipefail abort when rg matches nothing  (2026-07-18, status: worked-around)
Environment: GNU bash 5.x, ripgrep 13.0.0+ / Repro: Running `set -eo pipefail; asset_path=$(rg "pattern" file | sed -n "1p")` with a file not matching "pattern" causes bash to exit immediately with status 1. / Observed: Under `pipefail`, the pipeline `rg ... | sed ...` takes the exit code of `rg` (which is 1 on no matches). In bash, if a command substitution assignment fails, and `set -e` is active, it raises an error and terminates the script before the variable value can be guarded. / Expected: The command substitution should complete and assign an empty string to the variable so it can be handled by standard conditional logic. / Impact: Relied-upon sanity checks in deploy scripts will fail and trigger rollbacks on healthy releases when assets are inline and no external stylesheet/javascript matches `rg` patterns. / Update (2026-07-18, D-014): the deploy.sh asset check that motivated this was removed when the deploy became a plain rsync; kept as a general bash gotcha. / Links: None
