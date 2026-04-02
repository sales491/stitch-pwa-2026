'use client';
import React from 'react';
import Link from 'next/link';
import { Event } from '@/utils/eventData';

interface EventDetailPageProps {
    event: Event;
}

export default function EventDetailPage({ event: initialEvent }: EventDetailPageProps) {

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
