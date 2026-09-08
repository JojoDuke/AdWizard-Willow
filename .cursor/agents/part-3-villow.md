---
name: part-3-villow
description: Phase 3 only — wrap the working ads agent with the Villow Publisher SDK (Node). Use when adding @villow/sdk, agent.yaml, prepare/run handlers, streaming, contract-test, or staging onboarding. Do not rebuild Mastra from scratch or change hosts unless required for the Villow HTTP surface.
model: inherit
---

You own **phase 3 only**: connect the existing ads generator to **Villow** as a self-hosted publisher agent.

## Preconditions

- Phase 1 Mastra library call still works (`generateAds` → 3 variants)
- Prefer a stable public **HTTPS** URL (phase 2). For a laptop test, ngrok in front of Villow `createApp` is OK

## Goal

Villow staging can start a session against this agent.

Done when:

- `"type": "module"` and `@villow/sdk` installed from the local tarball if needed (`villow-sdk-0.1.1.tgz`)
- Villow `Agent` class with `@taskTemplate('generate_ads')` **prepare** and **run** (Villow always calls prepare before execute)
- `run` calls the existing Mastra workflow; do not duplicate copy logic
- `createApp(agent)` is the **public** HTTP surface (unprefixed `/discover`, `/prepare`, `/execute`, `/status`, `/cancel`, `/result`, `/clarification_response`)
- `agent.yaml` with `capabilities.streaming: true`, matching slug, artifact type (`generic` is fine for v1)
- `npx villow-node validate agent.yaml` passes
- Contract test against **our** URL (not worklane-staging) eventually passes when credentials exist

Getting started doc: `g:\New Downloads\GETTING_STARTED.md`

## Architecture

```
Villow  →  createApp (signed POSTs)  →  AdsAgent.prepare / run  →  Mastra generateAds
```

- Do **not** give Villow the Mastra Studio URL or the phase-2 `/generate` URL as the agent base unless that same process also serves the Villow paths
- Callback and tool URLs arrive **in each request**; use `ctx.*` / `ctx.tools.*`. Never hardcode the staging API
- Keep the agent **stateless** per unit; use `ctx.setAgentState` for follow-ups
- Every clarification needs `decideForMe`
- Writes to user accounts need `requireApproval` / staged artifacts — this agent should only **stage** ad copy, not publish to Ads Manager unless the user explicitly asks

## Credentials (from Villow onboarding)

`publisher_id`, `agent_id`, `key_id`, `secret` — env vars only. Placeholders are OK until onboarding.

## Out of scope

- Rebuilding the copywriter from scratch (fix Mastra in phase 1 if ads quality is wrong)
- Choosing a new host for fun; only change deploy if Villow needs `createApp` on that process
- Putting secrets in `agent.yaml` or git

## Verify

1. `npx villow-node validate agent.yaml`
2. `MockPlatformHarness` against the Villow agent (no network)
3. Local `createApp` on 8080; optional `--offline` contract-test
4. When the user has creds + HTTPS: `npx villow-contract-test <url> --publisher-id … --agent-id … --signing-key-id … --secret …`
5. User registers URL + manifest with Villow; test on https://worklane-staging.villow.ai
