# PStack 0.15.36 source decisions

This Codex-only refresh was reviewed on 29 October 2026 against Cursor upstream `1ba91fc25c0977741dd0e267849e6234b037ed0a`. The last PStack source change is `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`, version `0.15.36`. The maintained base is `d23ab42d2a64fe1039ea6ad25442d0f763c8a8a5`.

The existing full-catalog sync PR #6 is still independent and unmerged. This package reuses its reviewed Codex adaptations for prompt-only sharpen, reflection outside installed caches, and formal-check routing. It takes the current TypeScript statechart compiler directly from upstream instead of the superseded JavaScript implementation in that PR. No original Cursor source, Claude package, other Codex package, or global source checkpoint is changed.

`inventory.json` retains `originalVersion` for the adopted source tree and records `portedVersion` and `portedSourceCommit` for this newer package. Those fields do not clear source-diff warnings for unadopted upstream work. A future full sync must preserve this package's newer adaptation.

| Upstream change | Codex decision |
| --- | --- |
| Statechart compiler, qualified action names, and SIGKILL test synchronization | Bundle the complete current compiler, launcher, corpus, and tests, with the two local corrections documented below. Retain explicit invocation, owned scratch paths, dependency disclosure, bounded-proof limits, and real-code replay. Preserve output draining in the new CLI with `process.exitCode`. |
| Formal-verification result routing | Generated TLA+ verification skills call `$statechart` by name without pinning its changing command syntax. |
| Interrogate | Replace rubric-driven reviews with executable adversarial repros. The coordinator reruns each finding, merges duplicates, and reports drops. Remove the retired rubric resources. Repros use isolated checkouts; user code stays unchanged. |
| Arena and setup | Cross-judges must be from a confirmed different family and explicitly authorized. Skip the cross-judge when no such model is available. Candidate models still inherit by default. No Cursor model names are installed. |
| Orchestrate | Native authorized workers, durable project-owned state, scoped kickoffs, actual evidence, bounded retries, current-head verification, and live PR readback. No orch CLI, mandatory external orchestrate plugin, cloud VM assumption, or invented Project store. Existing topology ownership and merge authority remain. |
| Autopilot and planning | Distinguish runs authorized to merge from user-landed stacks, base stacked branches on their real parents, classify trunk failures, and rebase for concurrent changes when needed. Retain the stronger native independent shipping and evidence-freshness gates. |
| Interrogate removed from automatic PR ceremony | Keep interrogate explicitly invoked; opening a PR does not automatically invoke it or start babysitting. |
| Ketchup video | Add the current subtitled-video workflow, subtitle strip, frame-based hold measurements, and honest render-failure behavior. No renderer or browser is installed by the skill package. |
| Explain the number | Name the decision threshold and noise floor before measurement; stop when noise exceeds the measured effect. |
| Sharpen and reflect | Sharpen rewrites the prompt and stops; reflection proposes edits in a writable source rather than changing an installed cache. Preserve the user's scope and memory-write authority. |
| Watcher, plan-parser, worktree-audit, swarm numbering, and deleted orch scripts | The Codex port does not ship these Cursor helpers or numbered swarm phases. It already uses native forge/status tools, scoped transcript access, and isolated workers. Do not reintroduce host-specific helpers. |
| Cursor/Claude install instructions, model rules, automatic hooks, and guide paths | Keep the existing Codex marketplace and session-capability guidance. These upstream harness instructions do not apply to this port. |

## Verification

The statechart executable uses only runtime standard libraries. Its tests use pinned fast-check 4.5.3; rendering tests install Pele 1.9.0, Mermaid 11.16.0, and jsdom 26.1.0 outside the repository. The CI lane runs the actual packaged compiler against checksum-pinned TLC 1.7.4 and Java 17. No browser is needed.

Run package validation and regressions from the repository root using the commands in the Codex README. For the statechart suite, install its test dependencies and set `TLA2TOOLS` to the pinned JAR and `JAVA` to a Java 11+ executable, then run `npm test` in the packaged `skills/statechart/scripts` directory. Node must support TypeScript directly (22.18–22.x or 23.6+). Remove test-only `node_modules` before package validation or installation.

Package structure, executable compiler tests, and installation readback are separate from live agent decisions. This update does not establish end-to-end acceptance for orchestration, adversarial reviews, video generation, or provider operations.

## Preserved local corrections

The new upstream CLI still called `process.exit()` immediately after writing a report. A real CLI run with a long-label CounterRules view returned only 65,536 of the expected 700,597 output bytes on macOS. The port sets `process.exitCode` at the end of the command and in its final error handler so pending output drains. The new regression compares complete stdout with the on-disk report and verifies the original exit status. It failed before the fix.

The upstream cancellation test raced between observing a chart file and signaling an already-finished worker. In the full suite, the SIGINT case failed; it passed alone. The port's test pauses the worker immediately after its first chart write, then signals the command. This preserves both SIGINT and SIGTERM assertions for exit status, absent published output, and removed temporary files, without skipping either platform.

## Local results

On macOS with Node 26.12.1, Java 17.0.15, and checksum-verified TLC 1.7.4, all **368 statechart tests passed, with no failures or skips**. This includes real TLC corpus/differential checks, rendering and parser checks, cancellation cleanup, and the output-draining regression. All **50 Codex regressions** passed. The original plugin validator, upstream harness/doc checks, package validation, adopted-source check, workflow lint, and diff whitespace check passed. Package validation reports 94 packages, 127 skills, and 59 bundled MCP servers for this branch.

The upstream source comparison still reports 22 source plugins needing full reconciliation. That is intentional: this package-only update does not adopt the full upstream marketplace or close the separate catalog-sync work.
