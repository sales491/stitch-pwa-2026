import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_BARANGAY } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import { getCalamityAlerts } from '@/app/actions/calamity';
import CalamityFeed from '@/components/CalamityFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Calamity Board — Emergency Alerts Marinduque',
    description: 'Mga babala at emergency alerts para sa Marinduque island — bagyo, baha, lindol, at iba pang kalamidad. Community-powered alerts mula sa mga lokal na residente.',
    keywords: ['typhoon Marinduque', 'flood alert Philippines', 'calamity board Marinduque', 'emergency alerts Philippines', 'NDRRMC Marinduque', ...TAGALOG_KEYWORDS_BARANGAY],
    openGraph: {
        title: 'Calamity Board — Marinduque Emergency Alerts',
        description: 'Community calamity alerts: typhoons, floods, and emergencies in Marinduque.',
    },
    alternates: hreflangAlternates('/my-barangay/calamity'),
};

export const dynamic = 'force-dynamic';

export default async function CalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialAlerts = await getCalamityAlerts({ status: 'active', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: metadata.openGraph?.title || 'Calamity Board — Marinduque Emergency Alerts',
                    description: metadata.openGraph?.description || 'Community calamity alerts: typhoons, floods, and emergencies in Marinduque.',
                    url: 'https://marinduquemarket.com/my-barangay/calamity'
                }) }}
            />
            <PageHeader title="Calamity Board" subtitle="My Barangay" emoji="🚨" />

            <CalamityFeed initialAlerts={initialAlerts} userId={user?.id ?? null} />
        </main>
    );
}
