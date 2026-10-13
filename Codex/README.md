# Codex plugin port

A standalone Codex marketplace adapted from this repository's 101 Cursor plugin entries. All work lives under `Codex/`; the original plugin folders are preserved.

The port exposes **88 packages**: 17 adapted workflow plugins, 56 provider MCP bundles, and 15 setup workflows requiring credentials, tenant details, or provider registration. Thirteen host-specific or unimplemented entries are excluded. Read the [full compatibility review](COMPATIBILITY.md) before assuming feature parity or a connected service.

This is a community port. Original author metadata and each plugin's MIT license are preserved. It is not an official Cursor or OpenAI release.

## Install selected plugins

From the repository root, register this standalone marketplace:

```sh
codex plugin marketplace add ./Codex
```

Then browse **Cursor Plugins for Codex (community port)** in the app, or install a selected package with the CLI:

```sh
codex plugin add teaching@cursor-plugins-codex
codex plugin add codex-team-kit@cursor-plugins-codex
```

Refresh or restart the client if the catalog has not appeared. Use `$skill-name` to invoke an installed skill. Install only the workflows you intend to use; plugins can contain overlapping skill names. Nothing was installed into your account by creating this folder.

For a configuration-required package, run its `$setup-<plugin-name>` skill. Its `references/config.example.toml`, when present, is a starting point for Codex-native configuration. Its `references/upstream-mcp.json` is provenance evidence, not an executable connection. Complete provider registration and authentication before claiming that tools are available. Native configuration should preserve unrelated settings and hold only environment variable names or client-managed credentials.

## Validate locally

Python 3.11 or later and Node.js 18 or later are required for the checks; the commands below use Python 3.12. From the repository root:

```sh
python3.12 -m venv Codex/.venv
Codex/.venv/bin/python -m pip install -r Codex/requirements-dev.txt
Codex/.venv/bin/python Codex/scripts/validate.py
Codex/.venv/bin/python -m unittest discover -s Codex/scripts -p 'test_*.py'
```

The checks validate packaging and reject unsafe or misleading portable MCP configuration. They do not authenticate providers or prove every workflow's runtime behavior. [inventory.json](inventory.json) records each source plugin, port status, and original version against a fixed source commit.

## Layout

```text
Codex/
├── .agents/plugins/marketplace.json
├── plugins/<plugin-name>/
│   ├── plugin.json
│   ├── mcp.json                 # When portable connection data exists
│   ├── skills/<name>/SKILL.md   # When workflows or setup are supplied
│   ├── references/             # Consulted procedures and setup evidence
│   ├── assets/
│   └── LICENSE
├── schemas/                    # Vendored Agent Plugins 1.0.0 schemas
├── scripts/                    # Validation and regression checks
├── COMPATIBILITY.md
└── inventory.json
```

New plugin packages use the portable root manifest supported by [OpenAI's plugin packaging guidance](https://developers.openai.com/plugins/build/plugins). MCP URLs and headers are literal under the [Agent Plugins specification](https://agent-plugins.org/specification); credentials use [Codex-native MCP configuration](https://learn.chatgpt.com/docs/extend/mcp). The native SDK workflow follows the [Codex SDK guide](https://learn.chatgpt.com/docs/codex-sdk).

When updating a port, compare it with the named source version, preserve attribution and invocation policy, update its compatibility entry, and rerun validation. Changes to the original catalog are reported as inventory drift instead of silently broadening the port.
