import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_EVENTS } from '@/utils/seo';
import MarinduqueEventsCalendar from '@/components/MarinduqueEventsCalendar';

export const metadata: Metadata = {
    title: 'Events in Marinduque',
    description: 'Discover upcoming festivals, fiestas, at mga kaganapan sa Marinduque — from the Moriones Festival to barangay fiestas. Huwag palampasin ang mga lokal na celebrations.',
    keywords: ['Marinduque events', 'Moriones Festival', 'barangay fiesta Marinduque', 'local events Philippines', 'Marinduque festival calendar', ...TAGALOG_KEYWORDS_EVENTS],
    openGraph: {
        title: 'Events in Marinduque',
        description: 'Discover local events, fiestas, and festivals happening across Marinduque island.',
        url: 'https://marinduquemarket.com/events',
    },
    alternates: hreflangAlternates('/events'),
};

import { createClient } from '@/utils/supabase/server';

export default async function EventsPage() {
    const supabase = await createClient();
    const { data } = await supabase
      .from('events')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `);

    let initialEvents = [];
    if (data) {
      initialEvents = data.map((e: any) => ({
        ...e,
        fullDate: e.full_date,
        dayOfMonth: e.day_of_month,
        description: e.description || 'Join us for this local event in Marinduque!',
        attendees: e.attendees || Math.floor(Math.random() * 50) + 10,
        image: e.image || '/images/hub/event_placeholder.jpg',
        category: e.category || 'Community'
      }));
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Events in Marinduque',
                    description: metadata.openGraph?.description || 'Discover local events, fiestas, and festivals happening across Marinduque island.',
                    url: 'https://marinduquemarket.com/events'
                }) }}
            />
            <MarinduqueEventsCalendar initialEvents={initialEvents} />
        </>
    );
}
