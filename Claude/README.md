# Claude Code port

Claude Code versions of the Cursor plugins in this repository, as one marketplace: **16** workflow plugins and **66** MCP integrations.

> [!IMPORTANT]
> Everything in `plugins/`, `third_party/`, `.claude-plugin/`, and this README is generated. To change a plugin, edit [`scripts/port.config.mjs`](scripts/port.config.mjs) or add a file under [`overrides/<plugin>/`](overrides/), then rebuild.

## Install

From a clone of this repository:

```bash
claude plugin marketplace add ./Claude
```

Then install what you want, for example:

```bash
claude plugin install pstack@cursor-plugins-claude
```

Inside a session, `/plugin` opens the same browser. Skills run as `/<plugin>:<skill>` (for example `/pstack:poteto-mode`); the short `/<skill>` also works when no built-in command or other plugin uses the name. Agents are namespaced the same way (`thermos:thermo-nuclear-review-subagent`).

A marketplace added from a local folder loads its plugins in place, so a rebuild takes effect at the next session or after `/reload-plugins`. Each plugin's version carries a content hash (`1.0.0+claude.<hash>`), so installs that cache by version also pick up every change.

To use the marketplace from GitHub without cloning, point `extraKnownMarketplaces` in `~/.claude/settings.json` at this folder (untested with this repo). The repository root also has a separate upstream `.claude-plugin/marketplace.json`; the `path` key is what selects this one:

```json
{
  "extraKnownMarketplaces": {
    "cursor-plugins-claude": {
      "source": { "source": "github", "repo": "<owner>/plugins", "path": "Claude/.claude-plugin/marketplace.json" }
    }
  }
}
```

## Rebuild

```bash
node Claude/scripts/build.mjs
```

Run it after pulling upstream changes. It needs only Node 20+, builds in a staging folder, and replaces the output only when the whole build succeeds. A patch or rewrite that no longer matches upstream, or a link the port broke, fails the build.

| Flag | What it does |
| --- | --- |
| `--check` | Read-only. Exits 1 if the committed output is stale, or if an upstream file behind an override changed since the last `--lock`. |
| `--lock` | Rebuilds, then marks the current upstream files behind `overrides/` as reviewed. Run it after you update an override. |
| `--validate` | Read-only. Runs `claude plugin validate --strict` on the marketplace and every plugin. |
| `--residuals` | Read-only. Lists lines in the output that still mention Cursor, Grok, `.cursor/`, or Cursor-only tool parameters, so you can audit the port. |

The PR review helpers require Python 3.9 or later and create separate artifacts for every run. See [Maintaining both plugin ports](UPDATING.md) for the override workflow, regression checks, strict Claude CI, and weekly reconciliation. CI prepares evidence; merging stays manual.

## How the port maps Cursor to Claude Code

| Cursor | Claude Code |
| --- | --- |
| `.cursor-plugin/plugin.json` | `.claude-plugin/plugin.json` (same metadata; `logo` becomes `icon`; version gets a `+claude.<hash>` suffix) |
| `variables` + `${VAR}` in `mcp.json` | `userConfig` + `${user_config.VAR}` in `.mcp.json` (tokens marked `sensitive`) |
| `rules/*.mdc` with `alwaysApply: true` | `context/*.md` printed into context by a `SessionStart` hook |
| `rules/*.mdc` with `globs` | A skill with `paths` |
| Skills with `disable-model-invocation: true` that other skills route to | Same skills, plus a `SessionStart` note listing them and their paths, and a note in each agent (Claude Code hides user-only skills from the model and the Skill tool refuses them) |
| Agent `model: fast` / `inherit` / a Grok slug | `haiku` / `inherit` / `opus` (effort carried over) |
| Agent `readonly: true` | `disallowedTools: Edit, Write, NotebookEdit` (Bash stays available, so this is not a hard read-only sandbox) |
| `Task` tool, `AskQuestion`, `subagent_type: "explore"` | `Agent` tool, `AskUserQuestion`, `subagent_type: "Explore"` |
| `subagent_type: "<agent>"` | `subagent_type: "<plugin>:<agent>"` |
| Task `resume`, `readonly`, `environment: "cloud"` | `SendMessage`, a read-only brief, `isolation: "worktree"` |
| `.cursor/rules/`, `.cursor/skills/`, `AGENTS.md` | `.claude/rules/`, `.claude/skills/`, `CLAUDE.md` (or `AGENTS.md`); lists of repo guidance to read keep both |
| `~/.cursor/projects/<slug>/agent-transcripts/` | `~/.claude/projects/<slug>/*.jsonl` |
| Hooks (`stop`, `afterFileEdit`, `subagentStop`, `followup_message`) | Hand-ported in `overrides/` (`Stop`, `PostToolUse`, `SubagentStop`, `{"decision": "block"}`) |
| Canvas skills | Self-contained HTML pages |
| `CHANGELOG.md` | Copied unchanged (it records upstream's history) |

## Workflow plugins

| Plugin | Changes from Cursor |
| --- | --- |
| [Teaching](plugins/teaching/) | Ported as-is. |
| [Continual Learning](plugins/continual-learning/) | The Stop hook runs on Node instead of Bun and keeps its cadence state in the plugin's data directory. Mines Claude Code transcripts (`~/.claude/projects/<slug>/*.jsonl`) and writes `CLAUDE.md`, or `AGENTS.md` when the repo has no `CLAUDE.md`. |
| [Cursor Team Kit](plugins/cursor-team-kit/) | Cursor's always-apply rules are injected by a `SessionStart` hook. `pr-review-canvas` uses an isolated run directory, accurate visible diffs, and a task-owned preview instead of Cursor's in-app browser. |
| [Thermos](plugins/thermos/) | Agent references are namespaced (`thermos:thermo-nuclear-review-subagent`). The review agents read their rubric skills by path, since the Skill tool refuses user-only skills. |
| [Create Plugin](plugins/create-plugin/) | Rewritten to scaffold and validate Claude Code plugins (`.claude-plugin/plugin.json`, `claude plugin init`, `claude plugin validate`). |
| [Agent Compatibility](plugins/agent-compatibility/) | Review agents run on `haiku` (Cursor's `fast`) with file-writing tools disabled; they can still run shell commands. The published scanner checks Cursor files (`.cursor/rules`, `.cursor/mcp.json`); the review agent treats `CLAUDE.md`, `.claude/`, and `.mcp.json` as equivalents. |
| [CLI for Agents](plugins/cli-for-agent/) | Ported as-is. |
| [PR Review Canvas](plugins/pr-review-canvas/) | Renders a self-contained HTML review page in an isolated run directory with accurate visible diffs and a task-owned preview. |
| [Docs Canvas](plugins/docs-canvas/) | Renders a self-contained HTML page instead of a Cursor Canvas. The skill is still a placeholder upstream. |
| [Cursor SDK](plugins/cursor-sdk/) | Unchanged: teaches the `@cursor/sdk` TypeScript SDK. Code it writes needs a Cursor API key. |
| [Origin Apps](plugins/origin-apps/) | Unchanged: Cursor Origin API skills. |
| [Orchestrate](plugins/orchestrate/) | Unchanged workflow: from Claude Code you act as the dispatcher, which kicks off a Cursor cloud planner through `@cursor/sdk`. Needs a Cursor account billed for cloud agents, `CURSOR_API_KEY`, `bun` on `PATH`, and `bun install` in the installed copy's `skills/orchestrate/scripts/` (again after each update). Install `cursor-sdk` too; the skill calls it required reading. |
| [pstack](plugins/pstack/) | Model roles map to Claude aliases: `sonnet` for code, `opus` for judgment and prose, both for second opinions. `/setup-pstack` writes `~/.claude/rules/pstack-models.md`. Cursor's cloud subagents become local subagents in worktrees, and `resume` becomes `SendMessage`. Playbooks that assumed one VM per lane (Orchestrate, Autopilot, Multi-phase plan) now share this machine's CPU and ports. Claude Code has no Custom Modes: start each task with `/pstack:poteto-mode`. The guide pages under `docs/guide/` still describe some Cursor UI. Leaves out the Cursor Automations pack (`automations/benny`) and `make-bot-ui` (Grok Bot webhooks). Adds about 3.5k tokens of always-on context per session (its skill list plus the hidden-skill note). |
| [dyl-stack](plugins/dyl-stack/) | Agent references are namespaced (`dyl-stack:dyl-agent`, `thermos:…`). Repo guidance reads `CLAUDE.md`/`AGENTS.md` and `.claude/rules/`/`.cursor/rules/`. Deep reviews use a `general-purpose` bug-hunting subagent in place of Cursor's Bugbot. Builds on pstack, thermos, and cursor-team-kit; install those too. `build-figma` also needs a Figma plugin (`/plugin install figma`). |
| [Grok Voice](plugins/grok-voice/) | Unchanged: adds xAI Grok voice APIs to your app. Grok here is the product being integrated. |
| [Advisor](plugins/advisor/) | Claude Code has a built-in advisor (`/advisor`) on the Anthropic API; prefer it there. This plugin runs as `/advisor:advisor` and suits Bedrock, Google Cloud, and Foundry, or when you want explicit checkpoints and a consult log. Hooks rewritten for Claude Code: `PostToolUse` marks edits, `SubagentStop` logs consults, `Stop` posts the pre-completion nudge. They need `jq`. The advisor subagent defaults to `opus` at `xhigh` effort. State lives in `.claude/advisor/`. |

## MCP integrations

OAuth servers may sign in through `/mcp`; plugins with a required token prompt for it when enabled. Verify the provider's registration and redirect requirements before use. Claude Code uses a `localhost` callback, and some providers add an allowlist gate: Square allowlists clients, while Greenhouse and Workable pin `http://localhost:8787/callback` for their admins to allowlist. Static packaging does not establish authentication, entitlement, or live tool coverage.

| Plugin | Description | Asks for |
| --- | --- | --- |
| [Playwright](third_party/playwright/) | Navigate, click, screenshot, and test in a real browser. | — |
| [GitHub](third_party/github/) | Manage repos, issues, pull requests, and Actions. | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| [Ashby](third_party/ashby/) | Search candidates, prep interviews, and manage pipeline tasks. | — |
| [Greenhouse](third_party/greenhouse/) | Search candidates, jobs, and applications, and review scorecards in Greenhouse Recruiting. | — |
| [Intercom](third_party/intercom/) | Search conversations, contacts, and Help Center articles. | — |
| [Clay](third_party/clay/) | Enrich people and companies, run AI research agents. | — |
| [Circleback](third_party/circleback/) | Search meetings, transcripts, action items, and emails. | — |
| [Navan](third_party/navan/) | Query expenses, travel bookings, policies, and cards. | — |
| [Profound](third_party/profound/) | Track AI visibility, sentiment, and citations. | — |
| [Juicebox](third_party/juicebox/) | Query recruiting analytics, shortlists, and sourcing agents. | — |
| [Outreach](third_party/outreach/) | Search sequences, prospects, and Kaia meetings. | — |
| [Amplemarket](third_party/amplemarket/) | Search people and companies, enrich leads, run sequences. | — |
| [Klaviyo](third_party/klaviyo/) | Manage profiles, segments, campaigns, and flows. | — |
| [Customer.io](third_party/customer-io/) | Build campaigns, manage segments, and query people. | — |
| [MailerLite](third_party/mailerlite/) | Manage subscribers, groups, campaigns, and automations. | — |
| [Brevo](third_party/brevo/) | Manage contacts, email and SMS campaigns, and CRM deals. | `BREVO_MCP_TOKEN` |
| [Typeform](third_party/typeform/) | Build forms, analyze responses, and manage contacts. | — |
| [Jotform](third_party/jotform/) | Create and edit forms, then read submissions. | — |
| [Semrush](third_party/semrush/) | Research keywords, backlinks, traffic, and competitors. | — |
| [Ahrefs](third_party/ahrefs/) | Research keywords, backlinks, rankings, and site health. | — |
| [GoDaddy](third_party/godaddy/) | Brainstorm domain names and check availability. | — |
| [Upwork](third_party/upwork/) | Search talent, post jobs, and manage contracts. | — |
| [Workable](third_party/workable/) | Search candidates, move pipelines, and manage HR records. | — |
| [Brex](third_party/brex/) | Query expenses, receipts, bills, cards, and travel. | — |
| [Todoist](third_party/todoist/) | Create, find, and complete tasks and projects. | — |
| [Calendly](third_party/calendly/) | Check availability and book, cancel, or reschedule. | — |
| [Smartsheet](third_party/smartsheet/) | Query and update sheets, rows, and workspaces. | `SMARTSHEET_API_TOKEN` |
| [Wrike](third_party/wrike/) | Search projects, create tasks, and post comments. | `WRIKE_ACCESS_TOKEN` |
| [Coda](third_party/coda/) | Search docs, read pages, and update tables. | — |
| [Guru](third_party/guru/) | Search company knowledge and draft verified answers. | — |
| [Fireflies](third_party/fireflies/) | Search meeting transcripts, summaries, and action items. | — |
| [Otter.ai](third_party/otter/) | Search meeting history and pull full transcripts. | — |
| [Fathom](third_party/fathom/) | Search meetings and pull transcripts and summaries. | — |
| [Craft](third_party/craft/) | Search, create, and update documents and daily notes. | — |
| [Mem](third_party/mem/) | Capture, search, and organize notes and collections. | — |
| [Readwise](third_party/readwise/) | Search highlights and Reader documents, save articles. | — |
| [Similarweb](third_party/similarweb/) | Analyze website traffic, audiences, and competitors. | `SIMILARWEB_API_KEY` |
| [Xero](third_party/xero/) | Read and write invoices, contacts, reports, and payroll. | `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET` |
| [Attio](third_party/attio/) | Search and update CRM records, lists, notes, and tasks. | — |
| [Hunter](third_party/hunter/) | Find and verify emails, discover companies, and save leads. | `HUNTER_API_KEY` |
| [Stable](third_party/stable/) | Find mail, read scanned documents, and call Stable API endpoints. | `STABLE_API_KEY` |
| [Gamma](third_party/gamma/) | Generate presentations, documents, and webpages. | — |
| [Webull](third_party/webull/) | View accounts, positions, orders, watchlists, and market data. | — |
| [S&P Global](third_party/sp-global/) | Query S&P Capital IQ financials, prices, and transcripts. | — |
| [Interactive Brokers](third_party/interactive-brokers/) | Review positions, balances, P&L, and draft trade instructions. | — |
| [Meltwater](third_party/meltwater/) | Search media and social mentions and pull analytics. | — |
| [Daloopa](third_party/daloopa/) | Pull source-linked fundamentals, KPIs, filings, and prices. | — |
| [PitchBook](third_party/pitchbook/) | Research private companies, deals, investors, and funds. | — |
| [Excalidraw](third_party/excalidraw/) | Draw and export hand-drawn diagrams from chat. | — |
| [Statsig](third_party/statsig/) | Inspect and manage feature gates, experiments, dynamic configs, and metrics. | — |
| [Robinhood](third_party/robinhood/) | View portfolios, positions, orders, watchlists, and market data, and trade in a Robinhood Agentic account. | — |
| [Coinbase](third_party/coinbase/) | Check balances, get quotes, and preview or place trades. | — |
| [etoro](third_party/etoro-trading/) | View your eToro portfolio, balances, positions, and watchlists, research instruments and traders, and prepare and place trades. | — |
| [TinyFish](third_party/tinyfish/) | Browse and automate the web with TinyFish: run multi-step web automations, search the web, extract clean page content, and drive remote stealth browser sessions. | — |
| [beehiiv](third_party/beehiiv/) | Run your beehiiv newsletter from chat: draft and edit posts, organize subscribers with tags, custom fields, and segments, build automations, and review publication, post, and website performance. | — |
| [Trello](third_party/trello/) | Manage your Trello workspace from chat: browse and create boards, view and move lists, create, update, move, archive, and complete cards with labels and due dates, manage checklists, capture Inbox cards, schedule Planner focus time, and search across boards. | — |
| [Buffer](third_party/buffer/) | Manage social media with Buffer: draft, schedule, and publish posts across connected channels, manage the queue and ideas, and review post performance. | — |
| [Plaud](third_party/plaud/) | Work with your Plaud recordings: list and search meetings and voice notes, read full transcripts with speaker labels, and pull AI summaries, action items, and key topics into your workflow. | — |
| [PostHog MCP](third_party/posthog-mcp/) | Work with PostHog from chat: query product analytics and run SQL, manage feature flags and experiments, triage error tracking issues, and review session replays, surveys, and dashboards (URL-only connector to PostHog's hosted MCP server). | — |
| [Square](third_party/square/) | Work with payments, orders, catalog, customers, and invoices. | — |
| [Finary](third_party/finary/) | Read your net worth, accounts, holdings, spending, and budgets. | — |
| [TikTok for Business](third_party/tiktok-for-business/) | Manage TikTok ad campaigns, ad groups, ads, audiences, creatives, and reports. | — |
| [Gusto](third_party/gusto/) | Work with payroll, employees, contractors, time off, and reports. | — |
| [Lark](third_party/lark/) | Search, create, and update Lark Suite docs, and read Lark messages and groups. | — |
| [Feishu](third_party/feishu/) | Search, create, and update Feishu docs, and read Feishu messages and groups. | — |
| [Framer](third_party/framer/) | Design, build, and edit your Framer sites, pages, and CMS content. | — |

## Add these servers yourself

These servers require provider-specific endpoint, registration, redirect, or secret configuration before use. Read each row and verify those requirements first. Where the provider requires your own OAuth app, register `http://localhost:8787/callback` as its redirect URI. The commands below are templates for manually registered clients; when the selected endpoint supports dynamic client registration for Claude Code, omit the explicit client ID and any unnecessary secret. A plugin cannot hold a client secret. These recipes do not establish connectivity or authenticated tool coverage.

| Server | Why | Command |
| --- | --- | --- |
| databricks-genie-one | Requires your bare workspace hostname and a registered Databricks client ID; dynamic registration is unsupported. Preserve ai-gateway/offline_access scopes and verify native redirect support. A secret is optional, not required. | `claude mcp add-json databricks-genie-one '{"type":"http","url":"https://<databricks-host>/ai-gateway/mcp-services/system.ai.genie_one_mcp","oauth":{"clientId":"<your-client-id>","callbackPort":8787,"scopes":"ai-gateway offline_access"}}'` |
| jobber | Requires your own Jobber OAuth client ID and secret with the native redirect registered. Clients, requests, and quotes are writable; jobs, invoices, and visits are read-only. | `claude mcp add --transport http jobber https://mcp.getjobber.com/mcp --client-id <your-client-id> --callback-port 8787 --client-secret` |
| vanta | Select mcp.vanta.com (US), mcp.eu.vanta.com (Europe), or mcp.aus.vanta.com (Australia) before adding the server. No region is inferred. Verify provider-supported dynamic registration and native redirect/tool access; connectivity is unverified. | `claude mcp add --transport http vanta https://<vanta-mcp-host>/mcp --client-id <your-client-id> --callback-port 8787` |
| highlevel | Upstream uses a client-specific Cursor v2 endpoint. This recipe selects the separately documented universal endpoint, with fewer tools; verify provider-supported client registration, redirect support, and the required tools before adding it. | `claude mcp add --transport http highlevel https://services.leadconnectorhq.com/mcp/ --client-id <your-client-id> --callback-port 8787` |
| meta-ads | Upstream uses Cursor's registered Meta app ID and no dynamic client registration. Register a Meta OAuth client with your own allowed redirect URI; do not reuse Cursor's app ID. | `claude mcp add --transport http meta-ads https://mcp.facebook.com/ads --client-id <your-client-id> --callback-port 8787` |
| quickbooks-online | Intuit now publishes an MCP endpoint, but the upstream setup relies on Cursor-owned OAuth credentials. Verify provider-supported Claude Code client registration and redirect support first; connectivity is unverified. | `claude mcp add --transport http quickbooks-online https://mcp-e2e.quickbooks.intuit.com/mcp --client-id <your-client-id> --callback-port 8787` |
| docusign | Needs your own Docusign integration key and secret. | `claude mcp add --transport http docusign https://mcp.docusign.com/mcp --client-id <your-client-id> --callback-port 8787 --client-secret` |
| gong | Needs your own Gong OAuth client ID and secret. | `claude mcp add --transport http gong https://mcp.gong.io/mcp --client-id <your-client-id> --callback-port 8787 --client-secret` |
| hubspot | Needs your own HubSpot app client ID and secret. | `claude mcp add --transport http hubspot https://mcp.hubspot.com --client-id <your-client-id> --callback-port 8787 --client-secret` |
| gmail | Google offers no dynamic client registration. Create a Desktop OAuth client in Google Cloud with the Gmail API enabled. | `claude mcp add --transport http gmail https://gmailmcp.googleapis.com/mcp/v1 --client-id <your-client-id> --callback-port 8787 --client-secret` |
| google-calendar | Google offers no dynamic client registration. Create a Desktop OAuth client in Google Cloud with the Calendar API enabled. | `claude mcp add --transport http google-calendar https://calendarmcp.googleapis.com/mcp/v1 --client-id <your-client-id> --callback-port 8787 --client-secret` |
| google-cloud-bigquery | Upstream now requires a team-owned Google client ID and secret. Verify a provider-supported native app type, redirect, and BigQuery scope; Cursor's web-app callback and backend secret storage do not transfer. Queries may be billed to the selected project, and execute_sql can write when IAM permits. | `claude mcp add --transport http google-cloud-bigquery https://bigquery.googleapis.com/mcp --client-id <your-client-id> --callback-port 8787 --client-secret` |
| salesforce | Needs your org's MCP URL and an External Client App consumer key (Connected Apps are not supported; enable JWT-based access tokens). | `claude mcp add-json salesforce '{"type":"http","url":"<salesforce-mcp-url>","oauth":{"clientId":"<your-client-id>","callbackPort":8787,"scopes":"mcp_api refresh_token"}}'` |
| salesforce-headless-360 | Needs your org's MCP URL and an External Client App consumer key and secret (Connected Apps are not supported). | `claude mcp add-json salesforce-headless-360 '{"type":"http","url":"<salesforce-mcp-url>","oauth":{"clientId":"<your-client-id>","callbackPort":8787,"scopes":"mcp_api refresh_token"}}' --client-secret` |
| x | X's MCP uses a fixed client ID whose allowed redirect URIs are not documented. Try X's client ID from the Cursor plugin's `mcp.json` first; if sign-in fails, register your own X app. | `claude mcp add-json x '{"type":"http","url":"https://api.x.com/mcp","oauth":{"clientId":"<your-client-id>","callbackPort":8787,"scopes":"tweet.read users.read follows.read space.read mute.read like.read list.read list.write block.read block.write bookmark.read bookmark.write dm.read dm.write calls.read calls.write broadcast.read broadcast.write media.write developer.billing.write developer.write offline.access"}}'` |
| x-ads | X's MCP uses a fixed client ID whose allowed redirect URIs are not documented. Try X's client ID from the Cursor plugin's `mcp.json` first; if sign-in fails, register your own X app. | `claude mcp add-json x-ads '{"type":"http","url":"https://ads-api.x.com/mcp","oauth":{"clientId":"<your-client-id>","callbackPort":8787,"scopes":"ads.read ads.write media.write offline.access"}}'` |

## Not ported

| Plugin | Reason |
| --- | --- |
| ralph-loop | Claude Code's official marketplace has a `ralph-loop` plugin for the same workflow. Install that one: `/plugin install ralph-loop@claude-plugins-official`. |
| finance | Grok Bot only (`minClientVersions.cursor` is `never`). |
| shopify-store | Grok Bot only (`minClientVersions.cursor` is `never`). |
| tailscale | Grok Bot only: joins Grok Bot to a tailnet. |
| gopuff | Grok Bot only, with a fixed mcp-grok-bot OAuth client; no supported Claude Code registration is supplied. |
| x-money | Grok Bot only (`minClientVersions.cursor` is `never`). |
| workday | No MCP config in the Cursor plugin; Cursor wires the server up on its side. |
| whatsapp-business | Metadata only; no MCP endpoint or implementation is supplied. |
| zoho-books | Metadata only; no MCP endpoint or implementation is supplied. |
| zoho-crm | Metadata only; no MCP endpoint or implementation is supplied. |
| zoho-desk | Metadata only; no MCP endpoint or implementation is supplied. |
| zoom | Zoom accepts only a `127.0.0.1` loopback redirect and rejects `localhost`, and Claude Code always signs in through `http://localhost:<port>/callback`. |
| google-docs | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| google-ads | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| power-bi | Grok Bot only and backed by Cursor's hosted REST MCP proxy; no native provider endpoint is supplied. |
| google-drive | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| google-sheets | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| google-slides | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| onedrive | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| outlook | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| outlook-calendar | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| sharepoint | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
| teams | The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account. |
