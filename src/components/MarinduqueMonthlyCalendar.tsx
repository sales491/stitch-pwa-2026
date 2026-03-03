'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface CalendarEvent {
    id: string;
    title: string;
    color: string;
}

export default function MarinduqueMonthlyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventsMap, setEventsMap] = useState<Record<number, CalendarEvent>>({});
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const fetchMonthEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('month', month);

            if (data) {
                const map: Record<number, CalendarEvent> = {};
                data.forEach((e: { id: string; title: string; day_of_month: number; category: string }) => {
                    const colors: Record<string, string> = {
                        'Cultural': 'bg-primary',
                        'Community': 'bg-blue-400',
                        'Sports': 'bg-emerald-400',
                        'Religious': 'bg-moriones-red',
                        'Entertainment': 'bg-purple-400'
                    };
                    map[e.day_of_month] = {
                        id: e.id,
                        title: e.title,
                        color: colors[e.category] || 'bg-slate-400'
                    };
                });
                setEventsMap(map);
            }
            setLoading(false);
        };

        fetchMonthEvents();
    }, [month]);

    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
        days.push(i);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date().getDate();
    const isThisMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-slate-50 dark:bg-zinc-950 overflow-x-hidden pb-10">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 pt-12 pb-4 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/marinduque-events-calendar" className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Full Calendar</h1>
                    <div className="size-10" /> {/* Spacer */}
                </div>

                <div className="flex items-center justify-between bg-slate-100/50 dark:bg-zinc-800/50 p-2 rounded-2xl">
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1))}
                        className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">chevron_left</span>
                    </button>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">{monthName}</h2>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1))}
                        className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">chevron_right</span>
                    </button>
                </div>
            </header>

            {/* Calendar Grid */}
            <main className="flex-1 px-4 py-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-xl border border-slate-200 dark:border-zinc-800">
                    <div className="grid grid-cols-7 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-2">
                        {days.map((day, idx) => {
                            const hasEvent = day && eventsMap[day];
                            const isToday = day === today && isThisMonth;

                            return (
                                <div key={idx} className="aspect-square flex flex-col items-center justify-center relative p-1">
                                    {day ? (
                                        <button className={`group relative w-full h-full flex flex-col items-center justify-center rounded-2xl transition-all ${isToday ? 'bg-primary text-black' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                                            }`}>
                                            <span className={`text-sm font-bold ${isToday ? '' : 'text-slate-700 dark:text-slate-200'}`}>{day}</span>
                                            {hasEvent && (
                                                <div className={`absolute bottom-2 w-1 h-1 rounded-full ${hasEvent.color} ${isToday ? 'bg-black' : ''}`} />
                                            )}

                                            {/* Tooltip-like event indicator on tap in real app, here we just show dots */}
                                        </button>
                                    ) : (
                                        <div className="w-full h-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend / Upcoming Section */}
                <div className="mt-8 space-y-4 px-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Selected Events</h3>
                    <div className="space-y-3">
                        {Object.entries(eventsMap).map(([day, event]) => (
                            <Link key={day} href={`/event/${event.id}`} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-black ${event.color}`}>
                                    {day}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{event.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">Coming soon in {currentDate.toLocaleDateString('en-US', { month: 'short' })}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <Link href="/create-event-post-screen" className="fixed right-4 bottom-6 z-50 flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all max-w-md mx-auto">
                <span className="material-symbols-outlined text-black text-3xl">add</span>
            </Link>
        </div>
    );
}
