'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { businessSchema, BusinessInput } from '@/lib/validations/business';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/utils/roles';
import { determineBarangay } from '@/utils/barangay-matcher';
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

export async function createBusinessProfile(data: BusinessInput) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = businessSchema.parse(data);

    // Auto-detect and assign barangay if missing
    let contactInfoObj = (validated.contact_info as Record<string, unknown>) || {};
    if (typeof contactInfoObj === 'string') {
        try { contactInfoObj = JSON.parse(contactInfoObj); } catch(e) { contactInfoObj = {}; }
    }
    if (!contactInfoObj.barangay) {
        const detectedBarangay = determineBarangay(validated.business_name, validated.location || null, contactInfoObj);
        if (detectedBarangay) {
            contactInfoObj.barangay = detectedBarangay;
            validated.contact_info = contactInfoObj;
        }
    }

    const { error } = await supabase
        .from('business_profiles')
        .insert({
            ...validated,
            owner_id: user.id,
            verification_status: 'pending',
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

    // Auto-detect and assign barangay if missing
    let contactInfoObj = (validated.contact_info as Record<string, unknown>) || {};
    if (typeof contactInfoObj === 'string') {
        try { contactInfoObj = JSON.parse(contactInfoObj); } catch(e) { contactInfoObj = {}; }
    }
    if (!contactInfoObj.barangay) {
        const detectedBarangay = determineBarangay(validated.business_name, validated.location || null, contactInfoObj);
        if (detectedBarangay) {
            contactInfoObj.barangay = detectedBarangay;
            validated.contact_info = contactInfoObj;
        }
    }

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
            .eq('owner_id', user.id); // Ensure ownership

        if (error) throw new Error(error.message);
    }

    revalidatePath('/directory');
    revalidatePath(`/business/${id}`);
    return { success: true };
}

export async function deleteBusinessProfile(id: string) {
    console.log('[deleteBusinessProfile] Starting for ID:', id);
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('[deleteBusinessProfile] Unauthorized: No user found');
        throw new Error('Unauthorized');
    }

    const hasAdminAccess = await isUserAdmin(user);
    console.log('[deleteBusinessProfile] User Email:', user.email, 'hasAdminAccess:', hasAdminAccess);

    if (hasAdminAccess) {
        console.log('[deleteBusinessProfile] Proceeding with Admin privileges');
        const adminClient = await createAdminClient();
        
        // Let's explicitly check if business_reviews prevents this.
        // If there's a foreign key constraint without CASCADE, we must delete reviews first.
        const { error: reviewsError } = await adminClient
            .from('business_reviews')
            .delete()
            .eq('business_id', id);
        
        if (reviewsError) {
             console.error('[deleteBusinessProfile] Error deleting reviews:', reviewsError.message);
             // We can proceed, if it fails below we'll know.
        }

        const { error, count } = await adminClient
            .from('business_profiles')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) {
            console.error('[deleteBusinessProfile] Admin delete error:', error.message);
            throw new Error(error.message);
        }
        console.log('[deleteBusinessProfile] Admin delete success. Rows affected:', count);
        if (count === 0) throw new Error('Business profile not found or already deleted');

    } else {
        console.log('[deleteBusinessProfile] Proceeding as regular user');
        const { error, count } = await supabase
            .from('business_profiles')
            .delete({ count: 'exact' })
            .eq('id', id)
            .eq('owner_id', user.id);

        if (error) {
            console.error('[deleteBusinessProfile] User delete error:', error.message);
            throw new Error(error.message);
        }
        console.log('[deleteBusinessProfile] User delete success. Rows affected:', count);
        if (count === 0) throw new Error('Business profile not found or you lack permission to delete it');
    }

    revalidatePath('/directory');
    return { success: true };
}
