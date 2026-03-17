'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import SellerVouchBadge from './SellerVouchBadge';
import ShareButton from './ShareButton';

type ListingProps = {
    id: string;
    title: string;
    price: number;
    town: string;
    imageUrl: string;
    sellerId: string;
};

export default function ListingCard({ id, title, price, town, imageUrl, sellerId }: ListingProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // Phase 3 Magic: Instantly know if this user is allowed to delete this card
    const isOwnerOrMod = profile?.id === sellerId || profile?.role === 'admin' || profile?.role === 'moderator';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevents the <Link> from triggering

        // 1. Confirm with the user
        if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        try {
            // 2. Delete the database row first
            const { error: dbError } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 3. Clean up the storage bucket (if there is an image)
            if (imageUrl) {
                // Extract the file path from the public URL
                const urlParts = imageUrl.split('/listings/');
                if (urlParts.length === 2) {
                    const filePath = urlParts[1];
                    await supabase.storage.from('listings').remove([filePath]);
                }
            }

            // 4. Refresh the page to remove the card from the feed
            router.refresh();

        } catch (error: any) {
            console.error('Failed to delete:', error.message);
            alert('Could not delete the item. Please try again.');
            setIsDeleting(false); // Only reset if it fails
        }
    };

    return (
        <div className={`bg-white dark:bg-[#1A1B1E] border border-slate-100 dark:border-white/[0.05] rounded-[2rem] overflow-hidden mb-4 shadow-sm relative transition-all hover:shadow-md group ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <Link href={`/marketplace/${id}`}>
                {/* Image Area */}
                <div className="w-full h-56 relative bg-slate-100 dark:bg-white/[0.02] overflow-hidden">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted/20">
                            <span className="material-symbols-outlined text-4xl mb-1">image</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">No Preview</span>
                        </div>
                    )}

                    {/* Price Overlay - Now more premium */}
                    <div className="absolute top-4 left-4 bg-background-main/90 backdrop-blur-md text-text-main px-3 py-1.5 rounded-2xl text-sm font-black shadow-xl border border-border-main">
                        ₱{price.toLocaleString()}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col gap-1.5">
                    <h3 className="font-black text-[17px] text-text-main truncate tracking-tight leading-tight">{title}</h3>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-moriones-red/60 text-[16px]">location_on</span>
                            <p className="text-text-muted text-[11px] font-black uppercase tracking-[0.1em]">{town}</p>
                        </div>
                        {/* We stop propagation so clicking the button doesn't trigger the Link routing */}
                        <div className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <SellerVouchBadge sellerId={sellerId} />
                            <ShareButton 
                                title={title}
                                text={`Check out this ${title} for ₱${price.toLocaleString()} in ${town} on Marinduque Market Hub!`}
                                url={`/marketplace/${id}`}
                                variant="icon"
                            />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Admin/Owner Controls */}
            {isOwnerOrMod && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-white/90 dark:bg-[#1A1B1E]/90 backdrop-blur-md text-red-500 p-2.5 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-all group active:scale-95 border border-white/20 disabled:text-slate-300"
                        aria-label="Delete listing"
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isDeleting ? 'animate-spin' : ''}`}>
                            {isDeleting ? 'refresh' : 'delete'}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
