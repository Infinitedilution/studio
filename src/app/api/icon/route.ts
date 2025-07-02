
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const appUrl = searchParams.get('url');

  if (!appUrl) {
    return new NextResponse('URL parameter is required', {status: 400});
  }

  let domain;
  try {
    domain = new URL(appUrl).hostname.replace(/^www./, '');
  } catch (error) {
    return new NextResponse('Invalid URL parameter', {status: 400});
  }
  
  const iconHorseUrl = `https://icon.horse/icon/${domain}`;
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const placeholderUrl = 'https://placehold.co/256x256.png';

  const fetchAndServe = async (url: string, validate?: (blob: Blob) => boolean) => {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'FirebaseStudio-IconFetcher/1.0' } });
      if (!response.ok) {
        throw new Error(`Service at ${url} failed with status ${response.status}`);
      }

      const imageBlob = await response.blob();

      if (validate && !validate(imageBlob)) {
        throw new Error(`Validation failed for icon from ${url}`);
      }
      
      const contentType = response.headers.get('content-type') || 'image/png';
      
      // Ensure it's an image content type
      if (!contentType.startsWith('image/')) {
        throw new Error(`Invalid content type from ${url}: ${contentType}`);
      }

      return new NextResponse(imageBlob, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, immutable', // Cache for 1 day
        },
      });
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, (error as Error).message);
      return null;
    }
  };

  // 1. Try icon.horse
  let iconResponse = await fetchAndServe(iconHorseUrl);
  if (iconResponse) {
    return iconResponse;
  }
  
  // 2. Fallback to Google Favicon service
  iconResponse = await fetchAndServe(googleFaviconUrl, (blob) => blob.size > 100);
  if (iconResponse) {
    return iconResponse;
  }

  // 3. If all else fails, redirect to a static placeholder
  console.warn(`All icon services failed for ${domain}. Redirecting to placeholder.`);
  return NextResponse.redirect(placeholderUrl, {status: 302});
}
