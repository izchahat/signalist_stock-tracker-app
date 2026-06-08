'use server';

import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getStocksDetails } from './finnhub.actions';
import { Watchlist } from '@/database/models/watchlist.model';

interface WatchlistDoc {
    symbol: string;
    userId: string;
    company?: string;
    addedAt?: Date;
}

// ✅ getUserWatchlist
export const getUserWatchlist = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        const watchlist = await Watchlist.find({ userId: session.user.id })
            .sort({ addedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(watchlist));
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};

// ✅ getWatchlistSymbolsByEmail
export const getWatchlistSymbolsByEmail = async (_email: string): Promise<string[]> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) return [];

        const watchlist = await Watchlist.find({ userId: session.user.id }).lean() as WatchlistDoc[];
        return watchlist.map((item) => item.symbol.toUpperCase());
    } catch (error) {
        console.error('Error fetching watchlist symbols:', error);
        return [];
    }
};

// ✅ getWatchlistWithData
export const getWatchlistWithData = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        const watchlist = await Watchlist.find({ userId: session.user.id })
            .sort({ addedAt: -1 })
            .lean() as WatchlistDoc[];

        if (watchlist.length === 0) return [];

        const stocksWithData = await Promise.all(
            watchlist.map(async (item) => {
                try {
                    const stockData = await getStocksDetails(item.symbol);

                    if (!stockData) {
                        console.warn(`Failed to fetch data for ${item.symbol}`);
                        return null;
                    }

                    return {
                        company: stockData.company,
                        symbol: stockData.symbol,
                        currentPrice: stockData.currentPrice,
                        priceFormatted: stockData.priceFormatted,
                        changeFormatted: stockData.changeFormatted,
                        changePercent: stockData.changePercent,
                        marketCap: stockData.marketCapFormatted,
                        peRatio: stockData.peRatio,
                    };
                } catch (e) {
                    console.error(`Error fetching data for ${item.symbol}:`, e);
                    return null;
                }
            })
        );

        const filtered = stocksWithData.filter(Boolean);
        return JSON.parse(JSON.stringify(filtered));
    } catch (error) {
        console.error('Error loading watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};

// ✅ addToWatchlist
export const addToWatchlist = async (symbol: string, company: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        const existing = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });

        if (existing) {
            return { success: false, error: 'Stock already in watchlist' };
        }

        await Watchlist.create({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            company,
            addedAt: new Date(),
        });

        revalidatePath('/watchlist');
        return { success: true, message: 'Stock added to watchlist' };
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw new Error('Failed to add stock to watchlist');
    }
};

// ✅ removeFromWatchlist
export const removeFromWatchlist = async (symbol: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        await Watchlist.deleteOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });

        revalidatePath('/watchlist');
        return { success: true, message: 'Stock removed from watchlist' };
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw new Error('Failed to remove stock from watchlist');
    }
};