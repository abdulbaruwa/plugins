#!/usr/bin/env node
// Builds the Claude Code marketplace in Claude/ from the Cursor plugins at the repo root.
//
//   node Claude/scripts/build.mjs              regenerate Claude/plugins, Claude/third_party, the marketplace, and Claude/README.md
//   node Claude/scripts/build.mjs --lock       regenerate, then record the upstream files behind each override as reviewed
//   node Claude/scripts/build.mjs --check      read-only: exit 1 if the committed output is stale or an override's upstream changed
//   node Claude/scripts/build.mjs --validate   read-only: run `claude plugin validate --strict` on the committed output
//   node Claude/scripts/build.mjs --residuals  read-only: list leftover Cursor-specific lines in the committed output
//
// Porting decisions live in port.config.mjs. Hand-written Claude files live in
// Claude/overrides/<plugin>/ and replace the converted file of the same path.
// Every build happens in a staging directory first, so a failed build leaves the
// committed output untouched.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as config from "./port.config.mjs";

const claudeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (path.basename(claudeRoot) !== "Claude" || !fs.existsSync(path.join(claudeRoot, "scripts", "port.config.mjs"))) {
  throw new Error(`build.mjs must live in Claude/scripts/ (found ${claudeRoot}); refusing to touch anything`);
}
const repoRoot = path.resolve(claudeRoot, "..");
const overridesRoot = path.join(claudeRoot, "overrides");
const lockPath = path.join(overridesRoot, "upstream.lock.json");
const GENERATED = ["plugins", "third_party", ".claude-plugin", "README.md"];
const IGNORED_NAMES = new Set([".DS_Store", "node_modules", "__pycache__"]);
const READ_ONLY_TOOLS = ["Edit", "Write", "NotebookEdit"];
const TEXT_FILE = /\.(md|mdc|sh|ts|mjs|js|json|yaml|yml|tsv|txt|html|css)$/;
const MCP_SERVER_KEYS = new Set(["type", "url", "headers", "command", "args", "env", "placement", "auth"]);

const flags = new Set(process.argv.slice(2));

// --- files -----------------------------------------------------------------

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${path.relative(repoRoot, file)}: ${error.message}`);
  }
}

function writeFile(file, content, mode) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  if (mode) fs.chmodSync(file, mode);
}

function writeJson(file, value) {
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

// Relative paths always use "/", whatever the OS, so config, lock, and checks agree.
function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORED_NAMES.has(entry.name) || (entry.isFile() && /\.py[co]$/.test(entry.name))) return [];
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`${path.relative(repoRoot, full)}: symlinks are not supported`);
    if (entry.isDirectory()) return walk(full, base);
    if (entry.isFile()) return [path.relative(base, full).split(path.sep).join("/")];
    return [];
  });
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function prune(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)),
  );
}

// --- frontmatter -------------------------------------------------------------

function splitFrontmatter(text) {
  const match = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return { lines: null, body: text };
  return { lines: match[1].split(/\r?\n/), body: text.slice(match[0].length) };
}

function joinFrontmatter(lines, body) {
  return lines ? `---\n${lines.join("\n")}\n---\n${body}` : body;
}

// A top-level key spans its line plus indented, list, and blank continuation lines.
function findKey(lines, key) {
  const start = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && (/^\s/.test(lines[end]) || /^- /.test(lines[end]) || lines[end].trim() === "")) end++;
  while (end > start + 1 && lines[end - 1].trim() === "") end--;
  const value = lines[start]
    .slice(key.length + 1)
    .replace(/\s+#.*$/, "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2");
  return { start, count: end - start, value };
}

function removeKey(lines, key) {
  const found = findKey(lines, key);
  if (found) lines.splice(found.start, found.count);
  return found?.value;
}

function frontmatterValue(lines, key) {
  return lines ? findKey(lines, key)?.value : undefined;
}

function toolList(value) {
  return (value ?? "").replace(/^\[|\]$/g, "").split(",").map((t) => t.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

function convertAgentFrontmatter(lines) {
  const model = removeKey(lines, "model");
  const readonly = removeKey(lines, "readonly");
  const background = removeKey(lines, "is_background");
  if (model) {
    const mapped = config.mapAgentModel(model);
    lines.push(`model: ${mapped.model}`);
    if (mapped.effort && !findKey(lines, "effort")) lines.push(`effort: ${mapped.effort}`);
  }
  if (readonly === "true") {
    const tools = findKey(lines, "tools");
    if (tools) {
      removeKey(lines, "tools");
      lines.push(`tools: ${toolList(tools.value).filter((t) => !READ_ONLY_TOOLS.includes(t)).join(", ")}`);
    } else {
      const merged = [...new Set([...toolList(removeKey(lines, "disallowedTools")), ...READ_ONLY_TOOLS])];
      lines.push(`disallowedTools: ${merged.join(", ")}`);
    }
  }
  if (background === "true") lines.push("background: true");
}

// Claude Code names a skill's command after `name`; Cursor allows display names there.
function convertSkillFrontmatter(lines, dirName) {
  config.CURSOR_ONLY_SKILL_KEYS.forEach((key) => removeKey(lines, key));
  const name = findKey(lines, "name");
  if (name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name.value)) lines[name.start] = `name: ${dirName}`;
}

// --- text rewrites -----------------------------------------------------------

// Claude Code names plugin agents `<plugin>:<agent>`. Qualify every reference in
// a subagent_type, and any backticked agent name that is not also a skill name.
function namespaceAgents(text, agentOwners, skillNames) {
  const qualify = (name) => (agentOwners.has(name) ? `${agentOwners.get(name)}:${name}` : name);
  return text
    .replace(/subagent_type: "([\w-]+)"/g, (_, name) => `subagent_type: "${qualify(name)}"`)
    .replace(/subagent_type: ([a-z][\w-]*)(?=[\s`.,;)])/g, (_, name) => `subagent_type: ${qualify(name)}`)
    .replace(/`([\w-]+)` (subagents?)\b/g, (_, name, noun) => `\`${qualify(name)}\` ${noun}`)
    .replace(/`([\w-]+)`/g, (match, name) => (skillNames.has(name) ? match : `\`${qualify(name)}\``));
}

function rewriteMarkdown(text, settings, ctx, usedRewrites) {
  const sets = settings.rewriteSets ?? config.DEFAULT_REWRITE_SETS;
  let out = text;
  for (const set of sets) for (const [pattern, replacement] of config.REWRITE_SETS[set]) out = out.replace(pattern, replacement);
  (settings.rewrites ?? []).forEach(([pattern, replacement], index) => {
    const next = out.replace(pattern, replacement);
    if (next !== out) usedRewrites.add(index);
    out = next;
  });
  if (sets.includes("tools")) out = namespaceAgents(out, ctx.agentOwners, ctx.skillNames);
  return out.replaceAll(config.KEEP, "");
}

function applyPatches(rel, text, patches, used) {
  let out = text;
  patches.forEach((patch, index) => {
    if (patch.file !== rel || !out.includes(patch.find)) return;
    out = out.split(patch.find).join(patch.replace);
    used.add(index);
  });
  return out;
}

// Insert a note after the frontmatter and, when the body opens with one, the first heading.
function prependNotes(rel, text, prepends, used) {
  let out = text;
  prepends.forEach((note, index) => {
    if (note.file !== rel) return;
    const { lines, body } = splitFrontmatter(out);
    const heading = body.match(/^(\s*# [^\n]*\n)/);
    const head = heading ? heading[1] : "";
    out = joinFrontmatter(lines, `${head}${head ? "\n" : ""}${note.text}\n\n${body.slice(head.length).replace(/^\n+/, "")}`);
    used.add(index);
  });
  return out;
}

// --- components --------------------------------------------------------------

// awk's index/substr keeps the plugin path literal (no sed or gsub metacharacters).
const SESSION_CONTEXT_SCRIPT = `#!/bin/sh
# Prints this plugin's always-on context at session start. Generated by Claude/scripts/build.mjs.
for f in "$CLAUDE_PLUGIN_ROOT"/context/*.md; do
  [ -f "$f" ] || continue
  awk '{ r = ENVIRON["CLAUDE_PLUGIN_ROOT"]; s = $0; o = ""
         while ((i = index(s, "{{PLUGIN_ROOT}}")) > 0) { o = o substr(s, 1, i - 1) r; s = substr(s, i + 15) }
         print o s }' "$f"
  printf '\\n'
done
`;

function userOnlySkills(outDir) {
  return walk(path.join(outDir, "skills"))
    .filter((rel) => /^[^/]+\/SKILL\.md$/.test(rel))
    .filter((rel) => frontmatterValue(splitFrontmatter(fs.readFileSync(path.join(outDir, "skills", rel), "utf8")).lines, "disable-model-invocation") === "true")
    .map((rel) => rel.split("/")[0])
    .sort();
}

// Skills marked disable-model-invocation are missing from Claude's skill list and
// the Skill tool refuses them, yet sibling skills route to them by name.
function skillIndexText(pluginName, skills) {
  return `The ${pluginName} plugin's skills below are user-invocable only, so they are not in your skill list and the Skill tool rejects them. When a skill tells you to use one of them (for example "the **${skills[0]}** skill" or \`/${pluginName}:${skills[0]}\`), Read \`{{PLUGIN_ROOT}}/skills/<name>/SKILL.md\` and follow it instead: ${skills.join(", ")}. Paths written \`<${pluginName} root>/…\` in its skills mean \`{{PLUGIN_ROOT}}/…\`. Subagents do not see this note, so give them absolute paths.\n`;
}

// Subagents never see the SessionStart note, but ${CLAUDE_PLUGIN_ROOT} is expanded in agent bodies.
function agentNote(skills) {
  const list = skills.map((s) => `\`${s}\``).join(", ");
  const subject = skills.length === 1 ? `skill ${list} is` : `skills ${list} are`;
  return `> **Claude Code port.** This plugin's ${subject} user-only, so the Skill tool refuses them. When these instructions say to load, read, or apply one, Read \`\${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md\` and follow it.`;
}

// Cursor rules become Claude context: always-apply rules are printed by a
// SessionStart hook, glob rules become skills scoped with `paths`, and the rest
// become model-invoked skills.
function sessionContext(rules, outDir, pluginName, settings, userOnly) {
  const context = [];
  for (const { rel, text } of rules) {
    const { lines, body } = splitFrontmatter(text);
    const base = path.posix.basename(rel, path.posix.extname(rel));
    const description = frontmatterValue(lines, "description") ?? base;
    const globs = frontmatterValue(lines, "globs");
    if (frontmatterValue(lines, "alwaysApply") === "true") {
      context.push([`${base}.md`, body.trimStart()]);
      continue;
    }
    const paths = globs ? `\npaths: ${JSON.stringify(globs.split(",").map((g) => g.trim()).filter(Boolean))}` : "";
    writeFile(path.join(outDir, "skills", `rule-${base}`, "SKILL.md"), `---\nname: rule-${base}\ndescription: ${JSON.stringify(description)}${paths}\n---\n${body}`);
  }
  if (settings.skillIndex && userOnly.length) context.push(["user-only-skills.md", skillIndexText(pluginName, userOnly)]);
  if (context.length === 0) return null;

  for (const [name, text] of context) writeFile(path.join(outDir, "context", name), text);
  writeFile(path.join(outDir, "hooks", "session-context.sh"), SESSION_CONTEXT_SCRIPT, 0o755);
  return {
    SessionStart: [{ hooks: [{ type: "command", command: 'sh "${CLAUDE_PLUGIN_ROOT}/hooks/session-context.sh"', timeout: 10 }] }],
  };
}

function mergeHooks(base, extra) {
  const hooks = structuredClone(base?.hooks ?? {});
  for (const [event, entries] of Object.entries(extra ?? {})) hooks[event] = [...(hooks[event] ?? []), ...entries];
  return { ...(base?.description && { description: base.description }), hooks };
}

function convertMcp(mcp, manifest, settings) {
  const vars = manifest.variables?.properties ?? {};
  const required = new Set(manifest.variables?.required ?? []);
  const servers = {};
  for (const [id, server] of Object.entries(mcp.mcpServers ?? {})) {
    const unknown = Object.keys(server).filter((key) => !MCP_SERVER_KEYS.has(key));
    if (unknown.length) throw new Error(`${manifest.name}: MCP server "${id}" has keys the converter does not handle: ${unknown.join(", ")}`);
    if (server.auth) throw new Error(`${manifest.name}: MCP server "${id}" needs OAuth client config; list it in MANUAL_MCP`);
    if (/\bcursor\.(com|sh)\b/.test(server.url ?? "")) throw new Error(`${manifest.name}: MCP server "${id}" is hosted by Cursor; list it in SKIP`);
    if (server.command) {
      servers[id] = prune({ command: server.command, args: server.args, env: server.env });
    } else {
      const headers = { ...server.headers };
      delete headers["X-Cursor-Plugin"];
      servers[id] = prune({
        type: server.type === "sse" ? "sse" : "http",
        url: server.url,
        headers: Object.keys(headers).length ? headers : undefined,
        oauth: settings.mcpOAuth,
      });
    }
  }
  let json = JSON.stringify(servers);
  const used = Object.keys(vars).filter((name) => json.includes(`\${${name}}`));
  for (const name of used) json = json.split(`\${${name}}`).join(`\${user_config.${name}}`);
  const unresolved = json.match(/\$\{(?!user_config\.|CLAUDE_PLUGIN_(?:ROOT|DATA)\})[^}]*\}/g);
  if (unresolved) throw new Error(`${manifest.name}: MCP config references undeclared variables ${[...new Set(unresolved)].join(", ")}`);
  const userConfig = Object.fromEntries(
    used.map((name) => {
      const v = vars[name];
      return [
        name,
        prune({
          type: "string",
          title: v.title ?? name,
          description: v.description ?? v.title ?? name,
          required: required.has(name) || undefined,
          default: v.default,
          sensitive: v.writeOnly === true || /TOKEN|KEY|SECRET|PASSWORD/i.test(name) || undefined,
        }),
      ];
    }),
  );
  return { mcpServers: JSON.parse(json), userConfig: used.length ? userConfig : undefined };
}

function readmeBanner(entry, notes, upstreamBody) {
  const lines = [
    "> [!NOTE]",
    `> **Claude Code port** of [\`${entry.source}/\`](../../../${entry.source}/), generated by [\`Claude/scripts/build.mjs\`](../../scripts/build.mjs). Change \`Claude/scripts/port.config.mjs\` or \`Claude/overrides/\`, not this folder.`,
    ">",
    `> Install: \`/plugin marketplace add <path-to-repo>/Claude\`, then \`/plugin install ${entry.name}@${config.MARKETPLACE.name}\`.`,
  ];
  if (notes.length) lines.push(">", "> Changes from the Cursor version:", ...notes.map((n) => `> - ${n}`));
  if (upstreamBody) lines.push(">", "> The rest of this page is the upstream Cursor README. Where it disagrees with the notes above, the notes apply.");
  return `${lines.join("\n")}\n\n`;
}

// Relative Markdown links whose target exists upstream but not in the port were broken by the port.
function brokenLinks(outDir, srcDir) {
  const broken = [];
  for (const rel of walk(outDir)) {
    if (!rel.endsWith(".md") || /(^|\/)(README|CHANGELOG)\.md$/.test(rel)) continue;
    const text = fs.readFileSync(path.join(outDir, rel), "utf8");
    for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^([a-z]+:|#|\/|~|<|\$)/i.test(target)) continue;
      const file = decodeURI(target.split("#")[0]);
      if (!file) continue;
      const linked = path.posix.normalize(path.posix.join(path.posix.dirname(rel), file));
      if (linked.startsWith("..")) continue;
      if (!fs.existsSync(path.join(outDir, linked)) && fs.existsSync(path.join(srcDir, linked))) broken.push(`${rel} → ${target}`);
    }
  }
  return broken;
}

// Content hash in the version: plugins cached by version (GitHub installs) see every port change.
function contentVersion(outDir, upstreamVersion) {
  const hash = createHash("sha256");
  for (const rel of walk(outDir).sort()) {
    if (rel === ".claude-plugin/plugin.json") continue;
    const full = path.join(outDir, rel);
    hash.update(`${rel}\0${fs.statSync(full).mode & 0o111 ? "x" : "-"}\0`).update(fs.readFileSync(full)).update("\0");
  }
  return `${upstreamVersion ?? "0.0.0"}+claude.${hash.digest("hex").slice(0, 8)}`;
}

// --- one plugin ----------------------------------------------------------------

function portPlugin(entry, outRoot, ctx, watched) {
  const srcDir = path.join(repoRoot, entry.source);
  const settings = config.PLUGINS[entry.name] ?? {};
  const isThirdParty = entry.source.startsWith("third_party/");
  const relOut = `${isThirdParty ? "third_party" : "plugins"}/${entry.name}`;
  const outDir = path.join(outRoot, relOut);
  const manifest = readJson(path.join(srcDir, ".cursor-plugin", "plugin.json"));
  const exclude = (settings.exclude ?? []).map((p) => p.replace(/\/+$/, ""));
  const patches = settings.patches ?? [];
  const prepends = settings.prepend ?? [];
  const usedPatches = new Set();
  const usedPrepends = new Set();
  const usedRewrites = new Set();
  const processed = new Set();
  const overrideDir = path.join(overridesRoot, entry.name);
  const overrides = new Set(walk(overrideDir));

  const upstream = walk(srcDir).filter((rel) => {
    const top = rel.split("/")[0];
    if ([".cursor-plugin", ".claude-plugin"].includes(top)) return false;
    if (["plugin.json", "mcp.json"].includes(rel)) return false;
    return !exclude.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`));
  });

  if (overrides.size) {
    for (const rel of upstream) {
      if (overrides.has(rel) || rel.startsWith("hooks/") || rel.startsWith("rules/")) {
        watched[`${entry.source}/${rel}`] = sha256(fs.readFileSync(path.join(srcDir, rel)));
      }
    }
  }

  const rules = [];
  for (const rel of upstream) {
    if (rel.startsWith("hooks/") || overrides.has(rel)) continue;
    const source = path.join(srcDir, rel);
    const mode = fs.statSync(source).mode & 0o777;
    if (!TEXT_FILE.test(rel)) {
      writeFile(path.join(outDir, rel), fs.readFileSync(source), mode);
      continue;
    }
    processed.add(rel);
    let text = applyPatches(rel, fs.readFileSync(source, "utf8"), patches, usedPatches);
    if (rel.startsWith("rules/") && rel.endsWith(".mdc")) {
      rules.push({ rel, text: rewriteMarkdown(text, settings, ctx, usedRewrites) });
      continue;
    }
    // CHANGELOGs record what upstream did; leave their history alone.
    if (rel.endsWith(".md") && !/(^|\/)CHANGELOG\.md$/.test(rel)) {
      text = prependNotes(rel, rewriteMarkdown(text, settings, ctx, usedRewrites), prepends, usedPrepends);
      const { lines, body } = splitFrontmatter(text);
      if (lines && rel.startsWith("agents/")) convertAgentFrontmatter(lines);
      if (lines && /^skills\/[^/]+\/SKILL\.md$/.test(rel)) convertSkillFrontmatter(lines, rel.split("/")[1]);
      text = joinFrontmatter(lines, body);
      if (rel === "README.md") text = readmeBanner(entry, settings.notes ?? [], true) + text;
    }
    writeFile(path.join(outDir, rel), text, mode);
  }

  const problems = [];
  patches.forEach((p, i) => {
    if (usedPatches.has(i)) return;
    problems.push(
      processed.has(p.file)
        ? `patch for ${p.file} no longer matches upstream: ${JSON.stringify(p.find.slice(0, 80))}…`
        : `patch targets ${p.file}, which the port does not convert (missing, excluded, binary, under hooks/, or overridden)`,
    );
  });
  prepends.forEach((p, i) => usedPrepends.has(i) || problems.push(`prepend targets ${p.file}, which the port does not convert`));
  (settings.rewrites ?? []).forEach(([pattern], i) => usedRewrites.has(i) || problems.push(`rewrite ${pattern} matched nothing`));
  if (problems.length) throw new Error(`${entry.name}: update port.config.mjs:\n  ${problems.join("\n  ")}`);

  for (const rel of overrides) {
    const source = path.join(overrideDir, rel);
    if (rel.startsWith("rules/") && rel.endsWith(".mdc")) {
      rules.push({ rel, text: fs.readFileSync(source, "utf8") });
      continue;
    }
    if (rel === "hooks/hooks.json") continue;
    const content = rel === "README.md" ? readmeBanner(entry, settings.notes ?? [], false) + fs.readFileSync(source, "utf8") : fs.readFileSync(source);
    writeFile(path.join(outDir, rel), content, fs.statSync(source).mode & 0o777);
  }

  if (upstream.includes("hooks/hooks.json") && !overrides.has("hooks/hooks.json")) {
    throw new Error(`${entry.name}: Cursor hooks need a Claude port in overrides/${entry.name}/hooks/hooks.json`);
  }

  const userOnly = userOnlySkills(outDir);
  if (userOnly.length) {
    for (const rel of walk(path.join(outDir, "agents")).filter((r) => r.endsWith(".md"))) {
      const file = path.join(outDir, "agents", rel);
      const { lines, body } = splitFrontmatter(fs.readFileSync(file, "utf8"));
      fs.writeFileSync(file, joinFrontmatter(lines, `\n${agentNote(userOnly)}\n${body.startsWith("\n") ? "" : "\n"}${body}`));
    }
  }

  const ruleHooks = sessionContext(rules, outDir, entry.name, settings, userOnly);
  const overrideHooks = overrides.has("hooks/hooks.json") ? readJson(path.join(overrideDir, "hooks/hooks.json")) : null;
  if (overrideHooks || ruleHooks) writeJson(path.join(outDir, "hooks", "hooks.json"), mergeHooks(overrideHooks, ruleHooks));

  let userConfig;
  const mcpPath = path.join(srcDir, "mcp.json");
  if (fs.existsSync(mcpPath)) {
    const converted = convertMcp(readJson(mcpPath), manifest, settings);
    writeJson(path.join(outDir, ".mcp.json"), { mcpServers: converted.mcpServers });
    userConfig = converted.userConfig;
  }

  const logo = manifest.logo && !/^https?:/.test(manifest.logo) ? `./${manifest.logo.replace(/^\.\//, "")}` : undefined;
  const version = contentVersion(outDir, manifest.version);
  writeJson(
    path.join(outDir, ".claude-plugin", "plugin.json"),
    prune({
      name: manifest.name,
      displayName: manifest.displayName,
      version,
      description: manifest.description,
      author: manifest.author,
      homepage: manifest.homepage,
      repository: manifest.repository,
      license: manifest.license,
      keywords: (manifest.keywords ?? []).filter((k) => k !== "cursor-plugin"),
      icon: logo && fs.existsSync(path.join(outDir, logo)) ? logo : undefined,
      userConfig,
    }),
  );

  return {
    name: entry.name,
    source: `./${relOut}`,
    description: manifest.description,
    version,
    author: manifest.author,
    category: manifest.category,
    tags: manifest.tags,
    displayName: manifest.displayName ?? entry.name,
    thirdParty: isThirdParty,
    notes: settings.notes ?? [],
    userConfig: userConfig ? Object.keys(userConfig) : [],
    brokenLinks: brokenLinks(outDir, srcDir),
  };
}

// --- README ------------------------------------------------------------------------

const cell = (value) => String(value ?? "").replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
const row = (cells) => `| ${cells.map(cell).join(" | ")} |`;

function manualMcpRecipe(name, spec) {
  const mcp = readJson(path.join(repoRoot, "third_party", name, "mcp.json"));
  const [[id, server]] = Object.entries(mcp.mcpServers);
  const url = (spec.url ?? server.url).replace(/\$\{([A-Z_]+)[^}]*\}/g, (_, v) => `<${v.toLowerCase().replace(/_/g, "-")}>`);
  const secret = server.auth?.CLIENT_SECRET;
  const needsSecret = spec.secret ?? Boolean(secret && !/:-\}$/.test(secret));
  const port = config.OAUTH_CALLBACK_PORT;
  if (server.auth?.scopes) {
    const oauth = { clientId: "<your-client-id>", callbackPort: port, scopes: server.auth.scopes.join(" ") };
    return `claude mcp add-json ${id} '${JSON.stringify({ type: "http", url, oauth })}'${needsSecret ? " --client-secret" : ""}`;
  }
  return `claude mcp add --transport http ${id} ${url} --client-id <your-client-id> --callback-port ${port}${needsSecret ? " --client-secret" : ""}`;
}

function renderReadme(ported) {
  const firstParty = ported.filter((p) => !p.thirdParty);
  const thirdParty = ported.filter((p) => p.thirdParty);
  const notes = (p) => (p.notes.length ? p.notes.join(" ") : "Ported as-is.");
  const redirect = `http://localhost:${config.OAUTH_CALLBACK_PORT}/callback`;
  return `# Claude Code port

Claude Code versions of the Cursor plugins in this repository, as one marketplace: **${firstParty.length}** workflow plugins and **${thirdParty.length}** MCP integrations.

> [!IMPORTANT]
> Everything in \`plugins/\`, \`third_party/\`, \`.claude-plugin/\`, and this README is generated. To change a plugin, edit [\`scripts/port.config.mjs\`](scripts/port.config.mjs) or add a file under [\`overrides/<plugin>/\`](overrides/), then rebuild.

## Install

From a clone of this repository:

\`\`\`bash
claude plugin marketplace add ./Claude
\`\`\`

Then install what you want, for example:

\`\`\`bash
claude plugin install pstack@${config.MARKETPLACE.name}
\`\`\`

Inside a session, \`/plugin\` opens the same browser. Skills run as \`/<plugin>:<skill>\` (for example \`/pstack:poteto-mode\`); the short \`/<skill>\` also works when no built-in command or other plugin uses the name. Agents are namespaced the same way (\`thermos:thermo-nuclear-review-subagent\`).

A marketplace added from a local folder loads its plugins in place, so a rebuild takes effect at the next session or after \`/reload-plugins\`. Each plugin's version carries a content hash (\`1.0.0+claude.<hash>\`), so installs that cache by version also pick up every change.

To use the marketplace from GitHub without cloning, point \`extraKnownMarketplaces\` in \`~/.claude/settings.json\` at this folder (untested with this repo). The repository root also has a separate upstream \`.claude-plugin/marketplace.json\`; the \`path\` key is what selects this one:

\`\`\`json
{
  "extraKnownMarketplaces": {
    "${config.MARKETPLACE.name}": {
      "source": { "source": "github", "repo": "<owner>/plugins", "path": "Claude/.claude-plugin/marketplace.json" }
    }
  }
}
\`\`\`

## Rebuild

\`\`\`bash
node Claude/scripts/build.mjs
\`\`\`

Run it after pulling upstream changes. It needs only Node 20+, builds in a staging folder, and replaces the output only when the whole build succeeds. A patch or rewrite that no longer matches upstream, or a link the port broke, fails the build.

| Flag | What it does |
| --- | --- |
| \`--check\` | Read-only. Exits 1 if the committed output is stale, or if an upstream file behind an override changed since the last \`--lock\`. |
| \`--lock\` | Rebuilds, then marks the current upstream files behind \`overrides/\` as reviewed. Run it after you update an override. |
| \`--validate\` | Read-only. Runs \`claude plugin validate --strict\` on the marketplace and every plugin. |
| \`--residuals\` | Read-only. Lists lines in the output that still mention Cursor, Grok, \`.cursor/\`, or Cursor-only tool parameters, so you can audit the port. |

The PR review helpers require Python 3.9 or later and create separate artifacts for every run. See [Maintaining both plugin ports](UPDATING.md) for the override workflow, regression checks, strict Claude CI, and weekly reconciliation. CI prepares evidence; merging stays manual.

## How the port maps Cursor to Claude Code

| Cursor | Claude Code |
| --- | --- |
| \`.cursor-plugin/plugin.json\` | \`.claude-plugin/plugin.json\` (same metadata; \`logo\` becomes \`icon\`; version gets a \`+claude.<hash>\` suffix) |
| \`variables\` + \`\${VAR}\` in \`mcp.json\` | \`userConfig\` + \`\${user_config.VAR}\` in \`.mcp.json\` (tokens marked \`sensitive\`) |
| \`rules/*.mdc\` with \`alwaysApply: true\` | \`context/*.md\` printed into context by a \`SessionStart\` hook |
| \`rules/*.mdc\` with \`globs\` | A skill with \`paths\` |
| Skills with \`disable-model-invocation: true\` that other skills route to | Same skills, plus a \`SessionStart\` note listing them and their paths, and a note in each agent (Claude Code hides user-only skills from the model and the Skill tool refuses them) |
| Agent \`model: fast\` / \`inherit\` / a Grok slug | \`haiku\` / \`inherit\` / \`opus\` (effort carried over) |
| Agent \`readonly: true\` | \`disallowedTools: ${READ_ONLY_TOOLS.join(", ")}\` (Bash stays available, so this is not a hard read-only sandbox) |
| \`Task\` tool, \`AskQuestion\`, \`subagent_type: "explore"\` | \`Agent\` tool, \`AskUserQuestion\`, \`subagent_type: "Explore"\` |
| \`subagent_type: "<agent>"\` | \`subagent_type: "<plugin>:<agent>"\` |
| Task \`resume\`, \`readonly\`, \`environment: "cloud"\` | \`SendMessage\`, a read-only brief, \`isolation: "worktree"\` |
| \`.cursor/rules/\`, \`.cursor/skills/\`, \`AGENTS.md\` | \`.claude/rules/\`, \`.claude/skills/\`, \`CLAUDE.md\` (or \`AGENTS.md\`); lists of repo guidance to read keep both |
| \`~/.cursor/projects/<slug>/agent-transcripts/\` | \`~/.claude/projects/<slug>/*.jsonl\` |
| Hooks (\`stop\`, \`afterFileEdit\`, \`subagentStop\`, \`followup_message\`) | Hand-ported in \`overrides/\` (\`Stop\`, \`PostToolUse\`, \`SubagentStop\`, \`{"decision": "block"}\`) |
| Canvas skills | Self-contained HTML pages |
| \`CHANGELOG.md\` | Copied unchanged (it records upstream's history) |

## Workflow plugins

${row(["Plugin", "Changes from Cursor"])}
${row(["---", "---"])}
${firstParty.map((p) => row([`[${p.displayName}](${p.source.slice(2)}/)`, notes(p)])).join("\n")}

## MCP integrations

Remote servers sign in through \`/mcp\` the first time you use them, and plugins that need a token prompt for it when you enable them. Claude Code signs in with dynamic client registration and a \`localhost\` callback. Every server below advertises dynamic registration, but some providers add their own gate: Square allowlists MCP clients, and Greenhouse and Workable allowlist redirect URIs (those two plugins pin \`${redirect}\`, the URL their admins allowlist).

${row(["Plugin", "Description", "Asks for"])}
${row(["---", "---", "---"])}
${thirdParty.map((p) => row([`[${p.displayName}](${p.source.slice(2)}/)`, p.description, p.userConfig.map((k) => `\`${k}\``).join(", ") || "—"])).join("\n")}

## Add these servers yourself

These servers need an OAuth client of your own: their authorization servers offer no dynamic client registration, and a Claude Code plugin cannot hold a client secret. Create an OAuth app with the provider, register \`${redirect}\` as its redirect URI, then add the server:

${row(["Server", "Why", "Command"])}
${row(["---", "---", "---"])}
${Object.entries(config.MANUAL_MCP).map(([name, spec]) => row([name, spec.why, `\`${manualMcpRecipe(name, spec)}\``])).join("\n")}

## Not ported

${row(["Plugin", "Reason"])}
${row(["---", "---"])}
${Object.entries(config.SKIP).map(([name, why]) => row([name, why])).join("\n")}
`;
}

// --- build -------------------------------------------------------------------------

function build(outRoot) {
  const cursorMarketplace = readJson(path.join(repoRoot, ".cursor-plugin", "marketplace.json"));
  const known = new Set(cursorMarketplace.plugins.map((p) => p.name));
  for (const name of [...Object.keys(config.PLUGINS), ...Object.keys(config.SKIP), ...Object.keys(config.MANUAL_MCP)]) {
    if (!known.has(name)) throw new Error(`port.config.mjs names "${name}", which is not in the Cursor marketplace`);
  }
  const entries = cursorMarketplace.plugins
    .map((p) => ({ name: p.name, source: p.source.replace(/^\.\//, "") }))
    .filter((p) => !config.SKIP[p.name] && !config.MANUAL_MCP[p.name]);
  for (const dir of new Set(walk(overridesRoot).filter((rel) => rel.includes("/")).map((rel) => rel.split("/")[0]))) {
    if (!entries.some((p) => p.name === dir)) throw new Error(`overrides/${dir} matches no ported plugin`);
  }

  config.ported.clear();
  for (const entry of entries) config.ported.add(entry.name);

  const agentOwners = new Map();
  const skillNames = new Set();
  for (const entry of entries) {
    for (const rel of walk(path.join(repoRoot, entry.source, "agents")).filter((r) => r.endsWith(".md"))) {
      const file = path.join(repoRoot, entry.source, "agents", rel);
      const name = frontmatterValue(splitFrontmatter(fs.readFileSync(file, "utf8")).lines, "name") ?? path.posix.basename(rel, ".md");
      if (agentOwners.has(name)) throw new Error(`agent "${name}" is defined by both ${agentOwners.get(name)} and ${entry.name}`);
      agentOwners.set(name, entry.name);
    }
    const skillsDir = path.join(repoRoot, entry.source, "skills");
    if (fs.existsSync(skillsDir)) for (const name of fs.readdirSync(skillsDir)) skillNames.add(name);
  }

  const watched = {};
  const ported = entries.map((entry) => portPlugin(entry, outRoot, { agentOwners, skillNames }, watched));

  const broken = ported.flatMap((p) => p.brokenLinks.map((link) => `${p.source.slice(2)}/${link}`));
  if (broken.length) throw new Error(`The port broke these links (patch or rewrite them away):\n  ${broken.join("\n  ")}`);

  writeJson(path.join(outRoot, ".claude-plugin", "marketplace.json"), {
    name: config.MARKETPLACE.name,
    owner: config.MARKETPLACE.owner,
    metadata: { description: config.MARKETPLACE.description },
    plugins: ported.map((p) =>
      prune({ name: p.name, source: p.source, description: p.description, version: p.version, author: p.author, category: p.category, tags: p.tags }),
    ),
  });
  writeFile(path.join(outRoot, "README.md"), renderReadme(ported));
  return { ported, watched };
}

// Build into a staging folder next to the output, hand it to `use`, and always clean up.
function staged(use) {
  const stage = fs.mkdtempSync(path.join(claudeRoot, ".build-"));
  try {
    return use(stage, build(stage));
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

function snapshot(root) {
  const files = new Map();
  for (const rel of GENERATED) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const list = fs.statSync(full).isDirectory() ? walk(full).map((f) => `${rel}/${f}`) : [rel];
    for (const f of list) {
      const file = path.join(root, f);
      files.set(f, `${fs.statSync(file).mode & 0o111 ? "x" : "-"} ${sha256(fs.readFileSync(file))}`);
    }
  }
  return files;
}

function lockDrift(watched) {
  const lock = fs.existsSync(lockPath) ? readJson(lockPath) : {};
  return Object.keys({ ...watched, ...lock }).filter((f) => watched[f] !== lock[f]).sort();
}

const RESIDUAL =
  /\bcursor\b|\.cursor\/|\bgrok\b|\bcomposer\b|readonly: |generalPurpose|\bAsk mode\b|Custom Mode|agent-transcripts|cloud agents?\b|environment: "|\bresume\b/i;

function residuals() {
  const hits = [];
  for (const rel of walk(claudeRoot)) {
    // Manifests credit the original authors, READMEs open with the port banner, and CHANGELOGs are history.
    if (!/\.(md|sh|mjs)$/.test(rel) || !/^(plugins|third_party)\//.test(rel) || /(README|CHANGELOG)\.md$/.test(rel)) continue;
    const settings = config.PLUGINS[rel.split("/")[1]] ?? {};
    if ((settings.rewriteSets ?? config.DEFAULT_REWRITE_SETS).length === 0) continue;
    fs.readFileSync(path.join(claudeRoot, rel), "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (RESIDUAL.test(line) && !line.startsWith("> ")) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 200)}`);
      });
  }
  return hits;
}

function validate() {
  const marketplace = readJson(path.join(claudeRoot, ".claude-plugin", "marketplace.json"));
  let failed = 0;
  for (const target of [".", ...marketplace.plugins.map((p) => p.source)]) {
    try {
      execFileSync("claude", ["plugin", "validate", "--strict", path.join(claudeRoot, target)], { stdio: "pipe" });
    } catch (error) {
      failed++;
      console.error(`✗ ${target}\n${error.stdout?.toString() ?? ""}${error.stderr?.toString() ?? error.message}`);
    }
  }
  console.log(failed ? `${failed} validation failure(s)` : `claude plugin validate --strict: all ${marketplace.plugins.length + 1} targets pass`);
  return failed === 0;
}

function main() {
  if (flags.has("--validate") || flags.has("--residuals")) {
    if (flags.has("--residuals")) for (const hit of residuals()) console.log(hit);
    if (flags.has("--validate") && !validate()) process.exit(1);
    return;
  }

  if (flags.has("--check")) {
    const { stale, drift } = staged((stage, { watched }) => {
      const fresh = snapshot(stage);
      const committed = snapshot(claudeRoot);
      return {
        stale: [...new Set([...fresh.keys(), ...committed.keys()])].filter((f) => fresh.get(f) !== committed.get(f)).sort(),
        drift: lockDrift(watched),
      };
    });
    if (stale.length) console.error(`Output is stale (${stale.length} files), e.g.:\n  ${stale.slice(0, 10).join("\n  ")}\nRun: node Claude/scripts/build.mjs`);
    if (drift.length) console.error(`Upstream changed behind these overrides; review them, then run --lock:\n  ${drift.join("\n  ")}`);
    if (stale.length || drift.length) process.exit(1);
    console.log("Claude port is up to date.");
    return;
  }

  const { count, watched } = staged((stage, { ported, watched }) => {
    for (const rel of GENERATED) {
      fs.rmSync(path.join(claudeRoot, rel), { recursive: true, force: true });
      if (fs.existsSync(path.join(stage, rel))) fs.renameSync(path.join(stage, rel), path.join(claudeRoot, rel));
    }
    return { count: ported.length, watched };
  });
  console.log(`Ported ${count} plugins to ${path.relative(repoRoot, claudeRoot)}/`);

  if (flags.has("--lock")) {
    writeJson(lockPath, Object.fromEntries(Object.entries(watched).sort()));
    console.log(`Locked ${Object.keys(watched).length} upstream files behind overrides.`);
  } else {
    const drift = lockDrift(watched);
    if (drift.length) console.warn(`Upstream changed behind these overrides; review them, then run --lock:\n  ${drift.join("\n  ")}`);
  }
}

main();
