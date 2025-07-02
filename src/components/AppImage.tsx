"use client";

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { App } from '@/lib/types';

interface AppImageProps extends Omit<ImageProps, 'src' | 'onError' | 'alt'> {
  app: App;
}

export function AppImage({ app, ...props }: AppImageProps) {
  // If a custom data URL is provided, use it. Otherwise, use our API proxy.
  const getInitialSrc = (app: App) => {
    return app.iconUrl?.startsWith('data:') 
      ? app.iconUrl 
      : `/api/icon?url=${encodeURIComponent(app.url)}`;
  }

  const [src, setSrc] = useState(getInitialSrc(app));
  
  // Update src if app data changes (e.g. from the Edit dialog)
  useEffect(() => {
    setSrc(getInitialSrc(app));
  }, [app.url, app.iconUrl]);


  const handleError = () => {
    // If our proxy or the data URL fails, use the final placeholder.
    setSrc('https://placehold.co/256x256.png');
  };

  return (
    <Image
      src={src}
      onError={handleError}
      alt={`${app.name} icon`}
      unoptimized={src.startsWith('data:')} // Do not optimize data URIs
      {...props}
    />
  );
}
