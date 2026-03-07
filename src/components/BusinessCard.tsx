'use client';

import Link from 'next/link';
import Image from 'next/image';

type BusinessProps = {
    id: string;
    name: string;
    type: string;
    location: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    imageUrl?: string;
};

export default function BusinessCard({
    id,
    name,
    type,
    location,
    isVerified,
    rating,
    reviewCount,
    imageUrl
}: BusinessProps) {
    return (
        <Link href={`/directory/${id}`}>
            <div className="bg-white dark:bg-[#1A1B1E] border border-slate-100 dark:border-white/[0.05] rounded-[2rem] p-5 mb-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 relative group overflow-hidden">

                {/* Logo / Image Area */}
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/[0.03] text-moriones-red dark:text-[#F44336] rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-inner overflow-hidden relative border border-transparent dark:border-white/[0.05]">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <span className="drop-shadow-sm">{name.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-lg text-slate-800 dark:text-white/95 truncate tracking-tight leading-none">{name}</h3>
                        {isVerified && (
                            <span className="material-symbols-outlined text-[#2196F3] dark:text-[#4FC3F7] text-[16px] font-variation-settings-fill">verified</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-slate-500 dark:text-white/40 text-xs font-bold truncate">{type}</p>
                        <span className="text-slate-300 dark:text-white/10 text-xs">•</span>
                        <p className="text-slate-500 dark:text-white/40 text-xs font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {location}
                        </p>
                    </div>

                    {/* Enhanced Rating Display */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-white/[0.03] px-2 py-0.5 rounded-lg border border-transparent dark:border-white/[0.05]">
                            <span className="text-amber-500 material-symbols-outlined text-[14px] font-variation-settings-fill">star</span>
                            <span className="font-black text-amber-700 dark:text-amber-500 text-xs">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-slate-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">{reviewCount} Reviews</span>
                    </div>
                </div>

                {/* Interaction Indicator */}
                <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center text-slate-300 dark:text-white/20 group-hover:bg-moriones-red group-hover:text-white transition-all transform group-hover:translateX-1">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </div>
            </div>
        </Link>
    );
}
