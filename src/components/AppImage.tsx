"use client";

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { App } from '@/lib/types';

interface AppImageProps extends Omit<ImageProps, 'src' | 'onError' | 'alt'> {
  app: App;
}

export function AppImage({ app, ...props }: AppImageProps) {
  const [currentIconUrl, setCurrentIconUrl] = useState(app.iconUrl);

  useEffect(() => {
    setCurrentIconUrl(app.iconUrl);
  }, [app.iconUrl]);

  const handleError = () => {
    if (currentIconUrl === app.iconUrl) {
        try {
            const url = new URL(app.url);
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
            setCurrentIconUrl(fallbackUrl);
        } catch (e) {
            setCurrentIconUrl('https://placehold.co/256x256.png');
        }
    } else {
        setCurrentIconUrl('https://placehold.co/256x256.png');
    }
  };

  return (
    <Image
      src={currentIconUrl}
      onError={handleError}
      alt={`${app.name} icon`}
      {...props}
    />
  );
}
