# Codex compatibility review

Reviewed source commit `dbf49813a39c1a5389c5e28cb8e4c1c2379e2454` on 13 October 2026. All 101 entries in the source catalog are accounted for. This is a community adaptation, not an official Cursor or OpenAI distribution.

## Coverage

| Class | Count | Meaning |
| --- | ---: | --- |
| Adapted skills | 17 | Packaged workflows with Codex runtime substitutions. Behavior is not forward-tested end to end. |
| MCP bundles | 56 | Literal provider endpoints or local server launchers in the portable schema. Not authenticated or live-tested. |
| Configuration required | 15 | Setup skill and source evidence; no MCP connection is loaded until supported configuration is supplied. |
| Blocked | 13 | No installable package is exposed. Needs a service replacement or implementation. |

## Material differences

- `cursor-team-kit` becomes `codex-team-kit`; `cursor-sdk` becomes `codex-sdk` with native SDK guidance. Cursor Origin remains an external API and retains its product identity.
- Named agent files become referenced review procedures. They are not registered agent types. Delegation uses session tools when available and authorized, with sequential fallback and inherited models.
- Cursor always-applied rules are consulted references. They do not silently become global Codex instructions. Existing explicit-only skill invocation is retained through `agents/openai.yaml`.
- Advisor and continual learning run on demand. Ralph runs a bounded loop in the current turn. No lifecycle hooks, transcript watcher, Custom Mode, cloud dispatcher, or automatic turn continuation is installed.
- Native orchestration replaces the Cursor SDK dispatcher. Its cloud execution, Slack integration, runtime scripts, and exact lifecycle semantics are not preserved.
- Pstack core principles and reusable reference rubrics are retained. Runtime entrypoints and playbooks are adapted to native tools. Cursor model matrices, Grok webhook routines, Benny automation packs, and dispatcher/watch scripts are excluded.
- PR canvases reuse the repo's standalone HTML renderer; documentation walkthroughs use ordinary HTML or Markdown instead of a proprietary Canvas SDK.
- Portable MCP `http` transports become `streamable-http`. Cursor placement metadata and vendor-identification headers are removed. Environment substitutions and provider-specific OAuth client objects are not copied into literal portable connection fields.
- Provider registration, access, billing, authorization, and tool availability must be checked during setup. The X guide does not assume Cursor credits or Grok public-read access. X Money does not claim Codex supports Grok enrollment.

## Validation scope

The current checks cover 88 packages, 119 skills, and 56 bundled MCP server definitions. The regression suite exercises malformed metadata, executable/cwd containment, isolated installed documentation, exact diff line mapping, concurrent PR artifacts, local serving boundaries, and chat-owned Ralph state. These checks run locally and do not connect external providers.

The validator checks manifests against vendored Agent Plugins 1.0.0 schemas, catalog paths and identity, resource containment, skill metadata and invocation policy, package-local Markdown reference integrity, TOML examples, safe literal MCP connections, component availability, and full source-catalog coverage. Tests exercise malformed packages and rejection of false portable credentials.

Codex CLI 0.157.1 listed all 88 packages using a process-scoped local marketplace override. The recorded names are in client-discovery.json. No account marketplace configuration or installation was changed. This proves catalog discovery only. Installation, actual skill decisions, SDK execution, OAuth, payments, provider connectivity, and deployed behavior require separate acceptance runs. No external services were connected or written during this port.

An independent manual review found and corrected stale Advisor/Thermos runtime references, PR pagination and filename-key bugs, and a missing runtime preference read. Resource paths damaged during invocation-syntax conversion were restored, and a regression check now rejects that corruption. Two attempts to run `codex review --uncommitted` failed before review with the configured model/account compatibility error; no automated review verdict is claimed.

## Per-plugin inventory

| Source plugin | Codex package | Class | Review result |
| --- | --- | --- | --- |
| teaching | [teaching](plugins/teaching/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| continual-learning | [continual-learning](plugins/continual-learning/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| cursor-team-kit | [codex-team-kit](plugins/codex-team-kit/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| thermos | [thermos](plugins/thermos/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| create-plugin | [create-plugin](plugins/create-plugin/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| ralph-loop | [ralph-loop](plugins/ralph-loop/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| agent-compatibility | [agent-compatibility](plugins/agent-compatibility/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| cli-for-agent | [cli-for-agent](plugins/cli-for-agent/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| pr-review-canvas | [pr-review-canvas](plugins/pr-review-canvas/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| docs-canvas | [docs-canvas](plugins/docs-canvas/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| cursor-sdk | [codex-sdk](plugins/codex-sdk/README.md) | adapted-skills | Native Codex SDK authoring workflow replaces Cursor SDK API guidance; original source API and examples are not copied. |
| origin-apps | [origin-apps](plugins/origin-apps/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| orchestrate | [orchestrate](plugins/orchestrate/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| pstack | [pstack](plugins/pstack/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| dyl-stack | [dyl-stack](plugins/dyl-stack/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| grok-voice | [grok-voice](plugins/grok-voice/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| advisor | [advisor](plugins/advisor/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| gmail | [gmail](plugins/gmail/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-drive | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-calendar | [google-calendar](plugins/google-calendar/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-docs | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-sheets | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-slides | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| gong | [gong](plugins/gong/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| salesforce | [salesforce](plugins/salesforce/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| salesforce-headless-360 | [salesforce-headless-360](plugins/salesforce-headless-360/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| playwright | [playwright](plugins/playwright/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| github | [github](plugins/github/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| ashby | [ashby](plugins/ashby/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| greenhouse | [greenhouse](plugins/greenhouse/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| hubspot | [hubspot](plugins/hubspot/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| intercom | [intercom](plugins/intercom/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| zoom | [zoom](plugins/zoom/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| x | [x](plugins/x/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| clay | [clay](plugins/clay/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| circleback | [circleback](plugins/circleback/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| docusign | [docusign](plugins/docusign/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| navan | [navan](plugins/navan/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| profound | [profound](plugins/profound/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| juicebox | [juicebox](plugins/juicebox/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| outreach | [outreach](plugins/outreach/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| amplemarket | [amplemarket](plugins/amplemarket/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| klaviyo | [klaviyo](plugins/klaviyo/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| customer-io | [customer-io](plugins/customer-io/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| mailerlite | [mailerlite](plugins/mailerlite/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| brevo | [brevo](plugins/brevo/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| typeform | [typeform](plugins/typeform/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| jotform | [jotform](plugins/jotform/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| semrush | [semrush](plugins/semrush/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| ahrefs | [ahrefs](plugins/ahrefs/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| godaddy | [godaddy](plugins/godaddy/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| upwork | [upwork](plugins/upwork/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| workable | [workable](plugins/workable/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| brex | [brex](plugins/brex/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| todoist | [todoist](plugins/todoist/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| calendly | [calendly](plugins/calendly/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| smartsheet | [smartsheet](plugins/smartsheet/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| wrike | [wrike](plugins/wrike/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| coda | [coda](plugins/coda/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| guru | [guru](plugins/guru/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| fireflies | [fireflies](plugins/fireflies/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| otter | [otter](plugins/otter/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| fathom | [fathom](plugins/fathom/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| craft | [craft](plugins/craft/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| mem | [mem](plugins/mem/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| readwise | [readwise](plugins/readwise/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| similarweb | [similarweb](plugins/similarweb/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| xero | [xero](plugins/xero/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| outlook | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| outlook-calendar | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| onedrive | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| sharepoint | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| teams | — | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| finance | — | blocked | Grok-hosted connector gateway; no independent MCP endpoint supplied. |
| x-ads | [x-ads](plugins/x-ads/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| attio | [attio](plugins/attio/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| hunter | [hunter](plugins/hunter/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| gamma | [gamma](plugins/gamma/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| webull | [webull](plugins/webull/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| sp-global | [sp-global](plugins/sp-global/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| interactive-brokers | [interactive-brokers](plugins/interactive-brokers/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| meltwater | [meltwater](plugins/meltwater/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| daloopa | [daloopa](plugins/daloopa/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| excalidraw | [excalidraw](plugins/excalidraw/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-cloud-bigquery | [google-cloud-bigquery](plugins/google-cloud-bigquery/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| statsig | [statsig](plugins/statsig/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| robinhood | [robinhood](plugins/robinhood/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| coinbase | [coinbase](plugins/coinbase/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| etoro-trading | [etoro-trading](plugins/etoro-trading/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| x-money | [x-money](plugins/x-money/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| shopify-store | [shopify-store](plugins/shopify-store/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tinyfish | [tinyfish](plugins/tinyfish/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| beehiiv | [beehiiv](plugins/beehiiv/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| trello | [trello](plugins/trello/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| buffer | [buffer](plugins/buffer/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| plaud | [plaud](plugins/plaud/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| posthog-mcp | [posthog-mcp](plugins/posthog-mcp/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| quickbooks-online | — | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| workday | — | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| square | [square](plugins/square/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tailscale | — | blocked | Grok Bot tailnet enrollment and tag:grokbot policy have no Codex implementation supplied. |

## Detailed-review corrections

The seven detailed-review findings are addressed: stdio command/cwd containment; structured nested-metadata errors; self-contained package documentation; independent stack verdicts and patch-freshness shipping gates; accurate diff lines with visible imports; separate per-run PR captures and serving roots; and Ralph ownership checks with separate run state. Each package documentation revision is now `codex.2`. The revised helpers operate on local task artifacts and install no hooks or automatic follow-ups. Independent review and local regression results are reported in the task closeout; live-provider acceptance remains a separate check.

## Upstream reconciliation

The source checkpoint now includes Cursor commit `c86f349b102feb91f1966f8a6a60882a4e601b50` (2026-10-14 review). Its three pstack changes revise the ketchup workflow and the corresponding README/help descriptions. The Codex port carries the new plain-language, short-reply and small-visual guidance; its native help remains scoped to supported Codex workflows. Invocation syntax and the existing explicit-only policy are preserved. Pstack is now `0.15.23-codex.3`; other packages retain `codex.2`. The upstream version did not change, so file-level source comparison was necessary. No service authentication or runtime-agent acceptance is implied by this reconciliation.
