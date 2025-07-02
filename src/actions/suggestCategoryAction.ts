
"use server";

import { suggestAppCategory } from '@/ai/flows/suggest-app-category';

export async function suggestCategoryAction(url: string) {
  if (!url || !url.startsWith('http')) {
    return { error: 'Please enter a valid URL.' };
  }
  try {
    const result = await suggestAppCategory({ url });
    return { category: result.category };
  } catch (e) {
    console.error(e);
    return { error: 'Could not suggest a category. Please enter one manually.' };
  }
}
