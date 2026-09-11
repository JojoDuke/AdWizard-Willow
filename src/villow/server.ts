import { createApp } from '@villow/sdk';
import { AdsAgent } from './ads-agent';

const agent = new AdsAgent({
  publisherId: process.env.VILLOW_PUBLISHER_ID ?? 'YOUR_PUBLISHER_ID',
  agentId: process.env.VILLOW_AGENT_ID ?? 'YOUR_AGENT_ID',
  keyId: process.env.VILLOW_KEY_ID ?? 'YOUR_KEY_ID',
  secret: process.env.VILLOW_SECRET ?? 'YOUR_SECRET',
});

const app = createApp(agent);
const port = Number(process.env.PORT) || 8080;

app.get('/health', async () => ({ success: true }));

await app.listen({ port, host: '0.0.0.0' });
console.error(`Villow agent listening on 0.0.0.0:${port}`);
