
"use client";

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { App } from '@/lib/types';

interface AppImageProps extends Omit<ImageProps, 'src' | 'onError' | 'alt'> {
  app: App;
}

const placeholderSrc = 'https://placehold.co/256x256.png';

// Helper to convert blob to data URL
const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export function AppImage({ app, ...props }: AppImageProps) {
  const [src, setSrc] = useState<string>(placeholderSrc);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `icon-cache-${app.url}`;

    const fetchAndCacheIcon = async () => {
      try {
        // 1. Check for custom iconUrl (data URI from user upload)
        if (app.iconUrl?.startsWith('data:')) {
            if (isMounted) setSrc(app.iconUrl);
            // Cache custom uploaded icons in localStorage to be consistent
            try { localStorage.setItem(cacheKey, app.iconUrl); } catch (e) { console.warn('Failed to cache custom icon', e); }
            return;
        }
        
        // 2. Check localStorage for a valid cached icon
        const cachedIcon = localStorage.getItem(cacheKey);
        if (cachedIcon) {
            if (isMounted) setSrc(cachedIcon);
            return;
        }

        // 3. Fetch from our API endpoint if not cached
        const response = await fetch(`/api/icon?url=${encodeURIComponent(app.url)}`);
        
        if (!response.ok) {
            // Use static placeholder on API error, but don't cache this failure.
            if (isMounted) setSrc(placeholderSrc);
            return;
        }

        const isPlaceholder = response.headers.get('X-Icon-Source') === 'placeholder';
        const imageBlob = await response.blob();
        const dataUrl = await blobToDataUrl(imageBlob);

        if (isMounted) setSrc(dataUrl);

        // 4. IMPORTANT: Only cache the result in localStorage if it's NOT a placeholder.
        // This prevents "cache poisoning" and allows the app to retry fetching a real icon on the next visit.
        if (!isPlaceholder) {
            try {
                localStorage.setItem(cacheKey, dataUrl);
            } catch (error) {
                console.warn('LocalStorage is full, could not cache icon.', error);
            }
        }

      } catch (error) {
        console.error('Failed to load or cache icon:', error);
        if (isMounted) setSrc(placeholderSrc);
      }
    };

    fetchAndCacheIcon();

    return () => {
      isMounted = false;
    };
  }, [app.url, app.iconUrl]);

  return (
    <Image
      src={src}
      alt={`${app.name} icon`}
      unoptimized={src.startsWith('data:')} // Do not optimize data URIs
      {...props}
    />
  );
}
