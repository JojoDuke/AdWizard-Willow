import type { Platform } from '../schemas/ads';

const OPENROUTER_IMAGES_URL = 'https://openrouter.ai/api/v1/images';
const IMAGE_MODEL = 'openai/gpt-image-2';

export function aspectRatioFor(platform: Platform): '1:1' | '16:9' | '3:4' {
  if (platform === 'linkedin') return '16:9';
  if (platform === 'meta') return '3:4';
  return '1:1';
}

export async function generateAdImage(prompt: string, platform: Platform): Promise<{ bytes: Buffer; mediaType: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing. Add it to .env.');
  }

  const response = await fetch(OPENROUTER_IMAGES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      n: 1,
      quality: 'medium',
      aspect_ratio: aspectRatioFor(platform),
    }),
  });

  const raw = await response.text();
  let parsed: {
    error?: { message?: string };
    data?: Array<{ b64_json?: string; url?: string; media_type?: string }>;
  };

  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    throw new Error(`OpenRouter image API returned non-JSON (${response.status}): ${raw.slice(0, 240)}`);
  }

  if (!response.ok) {
    throw new Error(parsed.error?.message ?? `OpenRouter image API failed (${response.status})`);
  }

  const image = parsed.data?.[0];
  if (!image?.b64_json) {
    throw new Error('OpenRouter image API returned no b64_json payload.');
  }

  return {
    bytes: Buffer.from(image.b64_json, 'base64'),
    mediaType: image.media_type ?? 'image/png',
  };
}

export function buildImagePrompt(imagePrompt: string): string {
  return [
    imagePrompt.trim(),
    'Photoreal paid-social ad still of this product only.',
    'Do not depict other brands, logos, or trademarked packaging.',
    'No medical before/after. No readable fake label text unless the product name is essential.',
  ].join(' ');
}
