# Keeping the Codex port current

The maintained fork is [abdulbaruwa/plugins](https://github.com/abdulbaruwa/plugins). Cursor's repository remains the source of the original plugins. Merge its history into the fork and reconcile affected Codex packages in the same reviewed update PR.

## Remotes and worktrees

This checkout shares Git configuration with another agent's worktree. Its existing `origin` still points to Cursor, but `main` tracks `fork/main`, so a plain pull or push on `main` uses the fork. The additional remotes are:

| Remote | Repository | Use |
|---|---|---|
| `fork` | `https://github.com/abdulbaruwa/plugins.git` | Publish maintained branches and PRs |
| `upstream` | `https://github.com/cursor/plugins.git` | Fetch original plugin changes |

The Codex feature branch tracks `fork`, explicitly. Fetch and push named remotes; do not assume `origin` is the fork. Git configuration and remote refs are shared across worktrees, while their checked-out files are separate. Keep update work in its own worktree and preserve other agents' branches, untracked files, and remote tracking.

## Inspect upstream changes

From a clean repository worktree with the validation environment installed:

```sh
git fetch upstream main
Codex/.venv/bin/python Codex/scripts/source_diff.py
Codex/.venv/bin/python Codex/scripts/source_diff.py --json
```

The checker compares committed Git trees against `inventory.json`'s `sourceCommit`, resolving every target to an exact SHA. It reports source files changed without a version bump, catalog additions/removals/metadata changes, changed blocked plugins, and their corresponding Codex package paths. Renames appear as removed and added paths. Root-level source changes appear separately as advisory items. It fetches nothing, writes nothing, and installs nothing. Uncommitted original-source edits are outside the comparison; commit them on the update branch before checking an adopted source tree.

`--head HEAD --check` checks the committed sources already adopted by the fork. Exit codes are 0 for a successful report, 1 for pending plugin/catalog reconciliation with `--check`, and 2 for malformed data or unavailable history. Plain reporting returns 0 even when drift exists. Missing revisions need a fetch/full history, not an invented baseline. `--base <commit>` overrides all recorded baselines for a one-off investigation.

## Prepare an update PR

After the initial Codex PR is merged into the fork's `main`, start a new update worktree from the maintained branch:

```sh
git fetch fork main
git fetch upstream main
git worktree add -b feature/upstream-sync-YYYYMMDD ../plugins-upstream-sync fork/main
cd ../plugins-upstream-sync
git merge upstream/main
```

Resolve source conflicts without discarding native enhancements. Inspect the source-diff report, then handle each affected plugin: port applicable fixes, retain Codex-specific safeguards, or record why the source change does not apply. New or removed source plugins need an explicit inventory/catalog decision. Review source endpoint or credential changes before enabling connections; connected acceptance is separate from package validation.

Keep the historical `sourceCommit` until every affected source plugin and catalog change has been reviewed. For partial work, a plugin row may record `reviewedSourceCommit` as the exact source SHA actually reviewed. This clears that plugin's file drift without clearing other plugins; catalog changes still require the global checkpoint. A checkpoint records your completed review, not automatic proof that a fix was ported. Put the rationale and validation in the update PR. Never advance it just to make CI green.

When the update is reconciled, advance `sourceCommit` to the merged upstream SHA, refresh the affected rows' `source`, `originalVersion`, and compatibility notes, and bump only changed Codex package versions. Remove obsolete per-plugin checkpoints when the global source checkpoint catches up. Codex-local package revisions are independent of upstream versions. Preserve the native serving containment, task ownership, independent shipping verification, and diff-line regressions introduced by this port.

Run the original validator and Codex checks:

```sh
npm install --no-save ajv ajv-formats
node scripts/validate-plugins.mjs
python3.12 -m venv Codex/.venv
Codex/.venv/bin/python -m pip install -r Codex/requirements-dev.txt
Codex/.venv/bin/python Codex/scripts/validate.py
Codex/.venv/bin/python -m unittest discover -s Codex/scripts -p 'test_*.py'
Codex/.venv/bin/python Codex/scripts/source_diff.py --head HEAD --check
```

Commit the adaptations, provenance, and validation together, push explicitly to `fork`, and open the PR against `abdulbaruwa/plugins:main`. Use a merge commit for upstream-sync PRs so the fork retains upstream ancestry. Keep the other agent's port in its own PR. Review and CI precede merging; force syncing or replacing the fork's history would discard the adaptations.

## CI behavior

`Codex CI` runs on all pushes and PRs, including source-only skill changes. It checks packages, all regressions, and adopted source reconciliation. A read-only comparison with the latest fetched Cursor `main` is uploaded as `codex-source-diff`; pending upstream changes are advisory and do not invalidate an otherwise sound Codex-only PR. Invalid data, unavailable history, or failed fetches are errors. The report's `headCommit` pins what was actually checked. Shared source files outside plugin directories are advisory and still need human inspection.

The workflow uses full Git history, read-only permissions, pinned actions, and no provider credentials. It does not merge upstream, regenerate packages, install plugins, or authenticate services.
