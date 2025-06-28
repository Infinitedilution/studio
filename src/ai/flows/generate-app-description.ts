'use server';

/**
 * @fileOverview AI agent to generate a description for an app.
 *
 * - generateAppDescription - A function that generates a short, engaging description for an app.
 * - GenerateAppDescriptionInput - The input type for the function.
 * - GenerateAppDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the app.'),
  url: z.string().url().describe('The URL of the app.'),
});
export type GenerateAppDescriptionInput = z.infer<typeof GenerateAppDescriptionInputSchema>;

const GenerateAppDescriptionOutputSchema = z.object({
  description: z.string().describe('A short, engaging, "game-launcher" style description for the app.'),
});
export type GenerateAppDescriptionOutput = z.infer<typeof GenerateAppDescriptionOutputSchema>;

export async function generateAppDescription(input: GenerateAppDescriptionInput): Promise<GenerateAppDescriptionOutput> {
  return generateAppDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppDescriptionPrompt',
  input: {schema: GenerateAppDescriptionInputSchema},
  output: {schema: GenerateAppDescriptionOutputSchema},
  prompt: `You are a helpful assistant who writes concise and accurate summaries for web applications for a futuristic app launcher.
Your task is to provide a factual, one-paragraph description for the given application based on your knowledge of it from its URL.
Summarize what the app does and its main purpose. Avoid making up features.
While the summary should be accurate, present it in an engaging and clear style suitable for an app launcher.

App Name: {{{name}}}
App URL: {{{url}}}

Generate the description based on the official information about the app:`,
});

const generateAppDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAppDescriptionFlow',
    inputSchema: GenerateAppDescriptionInputSchema,
    outputSchema: GenerateAppDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
