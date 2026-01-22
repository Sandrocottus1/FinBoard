import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    // Decode the URL just in case
    const targetUrl = decodeURIComponent(url);
    
    console.log(`Fetching: ${targetUrl}`);

    // Simple fetch without custom headers
    const res = await fetch(targetUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json(
      { error: `Failed to fetch: ${error.message}` },
      { status: 500 }
    );
  }
}