import { createClient } from '@/utils/supabase/server';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default async function EventsFeed() {
    const supabase = await createClient();

    // Get today's date string (YYYY-MM-DD) for filtering
    const today = new Date().toISOString().split('T')[0];

    // Fetch UPCOMING events, closest first
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today) // Greater than or equal to today
        .order('event_date', { ascending: true }) // Closest dates at the top
        .order('event_time', { ascending: true });

    if (error) return <div className="p-8 text-moriones-red font-black text-center">Protocol Error: Community schedule systems offline.</div>;

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">

            {/* Visual Hub Header */}
            <div className="bg-gradient-to-br from-red-600 to-orange-500 dark:from-red-900/60 dark:to-orange-800/40 p-8 pt-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden mb-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-white text-3xl">calendar_month</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Local Events</h1>
                        </div>
                        <p className="text-red-100 font-bold opacity-90 max-w-sm leading-tight text-sm">
                            The pulse of Marinduque. Discover festivals, workshops, and community gatherings.
                        </p>
                    </div>

                    <Link href="/events/create" className="bg-white text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 active:scale-95 transition-transform flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Host Hub Event
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col gap-2">
                    {events?.map((event) => (
                        <EventCard
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.event_date}
                            time={event.event_time}
                            location={event.location}
                            town={event.town}
                            category={event.category}
                            authorId={event.author_id}
                        />
                    ))}

                    {events?.length === 0 && (
                        <div className="p-20 bg-white dark:bg-zinc-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                <span className="material-symbols-outlined text-4xl">event_busy</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Registry Silent</h3>
                            <p className="text-slate-500 font-bold max-w-xs text-sm">No upcoming events found in the intelligence registry. Check back soon for the next festival.</p>
                            <Link href="/events/create" className="mt-8 text-red-500 font-black text-xs uppercase tracking-widest hover:underline">
                                Initialize Community Plan &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
