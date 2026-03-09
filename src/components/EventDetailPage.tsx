'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/utils/eventData';
import { createClient } from '@/utils/supabase/client';

interface EventDetailPageProps {
    event: Event;
}

export default function EventDetailPage({ event: initialEvent }: EventDetailPageProps) {
    const [isGoing, setIsGoing] = useState(false);
    const [attendees, setAttendees] = useState(initialEvent.attendees);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const stored = localStorage.getItem(`event_going_${initialEvent.id}`);
        if (stored === 'true') {
            setIsGoing(true);
        }
    }, [initialEvent.id]);

    const toggleAttendance = async () => {
        setLoading(true);
        const newIsGoing = !isGoing;
        const increment = newIsGoing ? 1 : -1;

        const { error } = await supabase.rpc('toggle_event_attendance', {
            event_id_text: initialEvent.id,
            increment_val: increment
        });

        if (!error) {
            setIsGoing(newIsGoing);
            setAttendees(prev => Math.max(0, prev + increment));
            localStorage.setItem(`event_going_${initialEvent.id}`, String(newIsGoing));
        } else {
            alert('Failed to update attendance. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 pb-40 max-w-md mx-auto overflow-x-hidden">
            {/* Hero Image Section */}
            <div className="relative h-[45vh] w-full">
                <img
                    src={initialEvent.image}
                    alt={initialEvent.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Navigation Overlays */}
                <div className="absolute top-12 left-4 flex items-center gap-3">
                    <Link href="/events" className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all border border-white/20">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </div>

                <div className="absolute top-12 right-4 flex items-center gap-3">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all border border-white/20">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                    <button
                        onClick={toggleAttendance}
                        className={`flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-all border ${isGoing ? 'bg-primary text-black border-primary' : 'bg-white/20 text-white border-white/20'}`}>
                        <span className={`material-symbols-outlined ${isGoing ? 'fill-1' : ''}`}>favorite</span>
                    </button>
                </div>

                {/* Floating Title Info */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary text-black text-[10px] font-bold uppercase tracking-wider">{initialEvent.category}</span>
                        {initialEvent.trending && (
                            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">local_fire_department</span>
                                Trending
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-lg">{initialEvent.title}</h1>
                    <div className="flex items-center gap-4 text-white/90 text-sm drop-shadow-md">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                            <span>{initialEvent.town}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                            <span>{initialEvent.date}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-6 bg-slate-50 dark:bg-zinc-950 rounded-t-3xl px-6 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="size-10 rounded-full border-4 border-slate-50 dark:border-zinc-950 overflow-hidden bg-slate-200 dark:bg-zinc-800">
                                <img src={`https://i.pravatar.cc/100?u=${initialEvent.id}${i}`} alt="Attendee" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {isGoing && (
                            <div className="size-10 rounded-full border-4 border-slate-50 dark:border-zinc-950 overflow-hidden bg-primary flex items-center justify-center z-10">
                                <span className="text-[10px] font-black text-black">YOU</span>
                            </div>
                        )}
                        <div className="size-10 rounded-full border-4 border-slate-50 dark:border-zinc-950 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                            +{attendees}
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-none mb-1">{attendees} Going</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isGoing ? "Including You" : "Join the Community"}</p>
                    </div>
                </div>

                {/* Inline Action Button - Sits before details grid */}
                <div className="mb-8">
                    <button
                        onClick={toggleAttendance}
                        disabled={loading}
                        className={`w-full font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${isGoing
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-primary text-black shadow-primary/20 hover:bg-primary/90'
                            }`}>
                        {loading ? 'Processing...' : isGoing ? "I'm Going" : "I'm Interested in Attending"}
                        <span className="material-symbols-outlined text-base">{isGoing ? 'check_circle' : 'arrow_forward'}</span>
                    </button>
                    {isGoing && (
                        <p className="text-center text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-widest animate-pulse">
                            You're registered for this event
                        </p>
                    )}
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{initialEvent.time}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
                        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                            <span className="material-symbols-outlined">pin_drop</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{initialEvent.location}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-3">About the Event</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {initialEvent.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
