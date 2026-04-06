import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_BARANGAY } from '@/utils/seo';
import { getLostFoundPosts } from '@/app/actions/lost-found';
import LostFoundFeed from '@/components/LostFoundFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Lost & Found — Marinduque',
    description: 'Nawala o natagpuan? I-post ang inyong lost and found items sa Marinduque — animals, documents, IDs, at iba pa. Community board para matulungan ang kapwa Marinduqueno.',
    keywords: ['lost and found Marinduque', 'lost pet Philippines', 'lost ID Marinduque', 'missing items Boac', 'found items Marinduque', ...TAGALOG_KEYWORDS_BARANGAY],
    openGraph: {
        title: 'Lost & Found — Marinduque',
        description: 'Community board for lost and found items across Marinduque island.',
    },
    alternates: hreflangAlternates('/my-barangay/lost-found'),
};

export const dynamic = 'force-dynamic';

export default async function LostFoundPage() {
    const initialPosts = await getLostFoundPosts({ status: 'open', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Lost & Found" subtitle="My Barangay" emoji="🔍" />

            {/* Feed */}
            <LostFoundFeed initialPosts={initialPosts} />
        </main>
    );
}
