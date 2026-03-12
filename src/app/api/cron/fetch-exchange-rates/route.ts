import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Uses open.er-api.com — free tier, no API key required
// Base: USD → we invert to get PHP as base
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/PHP';

export async function GET(req: NextRequest) {
    // Verify cron secret in production
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const res = await fetch(EXCHANGE_API_URL, {
            next: { revalidate: 0 },
            headers: { 'User-Agent': 'MarinduqueMarketHub/1.0' },
        });

        if (!res.ok) {
            throw new Error(`Exchange API returned ${res.status}`);
        }

        const json = await res.json();

        if (json.result !== 'success') {
            throw new Error(`Exchange API error: ${json['error-type'] ?? 'unknown'}`);
        }

        const rates: Record<string, number> = json.rates;

        // Store only the currencies we care about to keep the payload small
        const OFW_CURRENCIES = ['USD', 'SAR', 'AED', 'GBP', 'CAD', 'AUD', 'SGD', 'HKD', 'JPY', 'KRW', 'EUR', 'QAR'];
        const filteredRates: Record<string, number> = {};
        for (const code of OFW_CURRENCIES) {
            if (rates[code] !== undefined) {
                // Rates from open.er-api are already PHP-based (1 PHP = X foreign)
                // We want: 1 FOREIGN = Y PHP, so invert
                filteredRates[code] = rates[code] ? parseFloat((1 / rates[code]).toFixed(4)) : 0;
            }
        }

        const supabase = await createClient();

        // Delete old entries and insert fresh
        await supabase.from('exchange_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { error } = await supabase.from('exchange_rates').insert([{
            base_currency: 'PHP',
            rates: filteredRates,
            fetched_at: new Date().toISOString(),
            source: 'open.er-api.com',
        }]);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            currencies: Object.keys(filteredRates).length,
            fetched_at: new Date().toISOString(),
        });
    } catch (err: any) {
        console.error('[fetch-exchange-rates]', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
