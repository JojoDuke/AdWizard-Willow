import { z } from 'zod';

export const platformSchema = z.enum(['meta', 'google', 'linkedin']);

export const metaCtaSchema = z.enum([
  'Shop Now',
  'Learn More',
  'Sign Up',
  'Subscribe',
  'Get Offer',
  'Book Now',
  'Contact Us',
  'Download',
  'Apply Now',
  'Get Quote',
]);

export const competitorSchema = z.object({
  brand: z.string().optional().describe('Competitor brand the user is borrowing a pattern from'),
  notes: z
    .string()
    .optional()
    .describe('Pasted pattern from Ads Library: hook, format, claims style. Not a live fetch.'),
});

export const adsBriefSchema = z.object({
  product: z.string().describe('Product or service being advertised'),
  audience: z.string().describe('Who the ad is for'),
  offer: z.string().describe('Offer, promo, or reason to act now'),
  platform: platformSchema.describe('Network all three variants will target'),
  tone: z.string().describe('Voice of the business DNA'),
  landingPage: z.string().optional().describe('Optional destination URL'),
  differentiators: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('What makes this business distinct'),
  brandFacts: z.string().optional().describe('Claims, ingredients, or facts that may be used. Do not invent extras.'),
  competitor: competitorSchema.optional(),
});

export const adCopyVariantSchema = z.object({
  headline: z.string(),
  primaryText: z.string(),
  cta: z.string(),
  platform: platformSchema,
  imagePrompt: z.string().describe('Photoreal ad still of THIS product, matching the visual pattern without naming competitors'),
});

export const adsCopyOutputSchema = z.object({
  variants: z.array(adCopyVariantSchema).length(3),
});

export const adVariantSchema = adCopyVariantSchema.extend({
  imagePath: z.string().describe('Local PNG path written after image generation'),
  imageUrl: z.string().optional().describe('Public URL for the PNG when served over HTTP'),
});

export const adsOutputSchema = z.object({
  variants: z.array(adVariantSchema).length(3),
});

export type AdsBrief = z.infer<typeof adsBriefSchema>;
export type AdCopyVariant = z.infer<typeof adCopyVariantSchema>;
export type AdVariant = z.infer<typeof adVariantSchema>;
export type AdsCopyOutput = z.infer<typeof adsCopyOutputSchema>;
export type AdsOutput = z.infer<typeof adsOutputSchema>;
export type Platform = z.infer<typeof platformSchema>;
