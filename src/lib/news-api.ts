export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    imageUrl?: string;
    category: string;
}

export async function fetchMarketNews(category?: string): Promise<NewsArticle[]> {
    try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);

        const baseUrl = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/news?${params.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`News API error: ${res.status}`);
            return getFallbackNews();
        }

        const data = await res.json();

        // Handle both GNews and NewsAPI formats
        const articles = data.articles || [];

        if (!Array.isArray(articles)) {
            console.warn('News API returned unexpected format, using fallback');
            return getFallbackNews();
        }

        /* eslint-disable @typescript-eslint/no-explicit-any */
        return articles.map((a: any) => ({
            title: a.title,
            description: a.description || a.content || 'No description available',
            url: a.url,
            source: a.source?.name || 'Unknown',
            publishedAt: a.publishedAt,
            imageUrl: a.image || a.urlToImage, // a.image for GNews, a.urlToImage for NewsAPI
            category: category || 'general',
        }));
        /* eslint-enable @typescript-eslint/no-explicit-any */

    } catch (err) {
        console.error('Failed to fetch news:', err);
        return getFallbackNews();
    }
}

function getFallbackNews(): NewsArticle[] {
    return [
        {
            title: 'Markets Rally as Fed Signals Cautious Approach',
            description: 'Major indices posted gains as the Federal Reserve indicated a measured pace for future policy changes.',
            url: '#',
            source: 'Market Wire',
            publishedAt: new Date().toISOString(),
            category: 'indices',
        },
        {
            title: 'Bitcoin Holds Key Support Level Amid Volatility',
            description: 'BTC/USD remains resilient above critical support levels as crypto markets navigate macroeconomic uncertainty.',
            url: '#',
            source: 'Crypto Daily',
            publishedAt: new Date().toISOString(),
            category: 'crypto',
        },
        {
            title: 'EUR/USD Consolidates Near Multi-Week Highs',
            description: 'The euro remains supported against the dollar as European economic data surprises to the upside.',
            url: '#',
            source: 'FX Street',
            publishedAt: new Date().toISOString(),
            category: 'forex',
        },
        {
            title: 'NASDAQ Hits New Highs on Tech Earnings',
            description: 'Technology sector earnings continue to exceed expectations, driving the composite to fresh records.',
            url: '#',
            source: 'Market Wire',
            publishedAt: new Date().toISOString(),
            category: 'indices',
        },
        {
            title: 'Ethereum Upgrades Drive Network Activity',
            description: 'ETH sees increased on-chain activity as protocol improvements boost transaction throughput and reduce fees.',
            url: '#',
            source: 'Crypto Daily',
            publishedAt: new Date().toISOString(),
            category: 'crypto',
        },
        {
            title: 'GBP/USD Eyes Resistance After BoE Decision',
            description: 'The British pound tests key resistance levels following the Bank of England\'s latest monetary policy decision.',
            url: '#',
            source: 'FX Street',
            publishedAt: new Date().toISOString(),
            category: 'forex',
        },
    ];
}
