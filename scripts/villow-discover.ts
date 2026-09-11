import { signRequest, stableJsonBuffer } from '@villow/sdk';
import { AdsAgent } from '../src/villow/ads-agent';

const agent = new AdsAgent();
const app = agent.fastifyApp();

async function signedPost(path: string, payload: Record<string, unknown>) {
  const body = stableJsonBuffer(payload);
  const headers = signRequest({
    method: 'POST',
    path,
    body,
    keyId: agent.keyId,
    secret: agent.secret,
    publisherId: agent.publisherId,
    agentId: agent.agentId,
    idempotencyKey: `t_${path}_${Date.now()}`,
  });
  headers['content-type'] = 'application/json';
  const res = await app.inject({ method: 'POST', url: path, payload: body, headers });
  return { status: res.statusCode, body: res.json() };
}

const discover = await signedPost('/discover', {});
const prepare = await signedPost('/prepare', {
  task_id: 'task_local_1',
  task_template: 'generate_ads',
  initial_inputs: {
    product: 'Halo Barrier Cream',
    audience: 'People with over-exfoliated skin',
    offer: 'First jar $29',
    platform: 'meta',
    tone: 'direct and unfussy',
  },
});

console.log(JSON.stringify({ discover, prepare }, null, 2));
await app.close();
