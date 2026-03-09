'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { isAdmin as checkIsAdmin } from '@/utils/roles';

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin' && !checkIsAdmin(user.email)) {
        throw new Error('Not authorized');
    }

    return supabase;
}

/** Save or update the admin writeup for a specific shoutout slot (1 or 2). */
export async function updateSpotlightWriteup(
    monthYear: string,
    slot: 1 | 2,
    writeup: string
) {
    const supabase = await requireAdmin();
    const field = slot === 1 ? 'writeup_1' : 'writeup_2';

    const { error } = await supabase
        .from('boac_spotlights')
        .upsert(
            { month_year: monthYear, [field]: writeup, updated_at: new Date().toISOString() },
            { onConflict: 'month_year' }
        );

    if (error) throw new Error(error.message);
    revalidatePath('/best-of-boac-monthly-spotlight');
}

/** Save or update the admin writeup for the winner card (slot 1 or 2). */
export async function updateWinnerWriteup(
    monthYear: string,
    slot: 1 | 2,
    writeup: string
) {
    const supabase = await requireAdmin();
    const field = slot === 1 ? 'winner_writeup_1' : 'winner_writeup_2';

    const { error } = await supabase
        .from('boac_spotlights')
        .upsert(
            { month_year: monthYear, [field]: writeup, updated_at: new Date().toISOString() },
            { onConflict: 'month_year' }
        );

    if (error) throw new Error(error.message);
    revalidatePath('/best-of-boac-monthly-spotlight');
}

/** Swap one of the two shoutout business slots for the current month. */
export async function swapSpotlightBusiness(
    monthYear: string,
    slot: 1 | 2,
    businessId: string
) {
    const supabase = await requireAdmin();
    const field = slot === 1 ? 'business_id_1' : 'business_id_2';

    const { error } = await supabase
        .from('boac_spotlights')
        .upsert(
            { month_year: monthYear, [field]: businessId, updated_at: new Date().toISOString() },
            { onConflict: 'month_year' }
        );

    if (error) throw new Error(error.message);
    revalidatePath('/best-of-boac-monthly-spotlight');
}

/** Swap the Monthly Top Spot winner business. */
export async function swapWinnerBusiness(monthYear: string, businessId: string) {
    const supabase = await requireAdmin();

    const { error } = await supabase
        .from('boac_spotlights')
        .upsert(
            { month_year: monthYear, winner_business_id: businessId, updated_at: new Date().toISOString() },
            { onConflict: 'month_year' }
        );

    if (error) throw new Error(error.message);
    revalidatePath('/best-of-boac-monthly-spotlight');
}
