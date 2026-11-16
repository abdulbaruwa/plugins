# Codex compatibility review

Reviewed source commit `bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7` on 16 November 2026. All 139 entries in the source catalog are accounted for. This is a community adaptation, not an official Cursor or OpenAI distribution.

## Coverage

| Class | Count | Meaning |
| --- | ---: | --- |
| Adapted skills | 17 | Packaged workflows with Codex runtime substitutions. Behavior is not forward-tested end to end. |
| MCP bundles | 69 | Literal provider endpoints or local server launchers in the portable schema. Not authenticated or live-tested. |
| Configuration required | 29 | Setup skill and source evidence; no MCP connection is loaded until supported configuration is supplied. |
| Blocked | 24 | No installable package is exposed. Needs a service replacement or implementation. |

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

The current checks cover 115 packages, 138 skills, and 69 bundled MCP server definitions. The regression suite exercises malformed metadata, executable/cwd containment, isolated installed documentation, exact diff line mapping, concurrent PR artifacts, local serving boundaries, and chat-owned Ralph state. These checks run locally and do not connect external providers.

The validator checks manifests against vendored Agent Plugins 1.0.0 schemas, catalog paths and identity, resource containment, skill metadata and invocation policy, package-local Markdown reference integrity, TOML examples, safe literal MCP connections, component availability, and full source-catalog coverage. Tests exercise malformed packages and rejection of false portable credentials.

The historical discovery snapshot used Codex CLI 0.157.1 to list the previous 88 packages with a process-scoped local marketplace override. The 19 October update adds six packages and is validated statically; it has not been installed or connected by the weekly automation. The 26 October update adds eight packages, converts BigQuery to setup-only, and adds statechart and ketchup-video; it is also not installed or connected by the automation. The 2 November update adds five packages and reconciles the original source tree with the previously reviewed 0.15.36 Codex package. It does not install or connect any plugin. The recorded historical names are in client-discovery.json. No account marketplace configuration or installation was changed. This proves catalog discovery only. Installation, actual skill decisions, SDK execution, OAuth, payments, provider connectivity, and deployed behavior require separate acceptance runs. No external services were connected or written during this port.

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
| pstack | [pstack](plugins/pstack/README.md) | adapted-skills | Adopts 0.15.42 compiler/diagnostic fixes and streamlined How/Why while retaining optional native research resources, inherited models, prompt-only Sharpen and shipping/ownership safeguards. |
| dyl-stack | [dyl-stack](plugins/dyl-stack/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| grok-voice | [grok-voice](plugins/grok-voice/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| advisor | [advisor](plugins/advisor/README.md) | adapted-skills | Codex skill adaptation; Cursor hooks and automatic rules are not installed. |
| gmail | [gmail](plugins/gmail/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-drive | google-drive | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-calendar | [google-calendar](plugins/google-calendar/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| google-docs | google-docs | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-sheets | google-sheets | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| google-slides | google-slides | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| gong | [gong](plugins/gong/README.md) | configuration-required | Own-client setup requires a provider-supported HTTPS redirect. Grok optional client registration does not transfer; stop when native callback support cannot satisfy Gong. |
| salesforce | [salesforce](plugins/salesforce/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| salesforce-headless-360 | [salesforce-headless-360](plugins/salesforce-headless-360/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| playwright | [playwright](plugins/playwright/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| github | [github](plugins/github/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| ashby | [ashby](plugins/ashby/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| greenhouse | [greenhouse](plugins/greenhouse/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| hubspot | [hubspot](plugins/hubspot/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| intercom | [intercom](plugins/intercom/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| zoom | [zoom](plugins/zoom/README.md) | configuration-required | Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled. |
| x | [x](plugins/x/README.md) | configuration-required | Manual native OAuth. Posting is opt-in with tweet.write and exact approval; native Chat contact lookup is documented without Grok helpers. No placeholder connection is enabled. |
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
| outlook | outlook | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| outlook-calendar | outlook-calendar | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| onedrive | onedrive | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| sharepoint | sharepoint | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| teams | teams | blocked | Cursor-hosted REST MCP gateway; needs a provider or Codex connector replacement. |
| finance | finance | blocked | Grok-hosted connector gateway; no independent MCP endpoint supplied. |
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
| workday | workday | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| square | [square](plugins/square/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tailscale | tailscale | blocked | The Tailscale plugin 1.0.6 uses Grok Bot's one-click personal tailnets and bot-computer routing; the tag sign-in path is retired. No native Codex endpoint is supplied. |
| google-ads | google-ads | blocked | Cursor-hosted REST MCP gateway; no native Codex service replacement is supplied. |
| gopuff | gopuff | blocked | Grok Bot/sand only, with the fixed mcp-grok-bot OAuth client. Branding metadata changed; no supported native Codex registration is supplied. |
| whatsapp-business | whatsapp-business | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-books | zoho-books | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-crm | zoho-crm | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| zoho-desk | zoho-desk | blocked | Metadata only; no MCP endpoint or implementation supplied. |
| finary | [finary](plugins/finary/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| gusto | [gusto](plugins/gusto/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| tiktok-for-business | [tiktok-for-business](plugins/tiktok-for-business/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| highlevel | [highlevel](plugins/highlevel/README.md) | configuration-required | Upstream uses HighLevel’s client-specific Cursor endpoint. Confirm a provider-supported Codex endpoint and client registration before configuration; no connection is enabled. |
| meta-ads | [meta-ads](plugins/meta-ads/README.md) | configuration-required | Upstream supplies Cursor’s registered Meta OAuth app ID and no dynamic client registration. Register a provider-supported Codex client; no shared app ID or connection is enabled. |
| feishu | [feishu](plugins/feishu/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| lark | [lark](plugins/lark/README.md) | mcp-bundle | Provider docs/messages endpoint retained. The new separate Lark Base integration is a Cursor-hosted proxy and is excluded; authentication and live behavior remain unverified. |
| pitchbook | [pitchbook](plugins/pitchbook/README.md) | mcp-bundle | Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified. |
| stable | [stable](plugins/stable/README.md) | configuration-required | Configure x-api-key from the STABLE_API_KEY environment variable using the supported native secret/header mapping. No credential interpolation is copied into a portable connection. The execute-request tool may write; honor the requested action and authorization. |
| vanta | [vanta](plugins/vanta/README.md) | configuration-required | Ask the user to select mcp.vanta.com (United States), mcp.eu.vanta.com (Europe), or mcp.aus.vanta.com (Australia). Do not infer a region. Verify native authentication and tool permissions before configuring that exact host. |
| power-bi | power-bi | blocked | Grok Bot only with Cursor hosted REST MCP proxy; no supported native provider endpoint is supplied. |
| business-central | business-central | blocked | Cursor hosts and credentials the server; no endpoint or portable implementation is supplied. |
| lark-base | lark-base | blocked | Cursor-hosted REST MCP proxy with team-owned Lark credentials; no native provider endpoint is supplied. |
| ringcentral-phone | [ringcentral-phone](plugins/ringcentral-phone/README.md) | mcp-bundle | Packages the separate RingCentral phone endpoint for calls, AI notes, SMS, voicemail and fax. Sending SMS requires the user's explicit instruction. Authentication, tool availability and live behavior are unverified. |
| ringcentral-chat | [ringcentral-chat](plugins/ringcentral-chat/README.md) | mcp-bundle | Packages the separate RingCentral team-chat endpoint. It can send messages and manage teams, tasks and notes; outbound actions require the user's explicit instruction. Authentication, tool availability and live behavior are unverified. |
| servicenow | [servicenow](plugins/servicenow/README.md) | configuration-required | Ask for the bare instance hostname and the exact MCP server name from its active server record. Do not infer a tenant or activate a server. An administrator must register a native authorization-code OAuth client with a secret, JWT token format and the mcp_server scope; dynamic registration is unsupported. Register the actual Codex redirect and keep the secret in the supported credential store. The connecting user needs sn_mcp_server.viewer and each tool's ACL. Preserve the provider's 26 KB request and 64 KB response limits. Preview writes and obtain user authority for the exact published tool before execution. |
| rippling | [rippling](plugins/rippling/README.md) | configuration-required | Ask for the employee's Remote MCP server URL from Rippling → My IT → MCP connectors. Verify that it is the first-party Rippling workforce MCP, not the separate MCP Gateway or another host. Do not substitute a company-wide API token. An admin access policy and active Rippling AI trial/subscription are required. Use employee OAuth and verify the provider-supported native client flow; there is no upstream client ID or secret to copy. Discover the connected user's authorized codemode.* functions rather than inventing them. Preview and obtain user authority for official time-off requests, draft hires, and custom-object writes before executing them. |
| onepay | onepay | blocked | Source is restricted to Grok Bot/sand. Claude and ChatGPT directory listings do not establish Codex-native registration or live tool support. |
| questrade | [questrade](plugins/questrade/README.md) | mcp-bundle | Packages Questrade's own endpoint for account, balance, position and market-data tools. Trading is described as discussion; do not infer order execution. Authentication, account entitlements, tool schemas and live behavior are unverified. |
| tesla | tesla | blocked | Grok Bot/sand only. The source uses the Cursor REST proxy, OAuth and vehicle key pairing; it supplies no portable Tesla endpoint. |
| fitmetrics | [fitmetrics](plugins/fitmetrics/README.md) | configuration-required | FitMetrics Scale and a scoped key are required. Native setup maps an environment variable to the provider bearer header; no connection is enabled by the package. |
| eight-sleep | [eight-sleep](plugins/eight-sleep/README.md) | mcp-bundle | Requires your Eight Sleep account and Pod. Confirm read_sleep/read_device access; write_device requires explicit agreement and a supported reconnect. Confirm every exact change on the user's own side; do not change a partner's side or offer diagnoses. Alarms/schedules depend on membership and the app timezone. Cover connectivity, online/away limits and queued offline alarm writes matter. Respect 60 calls/minute, 10 changes/5 minutes and 50 changes/day. |
| engine | [engine](plugins/engine/README.md) | mcp-bundle | Hotel booking tools act for the signed-in member. Bookings charge the saved card or direct bill. Show member, hotel, dates, full price and cancellation terms and get exact approval before booking; preview shortening/cancellation first. Check booking status or offer the provider website after an uncertain result, never blindly retry. Native OAuth and live booking acceptance remain unverified. |
| metricool | [metricool](plugins/metricool/README.md) | mcp-bundle | Uses provider OAuth PKCE/DCR; no X-Mc-Auth header is copied. MCP is available on all plans but plan limits apply. Confirm brand, network, content and effects before publishing, messages, reviews or Smartlinks. Ad changes require specific spending authority. Package validation does not establish authentication or publishing acceptance. |
| paypal | [paypal](plugins/paypal/README.md) | mcp-bundle | The packaged endpoint is PRODUCTION, not sandbox. Requires a PayPal business account and supported OAuth PKCE/DCR. Financial actions, refunds, disputes, subscriptions, invoices and reminders need authority for the exact account, amount, recipient and effect. No commerce feature header, shopping capability or local token server is added. Static checks do not establish authenticated access. |
| squarespace | [squarespace](plugins/squarespace/README.md) | mcp-bundle | Public domain naming/search tools can be used without authentication. Show sponsored labels, first-year and renewal prices, and distinguish an unknown available:null result from unavailable. A checkout link is not a purchase. Commerce is separately client-qualified through CIMD; do not claim native Commerce tools or replace CIMD with DCR. |
| databricks-genie | [databricks-genie](plugins/databricks-genie/README.md) | configuration-required | Renamed from databricks-genie-one; the endpoint still ends in system.ai.genie_one_mcp. Requires the bare workspace hostname and an admin-registered native OAuth client with ai-gateway/offline_access; no DCR. The secret is optional. Verify native redirect support and signed-in user access; do not modify existing saved configuration as part of this rename. |
| front | [front](plugins/front/README.md) | configuration-required | An admin must create a confidential Front app with the MCP feature, own client ID and secret, feature:mcp scope and actual native callback. DCR is unsupported. Resource read/write/send permissions are separate; request minimum access and reconnect after permission changes. Confirm exact recipients and content for sends. Distinguish drafts and internal comments, honor inbox/user permissions and rate-limit waits. |
| mixpanel | [mixpanel](plugins/mixpanel/README.md) | configuration-required | Select the organization's US mcp.mixpanel.com, EU mcp-eu.mixpanel.com or IN mcp-in.mixpanel.com host; never infer or change residency. Uses OAuth PKCE/DCR, not a service-account header. Verify project access and admin AI/MCP enablement, which may take 15 minutes; query limits apply. Confirm each dashboard, metadata, cohort, experiment or flag write. Keep unverified-entity markers; unsupported audience targeting is not supplied. |
| netsuite | [netsuite](plugins/netsuite/README.md) | configuration-required | Require an authorized account-specific AI Connector Service URL: /all or the exact /suiteapp/<applicationid> suffix. Account ID uses domain form (lowercase, underscores to hyphens). Qualify native DCR client name/redirect and only mcp scope. Admin must enable SuiteScript/OAuth, tools SuiteApp and pending integration; standard records need REST Web Services. Use a dedicated non-admin role with MCP Connection, OAuth access-token and SuiteApp folder permissions. Honor ACLs, exact write authority, concurrency limits and the provider's ePHI exclusion. |
| runta | [runta](plugins/runta/README.md) | configuration-required | Uses Client ID Metadata Documents (CIMD), not DCR. Stop until native CIMD support and the actual client identity/organization consent are verified; no ID, secret or API key should be invented. Preserve runtime:read/runtime:manage scopes and organization roles. Commands, runtime changes/deletion, checkpoint restores and port publication require concrete authority; published URLs are public. Accepted lifecycle requests require status checks before claiming completion. Do not expose credentials, copy local files or claim secret/billing/member-management tools. |
| google-analytics | google-analytics | blocked | Grok Bot/Cursor-hosted REST proxy; no portable provider implementation is supplied. |
