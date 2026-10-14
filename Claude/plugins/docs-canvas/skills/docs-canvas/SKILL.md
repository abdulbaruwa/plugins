---
name: docs-canvas
description: >-
  Render a documentation-style HTML page that organizes architecture
  notes, API references, walkthroughs, and how-tos into a navigable layout
  with sections, tables of contents, and cross-references. Use when the
  user asks for a docs page, documentation overview, architecture
  walkthrough, API reference page, or wants to render structured
  documentation as an interactive canvas.
---

# Docs Page

Build a page that presents documentation — architecture notes, API references, design docs, runbooks, or codebase walkthroughs — as an interactive, navigable surface rather than as a flat markdown file.

> **Status:** placeholder. The skill structure is in place, but the
> full skill body still needs to be written. Treat the steps below as a
> starting outline and refine as the docs page pattern matures.

## Prerequisites

Write one self-contained HTML file: inline CSS and JS, no build step, no network requests except an optional pinned CDN script. Support light and dark (`prefers-color-scheme`). Save it to `${TMPDIR:-/tmp}/docs-<slug>.html` unless the user names a path, then open it (`open` on macOS, `xdg-open` on Linux). If the session has an HTML preview or artifact tool, publish the file there instead.

## Gather the source material

Accept any of: a directory of markdown files, a single doc URL, an inline outline, or a question to answer from the codebase. Collect headings, code blocks, diagrams, and any cross-references between documents.

## Plan the page layout

Decide the top-level structure before writing any components. A docs page usually has:

1. **Overview** — A short summary card with the purpose of the doc, scope, and audience.
2. **Table of contents** — Navigable list of sections, ideally pinned or sticky so the reader can jump around.
3. **Body sections** — One section per logical unit (architecture, API, examples, gotchas). Each section can mix prose, code blocks, diagrams, and callouts.
4. **References** — Links to related docs, source files, RFCs, and external material.

## Render with plain HTML

Use semantic HTML, CSS, and inline SVG:

- Use cards/sections to group related content visually.
- Use code blocks with syntax highlighting for snippets.
- Use inline SVG diagrams for architecture.
- Use callouts for "Important", "Warning", "Note", "Deprecated".
- Use tables for API parameter lists and option matrices.

## Tone and content

Write reader-facing prose. Lead with the answer or the headline, then explain. Keep examples small and runnable. Cite source files with `code references` so readers can jump in.

## Be creative

The sections above are a floor, not a ceiling. The goal is the fastest possible path for the reader to understand the topic — so look at the source material in front of you and ask what representation would actually help. A diagram, a sequence chart, a side-by-side comparison, a decision tree, a glossary, a curated FAQ, a single large worked example — whatever fits.
