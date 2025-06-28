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
  prompt: `You are a creative writer for a futuristic app launcher with a "glassmorphic" UI, similar to a high-end game launcher.
Your task is to write a compelling, one-paragraph description for the given application.
Focus on what the app does and its key features, but write it in an exciting and slightly edgy style. Keep it concise.

App Name: {{{name}}}
App URL: {{{url}}}

Generate the description:`,
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
