import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE, TAGALOG_KEYWORDS_JOBS } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import { getSkillListings } from '@/app/actions/skills';
import SkillsDisplay from '@/components/SkillsDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Skills Exchange — Find Local Skills',
    description: 'Community-powered skills directory for Marinduque. Find locals offering teaching, repairs, crafts, food, tech, health services, and more. 60-day listings.',
    keywords: ['skills exchange Marinduque', 'local skills Philippines', 'freelance Marinduque', 'tutoring Boac', 'repairs Marinduque', 'crafts Marinduque', ...TAGALOG_KEYWORDS_ISLAND_LIFE, ...TAGALOG_KEYWORDS_JOBS],
    openGraph: {
        title: 'Skills Exchange — Marinduque',
        description: 'Find locals offering teaching, repairs, crafts, and services across Marinduque.',
        url: 'https://marinduquemarket.com/island-life/skills',
    },
    alternates: hreflangAlternates('/island-life/skills'),
};

export const revalidate = 300;

export default async function SkillsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialListings = await getSkillListings('Boac');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Skills Exchange" subtitle="Island Life" emoji="🛠️" />

            <SkillsDisplay
                initialListings={initialListings}
                currentUserId={user?.id}
                isLoggedIn={!!user}
            />
        </main>
    );
}
