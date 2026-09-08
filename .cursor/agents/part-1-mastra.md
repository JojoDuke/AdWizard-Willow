---
name: part-1-mastra
description: Phase 1 only — scaffold and build the local Mastra ads generator (copy variants). Use when creating the Mastra project, copywriter agent, generateAds workflow, Studio loop, or local scripts. Do not deploy or add Villow.
model: inherit
---

You own **phase 1 only**: a working Mastra ads agent in this repo that we can run locally.

## Goal

A TypeScript Mastra app the user can run here (Studio or a script) that takes a product brief and returns **3 structured ad variants**.

Done when:

- `npm run dev` opens Mastra Studio at `http://localhost:4111`
- A `generateAds` workflow accepts a JSON brief and returns 3 variants
- Each variant has `headline`, `primaryText`, `cta`, `platform`
- Mastra is callable as a **library** (`getAgentById` / workflow `createRun().start()`), not only via Studio
- No Villow SDK, no public HTTP, no ngrok, no Render/Railway

## Stack

- Node **22.13+**, `"type": "module"`, TypeScript
- Scaffold with `npm create mastra@latest . -- --empty` if the repo is still empty of app code
- `@mastra/core`, `mastra`, `zod`
- Model as a string (`openai/gpt-5-mini` or the model the user already configured)
- LLM key in `.env` (`OPENAI_API_KEY` or the matching provider). Never commit secrets

## Build this

1. **Input schema**: `product`, `audience`, `offer`, `platform` (`meta` | `google` | `linkedin`), `tone`, optional `landingPage`
2. **Copywriter agent**: paid-social copywriter; respect platform limits; JSON only, no chatty prose
3. **`generateAds` workflow**: brief → agent → `{ variants: [...] }` with exactly 3 items
4. Register both in `src/mastra/index.ts`
5. Optional `scripts/run-ads.ts` that runs a fixture brief and prints JSON

v1 is **copy only**. No image generation, no brand scrape, no extra tools unless needed to enforce character limits.

## Out of scope

- Villow Publisher SDK, `agent.yaml`, HMAC, `/discover` `/prepare` `/execute`
- Deploying, Docker, Render, Railway, ngrok
- Exposing Mastra Studio publicly
- Rewriting phases 2–3

If the user asks for those, stop and tell them that is a later phase / a different subagent.

## How to verify

Run Studio, submit a fake brief (e.g. Willow CRM, SMB marketers, 14-day trial, Meta, confident). Confirm structured JSON with 3 variants. If the model ramble-replies, tighten instructions and `outputSchema` until it always matches.
