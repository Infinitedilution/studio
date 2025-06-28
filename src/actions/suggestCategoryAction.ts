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
        // Using Google's favicon service is a reliable way to get an icon
        // without complex server-side scraping.
        return { iconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` };
    } catch (error) {
        console.error("Invalid URL for favicon:", error);
        // Fallback to a placeholder
        return { iconUrl: 'https://placehold.co/128x128.png' };
    }
}
