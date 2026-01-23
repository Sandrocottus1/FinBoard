import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    const targetUrl = new URL(url);

    // SECURELY INJECT API KEY FOR FINNHUB
    if (targetUrl.hostname.includes('finnhub.io')) {
      // Append the token from .env file
      targetUrl.searchParams.append('token', process.env.FINNHUB_API_KEY || '');
    }

    const res = await fetch(targetUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `API Error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}