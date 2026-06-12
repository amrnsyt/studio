'use server';
/**
 * @fileOverview An AI agent that analyzes daily kick patterns and generates a summary of rhythmic activity.
 *
 * - dailyKickRhythmSummary - A function that handles the daily kick rhythm summary generation.
 * - DailyKickRhythmSummaryInput - The input type for the dailyKickRhythmSummary function.
 * - DailyKickRhythmSummaryOutput - The return type for the dailyKickRhythmSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyKickRhythmSummaryInputSchema = z.object({
  kickEntries: z
    .array(
      z.object({
        time: z.string().describe('The time the kick was recorded (ISO string).'),
        intensity: z.number().int().min(1).max(5).describe('The intensity of the kick (1-5).'),
        notes: z.string().optional().describe('Any notes associated with the kick entry.'),
      })
    )
    .describe('An array of kick entries for a specific day.'),
});
export type DailyKickRhythmSummaryInput = z.infer<typeof DailyKickRhythmSummaryInputSchema>;

const DailyKickRhythmSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise daily summary of the baby\'s rhythmic activity.'),
});
export type DailyKickRhythmSummaryOutput = z.infer<typeof DailyKickRhythmSummaryOutputSchema>;

export async function dailyKickRhythmSummary(
  input: DailyKickRhythmSummaryInput
): Promise<DailyKickRhythmSummaryOutput> {
  return dailyKickRhythmSummaryFlow(input);
}

const dailyKickRhythmSummaryPrompt = ai.definePrompt({
  name: 'dailyKickRhythmSummaryPrompt',
  input: {schema: DailyKickRhythmSummaryInputSchema},
  output: {schema: DailyKickRhythmSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing baby kick patterns.
Your goal is to provide a concise daily summary of the baby's rhythmic activity based on the provided kick entries.
Identify any noticeable patterns, trends, or unusual activity. Keep the summary under 150 words.

Kick Entries:
{{#each kickEntries}}
- Time: {{{time}}}, Intensity: {{{intensity}}}{{#if notes}}, Notes: {{{notes}}}{{/if}}
{{/each}}

Generate a summary of the baby's rhythmic activity for the day:`,
});

const dailyKickRhythmSummaryFlow = ai.defineFlow(
  {
    name: 'dailyKickRhythmSummaryFlow',
    inputSchema: DailyKickRhythmSummaryInputSchema,
    outputSchema: DailyKickRhythmSummaryOutputSchema,
  },
  async input => {
    const {output} = await dailyKickRhythmSummaryPrompt(input);
    return output!;
  }
);
