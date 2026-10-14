"""Run the established PR artifact contract against both generated Claude packages."""

import importlib.util
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("pr_artifact_contract", ROOT / "Codex/scripts/test_workflows.py")
contract = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contract)


class ClaudePrRunTests(contract.PrRunTests):
    def helpers(self):
        return [contract.module_at(ROOT / "Claude/plugins" / plugin / "skills/pr-review-canvas/assemble.py")
                for plugin in ("pr-review-canvas", "cursor-team-kit")]


class ClaudeRendererTests(unittest.TestCase):
    def test_renderer_contract(self):
        subprocess.run(["node", str(ROOT / "Codex/scripts/test_renderer.cjs"),
                        *[str(ROOT / "Claude/plugins" / plugin / "skills/pr-review-canvas/renderer.js")
                          for plugin in ("pr-review-canvas", "cursor-team-kit")]], check=True)


class ClaudeOverrideTests(unittest.TestCase):
    def test_versionless_source_change_behind_renderer_override_is_rejected(self):
        # A source fix must not be hidden merely because the generated file is
        # overridden. Exercise the real generator on a disposable repository.
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / "plugins"
            shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(
                ".git", "node_modules", ".venv", "__pycache__", ".build-*"))
            renderer = fixture / "cursor-team-kit/skills/pr-review-canvas/renderer.js"
            renderer.write_text(renderer.read_text() + "\n// upstream fix without a version bump\n")
            result = subprocess.run(["node", "Claude/scripts/build.mjs", "--check"],
                                    cwd=fixture, capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn("Upstream changed behind these overrides", result.stderr)
            self.assertIn("cursor-team-kit/skills/pr-review-canvas/renderer.js", result.stderr)


if __name__ == "__main__":
    unittest.main()
