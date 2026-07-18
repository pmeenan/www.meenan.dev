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

---

## RE-001: Bash command substitution assignments with set -e and pipefail abort when rg matches nothing  (2026-07-18, status: worked-around)
Environment: GNU bash 5.x, ripgrep 13.0.0+ / Repro: Running `set -eo pipefail; asset_path=$(rg "pattern" file | sed -n "1p")` with a file not matching "pattern" causes bash to exit immediately with status 1. / Observed: Under `pipefail`, the pipeline `rg ... | sed ...` takes the exit code of `rg` (which is 1 on no matches). In bash, if a command substitution assignment fails, and `set -e` is active, it raises an error and terminates the script before the variable value can be guarded. / Expected: The command substitution should complete and assign an empty string to the variable so it can be handled by standard conditional logic. / Impact: Relied-upon sanity checks in deploy scripts will fail and trigger rollbacks on healthy releases when assets are inline and no external stylesheet/javascript matches `rg` patterns. / Update (2026-07-18, D-014): the deploy.sh asset check that motivated this was removed when the deploy became a plain rsync; kept as a general bash gotcha. / Links: None
