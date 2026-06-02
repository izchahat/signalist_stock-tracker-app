'use client';

import {
    addToWatchlist,
    removeFromWatchlist,
} from '@/lib/actions/watchlist.actions';
import { Star, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface WatchlistButtonProps {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    showTrashIcon?: boolean;
    type?: 'button' | 'icon';
    onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = 'button',
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);

    const label = added ? 'Remove from Watchlist' : 'Add to Watchlist';

    const toggleWatchlist = async () => {
        const previousState = added;
        setAdded(!added);

        const result = added
            ? await removeFromWatchlist(symbol)
            : await addToWatchlist(symbol, company);

        if (result.success) {
            toast.success(added ? 'Removed from Watchlist' : 'Added to Watchlist', {
                description: `${company} ${
                    added ? 'removed from' : 'added to'
                } your watchlist`,
            });
            onWatchlistChange?.(symbol, !added);
        } else {
            setAdded(previousState);
            toast.error('Something went wrong', {
                description: 'Please try again',
            });
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWatchlist();
    };

    if (type === 'icon') {
        return (
            <button
                title={
                    added
                        ? `Remove ${symbol} from watchlist`
                        : `Add ${symbol} to watchlist`
                }
                aria-label={
                    added
                        ? `Remove ${symbol} from watchlist`
                        : `Add ${symbol} to watchlist`
                }
                className={`watchlist-icon-btn ${added ? 'watchlist-icon-added' : ''}`}
                onClick={handleClick}
            >
                <Star fill={added ? 'currentColor' : 'none'} />
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`
            ml-4
            h-10
            min-w-[100px]
            rounded-xl
            px-4
            text-sm
            font-semibold
            transition-all
            flex
            items-center
            justify-center
            gap-2
            ${
                added
                    ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
            }
        `}
        >
            {showTrashIcon && added ? <Trash2 className="h-4 w-4" /> : null}
            <span>{added ? 'Added' : 'Add +'}</span>
        </button>
    );
};

export default WatchlistButton;