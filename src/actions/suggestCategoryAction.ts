
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

export async function getFaviconAction(url: string) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        return { iconUrl: `https://unavatar.io/${domain}?fallback=https://placehold.co/512x512.png&size=512` };
    } catch (error) {
        console.error("Invalid URL for favicon:", error);
        return { iconUrl: 'https://placehold.co/512x512.png' };
    }
}
