'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Event } from '@/utils/eventData';

export default function MarinduqueEventsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (data) {
        const transformedEvents = data.map((e: any) => ({
          ...e,
          fullDate: e.full_date,
          dayOfMonth: e.day_of_month
        }));
        setEvents(transformedEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Generate next 7 days starting from today
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
    <>
      <div>
        <div className="relative min-h-screen flex flex-col pb-24">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-dark/90 backdrop-blur-md border-b border-neutral-light dark:border-neutral-dark/50 px-4 pt-12 pb-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link href="/marinduque-connect-home-feed" className="flex items-center justify-center size-10 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark/50 transition-colors">
                  <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">arrow_back</span>
                </Link>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>festival</span>
                <h1 className="text-xl font-bold tracking-tight">Marinduque Events</h1>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark/50 transition-colors">
                  <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">search</span>
                </button>
                <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark/50 transition-colors">
                  <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">notifications</span>
                </button>
              </div>
            </div>
            {/* Calendar Strip */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{currentMonth}</span>
                <Link href="/marinduque-monthly-calendar" className="flex items-center justify-center size-6 rounded-md bg-neutral-light dark:bg-neutral-dark/50 hover:bg-primary transition-colors hover:text-black group">
                  <span className="material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark group-hover:text-black">calendar_month</span>
                </Link>
              </div>
              <span className="text-xs font-medium text-primary">Today</span>
            </div>
            <div className="flex justify-between items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex flex-col items-center justify-center min-w-[48px] h-16 rounded-2xl transition-all ${selectedDate === day.date
                    ? 'bg-primary text-black shadow-sm'
                    : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                    }`}
                >
                  <span className={`text-xs font-medium ${selectedDate === day.date ? 'opacity-80' : ''}`}>{day.name}</span>
                  <span className={`text-lg font-bold ${selectedDate === day.date ? '' : 'text-text-primary-light dark:text-text-primary-dark'}`}>{day.date}</span>
                  {selectedDate === day.date && <div className="w-1 h-1 rounded-full bg-black mt-1" />}
                </button>
              ))}
            </div>
          </header>
          {/* Town Filter */}
          <div className="px-4 py-2.5 sticky top-[180px] z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm shadow-sm border-b border-neutral-light dark:border-neutral-dark/20 space-y-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedTown('All Towns')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-bold shadow-sm transition-all active:scale-95 text-center truncate ${selectedTown === 'All Towns' ? 'bg-primary text-black' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark'
                  }`}>
                All Towns
              </button>
              <button
                onClick={() => setSelectedTown('Boac')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Boac' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Boac
              </button>
              <button
                onClick={() => setSelectedTown('Mogpog')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Mogpog' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Mogpog
              </button>
              <button
                onClick={() => setSelectedTown('Gasan')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Gasan' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Gasan
              </button>
            </div>
            <div className="flex gap-1.5 px-4">
              <button
                onClick={() => setSelectedTown('Buenavista')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Buenavista' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Buenavista
              </button>
              <button
                onClick={() => setSelectedTown('Torrijos')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Torrijos' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Torrijos
              </button>
              <button
                onClick={() => setSelectedTown('Santa Cruz')}
                className={`flex-1 min-w-0 px-1 py-1 rounded-full text-[11px] font-medium transition-all text-center truncate ${selectedTown === 'Santa Cruz' ? 'bg-primary text-black font-bold' : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary'
                  }`}>
                Santa Cruz
              </button>
            </div>
          </div>
          {/* Event Feed */}
          <main className="px-4 flex flex-col gap-6">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 w-full bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (() => {
              const filteredEvents = events.filter((event: Event) =>
                (selectedTown === 'All Towns' || event.town === selectedTown) &&
                event.dayOfMonth === selectedDate
              );

              if (filteredEvents.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="material-symbols-outlined text-stone-300 dark:text-stone-700 text-6xl mb-4">event_busy</span>
                    <p className="text-stone-500 dark:text-stone-400 font-medium">No events scheduled for this day in {selectedTown}</p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-1">Try selecting another date or town</p>
                  </div>
                );
              }

              return filteredEvents.map((event, index) => {
                const isFeatured = index === 0;
                // Simple sync check for local user status
                const isUserGoing = typeof window !== 'undefined' && localStorage.getItem(`event_going_${event.id}`) === 'true';

                if (isFeatured) {
                  return (
                    <article key={event.id} className="group bg-white dark:bg-neutral-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-light dark:border-neutral-dark/50">
                      <Link href={`/event/${event.id}`}>
                        <div className="relative h-48 w-full">
                          <img alt={event.title} className="w-full h-full object-cover" src={event.image} />
                          {event.trending && (
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-primary text-sm">local_fire_department</span>
                              <span className="text-xs font-bold text-text-primary-light dark:text-white">Trending</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h2 className="text-lg font-bold text-text-primary-light dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{event.title}</h2>
                              <div className="flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                <span className="material-symbols-outlined text-base text-primary">location_on</span>
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded text-center whitespace-nowrap">{event.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark bg-neutral-light dark:bg-neutral-dark/80 px-2 py-0.5 rounded">{event.time}</span>
                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark bg-neutral-light dark:bg-neutral-dark/80 px-2 py-0.5 rounded">{event.category}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-neutral-light dark:border-neutral-dark/50 pt-3 mt-1">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((u) => (
                                <div key={u} className="w-7 h-7 rounded-full border-2 border-white dark:border-neutral-dark bg-slate-200 dark:bg-neutral-dark flex items-center justify-center overflow-hidden">
                                  <img src={`https://i.pravatar.cc/100?u=${event.id}${u}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {isUserGoing && (
                                <div className="w-7 h-7 rounded-full border-2 border-primary bg-primary flex items-center justify-center z-10">
                                  <span className="material-symbols-outlined text-[14px] text-black font-bold">check</span>
                                </div>
                              )}
                              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-neutral-dark bg-neutral-light dark:bg-neutral-dark/80 flex items-center justify-center text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark">+{event.attendees}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">{event.attendees} Going</p>
                              {isUserGoing && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px] fill-1">check_circle</span>You&apos;re Going</span>}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                }

                return (
                  <article key={event.id} className="bg-white dark:bg-neutral-dark rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow border border-neutral-light dark:border-neutral-dark/50 group">
                    <Link href={`/event/${event.id}`} className="flex gap-4 items-center">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                        <img alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={event.image} />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-wide">{event.town}</span>
                          <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{event.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-text-primary-light dark:text-white truncate mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2 truncate">{event.description}</p>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 text-xs font-bold ${isUserGoing ? 'text-emerald-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                            <span className={`material-symbols-outlined text-sm ${isUserGoing ? 'text-emerald-500 fill-1' : 'text-primary'}`}>{isUserGoing ? 'check_circle' : 'group'}</span>
                            <span>{isUserGoing ? "You&apos;re Going" : `${event.attendees} Going`}</span>
                          </div>
                          <div className="ml-auto text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-black transition-colors">
                            DETAILS
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              });
            })()}
          </main>
        </div>
        {/* Floating Action Button */}
        <Link href="/create-event-post-screen" className="fixed right-4 bottom-20 z-50 flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all max-w-md mx-auto">
          <span className="material-symbols-outlined text-black text-3xl">add</span>
        </Link>
      </div>
    </>
  );
}
