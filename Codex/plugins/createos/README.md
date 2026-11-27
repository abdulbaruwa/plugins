# CreateOS for Codex

Community adaptation of upstream 1.0.0 from third_party/createos. Original authors, assets and license are retained.

Use the documented X-Api-Key path with a CreateOS account and a key held in the native credential store or environment. Do not infer native OAuth compatibility from advertised DCR. Actions run as the key owner and consume account quotas; inspect GetQuotas. Obtain explicit authority for deployments, environment changes, deletion, sandbox command execution, template purchases, credential management and project transfers. A transfer bearer token lasts six hours and conveys ownership; never expose it. Accepted deployment requests are not completed deployments: poll deployment state and logs.

No connection is enabled; run $setup-createos after installing this package. [Upstream README](references/upstream-readme.md) is source evidence; client-specific setup does not override the native qualifications above. Authentication and live behavior remain unverified.
