import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import CommuterDeliveryHub from '@/components/CommuterDeliveryHub';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Commute & Delivery — Marinduque',
    description: 'Find local commute and delivery services in Marinduque. Book tricycles, multicabs, jeepneys, and delivery riders across Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['commute Marinduque', 'delivery Marinduque', 'tricycle hire Boac', 'local delivery Philippines', 'Marinduque transport'],
    openGraph: {
        title: 'Commute & Delivery — Marinduque',
        description: 'Find local transport and delivery services across Marinduque island.',
        url: 'https://marinduquemarket.com/commute',
    },
    alternates: hreflangAlternates('/commute'),
};

import { createClient } from '@/utils/supabase/server';

export const revalidate = 60; // Cache for 60 seconds

export default async function CommuteBoard() {
    const supabase = await createClient();

    // Fetch services for SSR
    const { data: services } = await supabase
        .from('transport_services')
        .select(`
            *,
            provider:profiles!transport_services_provider_id_fkey(trust_score, is_verified, phone)
        `);

    // Fetch vouch counts for SSR
    const { data: vouchesCount } = await supabase
        .from('transport_vouches')
        .select('service_id');

    const countsByService: Record<string, number> = {};
    vouchesCount?.forEach(v => {
        countsByService[v.service_id] = (countsByService[v.service_id] || 0) + 1;
    });

    let initialOperators: any[] = [];
    if (services) {
        initialOperators = services.map((d: any) => ({
            id: d.id,
            name: `${d.vehicle_type}: ${d.base_town}`,
            operator: d.driver_name,
            vehicleType: d.vehicle_type,
            serviceType: d.service_type,
            towns: d.towns_covered || [d.base_town],
            price: '0',
            vouchCount: countsByService[d.id] || 0,
            hasVouched: false, // Rehydrated on client
            available: d.is_available,
            phone: d.contact_number || d.provider?.phone || '',
            img: d.images?.[0] || '',
            images: d.images,
            provider_id: d.provider_id,
            route: d.route,
            schedule: d.schedule,
            charterAvail: d.charter_avail,
            fb: d.contact_details?.fb_username,
            email: d.contact_details?.email
        })).sort((a, b) => {
            if (a.available !== b.available) return a.available ? -1 : 1;
            return b.vouchCount - a.vouchCount;
        });
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'TransportationService',
                    name: metadata.openGraph?.title || 'Commute & Delivery — Marinduque',
                    description: metadata.openGraph?.description || 'Find local transport and delivery services across Marinduque island.',
                    url: 'https://marinduquemarket.com/commute',
                    areaServed: {
                        '@type': 'AdministrativeArea',
                        name: 'Marinduque'
                    }
                }) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                        {
                            '@type': 'Question',
                            name: 'Are there ride-hailing apps like Grab or JoyRide in Marinduque?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'No, there are no ride-hailing apps like Grab, Angkas, or JoyRide in Marinduque. Getting around the island is mainly done by tricycle or jeepney.'
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'How much is the tricycle fare in Marinduque?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Tricycle fares within town centers typically range from ₱20 to ₱50. For inter-town trips, it may cost ₱100 to ₱300 depending on the distance and negotiation.'
                            }
                        }
                    ]
                }) }}
            />
            <CommuterDeliveryHub initialOperators={initialOperators} />
            <SeoTextBlock heading="Getting Around Marinduque Island">
                <div className="bg-slate-100 dark:bg-zinc-800 p-4 border-l-4 border-slate-500 mb-6 rounded-r-xl">
                    <p className="font-bold mb-0">TL;DR: How to Get Around</p>
                    <p className="mb-0">Getting around Marinduque is mainly done by tricycle or jeepney, as there are no ride-hailing apps like Grab. Fares start at ₱20 for short trips within town, while inter-town trips cost ₱100-₱300. Use this directory to book local drivers directly.</p>
                </div>
                <p>Marinduque is a small, heart-shaped island in the MIMAROPA region of the Philippines. Getting around the island is mainly done by <strong>tricycle</strong> (the primary mode of local transport) and <strong>jeepney</strong> or multicab for longer inter-town routes. There are no ride-hailing apps like Grab on the island — you flag down or book tricycles directly.</p>
                <p>The six municipalities of Marinduque — <strong>Boac</strong> (the capital), <strong>Mogpog</strong>, <strong>Gasan</strong>, <strong>Santa Cruz</strong>, <strong>Torrijos</strong>, and <strong>Buenavista</strong> — are connected by a single circumferential road. A full loop around the island takes about 2–3 hours by motorcycle. Tricycle fares within town centers typically range from ₱20–₱50, while inter-town trips may cost ₱100–₱300.</p>
                <p>This page connects you with local commute operators and delivery riders who service different parts of the island. You can find tricycle drivers available for hire, delivery services for packages and parcels, and shared transport options for daily commuters.</p>
            </SeoTextBlock>
        </>
    );
}
