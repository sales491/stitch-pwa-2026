'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { Event } from '@/utils/eventData';
import PageHeader from '@/components/PageHeader';

export default function MonthlyCalendarPage() {
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('events')
        .select('*');

      if (data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [supabase]);

  const goToPrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });

  const isEventOnDay = (event: Event, day: number) => {
    const eventStart = new Date(event.event_date);
    eventStart.setHours(0, 0, 0, 0);

    const eventEnd = event.event_date_end ? new Date(event.event_date_end) : eventStart;
    eventEnd.setHours(23, 59, 59, 999);

    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate >= eventStart && checkDate <= eventEnd;
  };

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center pb-20">
      <PageHeader
        title="Full Calendar"
        rightAction={
          <div className="flex items-center gap-2">
            <button onClick={goToPrevMonth} className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:text-moriones-red transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest min-w-[90px] text-center">{monthLabel}</span>
            <button onClick={goToNextMonth} className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:text-moriones-red transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        }
      />

      <main className="w-full max-w-4xl p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-xl">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="bg-slate-50 dark:bg-zinc-900 py-3 text-center text-[10px] font-black text-slate-400 tracking-widest">{day}</div>
          ))}
          {days.map((day, i) => {
            const dayEvents = day ? events.filter(e => isEventOnDay(e, day)) : [];
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

            return (
              <div key={i} className={`min-h-[100px] sm:min-h-[140px] p-2 flex flex-col bg-white dark:bg-zinc-900 transition-colors ${!day ? 'bg-slate-50/50 dark:bg-zinc-900/50' : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'}`}>
                {day && (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-moriones-red text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {dayEvents.map(event => (
                        <Link 
                          key={event.id} 
                          href={`/events/${event.id}`}
                          className="px-1.5 py-0.5 rounded bg-moriones-red/10 border-l-2 border-moriones-red text-[9px] font-bold text-moriones-red truncate hover:bg-moriones-red/20 transition-colors"
                          title={event.title}
                        >
                          {event.title}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-moriones-red">event_note</span>
            Monthly Highlights
          </h2>
          <div className="space-y-4">
            {events.filter(e => new Date(e.event_date).getMonth() === currentMonth).slice(0, 5).map(event => (
               <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
                    <img src={event.image || '/images/hub/event_placeholder.jpg'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-moriones-red transition-colors">{event.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{new Date(event.event_date).toLocaleDateString()} • {event.town}</p>
                  </div>
               </Link>
            ))}
          </div>
        </div>
      </main>

      <Link 
        href="/events/create"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-moriones-red text-white px-6 py-4 rounded-full shadow-2xl shadow-moriones-red/40 text-sm font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-red-600 z-50"
      >
        <span className="material-symbols-outlined">calendar_add_on</span>
        Create Event
      </Link>
    </div>
  );
}
