'use client';

import React, { useTransition, useState } from 'react';
import { toggleGemLike } from '@/app/actions/gems';

type Props = {
    gemId: string;
    initialLiked: boolean;
    initialCount: number;
    className?: string;
    iconSize?: number;
};

export default function GemLikeButton({ gemId, initialLiked, initialCount, className = '', iconSize = 24 }: Props) {
    const [isPending, startTransition] = useTransition();
    const [optimisticLiked, setOptimisticLiked] = useState(initialLiked);
    const [optimisticCount, setOptimisticCount] = useState(initialCount);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        const newLiked = !optimisticLiked;
        const newCount = optimisticLiked ? Math.max(0, optimisticCount - 1) : optimisticCount + 1;

        setOptimisticLiked(newLiked);
        setOptimisticCount(newCount);

        startTransition(async () => {
            try {
                const res = await toggleGemLike(gemId);
                setOptimisticLiked(res.liked);
            } catch (err) {
                setOptimisticLiked(initialLiked);
                setOptimisticCount(initialCount);
                alert("Please log in to like this gem.");
            }
        });
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={isPending}
            className={`flex items-center justify-center gap-1 transition-colors ${className}`}
            title={optimisticLiked ? 'Unlike' : 'Like'}
        >
            <span
                className={`material-symbols-outlined transition-colors duration-200 ${optimisticLiked ? 'text-moriones-red fill-current' : ''}`}
                style={{ fontSize: iconSize, fontVariationSettings: optimisticLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
                favorite
            </span>
            {optimisticCount > 0 && <span className="text-sm font-medium">{optimisticCount}</span>}
        </button>
    );
}
