'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuCarouselProps {
    images: string[];
    businessName: string;
    isDemoMode?: boolean;
}

export default function MenuCarousel({ images, businessName, isDemoMode }: MenuCarouselProps) {
    const [current, setCurrent] = useState(0);

    if (images.length === 0) return null;

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className="mb-6">
            {/* Section header */}
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
                Menu &amp; Dishes
                {isDemoMode && (
                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest ml-1">demo</span>
                )}
            </h2>

            {/* Carousel container */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 aspect-[3/4]">

                {/* Current image */}
                <Image
                    key={current}
                    src={images[current]}
                    alt={`${businessName} menu ${current + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 640px) 100vw, 512px"
                    quality={80}
                    loading={current === 0 ? 'eager' : 'lazy'}
                />

                {/* Dark gradient overlay at bottom for counter readability */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Left arrow */}
                {images.length > 1 && (
                    <button
                        onClick={prev}
                        aria-label="Previous menu image"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 active:scale-95 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transition-all"
                    >
                        <span className="material-symbols-outlined text-[22px]">chevron_left</span>
                    </button>
                )}

                {/* Right arrow */}
                {images.length > 1 && (
                    <button
                        onClick={next}
                        aria-label="Next menu image"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 active:scale-95 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transition-all"
                    >
                        <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                    </button>
                )}

                {/* Dot indicators + counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
                        <div className="flex gap-1.5">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                    className={`pointer-events-auto w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        i === current
                                            ? 'bg-white w-4'
                                            : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-white/70 tracking-widest">
                            {current + 1} / {images.length}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
