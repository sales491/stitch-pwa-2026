'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AdminActions from './AdminActions';
import type { Event } from '@/utils/eventData';
import PageHeader from '@/components/PageHeader';

export default function MarinduqueEventsCalendar({ initialEvents }: { initialEvents: Event[] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTown, setSelectedTown] = useState('All');
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const goToPrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(1);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d
    };
  });

  // Helper to check if an event falls on a specific day
  const isEventOnDay = (event: Event, day: number) => {
    const eventStart = new Date(event.event_date);
    eventStart.setHours(0, 0, 0, 0);

    const eventEnd = event.event_date_end ? new Date(event.event_date_end) : eventStart;
    eventEnd.setHours(23, 59, 59, 999);

    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate >= eventStart && checkDate <= eventEnd;
  };

  // Build a set of day-of-month numbers that have at least one event this month
  const daysWithEvents = new Set(
    days.filter(d => events.some(e => isEventOnDay(e, d.date))).map(d => d.date)
  );

  const currentMonthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="relative flex w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <PageHeader
        title="Events Calendar"
        rightAction={
          <>
            <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark p-0.5">
              <button onClick={goToPrevMonth} className="p-1 hover:text-moriones-red transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="px-2 text-[10px] font-black uppercase tracking-wider text-text-main dark:text-text-main-dark">{currentMonthLabel}</span>
              <button onClick={goToNextMonth} className="p-1 hover:text-moriones-red transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
            <Link
              href="/marinduque-monthly-calendar"
              className="text-moriones-red hover:bg-moriones-red/10 p-1.5 rounded-lg transition-colors flex items-center justify-center border border-moriones-red/10"
              title="View full month grid"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </Link>
          </>
        }
      >
        {/* Calendar Strip — next 7 days */}
        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {days.map((day) => {
              const hasEvent = daysWithEvents.has(day.date);
              const isSelected = selectedDate === day.date;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`relative flex flex-col items-center justify-center min-w-[54px] h-16 rounded-2xl transition-all shadow-sm border ${isSelected
                    ? 'bg-moriones-red border-moriones-red text-white'
                    : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark hover:border-moriones-red/50'
                    }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{day.name}</span>
                  <span className="text-lg font-black">{day.date}</span>
                  {hasEvent && (
                    <span
                      className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-moriones-red'
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Town Filter */}
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
      </PageHeader>

      {/* Main Content */}
      <main className="flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-5 space-y-6 pb-28">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 w-full bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl border border-border-light dark:border-border-dark" />
            ))}
          </div>
        ) : (() => {
          const filteredEvents = events.filter((event: Event) =>
            (selectedTown === 'All' || event.town === selectedTown) &&
            isEventOnDay(event, selectedDate)
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
                <article key={event.id} className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-md hover:shadow-xl transition-all active:scale-[0.99] cursor-pointer">
                  {/* Invisible absolute link that makes the entire card clickable */}
                  <Link href={`/events/${event.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View Details for {event.title}</span>
                  </Link>

                  <div className="relative aspect-video w-full overflow-hidden">
                    <img alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={event.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                      <span className="px-3 py-1 bg-moriones-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">Featured</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20">{event.category}</span>
                    </div>
                    {/* Admin Actions elevated over the invisible link */}
                    <div className="absolute top-4 right-4 z-20">
                      <AdminActions contentType="event" contentId={event.id} authorId={event.author_id} className="scale-90" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
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
                  <div className="p-5 flex items-center justify-between border-t border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 pointer-events-none">
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
                    <div className="flex items-center gap-1 text-moriones-red text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article key={event.id} className="relative flex gap-4 p-3 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all group active:scale-[0.98] cursor-pointer">
                {/* Invisible absolute link that makes the entire card clickable */}
                <Link href={`/events/${event.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View Details for {event.title}</span>
                </Link>

                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
                  <img alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={event.image} />
                  <div className="absolute bottom-0 right-0 p-1 bg-moriones-red text-white rounded-tl-lg pointer-events-none">
                    <span className="material-symbols-outlined text-[14px]">event</span>
                  </div>
                </div>

                {/* Admin Actions elevated over the invisible link */}
                <div className="absolute top-4 left-4 z-20">
                  <AdminActions contentType="event" contentId={event.id} authorId={event.author_id} className="scale-75 origin-top-left" />
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0 pointer-events-none">
                  <span className="text-[10px] font-black text-moriones-red uppercase tracking-tight">{event.town} • {event.category}</span>
                  <h3 className="text-base font-bold text-text-main leading-snug line-clamp-1 group-hover:text-moriones-red transition-colors">{event.title}</h3>
                  <p className="text-xs font-medium text-text-muted mt-1 line-clamp-1">{event.time} at {event.location}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-moriones-red/80 uppercase">
                    <span className="material-symbols-outlined text-[12px] fill-1">group</span>
                    {event.attendees} participants
                  </div>
                </div>
                
                <div className="flex items-center pointer-events-none">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-background-dark text-moriones-red group-hover:bg-moriones-red group-hover:text-white transition-all border border-moriones-red/10 group-hover:translate-x-1">
                    <span className="material-symbols-outlined">trending_flat</span>
                  </div>
                </div>
              </article>
            );
          });
        })()}
      </main>

      {/* Create Event FAB */}
      <div className="fixed bottom-24 right-4 z-50">
        <Link
          href="/events/create"
          className="flex items-center gap-1.5 bg-moriones-red text-white px-3.5 py-2 rounded-full shadow-lg shadow-moriones-red/30 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-red-600"
        >
          <span className="material-symbols-outlined text-[13px]">calendar_add_on</span>
          Create Event
        </Link>
      </div>
    </div>
  );
}
