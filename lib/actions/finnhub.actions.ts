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

// ✅ getStocksDetails - alag function, searchStocks ke bahar
export const getStocksDetails = cache(async (symbol: string) => {
    const cleanSymbol = symbol.trim().toUpperCase();

    try {
        const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) throw new Error('FINNHUB API key is not configured');

        const [quote, profile, financials] = await Promise.all([
            fetchJSON(
                `${FINNHUB_BASE_URL}/quote?symbol=${cleanSymbol}&token=${token}`
            ),
            fetchJSON(
                `${FINNHUB_BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${token}`,
                3600
            ),
            fetchJSON(
                `${FINNHUB_BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${token}`,
                1800
            ),
        ]);

        const quoteData = quote as QuoteData;
        const profileData = profile as ProfileData;
        const financialsData = financials as FinancialsData;

        if (!quoteData?.c || !profileData?.name)
            throw new Error('Invalid stock data received from API');

        const changePercent = quoteData.dp || 0;
        const peRatio = financialsData?.metric?.peNormalizedAnnual || null;

        return {
            symbol: cleanSymbol,
            company: profileData.name,
            currentPrice: quoteData.c,
            changePercent,
            priceFormatted: formatPrice(quoteData.c),
            changeFormatted: formatChangePercent(changePercent),
            peRatio: peRatio?.toFixed(1) || '—',
            marketCapFormatted: formatMarketCapValue(
                profileData.marketCapitalization || 0
            ),
        };
    } catch (error) {
        console.error(`Error fetching details for ${cleanSymbol}:`, error);
        throw new Error('Failed to fetch stock details');
    }
});

// ✅ searchStocks - clean aur alag function
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
            let results: FinnhubSearchResult[] = [];

            if (!trimmed) {
                const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
                const profiles = await Promise.all(
                    top.map(async (sym) => {
                        try {
                            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
                            const profile = await fetchJSON<any>(url, 3600);
                            return { sym, profile } as { sym: string; profile: any };
                        } catch (e) {
                            console.error('Error fetching profile2 for', sym, e);
                            return { sym, profile: null } as { sym: string; profile: any };
                        }
                    })
                );

                results = profiles
                    .map(({ sym, profile }) => {
                        const symbol = sym.toUpperCase();
                        const name: string | undefined = profile?.name || profile?.ticker || undefined;
                        const exchange: string | undefined = profile?.exchange || undefined;
                        if (!name) return undefined;
                        const r: FinnhubSearchResult = {
                            symbol,
                            description: name,
                            displaySymbol: symbol,
                            type: 'Common Stock',
                        };
                        (r as any).__exchange = exchange;
                        return r;
                    })
                    .filter((x): x is FinnhubSearchResult => Boolean(x));
            } else {
                const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
                const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
                results = Array.isArray(data?.result) ? data.result : [];
            }

            const mapped: StockWithWatchlistStatus[] = results
                .map((r) => {
                    const upper = (r.symbol || '').toUpperCase();
                    const name = r.description || upper;
                    const exchangeFromProfile = (r as any).__exchange as string | undefined;
                    const exchange = exchangeFromProfile || 'US';
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

// ✅ getNews - fetch news for watchlist symbols or general market news
export const getNews = cache(async (symbols?: string[]): Promise<any[]> => {
    try {
        const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) return [];

        if (symbols && symbols.length > 0) {
            const { from, to } = getDateRange(7);

            const allNews = await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${token}`;
                        const data = await fetchJSON<any[]>(url, 1800);
                        return Array.isArray(data) ? data.slice(0, 3) : [];
                    } catch (e) {
                        console.error(`Error fetching news for ${symbol}:`, e);
                        return [];
                    }
                })
            );

            return allNews.flat().slice(0, 6);
        }

        // General market news fallback
        const url = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
        const data = await fetchJSON<any[]>(url, 1800);
        return Array.isArray(data) ? data.slice(0, 6) : [];

    } catch (err) {
        console.error('Error fetching news:', err);
        return [];
    }
});
