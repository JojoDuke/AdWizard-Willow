import type { Mastra } from '@mastra/core/mastra';
import type { AdsBrief, AdsOutput } from '../schemas/ads';

export function withImageUrls(output: AdsOutput, origin?: string): AdsOutput {
  if (!origin) return output;

  return {
    variants: output.variants.map((variant) => {
      const parts = variant.imagePath.split('/');
      const filename = parts.at(-1);
      const runId = parts.at(-2);
      const imageUrl =
        filename && runId ? `${origin.replace(/\/$/, '')}/ads-media/${runId}/${filename}` : variant.imageUrl;

      return { ...variant, imageUrl };
    }),
  };
}

export async function runGenerateAds(
  mastra: Mastra,
  brief: AdsBrief,
  origin?: string,
): Promise<AdsOutput> {
  const workflow = mastra.getWorkflow('generateAds');
  const run = await workflow.createRun();
  const result = await run.start({ inputData: brief });

  if (result.status !== 'success') {
    const message = result.status === 'failed' ? result.error.message : `Workflow ${result.status}`;
    throw new Error(message);
  }

  return withImageUrls(result.result, origin);
}
