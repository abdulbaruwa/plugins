# Codex compatibility review

Reviewed source commit `99b609a72323b70204eab407c622f436e858e112` on 26 October 2026. All 121 entries in the source catalog are accounted for. This is a community adaptation, not an official Cursor or OpenAI distribution.

## Coverage

| Class | Count | Meaning |
| --- | ---: | --- |
| Adapted skills | 17 | Packaged workflows with Codex runtime substitutions. Behavior is not forward-tested end to end. |
| MCP bundles | 61 | Literal provider endpoints or local server launchers in the portable schema. Not authenticated or live-tested. |
| Configuration required | 24 | Setup skill and source evidence; no MCP connection is loaded until supported configuration is supplied. |
| Blocked | 19 | No installable package is exposed. Needs a service replacement or implementation. |

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

The current checks cover 102 packages, 133 skills, and 61 bundled MCP server definitions. The regression suite exercises malformed metadata, executable/cwd containment, isolated installed documentation, exact diff line mapping, concurrent PR artifacts, local serving boundaries, and chat-owned Ralph state. These checks run locally and do not connect external providers.

The validator checks manifests against vendored Agent Plugins 1.0.0 schemas, catalog paths and identity, resource containment, skill metadata and invocation policy, package-local Markdown reference integrity, TOML examples, safe literal MCP connections, component availability, and full source-catalog coverage. Tests exercise malformed packages and rejection of false portable credentials.

The historical discovery snapshot used Codex CLI 0.157.1 to list the previous 88 packages with a process-scoped local marketplace override. The 19 October update adds six packages and is validated statically; it has not been installed or connected by the weekly automation. The 26 October update adds eight packages, converts BigQuery to setup-only, and adds statechart and ketchup-video; it is also not installed or connected by the automation. The recorded historical names are in client-discovery.json. No account marketplace configuration or installation was changed. This proves catalog discovery only. Installation, actual skill decisions, SDK execution, OAuth, payments, provider connectivity, and deployed behavior require separate acceptance runs. No external services were connected or written during this port.

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
| google-drive | [google-drive](plugins/google-drive/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-calendar | [google-calendar](plugins/google-calendar/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-docs | [google-docs](plugins/google-docs/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-sheets | [google-sheets](plugins/google-sheets/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-slides | [google-slides](plugins/google-slides/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
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
| outlook | [outlook](plugins/outlook/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| outlook-calendar | [outlook-calendar](plugins/outlook-calendar/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| onedrive | [onedrive](plugins/onedrive/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| sharepoint | [sharepoint](plugins/sharepoint/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| teams | [teams](plugins/teams/README.md) | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| finance | [finance](plugins/finance/README.md) | blocked | Grok-hosted connector gateway; no independent MCP endpoint supplied. |
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
| google-cloud-bigquery | [google-cloud-bigquery](plugins/google-cloud-bigquery/README.md) | configuration-required | Upstream now requires a team-owned Google OAuth client ID and secret, with the BigQuery scope and provider-supported redirect. Verify native client registration and credential storage; Cursor team-backend secret storage does not transfer. Queries can incur project charges, and execute_sql can write when IAM permits. |
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
| quickbooks-online | [quickbooks-online](plugins/quickbooks-online/README.md) | configuration-required | Intuit now publishes an MCP endpoint, but upstream relies on Cursor-owned OAuth credentials. Verify a provider-supported Codex OAuth client before setup; no connection is enabled. |
| workday | [workday](plugins/workday/README.md) | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| square | [square](plugins/square/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tailscale | [tailscale](plugins/tailscale/README.md) | blocked | Grok Bot personal/company tailnet enrollment and tag:grokbot policy have no Codex implementation supplied. |
| google-ads | [google-ads](plugins/google-ads/README.md) | blocked | Cursor-hosted REST MCP gateway; no native Codex service replacement is supplied. |
| gopuff | [gopuff](plugins/gopuff/README.md) | blocked | Grok Bot-only integration with a fixed mcp-grok-bot OAuth client; no supported Codex client setup is supplied. |
| whatsapp-business | [whatsapp-business](plugins/whatsapp-business/README.md) | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-books | [zoho-books](plugins/zoho-books/README.md) | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-crm | [zoho-crm](plugins/zoho-crm/README.md) | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-desk | [zoho-desk](plugins/zoho-desk/README.md) | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| finary | [finary](plugins/finary/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| gusto | [gusto](plugins/gusto/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tiktok-for-business | [tiktok-for-business](plugins/tiktok-for-business/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| highlevel | [highlevel](plugins/highlevel/README.md) | configuration-required | Upstream uses HighLevel’s client-specific Cursor endpoint. Confirm a provider-supported Codex endpoint and client registration before configuration; no connection is enabled. |
| meta-ads | [meta-ads](plugins/meta-ads/README.md) | configuration-required | Upstream supplies Cursor’s registered Meta OAuth app ID and no dynamic client registration. Register a provider-supported Codex client; no shared app ID or connection is enabled. |
| feishu | [feishu](plugins/feishu/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| lark | [lark](plugins/lark/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| pitchbook | [pitchbook](plugins/pitchbook/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| databricks-genie-one | [databricks-genie-one](plugins/databricks-genie-one/README.md) | configuration-required | Supply a bare workspace hostname and your own Databricks OAuth client ID. Dynamic registration is unsupported; a client secret is optional, and ai-gateway/offline_access scopes are required. Verify native redirect support before connecting. |
| framer | [framer](plugins/framer/README.md) | configuration-required | Framer accepts localhost or HTTPS OAuth redirects, while native client callback compatibility is unverified. Verify the exact redirect and supported registration before connecting; never substitute Cursor hosted placement. Publishing a site requires explicit user authority. |
| jobber | [jobber](plugins/jobber/README.md) | configuration-required | Register your own Jobber OAuth client ID and required secret with a native supported redirect. Only clients, requests, and quotes are writable in the documented integration; jobs, invoices, and visits are read-only. |
| stable | [stable](plugins/stable/README.md) | configuration-required | Configure x-api-key from the STABLE_API_KEY environment variable using the supported native secret/header mapping. No credential interpolation is copied into a portable connection. The execute-request tool may write; honor the requested action and authorization. |
| vanta | [vanta](plugins/vanta/README.md) | configuration-required | Ask the user to select mcp.vanta.com (United States), mcp.eu.vanta.com (Europe), or mcp.aus.vanta.com (Australia). Do not infer a region. Verify native authentication and tool permissions before configuring that exact host. |
| power-bi | — | blocked | Grok Bot only with Cursor hosted REST MCP proxy; no supported native provider endpoint is supplied. |
