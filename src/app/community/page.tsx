import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_COMMUNITY } from '@/utils/seo';
import CommunityBoardCommuterHub from '@/components/CommunityBoardCommuterHub';
import { getCommunityPosts } from '@/app/actions/community';

export const metadata: Metadata = {
    title: 'Community Board — Marinduque',
    description: 'I-share ang mga balita, magtanong, at kumonekta sa inyong komunidad sa Marinduque. The community board for Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['Marinduque community', 'Marinduque forum', 'local community board Philippines', 'Marinduque locals', 'barangay posts', ...TAGALOG_KEYWORDS_COMMUNITY],
    openGraph: {
        title: 'Community Board — Marinduque',
        description: 'Connect with your local Marinduque community. Share posts, ask questions, and stay informed.',
        url: 'https://marinduquemarket.com/community',
    },
    alternates: hreflangAlternates('/community'),
};

export const revalidate = 60; // Cache for 60 seconds

export default async function CommunityFeedPage() {
    const initialPosts = await getCommunityPosts('All Towns', 'all', 0);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: metadata.openGraph?.title || 'Community Board — Marinduque',
                    description: metadata.openGraph?.description || 'Connect with your local Marinduque community. Share posts, ask questions, and stay informed.',
                    url: 'https://marinduquemarket.com/community'
                }) }}
            />
            <CommunityBoardCommuterHub initialPosts={initialPosts} />
        </>
    );
}
