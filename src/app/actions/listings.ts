'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { listingSchema, ListingInput } from '@/lib/validations/listing';
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

export async function createListing(data: ListingInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = listingSchema.parse(data);

    const { error } = await supabase
        .from('listings')
        .insert({
            ...validated,
            user_id: user.id,
            seller_id: user.id,
            // New listings go to 'pending' so admin can verify before going live
            status: 'pending',
        });

    if (error) throw new Error(error.message);

    revalidatePath('/marketplace');
    revalidatePath('/marinduque-classifieds-marketplace');
    revalidatePath('/admin');
    return { success: true };
}

export async function updateListing(id: string, data: ListingInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = listingSchema.parse(data);

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('listings')
            .update(validated)
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('listings')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/marinduque-classifieds-marketplace');
    revalidatePath(`/listing/${id}`);
    return { success: true };
}

export async function deleteListing(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('listings')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('user_id', user.id)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/marketplace');
    revalidatePath('/marinduque-classifieds-marketplace');
    return { success: true };
}

export async function approveListing(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);
    if (!hasAdminAccess) throw new Error('Forbidden');

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('listings')
        .update({ status: 'active' })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/admin/moderation');
    revalidatePath('/marketplace');
    revalidatePath(`/marketplace/${id}`);
    return { success: true };
}

export async function rejectListing(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);
    if (!hasAdminAccess) throw new Error('Forbidden');

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('listings')
        .update({ status: 'draft' })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/admin/moderation');
    return { success: true };
}
