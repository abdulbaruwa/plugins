# Easyship for Codex

Community adaptation of upstream 1.0.0 from third_party/easyship. Original author, assets and license are retained.

Qualify native PKCE/DCR and the actual redirect. Calls follow the signed-in user, account permissions and consent. Label purchase can occur in create_label, create_shipment or update_shipment and charges the account. Offer a draft shipment/rate review first and confirm the exact shipment, rate and purchase authority. Before delete_shipment, cancel_shipment or cancel_pickup, confirm ID and current status. With authority, list_shipments is a read smoke test; no purchase is part of setup.

Install easyship@cursor-plugins-codex from <repository>/Codex. [Upstream README](references/upstream-readme.md) is source evidence; its client-specific configuration does not establish native acceptance. No provider is authenticated or live-tested by this port.
