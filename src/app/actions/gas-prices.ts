'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/utils/roles';

export type GasPrice = {
    id: string;
    created_at: string;
    municipality: string;
    regular_price: number | null;
    premium_price: number | null;
    diesel_price: number | null;
    photo_url: string | null;
    station_name: string | null;
    note: string | null;
    author_id: string | null;
    poster_name: string | null;
    avatar_url: string | null;
};

interface RawGasPrice {
    id: string;
    created_at: string;
    municipality: string;
    regular_price: number | null;
    premium_price: number | null;
    diesel_price: number | null;
    photo_url: string | null;
    station_name: string | null;
    note: string | null;
    author_id: string | null;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export async function getGasPrices(municipality: string): Promise<GasPrice[]> {
    const supabase = await createClient();
    // Show entries from the last 3 days
    const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
        .from('gas_prices')
        .select('*, profiles(full_name, avatar_url)')
        .eq('municipality', municipality)
        .gte('created_at', since)
        .order('created_at', { ascending: false });

    const rawData = (data as unknown as RawGasPrice[]) ?? [];

    return rawData.map((r) => ({
        id: r.id,
        created_at: r.created_at,
        municipality: r.municipality,
        regular_price: r.regular_price ?? null,
        premium_price: r.premium_price ?? null,
        diesel_price: r.diesel_price ?? null,
        photo_url: r.photo_url ?? null,
        station_name: r.station_name ?? null,
        note: r.note ?? null,
        author_id: r.author_id ?? null,
        poster_name: r.profiles?.full_name ?? null,
        avatar_url: r.profiles?.avatar_url ?? null,
    }));
}

export async function submitGasPrice(formData: FormData): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to submit prices.' };

    const municipality   = (formData.get('municipality') as string)?.trim();
    const regular_price  = formData.get('regular_price')  ? parseFloat(formData.get('regular_price')  as string) : null;
    const premium_price  = formData.get('premium_price')  ? parseFloat(formData.get('premium_price')  as string) : null;
    const diesel_price   = formData.get('diesel_price')   ? parseFloat(formData.get('diesel_price')   as string) : null;
    const photo_url      = (formData.get('photo_url') as string)?.trim() || null;
    const station_name   = (formData.get('station_name') as string)?.trim() || null;
    const note           = (formData.get('note') as string)?.trim() || null;

    if (!municipality) return { error: 'Please select a municipality.' };
    if (!station_name) return { error: 'Please enter the gas station name.' };

    // At least one price or a photo
    const hasPrices = [regular_price, premium_price, diesel_price].some(p => p !== null && !isNaN(p) && p > 0);
    if (!hasPrices && !photo_url) {
        return { error: 'Please enter at least one price or upload a photo.' };
    }

    // Validate any entered prices
    for (const [label, val] of [
        ['Regular', regular_price],
        ['Premium', premium_price],
        ['Diesel', diesel_price],
    ] as const) {
        if (val !== null && (isNaN(val as number) || (val as number) <= 0)) {
            return { error: `Invalid price for ${label}.` };
        }
    }

    const { error } = await supabase
        .from('gas_prices')
        .insert({
            municipality,
            regular_price:  hasPrices ? regular_price  : null,
            premium_price:  hasPrices ? premium_price  : null,
            diesel_price:   hasPrices ? diesel_price   : null,
            photo_url,
            station_name,
            note,
            author_id: user.id,
        });

    if (error) return { error: error.message };

    revalidatePath('/island-life/gas-prices');
    return { success: true };
}

export async function deleteGasPrice(id: string): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated.' };

    // Check if user is admin
    const userIsAdmin = isAdmin(user.email);
    if (!userIsAdmin) {
        // Also check DB role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const dbRole = profile?.role;
        if (dbRole !== 'admin' && dbRole !== 'moderator' && dbRole !== 'super_admin') {
            // Not admin — can only delete own entry
            const { error } = await supabase
                .from('gas_prices')
                .delete()
                .eq('id', id)
                .eq('author_id', user.id);
            if (error) return { error: error.message };
            revalidatePath('/island-life/gas-prices');
            return { success: true };
        }
    }

    // Admin / super_admin path — can delete any entry
    const adminClient = await createAdminClient();
    const { error } = await adminClient.from('gas_prices').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/island-life/gas-prices');
    return { success: true };
}
