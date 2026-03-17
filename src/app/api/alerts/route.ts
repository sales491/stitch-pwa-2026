import { NextResponse } from 'next/server';
import { alertPriority } from '@/lib/alert-expiry';

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
    // Fetch ALL active alerts that have not yet expired
    // expires_at.is.null = no expiry set (treat as permanent)
    // expires_at.gt.NOW() = not yet expired
    const [calamityAlerts, outageReports] = await Promise.all([
        fetchTable<Record<string, unknown>>(
            'calamity_alerts',
            'status=eq.active&or=(expires_at.is.null,expires_at.gt.NOW())&order=created_at.desc'
        ),
        fetchTable<Record<string, unknown>>(
            'outage_reports',
            'status=eq.active&or=(expires_at.is.null,expires_at.gt.NOW())&order=created_at.desc'
        ),
    ]);

    // Tag each alert with its source so the banner can render it correctly
    type TaggedAlert = Record<string, unknown> & { _source: string };
    const tagged: TaggedAlert[] = [
        ...calamityAlerts.map(a => ({ ...a, _source: 'calamity' })),
        ...outageReports.map(a => ({ ...a, _source: 'outage' })),
    ];

    // Sort by unified priority (lower number = show first)
    tagged.sort((a, b) =>
        alertPriority({ type: a.type as string, severity: a.severity as string | undefined, expires_at: a.expires_at as string | null })
        - alertPriority({ type: b.type as string, severity: b.severity as string | undefined, expires_at: b.expires_at as string | null })
    );

    return NextResponse.json(
        { alerts: tagged },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        }
    );
}
