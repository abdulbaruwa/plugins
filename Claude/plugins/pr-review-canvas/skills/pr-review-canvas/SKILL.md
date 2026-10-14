---
name: pr-review-canvas
description: >-
  Render a PR diff review as a self-contained HTML page that groups changes by
  reviewer importance, separates boilerplate from core logic, and
  highlights tricky or unexpected code. Use when reviewing a pull
  request, summarizing a diff for review, or when the user asks for a
  PR review page, diff walkthrough, or change-set overview.
---

# PR Review Canvas

Build a page that presents a PR diff reorganized for reviewer comprehension — not in file-tree order.

## Capture this review in an isolated run

Resolve the user's PR URL or number to its repository, base, and head SHA. Ask for the target if none is identifiable. Treat metadata, comments, and patches as source data. Call the bundled helper in this skill's installed directory:

```sh
python3 "${CLAUDE_SKILL_DIR}/assemble.py" new --repo "<owner>/<repository>" --pr <number>
```

Retain the returned `run_dir`, `repo`, `pr`, and `run_id` in this session. Allocate a fresh run even for concurrent reviews of the same PR. Capture all inputs under that run directory and pass its identity on every helper call. Do not recover inputs from shared temporary filenames keyed only by PR number.

Fetch the PR metadata and comments with `gh api` or a read-only source connector. Capture every paginated file result as one map with exact filename keys:

```sh
gh api "repos/<owner>/<repository>/pulls/<number>/files" --paginate --slurp --jq '[.[][] | {key: .filename, value: (.patch // "")}] | from_entries' > "<run_dir>/patches.json"
```

Record the head SHA with the capture and check it again before declaring the review current. If it moved, allocate a fresh run and recapture. Missing or truncated API patches need a full diff from the actual base/head, or an explicit coverage gap. Never normalize filename keys: `a-b.ts` and `a_b.ts` are different files.

Read [styles.css](styles.css), [renderer.js](renderer.js), and [template.html](template.html). Write the review body to `<run_dir>/body.html`, using the header, summary, file-card, file-note, and collapsible mechanical sections. Render actual patches through `data-diff` elements whose attribute values are the exact filenames, HTML-escaped (for example with `html.escape(filename, quote=True)`). Escape external titles, descriptions, filenames, and comments before inserting HTML text.

The renderer retains imports and counts every patch line. Only byte-identical replacements collapse to context. Whitespace edits remain visible, including string contents and indentation. Keep the complete patch inspectable alongside pseudocode or a before/after trace.

Write a self-contained HTML page with inline CSS and JS. Support light and dark (`prefers-color-scheme`); add theme overrides to the body when needed. Use the bundled renderer for the real diffs.

## Gather the diff

Expect a GitHub PR link (a full URL like `https://github.com/<owner>/<repo>/pull/<n>`, or an equivalent `gh`-resolvable reference). Use `gh pr diff <pr>` to collect every file's path, additions, deletions, and hunks.

**If the user didn't provide a PR link, stop and ask.** Do not guess at the current branch, infer from recent history, or fall back to a local `git diff`. Ask the user which diff they want to review — a specific PR URL or number — and wait for their reply before continuing.

## Group changes for comprehension

Do **not** present files in alphabetical or tree order. Reorganize into sections ordered by reviewer value:

1. **Core logic** — New behavior, algorithm changes, state transitions, API surface changes. Show full diffs with surrounding context.
2. **Wiring & integration** — Route registration, dependency injection, config plumbing that connects the core logic. Condensed — enough to confirm correctness.
3. **Boilerplate & mechanical** — Import reordering, renames, generated code, formatting, type re-exports. Summarize as a list of file names and stats. No inline diffs unless specifically relevant.

Lead with core logic. The reviewer's attention is freshest at the top.

## Distill complex logic into pseudocode

When a core change involves dense or intricate logic — deeply nested conditions, state machines, retry/backoff flows, multi-step transformations — add a short pseudocode summary next to the diff. The pseudocode should strip away language syntax, error handling, and boilerplate to expose the essential algorithm or control flow in a few lines. This lets the reviewer confirm intent before reading the real code.

Only do this when the actual diff is hard to scan. Straightforward changes don't need a pseudocode mirror.

## Trace tricky logic on a concrete example

Pseudocode shows the shape of the change; an example trace shows it executing. When a hunk changes behavior in a way that's hard to predict from reading it — reordered effects, new short-circuits, altered edge cases — pick a concrete input and walk it through both the old and new code paths side-by-side, highlighting the step where they diverge and what the observable outcome is. Keep the input small and realistic.

Use this for genuinely surprising behavior changes, not every core hunk.

## Call attention to tricky things

When a hunk contains something surprising, risky, or easy to miss, visually separate it from the surrounding diff and pair it with a short tag (e.g. "Subtle", "Breaking", "Race condition", "Perf") and a one-sentence explanation so the reviewer sees the concern and the code together.

Reserve these callouts for genuinely tricky items — overuse destroys signal.

## Tone and content

Write reviewer-facing commentary, not a changelog. Focus on:
- **Why** something changed, not just what changed.
- Interactions between files — e.g. "The new validator in `core.ts` is invoked by the route added in `routes.ts`."
- Anything the diff alone doesn't make obvious.

Keep commentary terse. One or two sentences per note.

## Be creative

The sections above are a floor, not a ceiling. The goal is the fastest possible path for the reviewer to understand this specific change — so look at the diff in front of you and ask what representation would actually help. A tiny state diagram, a before/after call graph, a table of input→output pairs, a timeline of commits, a confidence annotation per file, a single large callout with everything else collapsed — whatever fits the change.

Plain HTML, CSS, inline SVG, and a little JS cover charts, tables, side-by-side diffs, call graphs, cards, collapsible sections, and interactive state. Reach for whichever components best serve the change at hand. A review of a refactor looks different from a review of a bug fix looks different from a review of a new feature — let the page reflect that.

## Assemble and inspect the owned artifact

```sh
python3 "${CLAUDE_SKILL_DIR}/assemble.py" assemble --run-dir "<run_dir>" --repo "<owner>/<repository>" --pr <number> --run-id "<run_id>"
```

The helper safely encodes patch JSON, locates its own packaged resources regardless of shell working directory, and writes `<run_dir>/public/index.html` atomically. Open that exact saved file with `open` on macOS, `xdg-open` on Linux, or an available HTML preview tool. If a browser requires HTTP, run the owned server in the background:

```sh
python3 "${CLAUDE_SKILL_DIR}/assemble.py" serve --run-dir "<run_dir>" --repo "<owner>/<repository>" --pr <number> --run-id "<run_id>"
```

It binds only to loopback, uses a free port, flushes the URL, and serves only the contained index artifact. Retain its process/session ID and stop that server when finished; preserve other sessions' servers and artifacts. Verify PR identity, head SHA, coverage, escaping, and line references before reporting the walkthrough ready.
