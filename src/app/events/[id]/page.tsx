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

    // Format date
    const displayDate = new Date(event.event_date).toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Format time: "08:00:00" → "8:00 AM"
    const formatTime = (t: string | null): string => {
        if (!t) return 'Oras ay TBD';
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    };
    const displayTime = formatTime(event.event_time ?? null);

    // Role labels
    const ROLE_LABELS: Record<string, string> = {
        organizer: '🎯 Organizer',
        community_poster: '📢 Community Poster',
        barangay_rep: '🏛️ Barangay/LGU Rep',
        event_reporter: '📰 Event Reporter',
    };
    const posterRoleLabel = ROLE_LABELS[event.poster_role ?? 'organizer'] ?? '📢 Community Poster';

    // Render description, converting URLs to styled link buttons
    const URL_REGEX = /(https?:\/\/[^\s]+)/g;
    const renderDescription = (text: string) => {
        const parts = text.split(URL_REGEX);
        return parts.map((part, i) => {
            if (/^https?:\/\//.test(part)) {
                let domain = part;
                try { domain = new URL(part).hostname.replace('www.', ''); } catch { /* noop */ }
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-xl px-3 py-1.5 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors my-1"
                    >
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        {domain}
                    </a>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">
            {/* JSON-LD for Google Rich Results */}
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

            {/* Hero Banner */}
            <div className="w-full h-72 md:h-[480px] relative overflow-hidden rounded-b-[3rem] shadow-2xl">
                {event.image ? (
                    <Image src={event.image} alt={event.title} fill className="object-cover" priority />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-tr from-red-700 via-red-500 to-orange-400 text-white font-black p-8 text-center">
                        <span className="material-symbols-outlined text-8xl opacity-20 mb-4">celebration</span>
                        <h1 className="text-3xl md:text-6xl tracking-tighter max-w-2xl">{event.title}</h1>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-5 left-5 z-20">
                    <Link href="/events" className="w-11 h-11 flex items-center justify-center bg-black/30 backdrop-blur-xl rounded-2xl text-white hover:bg-black/50 transition-all border border-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </div>

                {/* Desktop hero text overlay */}
                <div className="absolute bottom-8 left-8 right-8 z-20 hidden md:block">
                    <span className="bg-moriones-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl mb-3 inline-block">
                        {event.category}
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">{event.title}</h1>
                    <div className="flex flex-wrap items-center gap-5 text-white/80 font-semibold text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-red-300">calendar_today</span>
                            {displayDate}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-red-300">schedule</span>
                            {displayTime}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-red-300">location_on</span>
                            {event.location}, {event.town}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Mobile info card (hidden on desktop) */}
                        <div className="md:hidden bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-zinc-800 space-y-5">
                            <div className="flex items-start justify-between">
                                <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl inline-block">
                                    {event.category}
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">{event.title}</h1>
                            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-zinc-300">
                                    <span className="material-symbols-outlined text-moriones-red text-[20px]">calendar_today</span>
                                    <span className="text-sm font-semibold">{displayDate}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-zinc-300">
                                    <span className="material-symbols-outlined text-moriones-red text-[20px]">schedule</span>
                                    <span className="text-sm font-semibold">{displayTime}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-zinc-300">
                                    <span className="material-symbols-outlined text-moriones-red text-[20px]">location_on</span>
                                    <span className="text-sm font-semibold">{event.location}, {event.town}</span>
                                </div>
                            </div>
                            <button className="w-full bg-moriones-red text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all text-sm tracking-wide">
                                ✓ Pupunta Ako!
                            </button>
                        </div>

                        {/* About this Event */}
                        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-7 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-moriones-red">info</span>
                                Tungkol sa Event
                            </h3>
                            <div className="text-slate-700 dark:text-zinc-300 text-base leading-relaxed font-medium space-y-4">
                                {event.description
                                    ? renderDescription(event.description)
                                    : <p className="text-slate-400 italic">Walang detalye pa. Mag-update na lang ang organizer.</p>
                                }
                            </div>
                        </section>

                        {/* Comments */}
                        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-7 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800">
                            <div className="mb-6">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mga Komento</h2>
                                <p className="text-xs text-slate-500 mt-1">Ibahagi ang iyong mga tanong o excitement!</p>
                            </div>
                            <UniversalComments entityId={event.id} entityType="event" />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="sticky top-6 space-y-5">

                            {/* Event Details (Desktop only) */}
                            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-zinc-800">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px] text-moriones-red">event</span>
                                    Detalye ng Event
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-moriones-red text-[22px] mt-0.5 flex-shrink-0">calendar_today</span>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Petsa at Oras</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{displayDate}</p>
                                            <p className="text-sm font-bold text-moriones-red mt-0.5">{displayTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-moriones-red text-[22px] mt-0.5 flex-shrink-0">location_on</span>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lugar</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{event.location}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{event.town}, Marinduque</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-moriones-red text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all text-sm tracking-wide mt-8">
                                    ✓ Pupunta Ako!
                                </button>
                            </div>

                            {/* Poster Card */}
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nag-post</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative flex-shrink-0 shadow-inner border border-slate-200 dark:border-zinc-700">
                                        {event.author?.avatar_url ? (
                                            <Image src={event.author.avatar_url} alt="Poster" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-2xl font-black">
                                                {event.author?.full_name?.charAt(0) ?? 'M'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                            {event.author?.full_name ?? 'Miyembro ng Komunidad'}
                                        </p>
                                        <span className="inline-block mt-2 text-[10px] font-black text-moriones-red bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-800/30">
                                            {posterRoleLabel}
                                        </span>
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
