import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // cache at edge for 60s

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function fetchTable<T>(table: string, params: string): Promise<T[]> {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<T[]>;
}

export async function GET() {
    const [calamityAlerts, outageReports] = await Promise.all([
        fetchTable('calamity_alerts', 'status=eq.active&order=created_at.desc&limit=3'),
        fetchTable('outage_reports', 'status=eq.active&order=created_at.desc&limit=3'),
    ]);

    return NextResponse.json(
        { calamityAlerts, outageReports },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        }
    );
}
