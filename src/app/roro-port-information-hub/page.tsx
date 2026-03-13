import type { Metadata } from 'next';
import RoroPortInformationHub from '@/components/RoroPortInformationHub';

export const metadata: Metadata = {
    title: 'RoRo Port Information Hub — Marinduque',
    description: 'Complete RoRo ferry port information for Marinduque. Balanacan Port (Mogpog) and Buyabod Port (Santa Cruz) schedules, fares, operators, and live community updates.',
    keywords: ['RoRo port Marinduque', 'Balanacan Port schedule', 'Buyabod Port ferry', 'Marinduque ferry information', 'roll-on roll-off Philippines'],
    openGraph: {
        title: 'RoRo Port Information Hub — Marinduque',
        description: 'Complete ferry port guide for Marinduque — schedules, fares, and live updates.',
        url: 'https://marinduquemarket.com/roro-port-information-hub',
    },
    alternates: { canonical: 'https://marinduquemarket.com/roro-port-information-hub' },
};

export default function Page() {
  return <RoroPortInformationHub />;
}
