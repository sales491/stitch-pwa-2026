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

    let initialEvents: any[] = [];
    if (data) {
      initialEvents = data.map((e) => ({
        ...e,
        fullDate: e.full_date,
        dayOfMonth: e.day_of_month,
        description: e.description || 'Join us for this local event in Marinduque!',
        // Use a stable "random" number based on ID length + day to avoid 'impure function' lint error
        attendees: e.attendees || ((e.id.length * 7) % 50) + 10,
        image: e.image || '/images/hub/event_placeholder.jpg',
        category: e.category || 'Community'
      }));
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    {
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: metadata.openGraph?.title || 'Events in Marinduque',
                        description: metadata.openGraph?.description || 'Discover local events, fiestas, and festivals happening across Marinduque island.',
                        url: 'https://marinduquemarket.com/events'
                    },
                    ...initialEvents.map((event: any) => ({
                        '@context': 'https://schema.org',
                        '@type': 'Event',
                        name: event.title,
                        description: event.description,
                        startDate: event.fullDate,
                        location: {
                            '@type': 'Place',
                            name: event.location,
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: event.location,
                                addressRegion: 'Marinduque',
                                addressCountry: 'PH'
                            }
                        },
                        image: `https://marinduquemarket.com${event.image}`,
                        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                        eventStatus: 'https://schema.org/EventScheduled'
                    }))
                ]) }}
            />
            <MarinduqueEventsCalendar initialEvents={initialEvents} />
        </>
    );
}
