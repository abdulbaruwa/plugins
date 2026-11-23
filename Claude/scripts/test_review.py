"""Run the established PR artifact contract against both generated Claude packages."""

import importlib.util
import json
import re
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

    def test_documented_example_renders_its_actual_file(self):
        subprocess.run(["node", str(ROOT / "Claude/scripts/test_examples.cjs")], check=True)


class ClaudeOverrideTests(unittest.TestCase):
    def test_versionless_source_change_behind_renderer_override_is_rejected(self):
        # A source fix must not be hidden merely because the generated file is
        # overridden. Exercise the real generator on a disposable repository.
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / "plugins"
            shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(
                ".git", "node_modules", ".venv", "__pycache__", ".build-*"))
            package = fixture / "Claude/plugins/pr-review-canvas/skills/pr-review-canvas"
            cache = package / "__pycache__"
            cache.mkdir()
            (cache / "assemble.cpython-test.pyc").write_bytes(b"runtime cache")
            (package / "assemble.pyc").write_bytes(b"legacy runtime cache")
            (package / "assemble.pyo").write_bytes(b"optimized runtime cache")
            clean = subprocess.run(["node", "Claude/scripts/build.mjs", "--check"],
                                   cwd=fixture, capture_output=True, text=True)
            self.assertEqual(clean.returncode, 0, clean.stderr)
            renderer = fixture / "cursor-team-kit/skills/pr-review-canvas/renderer.js"
            renderer.write_text(renderer.read_text() + "\n// upstream fix without a version bump\n")
            result = subprocess.run(["node", "Claude/scripts/build.mjs", "--check"],
                                    cwd=fixture, capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn("Upstream changed behind these overrides", result.stderr)
            self.assertIn("cursor-team-kit/skills/pr-review-canvas/renderer.js", result.stderr)


class ClaudeDynamicRegistrationTests(unittest.TestCase):
    def test_dynamic_recipes_do_not_invent_credentials(self):
        readme = (ROOT / "Claude/README.md").read_text()
        for name in ("mixpanel", "netsuite", "redo", "expensify"):
            with self.subTest(provider=name):
                row = next(line for line in readme.splitlines() if line.startswith(f"| {name} | "))
                payload = re.search(r"add-json \S+ '([^']+)'", row)
                self.assertIsNotNone(payload)
                server = json.loads(payload.group(1))
                self.assertEqual(server["type"], "http")
                oauth = server["oauth"]
                self.assertNotIn("clientId", oauth)
                self.assertNotIn("clientSecret", oauth)
                self.assertEqual(oauth["callbackPort"], 8787)
                self.assertNotIn("--client-secret", row)
                if name == "netsuite":
                    self.assertEqual(oauth["scopes"], "mcp")
                if name == "expensify":
                    self.assertEqual(oauth["scopes"], "mcp:tools")

    def test_front_has_no_unqualified_registration_command(self):
        row = next(line for line in (ROOT / "Claude/README.md").read_text().splitlines()
                   if line.startswith("| front | "))
        self.assertNotIn("claude mcp add", row)
        self.assertIn("qualify", row.lower())


class ClaudeCredentialTests(unittest.TestCase):
    def test_createos_requires_sensitive_native_key_configuration(self):
        root = ROOT / "Claude/third_party/createos"
        manifest = json.loads((root / ".claude-plugin/plugin.json").read_text())
        key = manifest["userConfig"]["CREATEOS_API_KEY"]
        self.assertTrue(key["required"])
        self.assertTrue(key["sensitive"])
        self.assertNotIn("default", key)
        server = json.loads((root / ".mcp.json").read_text())["mcpServers"]["createos"]
        self.assertEqual(server["headers"]["X-Api-Key"], "${user_config.CREATEOS_API_KEY}")
        self.assertNotIn("oauth", server)

    def test_upstream_variable_declaration_requires_native_review(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / "plugins"
            shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(
                ".git", "node_modules", ".venv", "__pycache__", ".build-*"))
            path = fixture / "third_party/createos/.cursor-plugin/plugin.json"
            manifest = json.loads(path.read_text())
            manifest["variables"] = {"properties": {"CREATEOS_API_KEY": {"type": "string"}}}
            path.write_text(json.dumps(manifest))
            result = subprocess.run(["node", "Claude/scripts/build.mjs", "--check"],
                                    cwd=fixture, capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn("review the native MCP variable CREATEOS_API_KEY", result.stderr)


if __name__ == "__main__":
    unittest.main()
