'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { eventSchema, EventInput } from '@/lib/validations/event';
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

export async function createEvent(data: EventInput) {
    try {
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, message: 'You must be signed in to publish an event.' };
        }

        // 2. Validation
        const result = eventSchema.safeParse(data);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Invalid event data.';
            return { success: false, message: firstError };
        }

        const validated = result.data;

        // 3. Database Insert
        const { error } = await supabase
            .from('events')
            .insert({
                ...validated,
                author_id: user.id
            });

        if (error) {
            console.error('Database error in createEvent:', error);
            return { success: false, message: `DB Error: ${error.message} (code: ${error.code})` };
        }

        revalidatePath('/events');
        return { success: true };
    } catch (err: any) {
        console.error('Unexpected error in createEvent:', err);
        return { success: false, message: 'An unexpected error occurred while publishing your event.' };
    }
}

export async function deleteEvent(id: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const hasAdminAccess = await isUserAdmin(user);

    if (hasAdminAccess) {
        const adminClient = await createAdminClient();
        const { error } = await adminClient
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
            .eq('author_id', user.id);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/events');
    return { success: true };
}
