# Maintaining both plugin ports

Follow [the fork update workflow](../Codex/UPDATING.md) in a fresh worktree from `fork/main`. Publish changes to `abdulbaruwa/plugins` through a feature branch and PR. Merging remains manual; neither CI nor the weekly automation merges a PR or pushes directly to `main`.

Check the ports independently. The Codex source report maps original plugin changes against its inventory checkpoint. Claude's generated-output and override-lock checks protect a different adaptation, so a clean Codex report does not establish that Claude is current:

```sh
CODEX_UPSTREAM_BASE=$(python3 -c 'import json; from pathlib import Path; print(json.loads(Path("Codex/inventory.json").read_text())["sourceCommit"])')
python3 Codex/scripts/source_diff.py --base "$CODEX_UPSTREAM_BASE" --head upstream/main
node Claude/scripts/build.mjs --check
```

Also inspect the exact source diff between fetched `fork/main` and `upstream/main`; changes can apply to Claude even when Codex excludes that integration. If upstream has applicable fixes, merge its history into the isolated feature branch, then reconcile both ports before opening or updating the PR.

Edit `Claude/scripts/port.config.mjs` or `Claude/overrides/`, then rebuild. Do not edit generated packages directly: the next build replaces them. The PR renderer, skill instructions, assembly helper, styles, and template are overrides packaged into both `cursor-team-kit` and `pr-review-canvas`. This keeps imports, line references, meaningful whitespace edits, exact filename keys, separate run identities, safe JSON, and contained previews intact after an update. Each installed package carries its own resources.

Run the builder without `--lock` to identify new drift. Review changes behind every affected override before advancing the lock; `--lock` acknowledges all watched sources, so it must not clear unrelated unreviewed changes. Preserve existing Claude hooks, agent routing, invocation policy, MCP setup/skip decisions, author attribution, and licenses. Complete feasible adaptations and record why a source change is inapplicable rather than copying Cursor runtime assumptions.

After the overrides have been reconciled:

```sh
node Claude/scripts/build.mjs --lock
node Claude/scripts/build.mjs --check
python3 -m unittest discover -s Claude/scripts -p 'test_*.py'
node Claude/scripts/build.mjs --validate
```

The review artifact helper requires Python 3.9 or later. CI tests with Python 3.12 and Node 22, and pins Claude Code 2.1.296 for strict validation. Validation needs no provider credentials and does not install the plugins. Claude regressions reuse the established Codex artifact/renderer contract, then verify the generated Claude packages and a versionless source change behind an override in a disposable repository.

Run the original validator and full Codex suite as well. Keep Codex inventory checkpoints honest and preserve its native safeguards. Claude content hashes change only for packages whose generated content changes; stage regenerated manifests, marketplace entries, lock updates, and documentation together. List the tested revision, source SHA, checks, and remaining acceptance gaps in the PR. Use a draft when reconciliation or checks remain incomplete. Do not claim plugin installation, actual agent decisions, or authenticated service behavior from static validation.

The weekly Codex automation reconciles both ports on Mondays at 09:00 London time. It checks existing PRs, preserves human edits and other worktrees, runs both ports' checks and independent review, and opens or updates a PR only for actionable work. It never merges or enables auto-merge.
