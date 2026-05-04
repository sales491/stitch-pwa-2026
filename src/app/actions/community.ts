'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getCommunityPosts(location?: string, category?: string, page = 0) {
    const supabase = await createClient();
    const PAGE_SIZE = 15;

    let query = supabase
        .from('posts')
        .select(`
            *,
            author:profiles(id, full_name, avatar_url)
        `)
        // 3-strike rule: only show published posts (hidden ones auto-filtered)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (location && location !== 'All Towns') {
        query = query.eq('location', location);
    }

    if (category && category !== 'all') {
        query = query.eq('type', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching community posts:', error);
        return [];
    }

    return data || [];
}

export async function createCommunityPost(formData: {
    content: string;
    location: string;
    images?: string[];
    poll_data?: unknown;
    type?: string;
    title?: string;
    tags?: string[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'You must be logged in to post.' };
    }

    // Ensure profile exists (self-healing for common Supabase trigger delays)
    // We use the admin client here because regular users don't have INSERT permission on 'profiles'
    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (!profile) {
        console.log(`[createCommunityPost] Profile missing for user ${user.id}, creating fallback via Admin Client.`);
        const safeEmail = user.email || '';
        const defaultName = safeEmail ? safeEmail.split('@')[0] : 'PH User';

        const { error: profileError } = await adminSupabase.from('profiles').insert([{
            id: user.id,
            email: user.email, // Required field
            full_name: user.user_metadata?.full_name || defaultName,
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'user'
        }]);

        if (profileError) {
            console.error('[createCommunityPost] CRITICAL: Failed to create fallback profile:', profileError);
            return { success: false, error: `Profile setup failed: ${profileError.message}` };
        }
    }

    const postType = formData.poll_data ? 'poll' : (formData.type || 'general');

    const { data, error } = await supabase
        .from('posts')
        .insert([{
            author_id: user.id,
            content: formData.content,
            location: formData.location,
            images: formData.images || [],
            poll_data: formData.poll_data || null,
            type: postType,
            title: formData.title || null,
            tags: formData.tags || [],
            status: 'published',
            likes_count: 0,
            comments_count: 0
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating community post:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/community');
    return { success: true, data };
}

export async function voteInPoll(postId: string, optionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'You must be logged in to vote.' };
    }

    // This is a complex update for JSONB. 
    // We'll fetch, modify locally, and update.
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('poll_data')
        .eq('id', postId)
        .single();

    if (fetchError || !post || !post.poll_data) {
        return { success: false, error: 'Poll not found.' };
    }

    const pollData = post.poll_data as { options: { id: string, votes: string[] }[] };

    // Check if user already voted in ANY option
    const hasVoted = pollData.options.some((opt) => opt.votes.includes(user.id));
    if (hasVoted) {
        return { success: false, error: 'You have already voted in this poll.' };
    }

    // Add vote
    pollData.options = pollData.options.map((opt) => {
        if (opt.id === optionId) {
            return { ...opt, votes: [...opt.votes, user.id] };
        }
        return opt;
    });

    const { error: updateError } = await supabase
        .from('posts')
        .update({ poll_data: pollData })
        .eq('id', postId);

    if (updateError) {
        return { success: false, error: updateError.message };
    }

    revalidatePath('/community');
    return { success: true };
}

// ── Likes ───────────────────────────────────────────────────
/**
 * Toggle a like on a post.
 * Returns { liked: true } if the post is now liked, { liked: false } if unliked.
 * The DB trigger handles incrementing/decrementing posts.likes_count automatically.
 */
export async function toggleLike(postId: string): Promise<{ success: boolean; liked?: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'You must be logged in to like posts.' };
    }

    // Check if the user already liked this post
    const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('entity_id', postId)
        .eq('entity_type', 'post')
        .maybeSingle();

    if (existing) {
        // Already liked → unlike (delete)
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('id', existing.id);

        if (error) return { success: false, error: error.message };
        return { success: true, liked: false };
    } else {
        // Not liked → like (insert)
        const { error } = await supabase
            .from('likes')
            .insert([{
                user_id: user.id,
                entity_id: postId,
                entity_type: 'post',
            }]);

        if (error) return { success: false, error: error.message };
        return { success: true, liked: true };
    }
}

/**
 * Fetch which post IDs the current user has already liked.
 * Used on initial render to seed the liked-heart state.
 */
export async function getUserLikedPostIds(postIds: string[]): Promise<string[]> {
    if (!postIds.length) return [];

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('likes')
        .select('entity_id')
        .eq('user_id', user.id)
        .eq('entity_type', 'post')
        .in('entity_id', postIds);

    return (data || []).map((row) => row.entity_id);
}
