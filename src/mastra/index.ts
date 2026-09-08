import { Mastra } from '@mastra/core/mastra';
import { copywriterAgent } from './agents/copywriter';
import { adsMediaRoute } from './server/ads-media-route';
import { generateRoute } from './server/generate-route';
import { generateAds } from './workflows/generate-ads';

export const mastra = new Mastra({
  agents: { copywriter: copywriterAgent },
  workflows: { generateAds },
  server: {
    host: '0.0.0.0',
    timeout: 180_000,
    drainTimeout: 180_000,
    apiRoutes: [generateRoute, adsMediaRoute],
  },
});
