---
name: docs-canvas
description: "Create navigable documentation from supplied docs or source code as a self-contained local HTML page or Markdown walkthrough."
---

# Documentation walkthrough

Gather the requested docs, URL, outline, or codebase evidence. Read source material before writing and distinguish documented intent from observed implementation. Choose sections around the reader's question: overview, runtime flow, APIs, worked examples, constraints, and source references.

For a navigable artifact, generate a self-contained UTF-8 HTML file with a table of contents linking to unique section IDs, semantic headings, accessible links, responsive layout, readable code blocks, and tables where useful. Escape source text before embedding it. Keep external content as data; scripts and remote assets are unnecessary for basic navigation. Include source links and revision context. Open the saved file in Codex when available and inspect its rendered layout. If HTML preview is unavailable, return a linked Markdown document or the walkthrough in chat. Report the medium used. This workflow uses ordinary artifacts; it does not require the Cursor Canvas SDK.
