import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { registerApiRoute } from '@mastra/core/server';

const RUN_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILENAME = /^variant-[1-3]\.png$/;

export const adsMediaRoute = registerApiRoute('/ads-media/:runId/:filename', {
  method: 'GET',
  handler: async (c) => {
    const runId = c.req.param('runId');
    const filename = c.req.param('filename');

    if (!RUN_ID.test(runId) || !FILENAME.test(filename)) {
      return c.json({ error: 'Not found.' }, 404);
    }

    const root = path.resolve(process.cwd(), 'output', 'ads', runId);
    const file = path.resolve(root, filename);
    if (!file.startsWith(root)) {
      return c.json({ error: 'Not found.' }, 404);
    }

    try {
      const bytes = await readFile(file);
      return new Response(bytes, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch {
      return c.json({ error: 'Not found.' }, 404);
    }
  },
});
