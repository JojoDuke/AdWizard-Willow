import { Agent, Artifact, Context, Question, eventsToStream, taskTemplate } from '@villow/sdk';
import { mastra } from '../mastra/index';
import { runGenerateAds } from '../mastra/lib/run-generate-ads';
import { adsBriefSchema } from '../mastra/schemas/ads';

function asBrief(inputs: Record<string, unknown>, answers: Record<string, unknown> = {}): unknown {
  const base =
    inputs.brief && typeof inputs.brief === 'object' ? (inputs.brief as Record<string, unknown>) : inputs;
  return { ...base, ...answers };
}

export class AdsAgent extends Agent {
  @taskTemplate('generate_ads')
  prepare(inputs: Record<string, unknown>, ctx: Context) {
    const parsed = adsBriefSchema.safeParse(asBrief(inputs, ctx.answers));
    if (!parsed.success) {
      return ctx.requestClarification([
        Question.text({
          id: 'product',
          label: 'What product or service should these ads sell?',
          decideForMe: { value: 'A named product with one sentence on what it is.' },
        }),
        Question.text({
          id: 'audience',
          label: 'Who is the audience?',
          decideForMe: { value: 'The primary buyer in one sentence.' },
        }),
        Question.text({
          id: 'offer',
          label: 'What is the offer or reason to act now?',
          decideForMe: { value: 'A concrete offer such as a discount or trial.' },
        }),
        Question.singleSelect({
          id: 'platform',
          label: 'Which platform?',
          options: ['meta', 'google', 'linkedin'],
          default: 'meta',
          decideForMe: { value: 'meta' },
        }),
        Question.text({
          id: 'tone',
          label: 'What tone should the copy use?',
          decideForMe: { value: 'confident and clear' },
        }),
      ]);
    }

    return ctx.readyToAuthorize({
      normalizedInputs: parsed.data as unknown as Record<string, unknown>,
    });
  }

  @taskTemplate('generate_ads')
  async run(inputs: Record<string, unknown>, ctx: Context) {
    const brief = adsBriefSchema.parse(asBrief(inputs, ctx.answers));
    const origin = process.env.PUBLIC_BASE_URL ?? 'https://adwizard-willow.onrender.com';

    await ctx.reportProgress({ event_type: 'milestone', milestone: { label: 'Writing copy' } });
    const output = await runGenerateAds(mastra, brief, origin);

    await ctx.reportProgress({ event_type: 'milestone', milestone: { label: 'Generating stills' } });
    await ctx.stageArtifact(
      Artifact.generic({
        title: 'Ad variants',
        payload: { variants: output.variants },
        previewData: {
          headlines: output.variants.map((variant) => variant.headline),
        },
      }) as unknown as Record<string, unknown>,
    );

    ctx.setAgentState({ lastPlatform: brief.platform, variantCount: output.variants.length });
    const stream = eventsToStream(ctx.emittedEvents, ctx.taskId);
    return {
      accepted: true,
      stream_events: stream.events(),
    };
  }
}
