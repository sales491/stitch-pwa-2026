import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import PortsClientShell from '@/components/PortsClientShell';

export const metadata: Metadata = {
    title: 'RoRo Port Schedules & Updates — Marinduque',
    description: 'Live RoRo ferry schedule, departure status, and port updates for Marinduque. Balanacan Port (Mogpog) and Buyabod Port (Santa Cruz) — real-time community reports.',
    keywords: ['RoRo Marinduque', 'ferry schedule Philippines', 'Balanacan Port', 'Buyabod Port', 'Marinduque ferry', 'BAPOR MARINDUQUE'],
    openGraph: {
        title: 'RoRo Port Schedules & Updates — Marinduque',
        description: 'Live ferry schedules and port status updates for Marinduque island.',
        url: 'https://marinduquemarket.com/ports',
    },
    alternates: { canonical: 'https://marinduquemarket.com/ports' },
};

export default async function PortsPage() {
    const supabase = await createClient();

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const { data: updates } = await supabase
        .from('port_updates')
        .select('*, profiles(full_name, avatar_url)')
        .gte('created_at', twelveHoursAgo)
        .order('created_at', { ascending: false })
        .limit(20);

    const latestAlert = updates?.[0] ?? null;

    return <PortsClientShell updates={updates ?? []} latestAlert={latestAlert} />;
}
