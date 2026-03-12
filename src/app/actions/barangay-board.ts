'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type BarangayPost = {
    id: string;
    author_id: string;
    barangay: string;
    municipality: string;
    content: string;
    image_url: string | null;
    status: 'active' | 'removed';
    created_at: string;
    updated_at: string;
    author?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
};

export async function getBarangayPosts(barangay: string, municipality: string, page = 0) {
    const supabase = await createClient();
    const PAGE_SIZE = 20;

    const { data, error } = await supabase
        .from('barangay_posts')
        .select('*, author:profiles(full_name, avatar_url)')
        .eq('barangay', barangay)
        .eq('municipality', municipality)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) { console.error('[getBarangayPosts]', error); return []; }
    return (data ?? []) as BarangayPost[];
}

export async function createBarangayPost(data: {
    content: string;
    barangay: string;
    municipality: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'You must be logged in.' };
    if (!data.content.trim()) return { success: false, error: 'Post content is required.' };

    const { error } = await supabase.from('barangay_posts').insert([{
        author_id: user.id,
        barangay: data.barangay,
        municipality: data.municipality,
        content: data.content.trim(),
        status: 'active',
    }]);

    if (error) { console.error('[createBarangayPost]', error); return { success: false, error: error.message }; }
    revalidatePath('/my-barangay/board');
    return { success: true };
}

export async function deleteBarangayPost(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { error } = await supabase
        .from('barangay_posts')
        .update({ status: 'removed' })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/my-barangay/board');
    return { success: true };
}

export async function getUserBarangay(): Promise<{ barangay: string | null; municipality: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { barangay: null, municipality: null };

    const { data } = await supabase
        .from('profiles')
        .select('barangay, location')
        .eq('id', user.id)
        .single();

    return {
        barangay: data?.barangay ?? null,
        municipality: data?.location ?? null,
    };
}
