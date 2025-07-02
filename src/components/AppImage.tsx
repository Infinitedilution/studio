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
        // 1. Check for custom iconUrl (data URI)
        if (app.iconUrl?.startsWith('data:')) {
            if (isMounted) setSrc(app.iconUrl);
            // Also cache custom uploaded icons
            try {
                localStorage.setItem(cacheKey, app.iconUrl);
            } catch (e) {
                console.warn('Failed to cache custom icon in localStorage', e);
            }
            return;
        }
        
        // 2. Check localStorage
        const cachedIcon = localStorage.getItem(cacheKey);
        if (cachedIcon) {
            if (isMounted) setSrc(cachedIcon);
            return;
        }

        // 3. Fetch from API if not cached
        const response = await fetch(`/api/icon?url=${encodeURIComponent(app.url)}`);
        
        if (!response.ok || response.redirected) {
            if (isMounted) setSrc(placeholderSrc);
            return;
        }

        const imageBlob = await response.blob();

        if(imageBlob.size < 100){
            if (isMounted) setSrc(placeholderSrc);
            return;
        }

        const dataUrl = await blobToDataUrl(imageBlob);

        if (isMounted) setSrc(dataUrl);

        // 4. Cache the result in localStorage
        try {
            localStorage.setItem(cacheKey, dataUrl);
        } catch (error) {
            console.warn('LocalStorage is full, could not cache icon.', error);
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
