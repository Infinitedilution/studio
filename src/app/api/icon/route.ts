
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
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
  
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const iconHorseUrl = `https://icon.horse/icon/${domain}`;
  const placeholderUrl = 'https://placehold.co/256x256.png';

  const fetchAndServe = async (url: string, sourceName: string, validate?: (blob: Blob) => boolean) => {
    try {
      // Using a standard browser User-Agent can help avoid being blocked by services.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Service at ${url} failed with status ${response.status}`);
      }

      const imageBlob = await response.blob();

      if (validate && !validate(imageBlob)) {
        throw new Error(`Validation failed for icon from ${url}`);
      }
      
      const contentType = response.headers.get('content-type') || 'image/png';
      
      if (!contentType.startsWith('image/')) {
        throw new Error(`Invalid content type from ${url}: ${contentType}`);
      }

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', 'public, max-age=86400, immutable');
      headers.set('X-Icon-Source', sourceName);

      return new NextResponse(imageBlob, { status: 200, headers });
    } catch (error) {
      console.warn(`Failed to fetch from ${sourceName} (${url}):`, (error as Error).message);
      return null;
    }
  };
  
  // 1. Try icon.horse (often higher quality)
  let iconResponse = await fetchAndServe(iconHorseUrl, 'icon.horse');
  if (iconResponse) {
    return iconResponse;
  }

  // 2. Fallback to Google Favicon service
  // Google's service can return a tiny 1x1 transparent pixel, so we validate the size.
  iconResponse = await fetchAndServe(googleFaviconUrl, 'google', (blob) => blob.size > 100);
  if (iconResponse) {
    return iconResponse;
  }

  // 3. If all else fails, fetch and serve the static placeholder
  console.warn(`All icon services failed for ${domain}. Serving placeholder.`);
  try {
    const placeholderResponse = await fetch(placeholderUrl);
    if (placeholderResponse.ok) {
      const placeholderBlob = await placeholderResponse.blob();
      const contentType = placeholderResponse.headers.get('content-type') || 'image/png';
      
      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('X-Icon-Source', 'placeholder');

      return new NextResponse(placeholderBlob, { status: 200, headers });
    }
    throw new Error(`Placeholder fetch failed with status ${placeholderResponse.status}`);
  } catch (error) {
    console.error('Fatal: Failed to fetch placeholder image.', error);
    // Return a 404 if even the placeholder is unreachable
    return new NextResponse('Icon not found and placeholder failed.', { status: 404 });
  }
}
