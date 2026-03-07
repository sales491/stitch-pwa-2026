import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import UniversalComments from '@/components/UniversalComments';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ListingDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the listing AND the seller's profile data at the same time!
    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
      *,
      seller:profiles(id, full_name, avatar_url, role)
    `)
        .eq('id', id)
        .single();

    // If someone types in a fake URL, show the Next.js 404 page
    if (error || !listing) return notFound();

    // Fetch the current user to check permissions
    const { data: { user } } = await supabase.auth.getUser();
    const { data: viewerProfile } = user ? await supabase.from('profiles').select('id, role').eq('id', user.id).single() : { data: null };
    const canEdit = user && (viewerProfile?.id === (listing.seller_id || listing.user_id) || viewerProfile?.role === 'admin' || viewerProfile?.role === 'moderator');

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24">
            {/* 1. Header Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 md:absolute flex justify-between items-center pointer-events-none">
                <Link href="/marketplace" className="w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-slate-900 shadow-xl active:scale-90 transition-transform border border-white/20 pointer-events-auto">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>

                {canEdit && (
                    <Link href={`/marketplace/${listing.id}/edit`} className="h-10 px-5 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-2xl text-slate-900 shadow-xl active:scale-90 transition-transform border border-white/20 pointer-events-auto gap-2 font-black text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit Listing
                    </Link>
                )}
            </div>

            {/* 2. Big Image Gallery Placeholder */}
            <div className="w-full h-[45vh] md:h-[55vh] relative bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                {listing.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <span className="material-symbols-outlined text-6xl mb-2">image</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">The Seller hasn't added photos</span>
                    </div>
                )}

                {/* Price Tag Overlay */}
                <div className="absolute bottom-6 left-6 flex flex-col items-start gap-1">
                    <div className="bg-black/80 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl text-2xl font-black shadow-2xl border border-white/10">
                        ₱{(listing.price_value || 0).toLocaleString()}
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ml-1">
                        {listing.condition || 'Used'}
                    </div>
                </div>
            </div>

            <div className="px-6 py-8">
                {/* 3. Title & Basic Info */}
                <div className="flex flex-col mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">Active Listening</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">• {listing.category || 'General'}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-slate-400 text-sm">location_on</span>
                            <span className="text-slate-500 text-xs font-bold">{listing.town}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                            <span className="text-slate-500 text-xs font-bold">Just now</span>
                        </div>
                    </div>
                </div>

                {/* 4. Description Box */}
                <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">About this item</h3>
                    <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800">
                        <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed font-medium">
                            {listing.description}
                        </p>
                    </div>
                </div>

                {/* 5. Seller Info Card */}
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 flex flex-col gap-6 mb-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                    {/* Background Texture Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-slate-800 border-2 border-slate-800 shadow-xl">
                                {listing.seller?.avatar_url ? (
                                    <Image src={listing.seller.avatar_url} alt="Seller" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500 font-black text-sm">
                                        {(listing.seller?.full_name || 'U').charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-black text-lg tracking-tight flex items-center gap-1.5">
                                    {listing.seller?.full_name || 'Marinduque Seller'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Digital Town Square verified</p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">chat</span>
                            Message
                        </button>
                        <button className="flex-1 bg-primary text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">call</span>
                            Call Now
                        </button>
                    </div>
                </div>

                {/* 6. Universal Comments Component */}
                <UniversalComments entityId={listing.id} entityType="listing" />
            </div>
        </div>
    );
}
