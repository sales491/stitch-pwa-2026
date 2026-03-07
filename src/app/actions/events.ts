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
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validation
    const validated = eventSchema.parse(data);

    const { error } = await supabase
        .from('events')
        .insert({
            ...validated,
            author_id: user.id,
        });

    if (error) throw new Error(error.message);

    revalidatePath('/marinduque-events-calendar');
    revalidatePath('/events');
    return { success: true };
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

    revalidatePath('/marinduque-events-calendar');
    revalidatePath('/events');
    return { success: true };
}
