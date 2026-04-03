import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { createClient as createDirectClient } from '@supabase/supabase-js';
import Image from 'next/image';
import UniversalComments from '@/components/UniversalComments';
import SellerVouchBadge from '@/components/SellerVouchBadge';
import ListingContactButtons from '@/components/ListingContactButtons';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import RelatedItems from '@/components/RelatedItems';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: listing } = await supabase
        .from('listings')
        .select('title, description, price_value, town, category, images, condition')
        .eq('id', id)
        .single();

    if (!listing) return { title: 'Listing Not Found' };

    const price = listing.price_value ? `₱${listing.price_value.toLocaleString()}` : '';
    const titleStr = price ? `${listing.title} — ${price}` : listing.title;

    return {
        title: titleStr,
        description: listing.description?.slice(0, 155) ?? `${listing.title} for sale in ${listing.town}, Marinduque.`,
        openGraph: {
            title: `${listing.title} — For Sale in ${listing.town}, Marinduque`,
            description: listing.description?.slice(0, 155) ?? `${listing.category || 'Item'} for sale in Marinduque.`,
            url: `https://marinduquemarket.com/marketplace/${id}`,
            type: 'article',
            images: listing.images?.[0] ? [{ url: listing.images[0], alt: listing.title }] : undefined,
        },
        alternates: { canonical: `https://marinduquemarket.com/marketplace/${id}` },
    };
}

export const revalidate = 300; // 5-minute SWR cache for listing detail pages

export async function generateStaticParams() {
    // Pre-render top 50 most-recent active listings at build time
    const supabase = createDirectClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
        .from('listings')
        .select('id')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);
    return (data ?? []).map(({ id }) => ({ id: String(id) }));
}

export default async function ListingDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Step 1: Fetch the listing — avoid ambiguous FK join with profiles
    const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

    // If someone types in a fake URL, show the Next.js 404 page
    if (error || !listing) return notFound();

    // Step 2: Fetch the seller profile separately using seller_id (or user_id as fallback)
    const sellerId = listing.seller_id || listing.user_id;
    const { data: sellerProfile } = sellerId
        ? await supabase.from('profiles').select('id, full_name, avatar_url, role').eq('id', sellerId).single()
        : { data: null };

    // Fetch the current user to check permissions
    const { data: { user } } = await supabase.auth.getUser();
    const { data: viewerProfile } = user
        ? await supabase.from('profiles').select('id, role').eq('id', user.id).single()
        : { data: null };
    const canEdit = user && (viewerProfile?.id === sellerId || viewerProfile?.role === 'admin' || viewerProfile?.role === 'moderator');

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24">
            {/* Product JSON-LD for Google Shopping Rich Results + AI Answer Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: listing.title,
                    description: listing.description || `${listing.title} for sale in ${listing.town}, Marinduque.`,
                    url: `https://marinduquemarket.com/marketplace/${listing.id}`,
                    ...(listing.images?.[0] && { image: listing.images[0] }),
                    ...(listing.category && { category: listing.category }),
                    ...(listing.condition && {
                        itemCondition: listing.condition === 'Brand New'
                            ? 'https://schema.org/NewCondition'
                            : 'https://schema.org/UsedCondition',
                    }),
                    offers: {
                        '@type': 'Offer',
                        price: listing.price_value || 0,
                        priceCurrency: 'PHP',
                        availability: listing.status === 'active'
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/SoldOut',
                        seller: {
                            '@type': 'Person',
                            name: sellerProfile?.full_name || listing.seller?.name || 'Marinduque Seller',
                        },
                        itemCondition: listing.condition === 'Brand New'
                            ? 'https://schema.org/NewCondition'
                            : 'https://schema.org/UsedCondition',
                        areaServed: {
                            '@type': 'AdministrativeArea',
                            name: listing.town || 'Marinduque',
                        },
                    },
                }) }}
            />
            <PageHeader title="Listing Details" subtitle="Marinduque Marketplace" rightAction={
                canEdit ? (
                    <Link href={`/marketplace/${listing.id}/edit`} className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-white/70 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit
                    </Link>
                ) : undefined
            } />

            {/* 2. Big Image Gallery Placeholder */}
            <div className="w-full h-[45vh] md:h-[55vh] relative bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                {listing.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        priority
                        className="object-contain"
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
                <div className="bg-slate-100 dark:bg-zinc-800 rounded-[2.5rem] p-6 flex flex-col gap-5 mb-12 shadow-sm">

                    {/* Seller identity row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-slate-200 dark:bg-zinc-700 border-2 border-slate-200 dark:border-zinc-700 shadow-sm">
                                {sellerProfile?.avatar_url ? (
                                    <Image src={sellerProfile.avatar_url} alt="Seller" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-zinc-500 font-black text-lg">
                                        {(sellerProfile?.full_name || listing.seller?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                                    {sellerProfile?.full_name || listing.seller?.name || 'Marinduque Seller'}
                                </p>
                                {/* Vouch button replaces the verified badge */}
                                <SellerVouchBadge sellerId={sellerId || ''} />
                            </div>
                        </div>
                    </div>

                    {/* 3 Contact Buttons — client component (onClick requires client) */}
                    <ListingContactButtons
                        phone={listing.contact_details?.phone || ''}
                        fbUsername={listing.contact_details?.fb_username || ''}
                    />
                </div>

                {/* 6. Universal Comments Component */}
                <UniversalComments entityId={listing.id} entityType="listing" />

            </div>

            {/* Internal linking — similar listings */}
            <RelatedItems type="listings" town={listing.town} category={listing.category} excludeId={String(listing.id)} />
        </div>
    );
}
