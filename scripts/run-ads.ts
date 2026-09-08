import { mastra } from '../src/mastra/index';
import type { AdsBrief } from '../src/mastra/schemas/ads';

const fixture: AdsBrief = {
  product: 'Willow Glow — a fragrance-free 5% niacinamide serum for sensitive skin',
  audience: 'People with reactive skin who want clinical-strength actives without a harsh lab aesthetic',
  offer: '20% off first order plus a free pH-balancing toner sample',
  platform: 'meta',
  tone: 'calm, scientific, quietly confident',
  landingPage: 'https://willowglow.example/serum',
  differentiators: [
    'Fragrance-free and essential-oil-free',
    'Buffered 5% niacinamide for sensitive skin',
    'Dermatologist-tested',
  ],
  brandFacts:
    'Willow Glow is a small-batch skincare line. No fragrance, no essential oils. Do not claim medical results or before/after outcomes.',
  competitor: {
    brand: 'The Ordinary',
    notes:
      'Long-running Meta UGC: close-up of serum texture, deadpan voiceover listing what it does not contain, then one benefit, then Shop Now. Sparse white stills, short lines, no miracle language.',
  },
};

const workflow = mastra.getWorkflow('generateAds');
const run = await workflow.createRun();
const result = await run.start({ inputData: fixture });

if (result.status !== 'success') {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result.result, null, 2));
console.error(
  'Images:',
  result.result.variants.map((variant) => variant.imagePath).join(', '),
);
