'use client'

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BusinessImageGalleryProps {
    businessId: string;
    businessName: string;
    images: string[];
    isVerified: boolean;
    isClaimable?: boolean;
}

export default function BusinessImageGallery({ businessId, businessName, images, isVerified, isClaimable }: BusinessImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out any potential empty strings
    const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');

    const openLightbox = (index: number) => {
        if (validImages.length === 0) return;
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto'; // Restore scrolling
    }, []);

    const showNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, [validImages.length]);

    const showPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }, [validImages.length]);

    // Handle keyboard navigation Let's use left/right arrow keys and Escape
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && validImages.length > 1) showNext();
            if (e.key === 'ArrowLeft' && validImages.length > 1) showPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, closeLightbox, showNext, showPrev, validImages.length]);

    // If no images at all, render the placeholder
    if (validImages.length === 0) {
        return (
            <div className="w-full h-56 md:h-64 relative rounded-[2rem] overflow-hidden shadow-sm mb-6 border border-slate-100 dark:border-zinc-800/50 bg-slate-100 dark:bg-zinc-900">
                {(!isVerified || isClaimable) ? (
                    <Link href={`/claim-business/${businessId}`} className="w-full h-full relative block cursor-pointer group">
                        <Image src="/images/verify-business-banner.png" alt="Verify Your Business" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    </Link>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-black text-slate-300 dark:text-zinc-700">
                            {businessName.charAt(0)}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {/* Inline Gallery Display */}
            <div className="mb-6 space-y-2">
                {/* Main Hero Image */}
                <div 
                    className="w-full h-56 md:h-64 relative rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800/50 bg-slate-100 dark:bg-zinc-900 cursor-pointer group"
                    onClick={() => openLightbox(0)}
                >
                    <Image src={validImages[0]} alt={`${businessName} Hero`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Overlay hint if there are more images */}
                    {validImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                            <span className="material-symbols-outlined text-sm">photo_library</span>
                            1 of {validImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip (if more than 1 image) */}
                {validImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
                        {validImages.slice(1).map((img, idx) => {
                            const actualIndex = idx + 1;
                            return (
                                <div 
                                    key={actualIndex}
                                    className="relative w-20 h-20 shrink-0 rounded-[1rem] overflow-hidden cursor-pointer snap-start border border-slate-200 dark:border-zinc-800 opacity-90 hover:opacity-100 transition-opacity"
                                    onClick={() => openLightbox(actualIndex)}
                                >
                                    <Image src={img} alt={`${businessName} thumbnail ${actualIndex}`} fill className="object-cover" />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Fullscreen Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 touch-none animate-in fade-in duration-200" onClick={closeLightbox}>
                    
                    {/* Close Button */}
                    <button 
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center text-white transition-all z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                        }}
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    {/* Image Counter */}
                    {validImages.length > 1 && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest z-10">
                            {currentIndex + 1} / {validImages.length}
                        </div>
                    )}

                    {/* Main Image Container */}
                    <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center">
                        <img 
                            src={validImages[currentIndex]} 
                            alt={`${businessName} full screen ${currentIndex + 1}`} 
                            className="max-w-full max-h-full object-contain select-none"
                            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
                        />

                        {/* Navigation Arrows */}
                        {validImages.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10 active:scale-95"
                                    onClick={showPrev}
                                >
                                    <span className="material-symbols-outlined text-3xl">chevron_left</span>
                                </button>
                                <button 
                                    className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10 active:scale-95"
                                    onClick={showNext}
                                >
                                    <span className="material-symbols-outlined text-3xl">chevron_right</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Bottom Thumbnail Strip (Optional for Desktop) */}
                    {validImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-3 px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-2xl z-10" onClick={(e) => e.stopPropagation()}>
                            {validImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }}
                                    className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
