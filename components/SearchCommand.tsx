'use client';

import { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import WatchlistButton from './WatchlistButton';

interface StockWithWatchlistStatus {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
    isInWatchlist: boolean;
}

interface SearchCommandProps {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
}

const SYMBOL_COLORS: Record<string, string> = {
    A: '#5862FF', B: '#D13BFF', C: '#0FEDBE', D: '#FF8243',
    E: '#FF495B', F: '#E8BA40', G: '#3B82F6', H: '#8B5CF6',
    I: '#10B981', J: '#F59E0B', K: '#EF4444', L: '#6366F1',
    M: '#EC4899', N: '#14B8A6', O: '#F97316', P: '#8B5CF6',
    Q: '#0EA5E9', R: '#22C55E', S: '#E8BA40', T: '#5862FF',
    U: '#D13BFF', V: '#0FEDBE', W: '#FF8243', X: '#FF495B',
    Y: '#3B82F6', Z: '#10B981',
};

const getSymbolColor = (symbol: string) =>
    SYMBOL_COLORS[symbol[0].toUpperCase()] || '#5862FF';

// Stock Logo with fallback to colored avatar
function StockLogo({ symbol }: { symbol: string }) {
    const [imgError, setImgError] = useState(false);
    const logoUrl = `https://assets.parqet.com/logos/symbol/${symbol}?format=png`;

    if (imgError) {
        return (
            <div
                style={{ backgroundColor: getSymbolColor(symbol) }}
                className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
            >
                {symbol[0]}
            </div>
        );
    }

    return (
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shrink-0 overflow-hidden">
            <Image
                src={logoUrl}
                alt={symbol}
                width={44}
                height={44}
                className="object-contain"
                onError={() => setImgError(true)}
            />
        </div>
    );
}

export default function SearchCommand({
                                          renderAs = 'button',
                                          label = 'Add stock',
                                          initialStocks,
                                      }: SearchCommandProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 5);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks);
        setLoading(true);
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm('');
        setStocks(initialStocks);
    };

    const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
        setStocks(
            initialStocks?.map((stock) =>
                stock.symbol === symbol ? { ...stock, isInWatchlist: isAdded } : stock
            ) || []
        );
    };

    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-text">
                    {label}
                </span>
            ) : (
                <Button onClick={() => setOpen(true)} className="search-btn">
                    <span>{label}</span>
                    <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-black/20 bg-black/10 px-1.5 py-0.5 text-xs font-medium">
                        ⌘K
                    </kbd>
                </Button>
            )}

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                className="!bg-[#1a1d23] border border-gray-700 w-[95vw] sm:w-full !max-w-[680px] !rounded-2xl overflow-hidden shadow-2xl !fixed !top-[20px] sm:!top-[40px] !left-1/2 !-translate-x-1/2 !translate-y-0"
            >
                {/* Search Input */}
                <div className="relative flex items-center border-b border-gray-700">
                    <CommandInput
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder="Search stocks, companies or symbols..."
                        className="h-14 sm:h-16 bg-transparent text-gray-200 placeholder:text-gray-500 text-sm sm:text-base border-0 focus:ring-0 pr-16"
                    />
                    {/* ⌘K badge */}
                    <div className="absolute right-4 flex items-center gap-1 text-gray-500">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs">⌘</kbd>
                                <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs">K</kbd>
                            </>
                        )}
                    </div>
                </div>

                <CommandList
                    className="scrollbar-hide-default overflow-y-auto max-h-[70vh] sm:max-h-[480px]"
                >
                    {loading ? (
                        <CommandEmpty className="py-12 text-gray-500">
                            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-yellow-500" />
                            <p className="text-sm">Searching stocks...</p>
                        </CommandEmpty>
                    ) : displayStocks?.length === 0 ? (
                        <CommandEmpty className="py-12 text-gray-500 text-sm">
                            {isSearchMode ? '🔍 No results found' : 'No stocks available'}
                        </CommandEmpty>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
                                <span className="text-sm font-semibold text-gray-300">
                                    🔥 {isSearchMode ? 'Search Results' : 'Popular stocks'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {displayStocks?.length || 0} results
                                </span>
                            </div>

                            {/* Stock List */}
                            <div className="px-3 py-2 space-y-1">
                                {displayStocks?.map((stock) => (
                                    <div
                                        key={stock.symbol}
                                        className="group flex items-center justify-between rounded-xl px-3 py-3 transition-all hover:bg-gray-700/40 cursor-pointer"
                                    >
                                        <Link
                                            href={`/stocks/${stock.symbol}`}
                                            onClick={handleSelectStock}
                                            className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0"
                                        >
                                            {/* Company Logo */}
                                            <StockLogo symbol={stock.symbol} />

                                            {/* Symbol + Name */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm sm:text-base text-white">
                                                    {stock.symbol}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-400 truncate">
                                                    {stock.name}
                                                </div>
                                            </div>

                                            {/* Exchange Badge */}
                                            <div className="hidden md:block text-xs text-gray-500 shrink-0 mr-4 whitespace-nowrap">
                                                {stock.exchange} • {stock.type}
                                            </div>
                                        </Link>

                                        {/* Add/Added Button */}
                                        <WatchlistButton
                                            symbol={stock.symbol}
                                            company={stock.name}
                                            isInWatchlist={stock.isInWatchlist}
                                            onWatchlistChange={handleWatchlistChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* View All Results */}
                            {!isSearchMode && initialStocks.length > 5 && (
                                <div className="border-t border-gray-700/50 px-5 py-3">
                                    <button
                                        onClick={() => setSearchTerm(' ')}
                                        className="w-full text-center text-sm text-gray-400 hover:text-yellow-400 transition-colors py-1 flex items-center justify-center gap-2"
                                    >
                                        View all results
                                        <span className="text-yellow-500">→</span>
                                    </button>
                                </div>
                            )}

                            {/* Footer Shortcuts */}
                            <div className="hidden md:flex items-center justify-between border-t border-gray-700/50 px-5 py-3 text-xs text-gray-600">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="rounded bg-gray-700/80 px-1.5 py-0.5 text-gray-400">↑</kbd>
                                        <kbd className="rounded bg-gray-700/80 px-1.5 py-0.5 text-gray-400">↓</kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="rounded bg-gray-700/80 px-1.5 py-0.5 text-gray-400">↵</kbd>
                                        Select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <kbd className="rounded bg-gray-700/80 px-1.5 py-0.5 text-gray-400">ESC</kbd>
                                    to close
                                </span>
                            </div>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}