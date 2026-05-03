'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isSuperAdmin, isAdmin } from '@/utils/roles';
import { revalidatePath } from 'next/cache';

/**
 * Ensures the currently authenticated user is an administrator.
 * Returns 'super_admin', 'admin', or 'moderator' — or throws.
 */
async function verifyAdminServer(): Promise<string> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Hardcoded super admin check (highest trust)
    if (isSuperAdmin(user.email)) return 'super_admin';

    // Hardcoded admin check
    if (isAdmin(user.email)) return 'admin';

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role;
    if (role === 'super_admin') return 'super_admin';
    if (role === 'admin') return 'admin';
    if (role === 'moderator') return 'moderator';

    throw new Error('Forbidden: Admin access required.');
}

/** Check if current user is super_admin */
async function verifySuperAdmin() {
    const role = await verifyAdminServer();
    if (role !== 'super_admin') throw new Error('Forbidden: Super admin access required.');
    return true;
}

export async function adminDeleteContent(contentType: string, contentId: string) {
    console.log(`[adminDeleteContent] Server Action Triggered: type=${contentType}, id=${contentId}`);
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Unauthorized');

        let callerRole: string = '';
        try {
            callerRole = await verifyAdminServer();
        } catch (e) {
            callerRole = '';
        }

        const is_privileged = callerRole !== '';

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
        if (!tableName) throw new Error(`Unknown content type: ${contentType}`);

        if (!is_privileged) {
            // Not an admin/moderator, verify ownership
            const { data: item } = await adminSupabase.from(tableName).select('*').eq('id', contentId).single();
            if (!item) throw new Error('Content not found');

            const ownerId = item.user_id || item.author_id || item.employer_id || item.driver_id || item.provider_id || item.owner_id;
            if (ownerId !== user.id) throw new Error('Forbidden: You can only delete your own content.');
        }

        // If deleting a user/profile, prevent admins from deleting other admins — only super_admin can
        if (contentType === 'user') {
            const { data: targetProfile } = await adminSupabase.from('profiles').select('role').eq('id', contentId).single();
            const targetRole = targetProfile?.role;
            if ((targetRole === 'admin' || targetRole === 'super_admin' || targetRole === 'moderator') && callerRole !== 'super_admin') {
                throw new Error('Forbidden: Only super admins can delete admin or moderator accounts.');
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

export async function adminRevokeBusinessVerification(businessId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('business_profiles')
            .update({ is_verified: false })
            .eq('id', businessId);
        if (error) throw new Error(error.message);
        revalidatePath(`/directory/${businessId}`);
        revalidatePath('/directory');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminDeleteBusiness(businessId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        // Clean up claim requests first
        await adminSupabase.from('business_claim_requests').delete().eq('business_id', businessId);
        const { error } = await adminSupabase.from('business_profiles').delete().eq('id', businessId);
        if (error) throw new Error(error.message);
        revalidatePath('/directory');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminBanUser(userId: string) {
    try {
        const callerRole = await verifyAdminServer();
        const adminSupabase = await createAdminClient();

        // Only super_admin can ban other admins/moderators
        const { data: targetProfile } = await adminSupabase.from('profiles').select('role').eq('id', userId).single();
        const targetRole = targetProfile?.role;
        if ((targetRole === 'admin' || targetRole === 'super_admin' || targetRole === 'moderator') && callerRole !== 'super_admin') {
            throw new Error('Forbidden: Only super admins can ban admin or moderator accounts.');
        }

        const { error } = await adminSupabase.from('profiles').update({ role: 'banned' }).eq('id', userId);
        if (error) throw new Error(error.message);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminUnbanUser(userId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('profiles')
            .update({ role: 'user' })
            .eq('id', userId);
        if (error) throw new Error(error.message);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminDeleteUser(userId: string) {
    try {
        await verifyAdminServer();
        // Reuse the existing adminDeleteContent which handles cascades
        return await adminDeleteContent('user', userId);
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminMarkContactMessage(messageId: string, isRead: boolean) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('contact_messages')
            .update({ is_read: isRead })
            .eq('id', messageId);
        if (error) throw new Error(error.message);
        revalidatePath('/admin');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminDeleteOperator(table: 'boat_services' | 'transport_services', id: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase.from(table).delete().eq('id', id);
        if (error) throw new Error(error.message);
        revalidatePath('/admin');
        revalidatePath('/island-hopping');
        revalidatePath('/commute');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}


export async function adminApproveBusiness(businessId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('business_profiles')
            .update({ verification_status: 'verified', is_verified: true })
            .eq('id', businessId);
        if (error) throw new Error(error.message);
        revalidatePath('/directory');
        revalidatePath(`/directory/${businessId}`);
        revalidatePath('/admin/moderation');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminRejectBusiness(businessId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('business_profiles')
            .update({ verification_status: 'rejected' })
            .eq('id', businessId);
        if (error) throw new Error(error.message);
        revalidatePath('/directory');
        revalidatePath('/admin/moderation');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminApproveClaimRequest(claimId: string, businessId: string, _requesterId?: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        
        // 1. Fetch the claim request to get the requester's email
        const { data: claim, error: fetchError } = await adminSupabase
            .from('business_claim_requests')
            .select('requester_email')
            .eq('id', claimId)
            .single();
            
        if (fetchError || !claim) throw new Error('Claim request not found.');

        // 2. Look up the user profile by email
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('id')
            .eq('email', claim.requester_email)
            .single();
            
        if (profileError || !profile) {
            throw new Error(`User with email ${claim.requester_email} not found.`);
        }

        const ownerId = profile.id;

        // 3. Update the business profile
        const { error: bizError } = await adminSupabase
            .from('business_profiles')
            .update({ owner_id: ownerId, is_verified: true, verification_status: 'verified' })
            .eq('id', businessId);
        if (bizError) throw new Error(bizError.message);
        
        // 4. Update the claim request
        const { error: claimError } = await adminSupabase
            .from('business_claim_requests')
            .update({ status: 'approved' })
            .eq('id', claimId);
        if (claimError) throw new Error(claimError.message);
        
        revalidatePath('/directory');
        revalidatePath(`/directory/${businessId}`);
        revalidatePath('/admin/moderation');
        return { success: true };
    } catch (e: any) {
        console.error('[adminApproveClaimRequest] Error:', e.message);
        return { success: false, error: e.message };
    }
}

export async function adminRejectClaimRequest(claimId: string) {
    try {
        await verifyAdminServer();
        const adminSupabase = await createAdminClient();
        const { error } = await adminSupabase
            .from('business_claim_requests')
            .update({ status: 'rejected' })
            .eq('id', claimId);
        if (error) throw new Error(error.message);
        revalidatePath('/admin/moderation');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function adminUpdateRole(userId: string, newRole: string) {
    try {
        const callerRole = await verifyAdminServer();
        const adminSupabase = await createAdminClient();

        // Only super_admin can set or remove admin/moderator roles for other users, or modify an existing admin/moderator.
        if (callerRole !== 'super_admin') {
            const { data: targetProfile } = await adminSupabase.from('profiles').select('role').eq('id', userId).single();
            const targetRole = targetProfile?.role;
            if (targetRole === 'admin' || targetRole === 'super_admin' || targetRole === 'moderator' || newRole === 'admin' || newRole === 'moderator' || newRole === 'super_admin') {
                throw new Error('Forbidden: Only super admins can manage admin/moderator roles.');
            }
        }

        const { error } = await adminSupabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);
        if (error) throw new Error(error.message);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

