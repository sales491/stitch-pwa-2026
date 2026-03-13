import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: event } = await supabase
        .from('events')
        .select('title, description, location, image, event_date, event_time, category')
        .eq('id', id)
        .single();

    if (!event) return { title: 'Event Not Found' };

    return {
        title: event.title,
        description: event.description?.slice(0, 155) ?? `${event.title} in ${event.location}, Marinduque.`,
        openGraph: {
            title: event.title,
            description: event.description?.slice(0, 155) ?? `Event in Marinduque.`,
            url: `https://marinduquemarket.com/events/${id}`,
            type: 'article',
            images: event.image ? [{ url: event.image, alt: event.title }] : undefined,
        },
        alternates: { canonical: `https://marinduquemarket.com/events/${id}` },
    };
}


export default async function EventDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select(`
            *,
            author:profiles(id, full_name, avatar_url, role)
        `)
        .eq('id', id)
        .single();

    if (error || !event) return notFound();

    // Format the date nicely for the big displays
    const displayDate = new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">
            {/* Event JSON-LD for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Event',
                    name: event.title,
                    description: event.description,
                    startDate: event.event_date + (event.event_time ? `T${event.event_time}` : ''),
                    eventStatus: 'https://schema.org/EventScheduled',
                    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                    location: {
                        '@type': 'Place',
                        name: event.location,
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: event.town,
                            addressRegion: 'MIMAROPA',
                            addressCountry: 'PH',
                        },
                    },
                    ...(event.image && { image: event.image }),
                    organizer: {
                        '@type': 'Organization',
                        name: 'Marinduque Market Hub',
                        url: 'https://marinduquemarket.com',
                    },
                }) }}
            />
            {/* 1. Immersive Hero Banner */}
            <div className="w-full h-64 md:h-[450px] relative overflow-hidden rounded-b-[4rem] shadow-2xl">
                {event.image ? (
                    <Image src={event.image} alt={event.title} fill className="object-cover" priority />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-tr from-red-600 via-red-500 to-orange-400 text-white font-black p-8 text-center">
                        <span className="material-symbols-outlined text-8xl opacity-20 mb-4">celebration</span>
                        <h1 className="text-3xl md:text-6xl tracking-tighter max-w-2xl">{event.title}</h1>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute top-6 left-6 z-20">
                    <Link href="/events" className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-20 hidden md:block">
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl mb-4 inline-block">
                        {event.category}
                    </span>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">{event.title}</h1>
                    <div className="flex items-center gap-6 text-white/80 font-bold text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {event.event_time || 'TBD'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -translate-y-12 md:translate-y-0 md:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Mobile Info Grid (Visible on small screens) */}
                        <div className="md:hidden bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-zinc-800 space-y-6">
                            <span className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl inline-block">
                                {event.category}
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{event.title}</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600 dark:text-zinc-400">
                                    <span className="material-symbols-outlined text-red-500">calendar_today</span>
                                    <span className="text-sm font-bold">{displayDate}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 dark:text-zinc-400">
                                    <span className="material-symbols-outlined text-red-500">schedule</span>
                                    <span className="text-sm font-bold">{event.event_time || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 dark:text-zinc-400">
                                    <span className="material-symbols-outlined text-red-500">location_on</span>
                                    <span className="text-sm font-bold">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">subject</span>
                                Protocol Description
                            </h3>
                            <div className="text-slate-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </section>

                        {/* Reaction Hub */}
                        <section>
                            <div className="mb-6 flex flex-col gap-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Event Intelligence Hub</h2>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Inquire about logistics or synchronize with other attendees.</p>
                            </div>
                            <UniversalComments entityId={event.id} entityType="event" />
                        </section>
                    </div>

                    {/* Sidebar / Host Area */}
                    <div className="space-y-6">
                        <div className="sticky top-24">
                            {/* Logistics Sidebar (Desktop) */}
                            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-zinc-800 mb-6 font-display">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-red-500">info</span>
                                    Mission Parameters
                                </h4>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporal Windows</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{displayDate}</p>
                                        <p className="text-[10px] font-bold text-red-500 mt-1">{event.event_time || 'Time TBD'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordinate Registry</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{event.location}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{event.town}</p>
                                    </div>
                                </div>

                                <button className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em] mt-10">
                                    Mark Attendance
                                </button>
                            </div>

                            {/* Host Profile */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Hub Organizer</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative shadow-inner border border-slate-50 dark:border-zinc-700">
                                        {event.author?.avatar_url ? (
                                            <Image src={event.author.avatar_url} alt="Host" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-2xl font-black">
                                                {event.author?.full_name?.charAt(0) || 'H'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{event.author?.full_name || 'Community Member'}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Organizer Authority</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
