'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SkillListing, SkillCategory, Municipality } from '@/lib/skills-constants';

export async function getSkillListings(municipality?: string, category?: string): Promise<SkillListing[]> {
    const supabase = await createClient();
    let query = supabase
        .from('skills_exchange')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (municipality) query = query.eq('municipality', municipality);
    if (category && category !== 'all') query = query.eq('category', category);

    const { data } = await query;
    return (data ?? []) as SkillListing[];
}

export async function postSkillListing(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to post a skill.' };

    // Get poster name from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

    const skill_name = (formData.get('skill_name') as string)?.trim();
    const category = formData.get('category') as SkillCategory;
    const municipality = formData.get('municipality') as Municipality;
    const description = (formData.get('description') as string)?.trim();
    const rate = (formData.get('rate') as string)?.trim() || null;
    const availability = (formData.get('availability') as string)?.trim() || null;
    const phone = (formData.get('phone') as string)?.trim() || undefined;
    const fbUsername = (formData.get('fbUsername') as string)?.trim() || undefined;

    if (!skill_name || !category || !municipality || !description) {
        return { error: 'Please fill in all required fields.' };
    }
    if (!phone && !fbUsername) {
        return { error: 'Please provide at least one contact method.' };
    }

    const poster_name = profile?.full_name ?? null;

    const { data: inserted, error } = await supabase.from('skills_exchange').insert({
        posted_by: user.id,
        poster_name,
        skill_name,
        category,
        municipality,
        description,
        rate,
        availability,
        contact: { phone, fbUsername },
    }).select('*').single();

    if (error) return { error: error.message };
    revalidatePath('/island-life/skills');
    return { success: true, item: inserted as SkillListing };
}

export async function deleteSkillListing(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('skills_exchange')
        .delete()
        .eq('id', id)
        .eq('posted_by', user.id);

    if (error) return { error: error.message };
    revalidatePath('/island-life/skills');
    return { success: true };
}
