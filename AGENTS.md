# AdWizard-Willow

Villow marketplace **Ads Generator**. Work **one phase at a time**. Do not start a later phase until the earlier one is done and the user asks to continue.

| Phase | Subagent | Goal |
|-------|----------|------|
| 1 | `part-1-mastra` | Local Mastra ads agent that turns a JSON brief into 3 structured ad variants |
| 2 | `part-2-deploy` | Same agent behind a public HTTPS URL (Render / Railway / similar) |
| 3 | `part-3-villow` | `@villow/sdk` wrapper, `agent.yaml`, contract test, staging onboarding |

Delegate implementation to the matching subagent in `.cursor/agents/`. Default to **phase 1** until the user says otherwise.

Villow SDK getting started (local, not in this repo): `g:\New Downloads\GETTING_STARTED.md`
