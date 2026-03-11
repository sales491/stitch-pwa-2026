'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isAdmin } from '@/utils/roles';
import { revalidatePath } from 'next/cache';

/**
 * Ensures the currently authenticated user is an administrator.
 * Returns true if admin, throws an error otherwise.
 */
async function verifyAdminServer() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    if (isAdmin(user.email)) {
        return true;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'admin' || profile?.role === 'moderator') {
        return true;
    }

    throw new Error('Forbidden: Admin access required.');
}

export async function adminDeleteContent(contentType: string, contentId: string) {
    console.log(`[adminDeleteContent] Server Action Triggered: type=${contentType}, id=${contentId}`);
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Unauthorized');

        let is_admin = false;
        try {
            is_admin = await verifyAdminServer();
        } catch (e) {
            is_admin = false;
        }

        // Initialize the admin client to bypass RLS
        const adminSupabase = await createAdminClient();

        const tableMap: Record<string, string> = {
            listing: 'listings',
            job: 'job_posts',
            business: 'business_profiles',
            post: 'posts',
            comment: 'comments',
            commute: 'transport_services',
            boat: 'boat_services',
            user: 'profiles',
            gem: 'gems',
            event: 'events',
        };

        const tableName = tableMap[contentType];
        if (!tableName) {
            throw new Error(`Unknown content type: ${contentType}`);
        }

        if (!is_admin) {
            // Not an admin, verify ownership
            const { data: item } = await adminSupabase.from(tableName).select('*').eq('id', contentId).single();
            if (!item) throw new Error('Content not found');

            const ownerId = item.user_id || item.author_id || item.employer_id || item.driver_id || item.provider_id;
            if (ownerId !== user.id) {
                throw new Error('Forbidden: You can only delete your own content.');
            }
        }

        console.log(`[adminDeleteContent] Authorization passed.`);

        // 3. Clean up linked records to avoid foreign key violations
        if (contentType === 'business') {
            await adminSupabase.from('business_claim_requests').delete().eq('business_id', contentId);
        }

        if (contentType !== 'user') {
            await adminSupabase.from('moderation_queue')
                .delete()
                .eq('content_type', contentType)
                .eq('content_id', contentId);
        }

        // 4. Perform the actual deletion of the specified content
        console.log(`[adminDeleteContent] Deleting from table: ${tableName} where id=${contentId}`);
        const { error: deleteError } = await adminSupabase.from(tableName).delete().eq('id', contentId);
        if (deleteError) {
            console.error(`[adminDeleteContent] Delete error in table ${tableName}:`, deleteError);
            throw new Error(`Failed to delete from ${tableName}: ${deleteError.message}`);
        }

        // 5. Revalidate common paths so UI refreshes securely
        revalidatePath('/directory');
        revalidatePath('/marinduque-classifieds-marketplace');
        revalidatePath('/marinduque-jobs');
        revalidatePath('/best-of-boac-2026-voting');
        revalidatePath('/community');
        revalidatePath('/island-hopping');
        revalidatePath('/');

        console.log(`[adminDeleteContent] Success.`);
        return { success: true };
    } catch (e: any) {
        console.error(`[adminDeleteContent] FATAL ERROR:`, e);
        return { success: false, error: e.message };
    }
}

export async function adminVerifyBusiness(businessId: string) {
    console.log(`[adminVerifyBusiness] Triggered for id=${businessId}`);
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();

        const { error } = await adminSupabase
            .from('business_profiles')
            .update({ is_verified: true })
            .eq('id', businessId);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath(`/directory/${businessId}`);
        revalidatePath('/directory');
        return { success: true };
    } catch (e: any) {
        console.error(`[adminVerifyBusiness] Error:`, e);
        return { success: false, error: e.message };
    }
}
