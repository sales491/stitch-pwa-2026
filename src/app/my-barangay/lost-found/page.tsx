import type { Metadata } from 'next';
import { getLostFoundPosts } from '@/app/actions/lost-found';
import LostFoundFeed from '@/components/LostFoundFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Lost & Found — Marinduque',
    description: 'Report and find lost items, animals, documents, and IDs across Marinduque island. Community-powered lost and found board to help reunite locals with their belongings.',
    keywords: ['lost and found Marinduque', 'lost pet Philippines', 'lost ID Marinduque', 'missing items Boac', 'found items Marinduque'],
    openGraph: {
        title: 'Lost & Found — Marinduque',
        description: 'Community board for lost and found items across Marinduque island.',
    },
    alternates: { canonical: 'https://marinduquemarket.com/my-barangay/lost-found' },
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
