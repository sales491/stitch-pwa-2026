'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
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

export async function createBoatService(data: any, editId?: string | null) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    if (editId) {
        // UPDATE existing record — admin can update any, regular users only their own
        const hasAdminAccess = await isUserAdmin(user);
        if (hasAdminAccess) {
            const adminClient = await createAdminClient();
            const { error } = await adminClient
                .from('boat_services')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', editId);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from('boat_services')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', editId)
                .eq('provider_id', user.id);
            if (error) throw new Error(error.message);
        }
    } else {
        // CREATE / UPDATE own listing — upsert on provider_id (one per user)
        const { error } = await supabase
            .from('boat_services')
            .upsert({
                ...data,
                provider_id: user.id,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'provider_id'
            });
        if (error) throw new Error(error.message);
    }

    revalidatePath('/island-hopping');
    return { success: true };
}

export async function deleteBoatService(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('boat_services')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('boat_services')
            .delete()
            .eq('id', id)
            .eq('provider_id', user.id);
        if (error) throw new Error(error.message);
    }

    revalidatePath('/island-hopping');
    return { success: true };
}
