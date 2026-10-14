#!/usr/bin/env python3
"""Report upstream source changes without modifying plugins, inventory, or Git refs."""

import argparse
import json
from pathlib import Path, PurePosixPath
import subprocess
import sys


CATALOG = ".cursor-plugin/marketplace.json"
LOCAL_PATHS = ("Codex/", "Claude/", ".github/workflows/codex-ci.yml", ".github/workflows/claude-ci.yml")


def git(root, *args):
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True)
    if result.returncode:
        raise ValueError(result.stderr.decode("utf-8", "replace").strip())
    return result.stdout


def commit(root, ref):
    if not isinstance(ref, str) or not ref.strip():
        raise ValueError("source revisions must be nonempty Git references")
    try:
        return git(root, "rev-parse", "--verify", "--end-of-options", ref + "^{commit}").decode().strip()
    except ValueError as exc:
        raise ValueError(f"cannot resolve {ref!r}; fetch upstream and use full history (checkout fetch-depth: 0)") from exc


def source_path(value):
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        raise ValueError("plugin source must be a repository-relative directory")
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts or str(path) == "." or str(path).startswith("-"):
        raise ValueError(f"invalid plugin source directory: {value!r}")
    return str(path)


def catalog(root, revision):
    value = json.loads(git(root, "show", revision + ":" + CATALOG))
    if not isinstance(value, dict) or not isinstance(value.get("plugins"), list):
        raise ValueError(f"{CATALOG} at {revision}: expected plugins[]")
    result = {}
    for entry in value["plugins"]:
        if not isinstance(entry, dict) or not isinstance(entry.get("name"), str) or not entry["name"]:
            raise ValueError(f"{CATALOG} at {revision}: each entry needs a string name")
        if entry["name"] in result:
            raise ValueError(f"{CATALOG} at {revision}: duplicate plugin {entry['name']}")
        source_path(entry.get("source"))
        result[entry["name"]] = entry
    return result


def changes(root, base, head):
    # No rename heuristics: both removed and added paths remain visible. NUL
    # delimiters preserve spaces, tabs, and newlines in actual Git filenames.
    raw = git(root, "diff", "--no-ext-diff", "--no-textconv", "--no-renames", "--name-status", "-z", base, head, "--")
    parts = raw.split(b"\x00")[:-1]
    if len(parts) % 2:
        raise ValueError("unexpected Git name-status output")
    return [{"status": parts[i].decode("ascii"), "path": parts[i + 1].decode("utf-8", "surrogateescape")}
            for i in range(0, len(parts), 2)]


def under(path, directories):
    return any(path == directory or path.startswith(directory + "/") for directory in directories)


def report(root, head="upstream/main", base=None):
    root = Path(root).resolve()
    inventory_path = root / "Codex/inventory.json"
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    if not isinstance(inventory, dict) or not isinstance(inventory.get("plugins"), list):
        raise ValueError(f"{inventory_path}: expected plugins[]")
    base_commit = commit(root, base if base is not None else inventory.get("sourceCommit"))
    head_commit = commit(root, head)
    catalogs, diffs = {}, {}

    def compare(revision):
        if revision not in catalogs:
            ancestor = subprocess.run(["git", "-C", str(root), "merge-base", "--is-ancestor", revision, head_commit], capture_output=True)
            if ancestor.returncode:
                raise ValueError(f"reviewed source {revision} is not an ancestor of target {head_commit}; choose the intended source history")
            catalogs[revision] = catalog(root, revision)
            diffs[revision] = changes(root, revision, head_commit)
        return catalogs[revision], diffs[revision]

    old_catalog, global_changes = compare(base_commit)
    new_catalog = catalog(root, head_commit)
    rows = {}
    for row in inventory["plugins"]:
        if not isinstance(row, dict) or not isinstance(row.get("originalName"), str) or not row["originalName"] or not isinstance(row.get("name"), str):
            raise ValueError(f"{inventory_path}: each row needs string originalName and name")
        if row["originalName"] in rows:
            raise ValueError(f"{inventory_path}: duplicate source {row['originalName']}")
        source_path(row.get("source"))
        rows[row["originalName"]] = row
    affected = []
    directories = set()
    for name in sorted(set(rows) | set(old_catalog) | set(new_catalog)):
        row = rows.get(name)
        reviewed = commit(root, row.get("reviewedSourceCommit", base_commit)) if row and base is None else base_commit
        reviewed_catalog, delta = compare(reviewed)
        sources = {source_path(entry["source"]) for entries in (old_catalog, reviewed_catalog, new_catalog)
                   if (entry := entries.get(name)) is not None}
        if row:
            sources.add(source_path(row["source"]))
        directories.update(sources)
        plugin_changes = [change for change in delta if under(change["path"], sources)]
        catalog_changed = reviewed_catalog.get(name) != new_catalog.get(name)
        if plugin_changes or catalog_changed or row is None:
            affected.append({
                "originalName": name, "name": row["name"] if row else None,
                "codexPath": row.get("path") if row else None,
                "portStatus": row.get("status") if row else "untracked",
                "reviewedSourceCommit": reviewed,
                "catalogChanged": catalog_changed, "changes": plugin_changes,
            })
    catalog_delta = {
        "added": sorted(set(new_catalog) - set(old_catalog)),
        "removed": sorted(set(old_catalog) - set(new_catalog)),
        "changed": sorted(name for name in set(old_catalog) & set(new_catalog) if old_catalog[name] != new_catalog[name]),
    }
    catalog_file_changed = any(change["path"] == CATALOG for change in global_changes)
    other = [change for change in global_changes
             if change["path"] != CATALOG and not under(change["path"], directories)
             and not any(change["path"].startswith(prefix) for prefix in LOCAL_PATHS)]
    return {"schemaVersion": 1, "baseCommit": base_commit, "headCommit": head_commit,
            "needsReview": bool(affected or catalog_file_changed),
            "plugins": affected, "catalog": catalog_delta,
            "catalogFileChanged": catalog_file_changed, "otherChanges": other}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2], help="repository root containing Codex/inventory.json")
    parser.add_argument("--head", default="upstream/main", help="committed source target; fetch upstream first (default: upstream/main)")
    parser.add_argument("--base", help="override every recorded source baseline for a one-off comparison")
    parser.add_argument("--json", action="store_true", help="emit the complete machine-readable report")
    parser.add_argument("--check", action="store_true", help="exit 1 when plugin/catalog changes need reconciliation; other files are advisory")
    args = parser.parse_args()
    try:
        result = report(args.root, args.head, args.base)
    except (OSError, ValueError) as exc:
        print(f"source-diff error: {exc}", file=sys.stderr)
        return 2
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"Source comparison: {result['baseCommit']} -> {result['headCommit']}")
        for plugin in result["plugins"]:
            print(f"{plugin['originalName']} -> {plugin['codexPath'] or '(no Codex package)'} [{plugin['portStatus']}]")
            if plugin["catalogChanged"]:
                print("  catalog entry changed")
            for change in plugin["changes"]:
                print(f"  {change['status']} {change['path']!r}")
        for kind, names in result["catalog"].items():
            if names:
                print(f"Catalog {kind}: {', '.join(names)}")
        if result["catalogFileChanged"]:
            print("Source catalog file changed; inspect marketplace metadata as well as plugin entries.")
        for change in result["otherChanges"]:
            print(f"Other source change (advisory): {change['status']} {change['path']!r}")
        print(f"{len(result['plugins'])} source plugins need review; no files or refs modified.")
    return 1 if args.check and result["needsReview"] else 0


if __name__ == "__main__":
    sys.exit(main())
