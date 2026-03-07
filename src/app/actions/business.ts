'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { businessSchema, BusinessInput } from '@/lib/validations/business';
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

export async function createBusinessProfile(data: BusinessInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = businessSchema.parse(data);

    const { error } = await supabase
        .from('business_profiles')
        .insert({
            ...validated,
            user_id: user.id,
        });

    if (error) throw new Error(error.message);

    revalidatePath('/directory');
    return { success: true };
}

export async function updateBusinessProfile(id: string, data: BusinessInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = businessSchema.parse(data);

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('business_profiles')
            .update(validated)
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('business_profiles')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id); // Ensure ownership

        if (error) throw new Error(error.message);
    }

    revalidatePath('/directory');
    revalidatePath(`/business/${id}`);
    return { success: true };
}

export async function deleteBusinessProfile(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('business_profiles')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('business_profiles')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/directory');
    return { success: true };
}
