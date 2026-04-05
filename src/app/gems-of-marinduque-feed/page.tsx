import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import GemsOfMarinduqueFeed from '@/components/GemsOfMarinduqueFeed';
import { isAdmin } from '@/utils/roles';

export const metadata: Metadata = {
    title: 'Gems of Marinduque — Community Discoveries',
    description: 'Browse community-shared hidden gems of Marinduque island. Secret beaches, local eats, scenic spots, and cultural treasures — shared by locals who know the island best.',
    keywords: ['Marinduque hidden gems', 'tourist spots Marinduque', 'Marinduque Instagram spots', 'island attractions Philippines', 'local recommendations Marinduque'],
    openGraph: {
        title: 'Gems of Marinduque',
        description: 'Community-discovered hidden gems from across Marinduque island, Philippines.',
        url: 'https://marinduquemarket.com/gems-of-marinduque-feed',
    },
    alternates: { canonical: 'https://marinduquemarket.com/gems-of-marinduque-feed' },
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Determine if the current user is an admin
  let userIsAdmin = false;
  if (user) {
    if (isAdmin(user.email)) {
      userIsAdmin = true;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'admin' || profile?.role === 'moderator') {
        userIsAdmin = true;
      }
    }
  }

  // Fetch gems
  let query = supabase
    .from('gems')
    .select(`
      id,
      title,
      town,
      category,
      description,
      images,
      latitude,
      longitude,
      created_at,
      author_id,
      likes_count,
      comments_count,
      is_approved,
      author:profiles!gems_author_id_fkey(
        full_name,
        avatar_url
      )
    `);
    
  if (!userIsAdmin) {
    query = query.eq('is_approved', true);
  }

  const { data: gems } = await query
    .order('created_at', { ascending: false });

  // Fetch user likes
  let myLikedGemIds = new Set<string>();
  if (user) {
    const { data: myLikes } = await supabase
      .from('gem_likes')
      .select('gem_id')
      .eq('user_id', user.id);
    if (myLikes) {
      myLikedGemIds = new Set(myLikes.map(l => l.gem_id));
    }
  }

  // Map to the Gem type expected by the UI
  const formattedGems = (gems || []).map((gem: any) => ({
    id: gem.id,
    title: gem.title,
    location: gem.town,
    description: gem.description,
    image: gem.images && gem.images.length > 0 ? gem.images[0] : 'https://placehold.co/600x400?text=No+Photo',
    images: gem.images || [],
    imageAlt: gem.title,
    author: {
      id: gem.author_id,
      name: gem.author?.full_name || 'Anonymous',
      avatar: gem.author?.avatar_url || null,
      initials: (gem.author?.full_name || 'A')[0].toUpperCase(),
    },
    aspectRatio: 'aspect-square',
    latitude: gem.latitude,
    longitude: gem.longitude,
    createdAt: gem.created_at,
    likesCount: gem.likes_count || 0,
    commentsCount: gem.comments_count || 0,
    isLikedByMe: myLikedGemIds.has(gem.id),
    isApproved: gem.is_approved,
    category: gem.category
  }));

  return (
    <GemsOfMarinduqueFeed
      initialGems={formattedGems}
      currentUserId={user?.id || null}
      isAdmin={userIsAdmin}
    />
  );
}
