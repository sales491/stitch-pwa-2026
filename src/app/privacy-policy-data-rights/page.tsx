import type { Metadata } from 'next';
import PrivacyPolicyDataRights from '@/components/PrivacyPolicyDataRights';

export const metadata: Metadata = {
    title: 'Privacy Policy & Data Rights',
    description: 'Marinduque Market Hub Privacy Policy — how we collect, store, and protect your data. Your rights under the Philippines Data Privacy Act of 2012 (RA 10173).',
    keywords: ['privacy policy Philippines', 'data rights RA 10173', 'Marinduque Market Hub privacy', 'data protection Philippines'],
    openGraph: {
        title: 'Privacy Policy & Data Rights — Marinduque Market Hub',
        description: 'How your data is collected, stored, and protected on Marinduque Market Hub.',
        url: 'https://marinduquemarket.com/privacy-policy-data-rights',
    },
    alternates: { canonical: 'https://marinduquemarket.com/privacy-policy-data-rights' },
};

export default function Page() {
  return <PrivacyPolicyDataRights />;
}
