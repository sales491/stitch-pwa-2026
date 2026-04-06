import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Marinduque Market Hub — the mobile-first community platform built for the people of Marinduque. Find jobs, buy and sell locally, discover island hopping, and stay connected.',
    keywords: ['about Marinduque Market Hub', 'community platform Marinduque', 'mobile app Marinduque Philippines'],
    openGraph: {
        title: 'About Marinduque Market Hub',
        description: 'A mobile-first community platform built for the people of Marinduque, Philippines.',
        url: 'https://marinduquemarket.com/about',
    },
    alternates: hreflangAlternates('/about'),
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
