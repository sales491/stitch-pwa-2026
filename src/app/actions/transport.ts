'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { transportServiceSchema, TransportServiceInput } from '@/lib/validations/transport';
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

export async function createTransportService(data: any, editId?: string | null) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = transportServiceSchema.parse(data);

    if (editId) {
        // UPDATE existing record — admin can update any, regular users only their own
        const hasAdminAccess = await isUserAdmin(user);
        if (hasAdminAccess) {
            const adminClient = await createAdminClient();
            const { error } = await adminClient
                .from('transport_services')
                .update({ ...validated, updated_at: new Date().toISOString() })
                .eq('id', editId);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from('transport_services')
                .update({ ...validated, updated_at: new Date().toISOString() })
                .eq('id', editId)
                .eq('provider_id', user.id);
            if (error) throw new Error(error.message);
        }
    } else {
        // CREATE — insert a new listing. Multiple listings per provider are allowed
        // (e.g. one tricycle + one van). Editing an existing listing uses the editId
        // branch above, which does a targeted update instead.
        const { error } = await supabase
            .from('transport_services')
            .insert({
                ...validated,
                provider_id: user.id,
                updated_at: new Date().toISOString()
            });
        if (error) throw new Error(error.message);
    }

    revalidatePath('/commuter-delivery-hub');
    return { success: true };
}

export async function deleteTransportService(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('transport_services')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('transport_services')
            .delete()
            .eq('id', id)
            .eq('provider_id', user.id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/commuter-delivery-hub');
    return { success: true };
}
