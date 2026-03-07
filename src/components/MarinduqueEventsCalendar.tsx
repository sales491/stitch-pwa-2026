'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AdminActions from './AdminActions';
import type { Event } from '@/utils/eventData';

export default function MarinduqueEventsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTown, setSelectedTown] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `);

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedEvents = data.map((e: any) => ({
          ...e,
          fullDate: e.full_date,
          dayOfMonth: e.day_of_month,
          description: e.description || 'Join us for this local event in Marinduque!',
          attendees: e.attendees || Math.floor(Math.random() * 50) + 10,
          image: e.image || '/images/hub/event_placeholder.jpg',
          category: e.category || 'Community'
        }));
        setEvents(transformedEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [supabase]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d
    };
  });

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Link href="/marinduque-connect-home-feed" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">arrow_back</span>
            </Link>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red">Events Calendar</h1>
          </div>

          <Link href="/marinduque-events-calendar" className="text-[9px] font-black text-moriones-red/60 hover:text-moriones-red uppercase tracking-[0.2em] transition-all border-b border-moriones-red/20 pb-0.5">
            Next 7 Days
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-text-main dark:text-text-main-dark">{currentMonth}</span>
            <Link href="/marinduque-monthly-calendar" className="text-moriones-red hover:bg-moriones-red/10 p-1 rounded-lg transition-colors flex items-center justify-center border border-moriones-red/10">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </Link>
          </div>
        </div>

        {/* Calendar Strip */}
        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex flex-col items-center justify-center min-w-[54px] h-16 rounded-2xl transition-all shadow-sm border ${selectedDate === day.date
                  ? 'bg-moriones-red border-moriones-red text-white'
                  : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark hover:border-moriones-red/50'
                  }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{day.name}</span>
                <span className="text-lg font-black">{day.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Town Filter - Horizontal Scroll */}
        <div className="flex justify-between gap-1 px-3 pb-4">
          {['All', 'Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'].map((town) => (
            <button
              key={town}
              onClick={() => setSelectedTown(town)}
              className={`flex-1 text-center rounded-lg border px-0.5 py-1.5 text-[9px] font-black uppercase tracking-tighter transition-all shadow-sm ${selectedTown === town
                ? 'bg-moriones-red border-moriones-red text-white'
                : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-main dark:text-text-main-dark hover:border-moriones-red/50'
                }`}
            >
              {town}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-light/50 dark:bg-background-dark/50 px-4 py-5 space-y-6 pb-28">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 w-full bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl border border-border-light dark:border-border-dark" />
            ))}
          </div>
        ) : (() => {
          const filteredEvents = events.filter((event: Event) =>
            (selectedTown === 'All' || event.town === selectedTown) &&
            event.dayOfMonth === selectedDate
          );

          if (filteredEvents.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-[64px] text-text-muted/20 mb-4">event_busy</span>
                <p className="text-text-main font-black">No events scheduled</p>
                <p className="text-xs text-text-muted mt-1">Try another date or town</p>
              </div>
            );
          }

          return filteredEvents.map((event, index) => {
            const isFeatured = index === 0;

            if (isFeatured) {
              return (
                <article key={event.id} className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-md hover:shadow-xl transition-all active:scale-[0.99]">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={event.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-moriones-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">Featured</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20">{event.category}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <AdminActions contentType="event" contentId={event.id} authorId={event.author_id} className="scale-90" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-xl font-black leading-tight group-hover:text-moriones-red transition-colors">{event.title}</h2>
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-white/80">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-moriones-red">location_on</span>
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-moriones-red">schedule</span>
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between border-t border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((u) => (
                        <div key={u} className="w-8 h-8 rounded-full border-2 border-surface-light dark:border-surface-dark bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?u=${event.id}${u}`} alt="User" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-surface-light dark:border-surface-dark bg-moriones-red flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                        +{event.attendees}
                      </div>
                    </div>
                    <Link href={`/event/${event.id}`} className="bg-moriones-red text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-moriones-red/20 active:scale-95 transition-all">
                      JOIN EVENT
                    </Link>
                  </div>
                </article>
              );
            }

            return (
              <article key={event.id} className="flex gap-4 p-3 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
                  <img alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={event.image} />
                  <div className="absolute bottom-0 right-0 p-1 bg-moriones-red text-white rounded-tl-lg">
                    <span className="material-symbols-outlined text-[14px]">event</span>
                  </div>
                  <div className="absolute top-1 left-1">
                    <AdminActions contentType="event" contentId={event.id} authorId={event.author_id} className="scale-75 origin-top-left" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-black text-moriones-red uppercase tracking-tight">{event.town} • {event.category}</span>
                  <Link href={`/event/${event.id}`} className="group-hover:underline">
                    <h3 className="text-base font-bold text-text-main leading-snug line-clamp-1">{event.title}</h3>
                  </Link>
                  <p className="text-xs font-medium text-text-muted mt-1 line-clamp-1">{event.time} at {event.location}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-moriones-red/80 uppercase">
                    <span className="material-symbols-outlined text-[12px] fill-1">group</span>
                    {event.attendees} participants
                  </div>
                </div>
                <div className="flex items-center">
                  <Link href={`/event/${event.id}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-background-dark text-moriones-red hover:bg-moriones-red hover:text-white transition-all border border-moriones-red/10">
                    <span className="material-symbols-outlined">trending_flat</span>
                  </Link>
                </div>
              </article>
            );
          });
        })()}
      </main>

      {/* FAB */}
      <div className="fixed bottom-10 left-0 right-0 z-50 max-w-md mx-auto px-6 pointer-events-none flex justify-end">
        <Link
          href="/events/create"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-moriones-red text-white shadow-lg shadow-moriones-red/40 transition-all hover:scale-110 active:scale-95 group pointer-events-auto"
          title="Create Event"
        >
          <span className="material-symbols-outlined text-[32px]">calendar_add_on</span>
        </Link>
      </div>
    </div>
  );
}
