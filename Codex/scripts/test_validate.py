"""Exercise loading failures and containment/authentication boundaries on real files."""

import json
from pathlib import Path
import shutil
import tempfile
import unittest

from validate import validate


class PackageValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        source = Path(__file__).resolve().parents[1]
        shutil.copytree(source / "schemas", self.root / "schemas")
        shutil.copytree(source / "plugins/teaching", self.root / "plugins/teaching")
        (self.root / "README.md").write_text("Install guide")
        (self.root / "COMPATIBILITY.md").write_text("Compatibility")
        self.catalog_path = self.root / ".agents/plugins/marketplace.json"
        self.catalog_path.parent.mkdir(parents=True)
        self.catalog = {
            "name": "test",
            "interface": {"displayName": "Test"},
            "plugins": [{
                "name": "teaching",
                "source": {"source": "local", "path": "./plugins/teaching"},
                "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
                "category": "Productivity",
            }],
        }
        self.write(self.catalog_path, self.catalog)
        self.write(self.root / "inventory.json", {"plugins": [{
            "originalName": "teaching", "name": "teaching",
            "path": "./plugins/teaching", "status": "adapted-skills",
        }]})
        self.plugin = self.root / "plugins/teaching"

    @staticmethod
    def write(path, value):
        path.write_text(json.dumps(value))

    def assert_error(self, text):
        errors, _ = validate(self.root)
        self.assertTrue(any(text in error for error in errors), errors)

    def test_real_package_loads(self):
        errors, counts = validate(self.root)
        self.assertEqual(errors, [])
        self.assertEqual(counts["skills"], 2)

    def test_catalog_cannot_escape_root(self):
        self.catalog["plugins"][0]["source"]["path"] = "./../outside"
        self.write(self.catalog_path, self.catalog)
        self.assert_error("contained ./ local path")

    def test_duplicate_entry_is_rejected(self):
        self.catalog["plugins"].append(self.catalog["plugins"][0])
        self.write(self.catalog_path, self.catalog)
        self.assert_error("duplicate plugin")

    def test_invalid_json_reports_the_file(self):
        (self.plugin / "plugin.json").write_text("{")
        self.assert_error("plugin.json")

    def test_invalid_catalog_entry_reports_error_instead_of_crashing(self):
        self.catalog["plugins"].append("not an entry")
        self.write(self.catalog_path, self.catalog)
        self.assert_error("entry must be an object")

    def test_bad_invocation_rewrite_cannot_corrupt_bare_resource_paths(self):
        skill = self.plugin / "skills/create-learning-path/SKILL.md"
        skill.write_text("---\nname: create-learning-path\ndescription: A workflow\n---\nRead ..$other-skill/SKILL.md.")
        self.assert_error("corrupted a relative resource path")

    def test_skill_metadata_must_match_directory(self):
        skill = self.plugin / "skills/create-learning-path/SKILL.md"
        skill.write_text("---\nname: different\ndescription: A workflow\n---\nBody")
        self.assert_error("name must match")

    def test_broken_resource_reference_is_rejected(self):
        (self.plugin / "skills/create-learning-path/SKILL.md").write_text(
            "---\nname: create-learning-path\ndescription: A workflow\n---\nRead [missing](missing.md).")
        self.assert_error("broken relative reference")

    def test_symlink_cannot_escape_package(self):
        (self.root / "outside.md").write_text("Private material")
        (self.plugin / "exposed.md").symlink_to(self.root / "outside.md")
        self.assert_error("resource escapes plugin")

    def test_portable_header_does_not_expand_tokens(self):
        self.write(self.plugin / "mcp.json", {
            "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
            "mcpServers": {"provider": {"type": "streamable-http",
                "url": "https://example.com/mcp",
                "headers": {"Authorization": "Bearer ${TOKEN}"}}},
        })
        self.assert_error("credentials or placeholders")

    def test_cursor_gateway_is_not_a_provider_port(self):
        self.write(self.plugin / "mcp.json", {
            "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
            "mcpServers": {"provider": {"type": "streamable-http",
                "url": "https://api.cursor.com/rest-mcp/test/mcp"}},
        })
        self.assert_error("host-specific gateway")

    def test_setup_only_package_cannot_silently_enable_mcp(self):
        inventory = json.loads((self.root / "inventory.json").read_text())
        inventory["plugins"][0]["status"] = "configuration-required"
        self.write(self.root / "inventory.json", inventory)
        self.write(self.plugin / "mcp.json", {
            "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
            "mcpServers": {},
        })
        self.assert_error("incomplete setup exposes MCP")


if __name__ == "__main__":
    unittest.main()
