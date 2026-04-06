import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import HelpCommunityGuidelines from '@/components/HelpCommunityGuidelines';

export const metadata: Metadata = {
    title: 'Community Guidelines',
    description: 'Marinduque Market Hub community guidelines — rules for respectful, safe, and bayanihan-spirited participation. How to post, report, and connect with your Marinduque community.',
    keywords: ['Marinduque community rules', 'how to post Marinduque Market', 'bayanihan community guidelines', 'marketplace safety Philippines'],
    openGraph: {
        title: 'Community Guidelines — Marinduque Market Hub',
        description: 'Rules for respectful, safe, and community-spirited participation on Marinduque Market Hub.',
        url: 'https://marinduquemarket.com/help-community-guidelines',
    },
    alternates: hreflangAlternates('/help-community-guidelines'),
};

export default function Page() {
  return <HelpCommunityGuidelines />;
}
