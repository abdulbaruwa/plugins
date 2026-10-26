"""Exercise source reconciliation against real temporary Git histories."""

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from source_diff import report


SCRIPT = Path(__file__).with_name("source_diff.py")


class SourceDiffTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git("init", "-q")
        self.git("config", "user.name", "Source diff fixture")
        self.git("config", "user.email", "fixture@example.invalid")
        self.entries = [{"name": name, "source": name, "description": "source"} for name in ("alpha", "beta")]
        self.catalog()
        for name in ("alpha", "beta"):
            self.write(f"{name}/skills/main/SKILL.md", "original skill\n")
            self.write(f"{name}/.cursor-plugin/plugin.json", '{"version":"1.0.0"}\n')
        self.write("README.md", "source readme\n")
        self.base = self.save("source baseline")
        self.inventory = {"sourceCommit": self.base, "plugins": [
            {"originalName": "alpha", "name": "codex-alpha", "source": "alpha", "status": "adapted-skills", "path": "./plugins/codex-alpha"},
            {"originalName": "beta", "name": "beta", "source": "beta", "status": "blocked", "path": None},
        ]}
        self.inventory_file()

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.root), *args], text=True, stderr=subprocess.DEVNULL).strip()

    def write(self, relative, text):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def catalog(self):
        self.write(".cursor-plugin/marketplace.json", json.dumps({"plugins": self.entries}))

    def inventory_file(self):
        self.write("Codex/inventory.json", json.dumps(self.inventory))

    def save(self, message):
        self.git("add", ".")
        self.git("commit", "-qm", message)
        return self.git("rev-parse", "HEAD")

    def check(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), "--root", str(self.root), "--head", "HEAD", *args], capture_output=True, text=True)

    def test_clean_history_and_codex_claude_overlays_do_not_signal_source_drift(self):
        self.write("Codex/plugins/codex-alpha/skills/main/SKILL.md", "native safeguards")
        self.write("Claude/skills/other/SKILL.md", "other port")
        self.write(".github/workflows/codex-ci.yml", "native CI")
        self.write(".github/workflows/claude-ci.yml", "native Claude CI")
        self.save("port overlays")
        result = report(self.root, "HEAD")
        self.assertFalse(result["needsReview"])
        self.assertEqual(result["otherChanges"], [])
        self.assertEqual(self.check("--check").returncode, 0)

    def test_skill_fix_without_version_bump_identifies_the_codex_package(self):
        self.write("alpha/skills/main/SKILL.md", "fixed without version bump\n")
        target = self.save("upstream skill fix")
        result = report(self.root, "HEAD")
        self.assertEqual(result["headCommit"], target)
        self.assertEqual(result["plugins"][0]["codexPath"], "./plugins/codex-alpha")
        self.assertEqual(result["plugins"][0]["changes"], [{"status": "M", "path": "alpha/skills/main/SKILL.md"}])
        self.assertEqual(self.check("--check").returncode, 1)

    def test_blocked_provider_changes_remain_visible(self):
        self.write("beta/mcp.json", '{"new":"provider configuration"}')
        self.save("blocked source changes")
        plugin = report(self.root, "HEAD")["plugins"][0]
        self.assertEqual(plugin["portStatus"], "blocked")
        self.assertIsNone(plugin["codexPath"])

    def test_additions_and_removals_are_not_hidden_by_rename_detection(self):
        (self.root / "alpha/skills/main/SKILL.md").rename(self.root / "alpha/skills/main/new name\twith\nnewline.md")
        self.save("rename skill")
        delta = report(self.root, "HEAD")["plugins"][0]["changes"]
        self.assertEqual({change["status"] for change in delta}, {"A", "D"})
        self.assertIn("alpha/skills/main/new name\twith\nnewline.md", [change["path"] for change in delta])
        self.assertEqual(self.check("--json").returncode, 0)

    def test_new_catalog_plugin_is_reported_as_untracked(self):
        self.entries.append({"name": "gamma", "source": "gamma"})
        self.catalog()
        self.write("gamma/mcp.json", "{}")
        self.save("new provider")
        result = report(self.root, "HEAD")
        self.assertEqual(result["catalog"]["added"], ["gamma"])
        self.assertEqual(result["plugins"][0]["originalName"], "gamma")
        self.assertEqual(result["plugins"][0]["portStatus"], "untracked")

    def test_removed_plugin_and_catalog_only_changes_are_reported(self):
        self.entries = [entry for entry in self.entries if entry["name"] != "beta"]
        self.entries[0]["description"] = "new description"
        self.catalog()
        self.save("catalog-only update")
        result = report(self.root, "HEAD")
        self.assertEqual(result["catalog"]["removed"], ["beta"])
        self.assertEqual(result["catalog"]["changed"], ["alpha"])
        self.assertEqual({plugin["originalName"] for plugin in result["plugins"]}, {"alpha", "beta"})

    def test_marketplace_metadata_changes_also_require_catalog_review(self):
        self.write(".cursor-plugin/marketplace.json", json.dumps({"plugins": self.entries, "owner": {"name": "changed"}}))
        self.save("marketplace owner change")
        result = report(self.root, "HEAD")
        self.assertTrue(result["catalogFileChanged"])
        self.assertTrue(result["needsReview"])
        self.assertEqual(result["plugins"], [])
        self.assertEqual(self.check("--check").returncode, 1)

    def test_source_directory_move_maps_both_old_and_new_paths(self):
        (self.root / "alpha").rename(self.root / "moved-alpha")
        self.entries[0]["source"] = "moved-alpha"
        self.catalog()
        self.save("move source")
        delta = report(self.root, "HEAD")["plugins"][0]["changes"]
        self.assertTrue(any(change["path"].startswith("alpha/") for change in delta))
        self.assertTrue(any(change["path"].startswith("moved-alpha/") for change in delta))

    def test_reviewed_plugin_checkpoint_does_not_clear_another_plugin(self):
        self.write("alpha/skills/main/SKILL.md", "reviewed alpha fix")
        reviewed = self.save("alpha change")
        self.inventory["plugins"][0]["reviewedSourceCommit"] = reviewed
        self.inventory_file()
        self.write("beta/skills/main/SKILL.md", "pending beta fix")
        self.save("beta change")
        result = report(self.root, "HEAD")
        self.assertEqual([plugin["originalName"] for plugin in result["plugins"]], ["beta"])
        self.assertEqual(len(report(self.root, "HEAD", self.base)["plugins"]), 2)

    def test_other_source_files_are_reported_as_advisory(self):
        self.write("README.md", "upstream repository docs")
        self.save("root docs")
        result = report(self.root, "HEAD")
        self.assertEqual(result["otherChanges"], [{"status": "M", "path": "README.md"}])
        self.assertFalse(result["needsReview"])
        self.assertEqual(self.check("--check").returncode, 0)

    def test_invalid_baseline_missing_ref_and_traversal_are_actionable_errors(self):
        for mutation in (lambda: self.inventory.update(sourceCommit="missing-source"),
                         lambda: self.inventory["plugins"][0].update(source="../outside"),
                         lambda: self.inventory["plugins"].append("bad-row")):
            with self.subTest(mutation=mutation):
                original = json.loads(json.dumps(self.inventory))
                mutation()
                self.inventory_file()
                result = self.check()
                self.assertEqual(result.returncode, 2)
                self.assertIn("source-diff error:", result.stderr)
                self.assertNotIn("Traceback", result.stderr)
                self.inventory = original
        self.inventory_file()

    def test_unrelated_review_checkpoint_is_rejected(self):
        self.git("checkout", "--orphan", "unrelated")
        self.save("different source history")
        self.inventory["plugins"][0]["reviewedSourceCommit"] = self.git("rev-parse", "HEAD")
        self.git("checkout", "--detach", self.base)
        self.inventory_file()
        result = self.check()
        self.assertEqual(result.returncode, 2)
        self.assertIn("not an ancestor", result.stderr)

    def test_upstream_override_preserves_drift_with_a_reviewed_local_source_patch(self):
        self.write("alpha/skills/main/SKILL.md", "reviewed native source correction")
        local_source = self.save("local source correction")
        self.inventory["plugins"][0]["reviewedSourceCommit"] = local_source
        self.inventory_file()
        local_head = self.save("record local review")
        self.assertFalse(report(self.root, "HEAD")["needsReview"])

        # Cursor's branch cannot contain our local patch. Keep the ancestry
        # rejection, and compare that branch with its recorded upstream base.
        self.git("checkout", "--detach", self.base)
        self.inventory_file()
        self.write("alpha/skills/main/SKILL.md", "new upstream alpha correction")
        self.write("beta/skills/main/SKILL.md", "new upstream beta correction")
        self.save("new upstream corrections")
        self.assertEqual(self.check("--check").returncode, 2)
        upstream = self.check("--base", self.base, "--json")
        self.assertEqual(upstream.returncode, 0)
        self.assertEqual({p["originalName"] for p in json.loads(upstream.stdout)["plugins"]}, {"alpha", "beta"})
        self.git("checkout", "--detach", local_head)
        self.assertFalse(report(self.root, "HEAD")["needsReview"])

    def test_reports_only_committed_source_and_is_read_only(self):
        self.write("alpha/skills/main/SKILL.md", "uncommitted source edit")
        before = self.git("status", "--porcelain=v1")
        result = self.check("--check", "--json")
        self.assertEqual(result.returncode, 0)
        self.assertFalse(json.loads(result.stdout)["needsReview"])
        self.assertEqual(self.git("status", "--porcelain=v1"), before)
        self.assertEqual((self.root / "alpha/skills/main/SKILL.md").read_text(), "uncommitted source edit")


if __name__ == "__main__":
    unittest.main()
