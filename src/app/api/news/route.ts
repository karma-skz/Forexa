import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY || '';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!NEWS_API_KEY) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    // Default query if no category is provided
    const query = category && category.trim()
        ? encodeURIComponent(`${category} market`)
        : encodeURIComponent('stock market OR crypto OR forex');

    try {
        // Switching to NewsAPI.org as the key seems to belong there
        const url = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=9&apiKey=${NEWS_API_KEY}`;

        console.log(`Fetching news from NewsAPI: ${url.replace(NEWS_API_KEY, 'SECRET')}`);
        const res = await fetch(url, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`NewsAPI error: ${res.status} ${res.statusText} - ${errorText}`);
            return NextResponse.json(
                { error: `NewsAPI error: ${res.status} ${res.statusText}`, detail: errorText },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('News proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
