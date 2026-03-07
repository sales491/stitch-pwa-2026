'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { gemSchema, GemInput } from '@/lib/validations/gem';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/utils/roles';

async function isUserAdmin(user: any): Promise<boolean> {
    if (isAdmin(user.email)) return true;
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    return profile?.role === 'admin' || profile?.role === 'moderator';
}

export async function createGem(data: GemInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = gemSchema.parse(data);

    const { error } = await supabase
        .from('gems')
        .insert({
            ...validated,
            author_id: user.id,
        });

    if (error) throw new Error(error.message);

    revalidatePath('/marinduque-connect-home-feed');
    revalidatePath('/gems-of-marinduque-feed');
    return { success: true };
}

export async function deleteGem(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        console.log(`[deleteGem] User has admin access. Deleting gem ${id}`);
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('gems')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[deleteGem] Admin delete error:', error);
            throw new Error(error.message);
        }
    } else {
        console.log(`[deleteGem] User is a regular author. Deleting gem ${id}`);
        const { error } = await supabase
            .from('gems')
            .delete()
            .eq('id', id)
            .eq('author_id', user.id);

        if (error) {
            console.error('[deleteGem] Author delete error:', error);
            throw new Error(error.message);
        }
    }

    revalidatePath('/marinduque-connect-home-feed');
    revalidatePath('/gems-of-marinduque-feed');
    return { success: true };
}

export async function toggleGemLike(gemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Check if like exists
    const { data: existingLike } = await supabase
        .from('gem_likes')
        .select('id')
        .eq('gem_id', gemId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingLike) {
        await supabase.from('gem_likes').delete().eq('id', existingLike.id);
    } else {
        await supabase.from('gem_likes').insert({ gem_id: gemId, user_id: user.id });
    }

    revalidatePath('/gems-of-marinduque-feed');
    revalidatePath(`/gems-of-marinduque-feed/${gemId}`);
    return { success: true, liked: !existingLike };
}

export async function addGemComment(gemId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    if (!content.trim()) throw new Error('Comment cannot be empty');

    const { error } = await supabase.from('gem_comments').insert({
        gem_id: gemId,
        author_id: user.id,
        content: content.trim()
    });

    if (error) throw new Error(error.message);

    revalidatePath(`/gems-of-marinduque-feed/${gemId}`);
    return { success: true };
}
