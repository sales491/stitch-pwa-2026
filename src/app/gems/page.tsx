import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import GemMasonryFeed from '@/components/GemMasonryFeed';

export const metadata: Metadata = {
    title: 'Gems of Marinduque',
    description: 'Discover hidden local gems across Marinduque island — beautiful beaches, secret spots, local restaurants, cultural sites, and community-loved places recommended by locals.',
    keywords: ['hidden gems Marinduque', 'Marinduque tourist spots', 'Maniwaya Island', 'Palad Sandbar', 'Tres Reyes Islands', 'things to do Marinduque', 'Marinduque travel'],
    openGraph: {
        title: 'Gems of Marinduque',
        description: 'Community-voted hidden gems and must-visit spots across Marinduque island.',
        url: 'https://marinduquemarket.com/gems',
    },
    alternates: { canonical: 'https://marinduquemarket.com/gems' },
};

export default async function GemsFeedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: gems, error } = await supabase
        .from('gems')
        .select(`*, gem_likes(count), profiles(full_name, avatar_url)`)
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

    return (
        <GemMasonryFeed
            gems={gemsWithMeta}
            isLoggedIn={!!user}
        />
    );
}
