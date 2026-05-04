'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { listingSchema, ListingInput } from '@/lib/validations/listing';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/utils/roles';
import { checkContent, checkRateLimit } from '@/lib/moderation/contentFilter';

import type { User } from '@supabase/supabase-js';

async function isUserAdmin(user: User): Promise<boolean> {
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

    // --- Content Filter (bilingual profanity / spam / prohibited items) ---
    const textToScan = `${validated.title} ${validated.description}`;
    const contentResult = checkContent(textToScan);
    if (contentResult.blocked) {
        throw new Error(contentResult.reason);
    }

    // --- Rate Limit: 5 active listings per user per 24 hours ---
    const rateLimitResult = await checkRateLimit(user.id, supabase);
    if (rateLimitResult.limited) {
        throw new Error(
            `You've reached the daily listing limit (${rateLimitResult.maxAllowed} listings per 24 hours). Please try again later.`
        );
    }

    const { error } = await supabase
        .from('listings')
        .insert({
            ...validated,
            user_id: user.id,
            seller_id: user.id,
            status: 'active',
        });

    if (error) throw new Error(error.message);

    revalidatePath('/marketplace');
    revalidatePath('/marinduque-classifieds-marketplace');
    revalidatePath('/');
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
    revalidatePath('/');
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

export async function resolveFlag(flagId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);
    if (!hasAdminAccess) throw new Error('Forbidden');

    const adminClient = await createAdminClient();
    
    // First retrieve the flag so we can find its related content_id
    const { data: flag } = await adminClient.from('content_flags').select('content_id').eq('id', flagId).single();

    const { error } = await adminClient
        .from('content_flags')
        .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: user.id,
        })
        .eq('id', flagId);

    if (error) throw new Error(error.message);

    // Synchronize the main moderation_queue 
    if (flag?.content_id) {
        const { count } = await adminClient.from('content_flags')
            .select('*', { count: 'exact', head: true })
            .eq('content_id', flag.content_id)
            .eq('resolved', false);
            
        if (count === 0) {
            await adminClient.from('moderation_queue')
                .update({ 
                    status: 'rejected',
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: user.id
                })
                .eq('content_id', flag.content_id)
                .eq('status', 'pending');
        }
    }

    revalidatePath('/admin');
    revalidatePath('/admin/moderation');
    return { success: true };
}
