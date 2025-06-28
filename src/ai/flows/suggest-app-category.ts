'use server';

/**
 * @fileOverview AI agent to suggest a category for a user-added app based on the URL.
 *
 * - suggestAppCategory - A function that handles the app category suggestion process.
 * - SuggestAppCategoryInput - The input type for the suggestAppCategory function.
 * - SuggestAppCategoryOutput - The return type for the suggestAppCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppCategoryInputSchema = z.object({
  url: z.string().url().describe('The URL of the app to categorize.'),
});
export type SuggestAppCategoryInput = z.infer<typeof SuggestAppCategoryInputSchema>;

const SuggestAppCategoryOutputSchema = z.object({
  category: z.string().describe('The suggested category for the app.'),
});
export type SuggestAppCategoryOutput = z.infer<typeof SuggestAppCategoryOutputSchema>;

export async function suggestAppCategory(input: SuggestAppCategoryInput): Promise<SuggestAppCategoryOutput> {
  return suggestAppCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppCategoryPrompt',
  input: {schema: SuggestAppCategoryInputSchema},
  output: {schema: SuggestAppCategoryOutputSchema},
  prompt: `You are an expert app categorizer. Given the URL of an app, you will determine the most appropriate category for the app.
Suggest one of the following categories if appropriate: Productivity, Design, Social, Utilities, Entertainment, Development, Dex, Cex, Web3 Games, Memes. Otherwise, suggest a suitable custom category.

URL: {{{url}}}

Suggest Category:`,
});

const suggestAppCategoryFlow = ai.defineFlow(
  {
    name: 'suggestAppCategoryFlow',
    inputSchema: SuggestAppCategoryInputSchema,
    outputSchema: SuggestAppCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
