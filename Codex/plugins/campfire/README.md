# Campfire for Codex

Community adaptation of upstream 1.0.0 from third_party/campfire. Original author, assets and license are retained.

Qualify native OAuth/DCR sign-in; no API key or client ID is supplied. Calls run as the authorizing Campfire user within that workspace and read live books. Record/report tools are read-only; Ember tools start or steer conversations and are non-read-only, requiring the corresponding authority. Optional intent context is stored for product analytics: exclude credentials and sensitive personal data. With authority, get_current_user is a scoped read smoke test, not full runtime acceptance.

Install campfire@cursor-plugins-codex from <repository>/Codex. [Upstream README](references/upstream-readme.md) is source evidence; its client-specific configuration does not establish native acceptance. No provider is authenticated or live-tested by this port.
