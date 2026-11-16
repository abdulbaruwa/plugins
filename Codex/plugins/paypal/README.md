# PayPal for Codex

Community adaptation of upstream 1.0.0 from `third_party/paypal`. Original authors, assets and MIT license are retained.

The packaged endpoint is PRODUCTION, not sandbox. Requires a PayPal business account and supported OAuth PKCE/DCR. Financial actions, refunds, disputes, subscriptions, invoices and reminders need authority for the exact account, amount, recipient and effect. No commerce feature header, shopping capability or local token server is added. Static checks do not establish authenticated access.

Register `<repository>/Codex` as the marketplace, then install `paypal@cursor-plugins-codex`. [Upstream README](references/upstream-readme.md) is reference evidence; its client-specific setup instructions do not override the native qualifications above. Provider authentication and live tools are unverified.
