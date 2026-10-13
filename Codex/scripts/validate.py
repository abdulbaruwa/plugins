#!/usr/bin/env python3
"""Validate the standalone marketplace without installing or contacting plugins."""

import argparse
import json
from pathlib import Path
import re
import sys
import tomllib
from urllib.parse import unquote, urlsplit

from jsonschema import Draft202012Validator
import yaml


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def contained(root, path):
    try:
        return path.resolve().is_relative_to(root.resolve())
    except (OSError, RuntimeError, ValueError):
        return False


def validate(root):
    root = root.resolve()
    errors = []
    counts = {"plugins": 0, "skills": 0, "mcp_servers": 0}

    def fail(path, message):
        errors.append(f"{path}: {message}")

    def read(path, reader=load_json):
        try:
            return reader(path)
        except (OSError, ValueError, yaml.YAMLError) as exc:
            fail(path, str(exc))
            return None

    def check_schema(path, data, schema):
        schema_errors = list(Draft202012Validator(schema).iter_errors(data))
        for error in schema_errors:
            fail(path, f"{'.'.join(map(str, error.path)) or '/'}: {error.message}")
        return not schema_errors

    def mapping(path, value, field):
        if not isinstance(value, dict):
            fail(path, f"{field} must be an object")
            return {}
        return value

    def check_stdio(path, directory, name, server):
        command = server["command"]
        if command.startswith("./"):
            executable = directory / command
            if not contained(directory, executable) or not executable.is_file():
                fail(path, f"{name}: command must resolve to a file inside the plugin")
        elif command in (".", "..") or "\x00" in command or re.search(r"[\s/\\]", command):
            fail(path, f"{name}: command must be a bare executable or a contained ./ path")
        cwd = server.get("cwd")
        if cwd is None:
            return
        if cwd == "${PLUGIN_ROOT}" or cwd.startswith("${PLUGIN_ROOT}/"):
            target = directory / cwd.removeprefix("${PLUGIN_ROOT}").lstrip("/")
            base = directory
        elif cwd == "${PLUGIN_DATA}" or cwd.startswith("${PLUGIN_DATA}/"):
            # The client supplies the real data root. Check traversal now; its
            # actual symlinks and containment remain a runtime client check.
            base = root / ".validation-plugin-data" / directory.name
            target = base / cwd.removeprefix("${PLUGIN_DATA}").lstrip("/")
        else:
            base, target = directory, directory / cwd
        if "\\" in cwd or not contained(base, target):
            fail(path, f"{name}: cwd must stay inside its plugin or PLUGIN_DATA root")

    catalog_path = root / ".agents/plugins/marketplace.json"
    catalog = read(catalog_path)
    inventory = read(root / "inventory.json")
    schemas = {name: read(root / "schemas" / f"{name}.schema.json") for name in ("plugin", "mcp")}
    if catalog is None or inventory is None or any(s is None for s in schemas.values()):
        return errors, counts
    if not isinstance(catalog, dict) or not isinstance(catalog.get("plugins"), list):
        fail(catalog_path, "expected an object with plugins[]")
        return errors, counts
    if not isinstance(inventory, dict) or not isinstance(inventory.get("plugins"), list):
        fail(root / "inventory.json", "expected an object with plugins[]")
        return errors, counts
    catalog_interface = mapping(catalog_path, catalog.get("interface", {}), "interface")
    if not isinstance(catalog.get("name"), str) or not catalog["name"].strip() or not isinstance(catalog_interface.get("displayName"), str) or not catalog_interface["displayName"].strip():
        fail(catalog_path, "missing marketplace identity or displayName")
    seen = set()
    paths = set()
    for entry in catalog["plugins"]:
        if not isinstance(entry, dict):
            fail(catalog_path, "plugin entry must be an object")
            continue
        name = entry.get("name", "")
        if not isinstance(name, str):
            fail(catalog_path, "plugin name must be a string")
            continue
        if name in seen:
            fail(catalog_path, f"duplicate plugin {name}")
        seen.add(name)
        source = entry.get("source", {})
        rel = source.get("path", "") if isinstance(source, dict) else ""
        if not isinstance(rel, str):
            fail(catalog_path, f"{name}: source path must be a string")
            continue
        directory = root / rel
        if not isinstance(source, dict) or source.get("source") != "local" or not rel.startswith("./") or not contained(root, directory):
            fail(catalog_path, f"{name}: source must be a contained ./ local path")
            continue
        if rel in paths:
            fail(catalog_path, f"duplicate source path {rel}")
        paths.add(rel)
        if entry.get("policy") != {"installation": "AVAILABLE", "authentication": "ON_INSTALL"} or not entry.get("category"):
            fail(catalog_path, f"{name}: missing installation/authentication policy or category")
        manifest_path = directory / "plugin.json"
        manifest = read(manifest_path)
        if manifest is None:
            continue
        if not check_schema(manifest_path, manifest, schemas["plugin"]):
            continue
        if manifest.get("name") != name:
            fail(manifest_path, "name does not match catalog")
        for field in ("version", "description", "author", "license"):
            if not manifest.get(field):
                fail(manifest_path, f"missing {field}")
        extensions = manifest.get("extensions", {})
        overlay = extensions.get("com.openai", {}) if isinstance(extensions, dict) else {}
        if not isinstance(overlay, dict):
            fail(manifest_path, "OpenAI overlay must be an object")
            overlay = {}
        interface = overlay.get("interface", {})
        if not isinstance(interface, dict):
            fail(manifest_path, "OpenAI interface must be an object")
            interface = {}
        if not interface.get("displayName"):
            fail(manifest_path, "missing OpenAI displayName")
        for field in ("logo", "composerIcon"):
            rel_asset = interface.get(field)
            if rel_asset and (not isinstance(rel_asset, str) or not rel_asset.startswith("./") or not contained(directory, directory / rel_asset) or not (directory / rel_asset).is_file()):
                fail(manifest_path, f"invalid {field} resource {rel_asset}")
        onboarding = overlay.get("onboardingSkill")
        if onboarding and (not isinstance(onboarding, str) or not onboarding.startswith("./") or not contained(directory, directory / onboarding) or not (directory / onboarding).is_file()):
            fail(manifest_path, "invalid onboardingSkill resource")
        if not (directory / "LICENSE").is_file():
            fail(directory, "missing upstream license")
        for file in directory.rglob("*"):
            if not contained(directory, file):
                fail(file, "resource escapes plugin")
        skills = list((directory / "skills").glob("*/SKILL.md"))
        for skill in skills:
            if not contained(directory, skill):
                continue
            text = skill.read_text(encoding="utf-8")
            if re.search(r"\.\.?\$[a-z][a-z0-9-]*(?:/|\b)", text):
                fail(skill, "invocation syntax corrupted a relative resource path")
            match = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
            if not match:
                fail(skill, "missing frontmatter")
                continue
            try:
                metadata = yaml.safe_load(match.group(1))
            except yaml.YAMLError as exc:
                fail(skill, str(exc))
                continue
            if not isinstance(metadata, dict):
                fail(skill, "frontmatter must be a mapping")
                continue
            if metadata.get("name") != skill.parent.name or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", skill.parent.name) or len(skill.parent.name) > 64:
                fail(skill, "name must match its kebab-case directory")
            if not isinstance(metadata.get("description"), str) or not metadata["description"].strip():
                fail(skill, "description must be a nonempty string")
            policy = skill.parent / "agents/openai.yaml"
            if policy.exists():
                value = read(policy, lambda p: yaml.safe_load(p.read_text()))
                value = mapping(policy, value, "skill metadata")
                invocation = mapping(policy, value.get("policy", {}), "policy")
                if not isinstance(invocation.get("allow_implicit_invocation"), bool):
                    fail(policy, "invocation policy must be a boolean")
        mcp_path = directory / "mcp.json"
        server_count = 0
        if mcp_path.exists():
            mcp = read(mcp_path)
            if mcp is not None:
                if not check_schema(mcp_path, mcp, schemas["mcp"]):
                    continue
                for server_name, server in mcp.get("mcpServers", {}).items():
                    if not isinstance(server, dict):
                        fail(mcp_path, f"{server_name}: server must be an object")
                        continue
                    if server.get("type") in ("streamable-http", "sse"):
                        try:
                            url = urlsplit(server["url"])
                            url.port
                        except ValueError:
                            fail(mcp_path, f"{server_name}: invalid literal HTTPS URL")
                            continue
                        if url.scheme != "https" or not url.hostname or url.username or url.password or url.fragment or "${" in server.get("url", ""):
                            fail(mcp_path, f"{server_name}: invalid literal HTTPS URL")
                        if url.hostname and (url.hostname.endswith("cursor.com") or url.hostname.endswith("grok.com")):
                            fail(mcp_path, f"{server_name}: host-specific gateway")
                        for header, value in server.get("headers", {}).items():
                            if "${" in value or header.lower() in ("authorization", "api-key", "x-api-key"):
                                fail(mcp_path, f"{server_name}: credentials or placeholders in literal header")
                    elif server["type"] == "stdio":
                        check_stdio(mcp_path, directory, server_name, server)
                    for value in [*server.get("args", []), *server.get("env", {}).values()]:
                        if re.search(r"\$\{(?!PLUGIN_ROOT\}|PLUGIN_DATA\})", value):
                            fail(mcp_path, f"{server_name}: unsupported environment interpolation")
                server_count = len(mcp["mcpServers"])
                counts["mcp_servers"] += server_count
        if not skills and not server_count:
            fail(directory, "plugin has no usable components")
        for example in directory.rglob("*.toml"):
            if not contained(directory, example):
                continue
            read(example, lambda p: tomllib.loads(p.read_text()))
        for markdown in directory.rglob("*.md"):
            if not contained(directory, markdown):
                continue
            prose = re.sub(r"(?ms)^```.*?^```[^\n]*", "", markdown.read_text(encoding="utf-8"))
            for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", prose):
                target = target.strip().split(" ", 1)[0].strip("<>")
                if not target or target.startswith(("#", "http:", "https:", "mailto:", "/", "$")):
                    continue
                target = unquote(target.split("#", 1)[0])
                if not target or any(x in target for x in ("<", ">", "*", "{", "}")):
                    continue
                resolved = markdown.parent / target
                if not contained(directory, resolved) or not resolved.exists():
                    fail(markdown, f"broken relative reference {target}")
        counts["plugins"] += 1
        counts["skills"] += len(skills)
    rows = []
    for row in inventory["plugins"]:
        if not isinstance(row, dict) or not isinstance(row.get("originalName"), str) or not isinstance(row.get("name"), str):
            fail(root / "inventory.json", "inventory entry must contain string names")
            continue
        if row.get("path") is not None and not isinstance(row["path"], str):
            fail(root / "inventory.json", "inventory path must be a string or null")
            continue
        rows.append(row)
    originals = [row.get("originalName") for row in rows]
    if len(set(originals)) != len(originals):
        fail(root / "inventory.json", "duplicate source plugins")
    represented = {row["name"] for row in rows if row.get("path")}
    if represented != seen:
        fail(root / "inventory.json", "catalog and coverage inventory disagree")
    if {p.name for p in (root / "plugins").iterdir() if p.is_dir()} != seen:
        fail(root / "plugins", "unlisted or missing plugin directory")
    for row in rows:
        if row.get("status") == "blocked" and row.get("path"):
            fail(root / "inventory.json", f"blocked plugin {row['name']} is exposed")
        if row.get("status") == "configuration-required" and row.get("path") and (root / row["path"] / "mcp.json").exists():
            fail(root / "inventory.json", f"{row['name']}: incomplete setup exposes MCP")
    source_catalog = root.parent / ".cursor-plugin/marketplace.json"
    if source_catalog.exists():
        upstream = read(source_catalog)
        if upstream and {entry["name"] for entry in upstream["plugins"]} != set(originals):
            fail(root / "inventory.json", "coverage differs from source catalog")
    return errors, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    errors, counts = validate(args.root)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Validated {counts['plugins']} plugins, {counts['skills']} skills, and {counts['mcp_servers']} bundled MCP servers (static checks only).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
