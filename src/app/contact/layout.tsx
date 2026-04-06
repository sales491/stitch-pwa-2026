import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Marinduque Market Hub — send us questions, report concerns, request account deletion, or submit privacy inquiries. We respond to all messages.',
    keywords: ['contact Marinduque Market Hub', 'support Marinduque', 'data privacy request Philippines', 'report listing Marinduque'],
    openGraph: {
        title: 'Contact Marinduque Market Hub',
        description: 'Reach out for support, privacy requests, or general inquiries.',
        url: 'https://marinduquemarket.com/contact',
    },
    alternates: hreflangAlternates('/contact'),
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
