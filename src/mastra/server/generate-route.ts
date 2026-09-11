import { registerApiRoute } from '@mastra/core/server';
import { adsBriefSchema } from '../schemas/ads';
import { runGenerateAds } from '../lib/run-generate-ads';
import { publicOrigin } from './public-origin';

export const generateRoute = registerApiRoute('/generate', {
  method: 'POST',
  handler: async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'Request body must be JSON.' }, 400);
    }

    const parsed = adsBriefSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: 'Invalid brief.', details: parsed.error.flatten() }, 400);
    }

    try {
      const output = await runGenerateAds(c.get('mastra'), parsed.data, publicOrigin(c));
      return c.json(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generate failed.';
      return c.json({ error: message }, 502);
    }
  },
});
