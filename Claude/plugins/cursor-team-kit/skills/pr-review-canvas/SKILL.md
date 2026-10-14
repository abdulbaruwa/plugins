---
name: pr-review-canvas
disable-model-invocation: true
description: Generate an interactive PR review walkthrough as an HTML page. Fetches PR data via gh API, categorizes files into core vs mechanical changes, adds reviewer annotations, and renders diffs with moved-code detection. Use when the user pastes a GitHub PR URL and asks for a review, walkthrough, or summary, or says "review this PR".
---

# PR Review Canvas

Generate an interactive HTML review of a GitHub PR that reads like a peer walking you through what matters.

## Workflow

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

### 2. Analyze the PR and write the body HTML

Read the diffs, understand the PR, and write the `<body>` content directly as HTML. You have full creative freedom -- the goal is to explain the PR clearly to a reviewer. Use whatever structure best fits the PR.

**Typical structure** (adapt as needed):
- Header with title, PR number, author, stats
- Summary box explaining what the PR does in plain English
- Core file sections with annotations and diffs
- Mechanical/boilerplate files collapsed by default
- Review checklist at the bottom

**But you can also add:**
- **Pseudocode summaries** for verbose code -- show the algorithm in plain English or short pseudocode, with the real diff collapsed below (use a `.bp-section` card labeled "Show full implementation"). Great when 150 lines of retry/backoff/error-handling code is really just "fetch with exponential backoff and circuit breaker."
- Diagrams (inline SVG, mermaid via CDN, ASCII art in `<pre>`)
- Flowcharts showing before/after control flow
- Tables comparing old vs new behavior
- Callout boxes for warnings, questions, or gotchas
- Interactive widgets if they help
- Anything else that makes the review clearer

**Pseudocode pattern example:**
```html
<div class="file-card">
  <div class="file-hdr" onclick="toggle(this)">
    <span class="fname">retryClient.ts</span>
    <div class="fstats"><span class="pill add">+173</span><span class="pill del">&minus;11</span><span class="chev open">&#9654;</span></div>
  </div>
  <div class="file-body open">
    <div class="file-note">
      <strong>What this does in plain English:</strong>
      <pre style="margin-top:8px;color:var(--text);font-size:12px;line-height:1.6;">
fetch(url):
  if circuit breaker is open → fail fast
  retry up to N times:
    try fetch with timeout
    on success → close circuit breaker, return
    on retryable error → wait (exponential backoff + jitter)
    on non-retryable error → throw
  circuit breaker records failure</pre>
    </div>
    <div class="bp-section" style="margin:0;border:0;border-radius:0;">
      <div class="bp-hdr" onclick="toggleBP(this)">
        <span>Show full implementation (+173 lines)</span><span class="chev">&#9654;</span>
      </div>
      <div class="bp-body"><div data-diff="retryClient.ts"></div></div>
    </div>
  </div>
</div>
```

### 3. Available CSS classes and JS utilities

Read [styles.css](styles.css) and [renderer.js](renderer.js) from this skill directory. These give you a prebuilt dark-themed toolkit. Inject them into [template.html](template.html) verbatim.

**CSS classes you can use:**

| Class | Purpose |
|-------|---------|
| `.header`, `.header h1`, `.header-meta` | Page header |
| `.pill.add`, `.pill.del`, `.pill.files` | Stat badges (+N, -N, N files) |
| `.content` | Centered content wrapper (max 900px) |
| `.summary` | Summary/TL;DR box |
| `.section-title` | Section heading with bottom border |
| `.ic` | Inline code reference (mono, blue, dark bg) |
| `.file-card`, `.file-hdr`, `.file-body` | Collapsible file card (use `onclick="toggle(this)"` on `.file-hdr`) |
| `.file-note` | Sticky reviewer annotation inside a file card |
| `.bp-section`, `.bp-hdr`, `.bp-body` | Collapsed boilerplate card (use `onclick="toggleBP(this)"`) |
| `.bp-note` | Note inside a boilerplate card |
| `.verdict` | Review checklist box |

**JS functions available:**

| Function | Usage |
|----------|-------|
| `toggle(hdrElement)` | Toggle a `.file-body` open/closed |
| `toggleBP(hdrElement)` | Toggle a `.bp-body` open/closed |
| `renderDiff(target, diffInput)` | Render a unified diff. `target` can be a DOM element, string ID, or CSS selector. `diffInput` can be a raw patch string OR an array of lines -- both work. Retains imports and exact line references, preserves meaningful whitespace edits, and detects moved code (blue/purple tint). |
| `esc(string)` | HTML-escape a string |

**Rendering diffs -- use `data-diff` attributes with auto-discovery.**
Put `<div data-diff="KEY"></div>` placeholders in your body HTML wherever you want a diff rendered. The renderer finds them automatically after DOM load and fills them from the `<script id="pr-diffs-json" type="application/json">` element in `template.html`.

## Assemble and inspect the owned artifact

```sh
python3 "${CLAUDE_SKILL_DIR}/assemble.py" assemble --run-dir "<run_dir>" --repo "<owner>/<repository>" --pr <number> --run-id "<run_id>"
```

The helper safely encodes patch JSON, locates its own packaged resources regardless of shell working directory, and writes `<run_dir>/public/index.html` atomically. Open that exact saved file with `open` on macOS, `xdg-open` on Linux, or an available HTML preview tool. If a browser requires HTTP, run the owned server in the background:

```sh
python3 "${CLAUDE_SKILL_DIR}/assemble.py" serve --run-dir "<run_dir>" --repo "<owner>/<repository>" --pr <number> --run-id "<run_id>"
```

It binds only to loopback, uses a free port, flushes the URL, and serves only the contained index artifact. Retain its process/session ID and stop that server when finished; preserve other sessions' servers and artifacts. Verify PR identity, head SHA, coverage, escaping, and line references before reporting the walkthrough ready.
