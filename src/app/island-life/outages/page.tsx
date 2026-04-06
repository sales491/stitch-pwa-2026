import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import { getOutageReports } from '@/app/actions/outages';
import OutageFeed from '@/components/OutageFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Outage Reports — Power & Water in Marinduque',
    description: 'Real-time community-reported power and water outages across Marinduque island. Report outages, track restoration, and get alerted when service returns in your area.',
    keywords: ['power outage Marinduque', 'water outage Philippines', 'MERALCO outage Marinduque', 'electricity outage Boac', 'community alerts Marinduque', ...TAGALOG_KEYWORDS_ISLAND_LIFE],
    openGraph: {
        title: 'Outage Reports — Marinduque',
        description: 'Live community-reported power and water outages across Marinduque island.',
        url: 'https://marinduquemarket.com/island-life/outages',
    },
    alternates: hreflangAlternates('/island-life/outages'),
};

export const dynamic = 'force-dynamic';

export default async function OutagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialReports = await getOutageReports({ status: 'active', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Live Power and Water Outages in Marinduque',
                    speakable: {
                        '@type': 'SpeakableSpecification',
                        cssSelector: ['#outage-reports-feed']
                    }
                })}}
            />
            <PageHeader title="Outage Reports" subtitle="Island Life" emoji="⚡" />

            <OutageFeed initialReports={initialReports} userId={user?.id ?? null} />
        </main>
    );
}
