import type { Metadata } from 'next';
import CommuterDeliveryHub from '@/components/CommuterDeliveryHub';

export const metadata: Metadata = {
    title: 'Commuter & Delivery Hub — Marinduque',
    description: 'Complete transport and delivery guide for Marinduque. Find tricycles, multicabs, delivery riders, and commuter operators serving all municipalities across the island.',
    keywords: ['commuter hub Marinduque', 'delivery hub Philippines', 'Marinduque transport guide', 'tricycle fare Boac', 'delivery services Marinduque'],
    openGraph: {
        title: 'Commuter & Delivery Hub — Marinduque',
        description: 'Transport and delivery services hub for Marinduque island.',
        url: 'https://marinduquemarket.com/commuter-delivery-hub',
    },
    alternates: { canonical: 'https://marinduquemarket.com/commuter-delivery-hub' },
};

export default function Page() {
  return <CommuterDeliveryHub />;
}
