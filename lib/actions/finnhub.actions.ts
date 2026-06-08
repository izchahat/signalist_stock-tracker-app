'use server';

import { cache } from 'react';
import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistSymbolsByEmail } from './watchlist.actions';
import {
    fetchJSON,
    formatPrice,
    formatChangePercent,
    formatMarketCapValue,
    FINNHUB_BASE_URL,
    getDateRange,
} from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';

interface StockProfile {
    name?: string;
    ticker?: string;
    exchange?: string;
    marketCapitalization?: number;
}

interface NewsArticle {
    headline?: string;
    summary?: string;
    url?: string;
    source?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
    id?: number;
}

interface FinnhubResultWithExchange extends FinnhubSearchResult {
    __exchange?: string;
}

// ✅ getStocksDetails
export const getStocksDetails = cache(async (symbol: string) => {
    const cleanSymbol = symbol.trim().toUpperCase();

    try {
        const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) throw new Error('FINNHUB API key is not configured');

        const [quote, profile, financials] = await Promise.all([
            fetchJSON<QuoteData>(
                `${FINNHUB_BASE_URL}/quote?symbol=${cleanSymbol}&token=${token}`
            ),
            fetchJSON<ProfileData>(
                `${FINNHUB_BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${token}`,
                3600
            ),
            fetchJSON<FinancialsData>(
                `${FINNHUB_BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${token}`,
                1800
            ),
        ]);

        if (!quote?.c || !profile?.name)
            throw new Error('Invalid stock data received from API');

        const changePercent = quote.dp || 0;
        const peRatio = financials?.metric?.peNormalizedAnnual || null;

        return {
            symbol: cleanSymbol,
            company: profile.name,
            currentPrice: quote.c,
            changePercent,
            priceFormatted: formatPrice(quote.c),
            changeFormatted: formatChangePercent(changePercent),
            peRatio: peRatio?.toFixed(1) || '—',
            marketCapFormatted: formatMarketCapValue(
                profile.marketCapitalization || 0
            ),
        };
    } catch (error) {
        console.error(`Error fetching details for ${cleanSymbol}:`, error);
        throw new Error('Failed to fetch stock details');
    }
});

// ✅ searchStocks
export const searchStocks = cache(
    async (query?: string): Promise<StockWithWatchlistStatus[]> => {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });
            if (!session?.user) redirect('/sign-in');

            const userWatchlistSymbols = await getWatchlistSymbolsByEmail(
                session.user.email
            );

            const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
            if (!token) {
                console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
                return [];
            }

            const trimmed = typeof query === 'string' ? query.trim() : '';
            let results: FinnhubResultWithExchange[] = [];

            if (!trimmed) {
                const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
                const profiles = await Promise.all(
                    top.map(async (sym) => {
                        try {
                            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
                            const profile = await fetchJSON<StockProfile>(url, 3600);
                            return { sym, profile };
                        } catch (e) {
                            console.error('Error fetching profile2 for', sym, e);
                            return { sym, profile: null as StockProfile | null };
                        }
                    })
                );

                results = profiles
                    .map(({ sym, profile }) => {
                        const symbol = sym.toUpperCase();
                        const name: string | undefined = profile?.name || profile?.ticker || undefined;
                        const exchange: string | undefined = profile?.exchange || undefined;
                        if (!name) return undefined;
                        const r: FinnhubResultWithExchange = {
                            symbol,
                            description: name,
                            displaySymbol: symbol,
                            type: 'Common Stock',
                            __exchange: exchange,
                        };
                        return r;
                    })
                    .filter((x): x is FinnhubResultWithExchange => Boolean(x));
            } else {
                const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
                const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
                results = Array.isArray(data?.result) ? data.result : [];
            }

            const mapped: StockWithWatchlistStatus[] = results
                .map((r) => {
                    const upper = (r.symbol || '').toUpperCase();
                    const name = r.description || upper;
                    const exchange = r.__exchange || 'US';
                    const type = r.type || 'Stock';

                    return {
                        symbol: upper,
                        name,
                        exchange,
                        type,
                        isInWatchlist: userWatchlistSymbols.includes(
                            r.symbol.toUpperCase()
                        ),
                    };
                })
                .slice(0, 15);

            return mapped;
        } catch (err) {
            console.error('Error in stock search:', err);
            return [];
        }
    }
);

// ✅ getNews
export const getNews = cache(async (symbols?: string[]): Promise<NewsArticle[]> => {
    try {
        const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) return [];

        if (symbols && symbols.length > 0) {
            const { from, to } = getDateRange(7);

            const allNews = await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${token}`;
                        const data = await fetchJSON<NewsArticle[]>(url, 1800);
                        return Array.isArray(data) ? data.slice(0, 3) : [];
                    } catch (e) {
                        console.error(`Error fetching news for ${symbol}:`, e);
                        return [];
                    }
                })
            );

            return allNews.flat().slice(0, 6);
        }

        const url = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
        const data = await fetchJSON<NewsArticle[]>(url, 1800);
        return Array.isArray(data) ? data.slice(0, 6) : [];

    } catch (err) {
        console.error('Error fetching news:', err);
        return [];
    }
});