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

  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const placeholderUrl = 'https://placehold.co/256x256.png';

  try {
    const response = await fetch(googleFaviconUrl);
    if (!response.ok) {
      throw new Error('Google favicon service failed');
    }

    const imageBuffer = await response.arrayBuffer();
    
    // Google's service can return a 200 OK with a very small, often transparent,
    // image if no favicon is found. We check the size to avoid displaying these.
    // A reasonable threshold for a minimal valid icon is ~100 bytes.
    if (imageBuffer.byteLength < 100) {
      throw new Error('Icon not found or is too small to be valid.');
    }
    
    const contentType = response.headers.get('content-type') || 'image/png';
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable', // Cache for 1 day
      },
    });
  } catch (error) {
    // If Google's favicon service fails or we reject the icon, 
    // redirect to a final placeholder. The browser will handle loading this.
    return NextResponse.redirect(placeholderUrl);
  }
}
