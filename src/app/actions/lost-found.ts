'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type LostFoundPost = {
    id: string;
    posted_by: string | null;
    type: 'lost' | 'found';
    category: 'animal' | 'item' | 'document' | 'person';
    title: string;
    description: string | null;
    image_url: string | null;
    location: string | null;
    municipality: string | null;
    contact: string | null;
    status: 'open' | 'resolved';
    created_at: string;
    poster?: { full_name: string | null; avatar_url: string | null } | null;
};

export type LostFoundFilters = {
    type?: 'lost' | 'found' | 'all';
    category?: string;
    municipality?: string;
    status?: 'open' | 'resolved' | 'all';
    page?: number;
};

const PAGE_SIZE = 15;

export async function getLostFoundPosts(filters: LostFoundFilters = {}) {
    const supabase = await createClient();
    const page = filters.page ?? 0;

    let query = supabase
        .from('lost_found')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
    }
    if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
    }
    if (filters.municipality && filters.municipality !== 'all') {
        query = query.eq('municipality', filters.municipality);
    }
    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    } else if (!filters.status) {
        // Default: show open only
        query = query.eq('status', 'open');
    }

    const { data, error } = await query;
    if (error) {
        console.error('[getLostFoundPosts]', error.code, error.message, error.hint, error.details);
        return [];
    }

    const rows = (data ?? []) as LostFoundPost[];

    // Manually fetch profile info for posters to avoid PostgREST join dependency
    const posterIds = [...new Set(rows.map(r => r.posted_by).filter(Boolean))] as string[];
    if (posterIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', posterIds);

        const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));
        for (const row of rows) {
            if (row.posted_by) {
                row.poster = profileMap.get(row.posted_by) ?? null;
            }
        }
    }

    return rows;
}

export async function getLostFoundPost(id: string): Promise<LostFoundPost | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('lost_found')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;

    const row = data as LostFoundPost;

    // Manually fetch poster profile
    if (row.posted_by) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', row.posted_by)
            .single();
        row.poster = profile ?? null;
    }

    return row;
}

export type CreateLostFoundData = {
    type: 'lost' | 'found';
    category: 'animal' | 'item' | 'document' | 'person';
    title: string;
    description?: string;
    image_url?: string;
    location?: string;
    municipality?: string;
    contact?: string;
};

export async function createLostFoundPost(data: CreateLostFoundData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'You must be logged in to post.' };
    }

    const { data: row, error } = await supabase
        .from('lost_found')
        .insert([{
            posted_by: user.id,
            type: data.type,
            category: data.category,
            title: data.title.trim(),
            description: data.description?.trim() || null,
            image_url: data.image_url || null,
            location: data.location?.trim() || null,
            municipality: data.municipality || null,
            contact: data.contact?.trim() || null,
            status: 'open',
        }])
        .select()
        .single();

    if (error) {
        console.error('[createLostFoundPost]', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/my-barangay/lost-found');
    return { success: true, id: row.id };
}

export async function updateLostFoundStatus(id: string, status: 'open' | 'resolved') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { error } = await supabase
        .from('lost_found')
        .update({ status })
        .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/my-barangay/lost-found');
    revalidatePath(`/my-barangay/lost-found/${id}`);
    return { success: true };
}

export async function deleteLostFoundPost(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { error } = await supabase
        .from('lost_found')
        .delete()
        .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/my-barangay/lost-found');
    return { success: true };
}
