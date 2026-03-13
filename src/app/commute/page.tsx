import type { Metadata } from 'next';
import CommuterDeliveryHub from '@/components/CommuterDeliveryHub';

export const metadata: Metadata = {
    title: 'Commute & Delivery — Marinduque',
    description: 'Find local commute and delivery services in Marinduque. Book tricycles, multicabs, jeepneys, and delivery riders across Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['commute Marinduque', 'delivery Marinduque', 'tricycle hire Boac', 'local delivery Philippines', 'Marinduque transport'],
    openGraph: {
        title: 'Commute & Delivery — Marinduque',
        description: 'Find local transport and delivery services across Marinduque island.',
        url: 'https://marinduquemarket.com/commute',
    },
    alternates: { canonical: 'https://marinduquemarket.com/commute' },
};

export default function CommuteBoard() {
    return <CommuterDeliveryHub />;
}
