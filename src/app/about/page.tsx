import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
    title: 'About — Marinduque Market Hub',
    description: 'Learn about Marinduque Market Hub — the digital community platform built for the people of Marinduque island, Philippines. Our mission, team, and how we serve the community.',
    keywords: ['about Marinduque Market Hub', 'Marinduque community platform', 'Marinduque digital hub', 'Marinduque online marketplace', 'bayanihan Marinduque', 'Marinduque tech'],
    openGraph: {
        title: 'About — Marinduque Market Hub',
        description: 'The digital community hub for the people of Marinduque island — buy & sell locally, find jobs, discover island hopping tours, and stay connected.',
        url: 'https://marinduquemarket.com/about',
    },
    alternates: hreflangAlternates('/about'),
};

export default function AboutPage() {
    return <AboutContent />;
}
