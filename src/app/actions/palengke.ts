'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Municipality, PricesByCategory, PalengkePrice } from '@/lib/palengke-constants';

// Fetch today's prices for a municipality (last 24h)
export async function getPalengkePrices(municipality: Municipality): Promise<PricesByCategory> {
    const supabase = await createClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
        .from('palengke_prices')
        .select('*, profiles(display_name)')
        .eq('municipality', municipality)
        .gte('created_at', since)
        .order('created_at', { ascending: false });

    const rows: PalengkePrice[] = (data ?? []).map((r: any) => ({
        ...r,
        poster_name: r.profiles?.display_name ?? null,
        profiles: undefined,
    }));

    return {
        fish:    rows.filter(r => r.category === 'fish'),
        produce: rows.filter(r => r.category === 'produce'),
        meat:    rows.filter(r => r.category === 'meat'),
        other:   rows.filter(r => r.category === 'other'),
    };
}

// Submit a price (authenticated)
export async function submitPrice(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to submit prices.' };

    const municipality = formData.get('municipality') as string;
    const category = formData.get('category') as string;
    const item_name = (formData.get('item_name') as string)?.trim();
    const price = parseFloat(formData.get('price') as string);
    const unit = (formData.get('unit') as string) || 'kg';
    const note = (formData.get('note') as string)?.trim() || null;
    const stall_location = (formData.get('stall_location') as string)?.trim() || null;
    const availability_tag = (formData.get('availability_tag') as string) || 'available';

    if (!municipality || !category || !item_name || isNaN(price) || price <= 0) {
        return { error: 'Please fill in all required fields.' };
    }

    const { error } = await supabase.from('palengke_prices').insert({
        municipality,
        category,
        item_name,
        price,
        unit,
        note,
        stall_location,
        availability_tag,
        posted_by: user.id,
    });

    if (error) return { error: error.message };
    revalidatePath('/island-life/palengke');
    return { success: true };
}

// Delete own price submission
export async function deletePrice(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('palengke_prices')
        .delete()
        .eq('id', id)
        .eq('posted_by', user.id);

    if (error) return { error: error.message };
    revalidatePath('/island-life/palengke');
    return { success: true };
}
