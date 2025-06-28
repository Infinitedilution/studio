"use server";

import { generateAppDescription } from '@/ai/flows/generate-app-description';

export async function generateDescriptionAction(name: string, url: string) {
  if (!url || !name) {
    return { error: 'App name and URL are required.' };
  }
  try {
    const result = await generateAppDescription({ name, url });
    return { description: result.description };
  } catch (e) {
    console.error(e);
    return { error: 'Could not generate a description.' };
  }
}
