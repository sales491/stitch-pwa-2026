import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_BARANGAY } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import { getCalamityAlerts } from '@/app/actions/calamity';
import CalamityFeed from '@/components/CalamityFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Mga Abiso — Emergency Alerts Marinduque',
    description: 'Mga babala at emergency alerts para sa Marinduque island — bagyo, baha, lindol, at iba pang kalamidad. Community-powered alerts mula sa mga lokal na residente.',
    keywords: ['typhoon Marinduque', 'flood alert Philippines', 'mga abiso Marinduque', 'emergency alerts Philippines', 'NDRRMC Marinduque', ...TAGALOG_KEYWORDS_BARANGAY],
    openGraph: {
        title: 'Mga Abiso — Marinduque Emergency Alerts',
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        name: metadata.openGraph?.title || 'Mga Abiso — Marinduque Emergency Alerts',
                        description: metadata.openGraph?.description || 'Community calamity alerts: typhoons, floods, and emergencies in Marinduque.',
                        url: 'https://marinduquemarket.com/my-barangay/calamity'
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Dataset',
                        name: 'Marinduque Local Government Announcements and Emergency Alerts',
                        description: 'Real-time and community-reported emergency alerts, weather warnings, and local government announcements for Marinduque province.',
                        url: 'https://marinduquemarket.com/my-barangay/calamity',
                        creator: {
                            '@type': 'Organization',
                            name: 'Marinduque Market Hub Community'
                        },
                        spatialCoverage: {
                            '@type': 'Place',
                            name: 'Marinduque',
                            address: {
                                '@type': 'PostalAddress',
                                addressRegion: 'Marinduque',
                                addressCountry: 'PH'
                            }
                        }
                    }
                ]) }}
            />
            <PageHeader title="Mga Abiso" subtitle="My Barangay" emoji="🚨" />

            <CalamityFeed initialAlerts={initialAlerts} userId={user?.id ?? null} />
        </main>
    );
}
