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
    const contentType = response.headers.get('content-type') || 'image/png';
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable', // Cache for 1 day
      },
    });
  } catch (error) {
    // If Google's favicon service fails, redirect to a final placeholder
    return NextResponse.redirect(placeholderUrl);
  }
}
