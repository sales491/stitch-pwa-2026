import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_GEMS } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import GemMasonryFeed from '@/components/GemMasonryFeed';

const BASE = 'https://marinduquemarket.com';

export const metadata: Metadata = {
    title: 'Hidden Gems of Marinduque Island — Tourist Spots & Secret Places',
    description: 'Discover the hidden gems of Marinduque island — mga magandang lugar, secret beaches, waterfalls, caves, at local favorites na hindi mo mahahanap sa ibang lugar. Community-curated and verified by locals.',
    keywords: [
        'hidden gems Marinduque', 'Marinduque tourist spots', 'Maniwaya Island', 'Palad Sandbar',
        'Tres Reyes Islands', 'Bathala Caves', 'Boac Cathedral', 'things to do Marinduque',
        'Marinduque travel guide', 'where to go Marinduque', 'Marinduque hidden places',
        'best places Marinduque', 'Marinduque attractions', 'Luzon Datum Marinduque',
        ...TAGALOG_KEYWORDS_GEMS,
    ],
    openGraph: {
        title: 'Hidden Gems of Marinduque Island',
        description: 'Community-voted hidden gems, secret beaches, waterfalls, caves and must-visit spots across Marinduque island, Philippines.',
        url: `${BASE}/gems`,
        images: [{ url: `${BASE}/images/gems/marinduque-museum.png`, alt: 'Marinduque National Museum — local gem in Boac, Marinduque' }],
    },
    alternates: hreflangAlternates('/gems'),
};

export default async function GemsFeedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: gems, error } = await supabase
        .from('gems')
        .select(`*, gem_likes(count), profiles(full_name, avatar_url)`)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    // Fetch which gems this user has already vouched for
    let userLikedIds = new Set<string>();
    if (user && gems && gems.length > 0) {
        const { data: myLikes } = await supabase
            .from('gem_likes')
            .select('gem_id')
            .eq('user_id', user.id)
            .in('gem_id', gems.map(g => g.id));
        if (myLikes) userLikedIds = new Set(myLikes.map(l => l.gem_id));
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
                <p className="text-sm text-gray-500 font-medium">Unable to load gems. Please try again.</p>
            </div>
        );
    }

    const gemsWithMeta = (gems ?? []).map(g => ({
        ...g,
        likeCount: Number((g.gem_likes as any)?.[0]?.count ?? 0),
        isLikedByMe: userLikedIds.has(g.id),
    }));

    // ── CollectionPage JSON-LD — capped at top 20 by community votes ──────────
    // Using like count (desc) so the schema always surfaces the most community-
    // endorsed gems. This keeps schema size bounded (~2 KB max) as the list grows.
    const schemaGems = [...gemsWithMeta]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 20);

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hidden Gems of Marinduque Island',
        description: 'A curated collection of the best hidden gems, tourist attractions, and community-recommended places across Marinduque island, Philippines.',
        url: `${BASE}/gems`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: schemaGems.length,
            itemListElement: schemaGems.map((gem, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: gem.title,
                url: `${BASE}/gems/${gem.id}`,
                ...(gem.images?.[0] && { image: gem.images[0] }),
                description: gem.description?.slice(0, 120),
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <GemMasonryFeed
                gems={gemsWithMeta}
                isLoggedIn={!!user}
            />
        </>
    );
}
