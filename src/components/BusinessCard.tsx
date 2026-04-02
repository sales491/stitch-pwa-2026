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
    deliveryAvailable?: boolean;
};

export default function BusinessCard({
    id,
    name,
    type,
    location,
    isVerified,
    rating,
    reviewCount,
    imageUrl,
    deliveryAvailable,
}: BusinessProps) {
    return (
        <Link href={`/directory/${id}`} className="block bg-white dark:bg-[#1A1B1E] border border-slate-100 dark:border-white/[0.05] rounded-[2rem] p-5 mb-4 shadow-sm hover:shadow-md transition-all relative group overflow-hidden min-h-[120px]">
            <div className="flex items-center gap-4">
            {/* Logo / Image Area */}
            <div className="w-28 self-stretch bg-slate-50 dark:bg-white/[0.03] text-moriones-red dark:text-[#F44336] rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 overflow-hidden relative border border-transparent dark:border-white/[0.05]">
                {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    !isVerified ? (
                        <span className="w-full h-full flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/30">
                            <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[22px] mb-0.5">add_a_photo</span>
                            <span className="text-[8px] uppercase font-black tracking-widest text-teal-700 dark:text-teal-500 text-center leading-[1.1]">Claim<br />Biz</span>
                        </span>
                    ) : (
                        <span className="drop-shadow-sm">{name.charAt(0).toUpperCase()}</span>
                    )
                )}
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5 mb-0.5 flex-wrap">
                    <h3 className="font-black text-lg text-slate-800 dark:text-white/95 tracking-tight leading-snug">{name}</h3>
                    {isVerified ? (
                        <span className="material-symbols-outlined text-[#2196F3] dark:text-[#4FC3F7] text-[16px] font-variation-settings-fill">verified</span>
                    ) : (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border border-amber-200/50 dark:border-amber-500/20 shadow-sm whitespace-nowrap">Pending</span>
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
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-white/[0.03] px-2 py-0.5 rounded-lg border border-transparent dark:border-white/[0.05]">
                        <span className="text-amber-500 material-symbols-outlined text-[14px] font-variation-settings-fill">star</span>
                        <span className="font-black text-amber-700 dark:text-amber-500 text-xs">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">{reviewCount} Reviews</span>
                    {deliveryAvailable === true && (
                        <span className="flex items-center gap-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border border-teal-100 dark:border-teal-700/30">
                            <span className="material-symbols-outlined text-[11px]">delivery_dining</span>
                            Delivery
                        </span>
                    )}
                </div>
            </div>
            </div>
        </Link>
    );
}
