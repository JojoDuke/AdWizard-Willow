import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { buildImagePrompt, generateAdImage } from '../lib/openrouter-images';
import { adsBriefSchema, adsCopyOutputSchema, adsOutputSchema } from '../schemas/ads';

const writeAds = createStep({
  id: 'write-ads',
  inputSchema: adsBriefSchema,
  outputSchema: adsCopyOutputSchema,
  execute: async ({ inputData, mastra }) => {
    if (!mastra) {
      throw new Error('Mastra instance is missing; register generateAds on the Mastra instance.');
    }

    const agent = mastra.getAgentById('copywriter');
    const response = await agent.generate(JSON.stringify(inputData), {
      structuredOutput: {
        schema: adsCopyOutputSchema,
      },
    });

    if (!response.object) {
      throw new Error('Copywriter returned no structured object.');
    }

    return adsCopyOutputSchema.parse(response.object);
  },
});

const generateImages = createStep({
  id: 'generate-images',
  inputSchema: adsCopyOutputSchema,
  outputSchema: adsOutputSchema,
  execute: async ({ inputData, runId }) => {
    const outputDir = path.join(process.cwd(), 'output', 'ads', runId);
    await mkdir(outputDir, { recursive: true });

    const variants = await Promise.all(
      inputData.variants.map(async (variant, index) => {
        const { bytes } = await generateAdImage(buildImagePrompt(variant.imagePrompt), variant.platform);
        const filename = `variant-${index + 1}.png`;
        await writeFile(path.join(outputDir, filename), bytes);
        const imagePath = path.posix.join('output', 'ads', runId, filename);

        return { ...variant, imagePath };
      }),
    );

    return adsOutputSchema.parse({ variants });
  },
});

export const generateAds = createWorkflow({
  id: 'generateAds',
  inputSchema: adsBriefSchema,
  outputSchema: adsOutputSchema,
  description: 'Turn a business DNA brief into three ad variants with gpt-image-2 stills.',
})
  .then(writeAds)
  .then(generateImages)
  .commit();
