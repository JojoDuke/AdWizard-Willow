import { MockPlatformHarness } from '@villow/sdk';
import { AdsAgent } from '../src/villow/ads-agent';

const harness = new MockPlatformHarness(new AdsAgent());
const result = await harness.runTask('generate_ads', {
  product: 'Halo Barrier Cream',
  audience: 'People with over-exfoliated skin',
  offer: 'First jar $29',
  platform: 'meta',
  tone: 'direct and unfussy',
});
await harness.close();

console.log(JSON.stringify(result, null, 2));
