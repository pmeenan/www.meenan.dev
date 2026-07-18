# Development workflow

How AI agents and the human developer collaborate on this repository. Complements the
root `AGENTS.md` rules (especially: agents never commit).

**Lightweight variant (D-001):** this is a simple static site, and the owner has
deliberately opted out of the heavyweight process used by the larger sibling projects.
The loop, the operating modes, and the human commit gate below apply in full — but the
multi-agent review fan-out described in reviewer mode is *optional* here: a single
careful review pass (plus the adversarial self-challenge) is the default; reserve the
subagent team structure for the rare change that is genuinely large or risky.

## The loop

1. **Initial work** — one agent implements a task in a **clean working tree** (fresh
   from the last human commit). Scope comes from [plan.md](plan.md) checkboxes.
2. **Review passes** — other agents review and iterate on the in-flight changes,
   **one agent at a time** (serial, never parallel — there is one working tree and
   uncommitted state is shared). Each reviewer either improves the change or reports
   findings for the next iteration.
3. **Human gate** — iteration continues until the developer is satisfied; the developer
   commits. Nothing is ever committed by an agent. The human operates at the level of
   direction: managing agents, making product decisions, guiding reviews, and scanning
   changes and results — not reading every line before commit. Line-level review is the
   job of the AI review passes.

## Rules that make the loop work

- **One stream of work at a time.** Don't start unrelated task B while task A's changes
  are uncommitted, and never assume the tree is clean — check `git status` first; if
  there are changes you didn't make, you are probably an iteration/review agent in
  step 2, not the initial agent in step 1.
- **Leave the tree explainable.** Every agent ends its turn with a summary of what
  changed and why, plus what it verified. The next agent (or the human) must be able
  to pick up from the message alone.
- **Scratch files stay out of the tree.** Temporary scripts/outputs go to the session
  scratchpad, not the repo.
- **Docs move with code:** plan checkboxes, decision log, and affected docs are
  updated within the same in-flight change, so the human commit is coherent.
- **Verification before handoff:** the initial agent runs the repo's checks (see the
  README for the check commands once the M1 toolchain lands) before declaring work
  review-ready; reviewers re-run them when the change affects verified behavior.

## Milestone work: tech-lead mode

A prompt like "start work on M2" makes you the **tech lead** for that milestone. That
means:

- **Scope a task-sized unit of work.** Pick the next unblocked plan.md task in
  dependency order and take it whole — a full task is the default unit; a full
  milestone is acceptable when its tasks are tightly coupled. Don't fragment work into
  small chunks to fit a human line-by-line reader (review is AI-led), and don't sprawl
  the working tree across unrelated tasks; the human gate still closes each unit.
- **Delegate deliberately — or don't.** For this project most tasks fit one agent;
  spawn subagents only for well-scoped pieces that benefit from it. The working tree
  is shared: subagents that write must run serially or own disjoint files; parallelize
  freely only for read-only work (research, code reading, verification).
- **You own acceptance.** Review every subagent's output and don't accept it until it
  meets the bar. Acceptance means evidence, not reading: run the checks yourself. A
  subagent reporting success is an assertion, not a measurement.
- **You own the cross-cutting rules.** Decision-log entries, rough-edges findings, docs
  moving with code — delegating work never delegates these.
- **Adversarial self-review before handoff.** When you believe the unit is complete,
  review the full working-tree diff with fresh eyes, briefed to find problems —
  correctness, rule breaches, missing docs — not to summarize or approve. Address
  every finding worth addressing and re-verify.
- **End with the handoff summary** (rule above): what changed and why, what was
  verified and how, what remains open.

## Review passes: reviewer mode

Any prompt requesting a review of uncommitted modifications (e.g., "review the current
changes", "take a look at the changes") triggers **reviewer mode** (step 2 of the
loop). The unit under review is the **entire uncommitted working tree** — the diff
against the last commit plus untracked files — including whether the docs that should
have moved with the change actually did.

- **Do not simply summarize the changes.** Perform an active, critical review looking
  for correctness bugs, logic errors, quality issues, and rule compliance.
- **Read-only by default.** You report; the agent that did the work owns the fixes.
  Don't edit the tree unless the human explicitly asks you to fix directly.
- **One deep read is the default (D-001).** Review the diff yourself, then challenge
  your own findings adversarially: refute the ones that don't hold up and hunt for
  what a piecewise read would miss. Only fan out to a reviewer-subagent team for a
  genuinely large or risky change.
- **Review thoroughly, not just for bugs:** AGENTS.md rule violations, missing
  decision-log or rough-edges entries, both themes verified, and better approaches
  (reported as suggestions, clearly distinct from defects).
- **Verify before you report.** Run the repo checks instead of guessing.
- **Write findings for handback.** The report goes verbatim to the implementing agent,
  who has the tree but not your conversation — each finding must be self-contained:
  location (file:lines), details (what/why/severity), a concrete suggestion phrased as
  a claim to **verify** ("X appears to break Y when Z — verify and fix, or rebut with
  evidence"), ranked most-severe first.
- **A clean review is a valid result.** If nothing survives verification, say so
  plainly — don't manufacture findings to look thorough.

## Findings handback: fix-pass mode

A prompt that hands you review results ("here are the review findings — address them")
makes you the **fix-pass agent**: the findings came from a reviewer, and you now own
the tree.

- **Verify independently before fixing.** Each finding is a claim, not an order.
  Confirm the problem yourself before changing anything.
- **Fix what's confirmed** at the root cause, with docs moving alongside, and re-run
  the relevant checks afterward.
- **Push back where appropriate.** A finding that doesn't survive verification gets a
  rebuttal with concrete evidence, not a grudging fix. "Won't fix" carries the same
  burden of proof as a fix.
- **End with a per-finding disposition:** fixed (what changed, how verified) or
  rebutted (the evidence). Write it self-contained — it goes verbatim to a
  verification pass that has the tree and your report but not your conversation.

## Fix verification: verify-pass mode

Any prompt requesting to check or verify fixes ("verify the fixes") triggers
**verify-pass mode**: evaluate the fix-pass agent's changes and disposition report
against the current working tree.

- **Retrieve the context first.** If the original findings and disposition report
  aren't in the prompt, recover them from session logs; if you can't, ask the human
  rather than guessing.
- **Verify each fix against the tree, not the report.** Run the actual checks.
- **Adjudicate each pushback independently** on the evidence.
- **Read-only by default** — report, don't fix.
- **Report a per-finding verdict:** `fix verified` · `fix incomplete or wrong (with
  evidence)` · `pushback accepted` · `pushback rejected (why the finding stands)`.
  All-positive is a valid result — don't manufacture disputes.

## Updating project favicons

As part of the project catalog maintenance (e.g. when adding new projects in M4 or when external sites change their favicons), the site favicons are scraped directly from their live URLs to ensure visual accuracy and keep local copies.

To update the local favicons in the workspace, run:
```bash
corepack pnpm scrape-favicons
```
This runs the script at `scripts/scrape-favicons.js` which:
1. Crawls each project's live site URL.
2. Locates and extracts the favicon URL from the HTML link tags, supporting relative paths, nested quotes, and inline SVG data URIs.
3. Downloads the icon and automatically optimizes/resizes large raster favicons (like PNG or JPG) down to a compact 32x32 pixel format using `sharp` to keep page load times fast.
4. Overwrites the assets in `src/assets/projects/` and cleans up any old format files.
