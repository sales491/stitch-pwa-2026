'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    isClaimable?: boolean;
    description?: string;
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
    isClaimable,
    description,
}: BusinessProps) {
    const router = useRouter();

    const handleClaimClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/claim-business/${id}`);
    };

    return (
        <Link href={`/directory/b/${id}`} className="block bg-white dark:bg-[#1A1B1E] border border-slate-100 dark:border-white/[0.05] rounded-[2rem] p-5 mb-4 shadow-sm hover:shadow-md transition-all relative group overflow-hidden min-h-[120px]">
            <div className="flex items-start gap-4">
            {/* Logo / Image Area */}
            <div className="w-28 aspect-square bg-slate-50 dark:bg-white/[0.03] text-moriones-red dark:text-[#F44336] rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 overflow-hidden relative border border-transparent dark:border-white/[0.05]">
                {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    (!isVerified || isClaimable) ? (
                        <Image src="/images/verify-business-banner.png" alt="Verify Your Business" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
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
                        <div className="flex items-center gap-1 bg-blue-50/50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20 shadow-sm">
                            <span className="material-symbols-outlined text-[#2196F3] dark:text-[#4FC3F7] text-[14px] font-variation-settings-fill">verified</span>
                            <span className="text-[9px] font-black text-[#2196F3] dark:text-[#4FC3F7] tracking-tight uppercase">Verified</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-amber-50/50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-500/20 shadow-sm">
                            <span className="text-amber-600 dark:text-amber-500 text-[9px] font-black tracking-tight uppercase">Unverified</span>
                        </div>
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

                {description && (
                    <p className="mt-2 text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Enhanced Rating Display */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-white/[0.03] px-2 py-0.5 rounded-lg border border-transparent dark:border-white/[0.05]">
                        <span className="text-amber-500 material-symbols-outlined text-[14px] font-variation-settings-fill">star</span>
                        <span className="font-black text-amber-700 dark:text-amber-500 text-xs">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">{reviewCount} Reviews</span>
                </div>
                {/* Delivery & Claim Links */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.05]">
                    {deliveryAvailable && (
                    <>
                        <span className={`material-symbols-outlined text-[14px] ${deliveryAvailable ? 'text-green-500' : 'text-slate-300 dark:text-zinc-600'}`}>
                            {deliveryAvailable ? 'local_shipping' : 'block'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                            {deliveryAvailable ? 'Delivery Available' : 'No Delivery'}
                        </span>
                    </>
                    )}
                    
                    {isClaimable && (
                        <button onClick={handleClaimClick} className="ml-auto bg-[#2196F3] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-1 z-10 relative">
                            <span className="material-symbols-outlined text-[12px]">verified_user</span>
                            Verify Your Business
                        </button>
                    )}
                </div>
            </div>
            </div>
        </Link>
    );
}
