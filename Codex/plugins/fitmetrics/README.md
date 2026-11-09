# FitMetrics for Codex

Community adaptation of [FitMetrics 1.0.0](https://github.com/cursor/plugins/tree/main/third_party/fitmetrics). The upstream author, logo, and MIT license are preserved.

FitMetrics connects to ABC Trainerize for client and check-in reads and authorized coaching updates. This package supplies the explicit `$fitmetrics:setup-fitmetrics` workflow and a [native configuration example](references/config.example.toml), with no connection enabled by the package.

FitMetrics Scale and a key scoped to the coach, clients, and tools are required. Keep the key outside the repository; use native bearer-token environment mapping. Write access is subject to provider permissions and the user's authority for the particular action. Packaging checks do not verify credentials, entitlements, or live tools.
