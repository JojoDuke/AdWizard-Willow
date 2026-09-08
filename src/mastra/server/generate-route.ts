import { registerApiRoute } from '@mastra/core/server';
import { adsBriefSchema } from '../schemas/ads';
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

    const mastra = c.get('mastra');
    const workflow = mastra.getWorkflow('generateAds');
    const run = await workflow.createRun();
    const result = await run.start({ inputData: parsed.data });

    if (result.status !== 'success') {
      const message = result.status === 'failed' ? result.error.message : `Workflow ${result.status}`;
      return c.json({ error: message }, 502);
    }

    const origin = publicOrigin(c);
    const variants = result.result.variants.map((variant) => {
      const parts = variant.imagePath.split('/');
      const filename = parts.at(-1);
      const runId = parts.at(-2);
      const imageUrl =
        filename && runId ? `${origin}/ads-media/${runId}/${filename}` : undefined;

      return { ...variant, imageUrl };
    });

    return c.json({ variants });
  },
});
