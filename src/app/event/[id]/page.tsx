import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EventDetailPage from '@/components/EventDetailPage';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (!event || error) {
        return {
            title: 'Event Not Found | Marinduque Market Hub',
        };
    }

    return {
        title: `${event.title} - ${event.town} | Marinduque Events`,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: [event.image],
            url: `https://marinduque-connect.com/event/${event.id}`,
            siteName: 'Marinduque Market Hub',
            locale: 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description,
            images: [event.image],
        },
        keywords: [
            'Marinduque',
            'Events',
            event.town,
            event.category,
            event.title,
            'Marinduque Market Hub',
        ],
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: rawEvent, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (!rawEvent || error) {
        notFound();
    }

    const event = {
        ...rawEvent,
        fullDate: rawEvent.full_date,
        dayOfMonth: rawEvent.day_of_month
    };

    return <EventDetailPage event={event} />;
}
