'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { jobSchema, JobInput } from '@/lib/validations/job';
import { revalidatePath } from 'next/cache';
import type { User } from '@supabase/supabase-js';
import { isAdmin } from '@/utils/roles';

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

export async function createJob(data: JobInput, id?: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = jobSchema.parse(data);

    if (id) {
        // UPDATE existing job
        const hasAdminAccess = await isUserAdmin(user);
        if (hasAdminAccess) {
            const adminClient = await createAdminClient();
            const { error } = await adminClient
                .from('jobs')
                .update({
                    ...validated,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from('jobs')
                .update({
                    ...validated,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('employer_id', user.id);
            if (error) throw new Error(error.message);
        }
    } else {
        // Create new job
        const { error } = await supabase
            .from('jobs')
            .insert({
                ...validated,
                employer_id: user.id,
            });

        if (error) throw new Error(error.message);
    }

    revalidatePath('/jobs');
    return { success: true };
}

export async function deleteJob(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id)
            .eq('employer_id', user.id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/jobs');
    return { success: true };
}
