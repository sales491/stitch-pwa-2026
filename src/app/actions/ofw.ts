'use server';

import { createClient } from '@/utils/supabase/server';

export type ExchangeRates = {
    base: string;
    rates: Record<string, number>;
    fetched_at: string | null;
};

export type RemittanceCenter = {
    id: string;
    name: string;
    network: string;
    municipality: string;
    barangay: string | null;
    address: string | null;
    phone: string | null;
    hours: string | null;
};

export async function getExchangeRates(): Promise<ExchangeRates> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('exchange_rates')
        .select('base_currency, rates, fetched_at')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return { base: 'PHP', rates: {}, fetched_at: null };
    }

    return {
        base: data.base_currency,
        rates: data.rates as Record<string, number>,
        fetched_at: data.fetched_at,
    };
}

export async function getRemittanceCenters(municipality?: string): Promise<RemittanceCenter[]> {
    const supabase = await createClient();

    let query = supabase
        .from('remittance_centers')
        .select('id, name, network, municipality, barangay, address, phone, hours')
        .order('municipality')
        .order('name');

    if (municipality && municipality !== 'All') {
        query = query.eq('municipality', municipality);
    }

    const { data, error } = await query;
    if (error) { console.error('[getRemittanceCenters]', error); return []; }
    return (data ?? []) as RemittanceCenter[];
}
