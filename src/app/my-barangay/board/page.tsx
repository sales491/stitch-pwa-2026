import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getBarangayPosts, getUserBarangay } from '@/app/actions/barangay-board';
import BarangayFeed from '@/components/BarangayFeed';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Barangay Board',
    description: 'Hyperlocal community posts visible only to your barangay in Marinduque. Share news, announcements, and updates with your immediate neighbors.',
    keywords: ['barangay Marinduque', 'community board Philippines', 'local community posts', 'hyperlocal Marinduque'],
    openGraph: {
        title: 'Barangay Board — Marinduque',
        description: 'Hyperlocal posts for your barangay community in Marinduque.',
    },
    alternates: { canonical: 'https://marinduquemarket.com/my-barangay/board' },
};

export const dynamic = 'force-dynamic';

export default async function BarangayBoardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Must be logged in
    if (!user) redirect('/login?next=/my-barangay/board');

    const { barangay, municipality } = await getUserBarangay();

    // User hasn't set their barangay yet — show gate screen
    if (!barangay || !municipality) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
                <PageHeader title="Barangay Board" subtitle="My Barangay" emoji="🏨️" />

                {/* Gate — prompt to set barangay */}
                <div className="flex flex-col items-center text-center px-6 pt-16 pb-8">
                    <span className="text-6xl mb-5">📍</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Set your barangay first</h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-6">
                        The Barangay Board shows posts only for your community. Add your barangay in your profile settings to unlock it.
                    </p>
                    <Link
                        href="/profile/edit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[14px] px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        Set My Barangay
                    </Link>
                </div>
            </main>
        );
    }

    const initialPosts = await getBarangayPosts(barangay, municipality, 0);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Barangay Board" subtitle="My Barangay" emoji="🏨️" />

            <BarangayFeed
                initialPosts={initialPosts}
                barangay={barangay}
                municipality={municipality}
                currentUserId={user.id}
            />
        </main>
    );
}
