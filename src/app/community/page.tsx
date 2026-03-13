import type { Metadata } from 'next';
import CommunityBoardCommuterHub from '@/components/CommunityBoardCommuterHub';

export const metadata: Metadata = {
    title: 'Community Board — Marinduque',
    description: 'The Marinduque community board — share posts, ask questions, and connect with locals across Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['Marinduque community', 'Marinduque forum', 'local community board Philippines', 'Marinduque locals', 'barangay posts'],
    openGraph: {
        title: 'Community Board — Marinduque',
        description: 'Connect with your local Marinduque community. Share posts, ask questions, and stay informed.',
        url: 'https://marinduquemarket.com/community',
    },
    alternates: { canonical: 'https://marinduquemarket.com/community' },
};

export default function CommunityFeedPage() {
    return <CommunityBoardCommuterHub />;
}
