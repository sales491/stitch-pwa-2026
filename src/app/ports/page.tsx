import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import PortsClientShell from '@/components/PortsClientShell';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'RoRo Port Schedules & Updates — Marinduque',
    description: 'Live RoRo ferry schedule, departure status, and port updates for Marinduque. Balanacan Port (Mogpog) and Buyabod Port (Santa Cruz) — real-time community reports.',
    keywords: ['RoRo Marinduque', 'ferry schedule Philippines', 'Balanacan Port', 'Buyabod Port', 'Marinduque ferry', 'BAPOR MARINDUQUE'],
    openGraph: {
        title: 'RoRo Port Schedules & Updates — Marinduque',
        description: 'Live ferry schedules and port status updates for Marinduque island.',
        url: 'https://marinduquemarket.com/ports',
        images: [
            {
                url: '/images/og-barko-watch.png',
                width: 1200,
                height: 630,
                alt: 'Barko Watch - RoRo Port Live Updates',
            },
        ],
    },
    alternates: hreflangAlternates('/ports'),
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CivicStructure',
                    name: metadata.openGraph?.title || 'RoRo Port Schedules & Updates',
                    description: metadata.openGraph?.description || 'Live ferry schedules and port status updates for Marinduque island.',
                    url: 'https://marinduquemarket.com/ports',
                    address: {
                        '@type': 'AdministrativeArea',
                        name: 'Marinduque'
                    }
                }) }}
            />
            <PortsClientShell updates={updates ?? []} latestAlert={latestAlert} />
            <SeoTextBlock heading="About Marinduque Ports & Ferry Schedules">
                <p>Marinduque island has three major ports connecting it to the Philippine mainland. <strong>Balanacan Port</strong> in Mogpog is the primary gateway, serving Roll-on/Roll-off (RoRo) ferries to and from Lucena City and Dalahican, Quezon Province. <strong>Buyabod Port</strong> in Santa Cruz is the secondary gateway with routes to Pinamalayan, Oriental Mindoro. <strong>Cawit Port</strong> in Boac handles LCT cargo vessels.</p>
                <p>Ferry schedules between Marinduque and the mainland vary by season and weather conditions. During typhoon season (June–November), sailings may be suspended. The most common route is the Dalahican–Balanacan crossing, which takes approximately 3–4 hours by RoRo ferry. Fares typically range from ₱200–₱400 for passengers.</p>
                <p>This page shows community-reported port status updates in real time. Residents report sailing conditions, delays, and cancellations as they happen — making this the most reliable source for current Marinduque ferry information.</p>
            </SeoTextBlock>
        </>
    );
}
