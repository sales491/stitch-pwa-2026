'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

type DriverProps = {
    id: string;
    providerId: string;
    driverName: string;
    vehicleType: string;
    serviceType: string;
    baseTown: string;
    contactNumber: string;
    isAvailable: boolean;
    notes: string;
};

const getVehicleIcon = (type: string) => {
    switch (type) {
        case 'Tricycle': return 'electric_rickshaw';
        case 'Van / UV Express': return 'airport_shuttle';
        case 'Motorcycle': return 'motorcycle';
        case 'Jeepney': return 'minor_crash'; // Closest tactical icon
        case 'Truck': return 'local_shipping';
        default: return 'directions_car';
    }
};

export default function DriverCard({ id, providerId, driverName, vehicleType, serviceType, baseTown, contactNumber, isAvailable, notes }: DriverProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = profile?.id === providerId;
    const isModOrAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

    const toggleAvailability = async () => {
        setIsUpdating(true);
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase
            .from('transport_services')
            .update({ is_available: !isAvailable })
            .eq('id', id);

        if (!error) {
            router.refresh();
        }
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Terminate this transport profile?')) return;
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.from('transport_services').delete().eq('id', id);
        router.refresh();
    };

    return (
        <div className={`group bg-white dark:bg-zinc-900 border-2 rounded-[2.5rem] p-6 mb-5 shadow-sm relative transition-all hover:shadow-xl ${isAvailable ? 'border-emerald-500 shadow-emerald-500/5' : 'border-slate-100 dark:border-zinc-800 opacity-80'}`}>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isAvailable ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-3xl">
                            {getVehicleIcon(vehicleType)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                            {driverName}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{serviceType}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicleType}</span>
                        </div>
                    </div>
                </div>

                {/* Live Status Intel */}
                <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm border ${isAvailable ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 border-slate-100 dark:border-zinc-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-zinc-600'}`}></span>
                    {isAvailable ? 'Live & Online' : 'Currently Offline'}
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-2xl mb-6 space-y-3 border border-slate-50 dark:border-zinc-700/50">
                <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>Base: {baseTown}</span>
                </div>
                {notes && (
                    <div className="text-sm font-medium text-slate-500 dark:text-zinc-500 italic leading-relaxed">
                        "{notes}"
                    </div>
                )}
            </div>

            {/* Action Deck */}
            <div className="flex gap-3 mt-auto">
                {/* Engagement Action */}
                <a
                    href={`tel:${contactNumber}`}
                    className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-emerald-500/10 ${isAvailable ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 pointer-events-none'}`}
                >
                    {isAvailable ? (
                        <>
                            <span className="material-symbols-outlined text-sm">call</span>
                            Initialize Engagement
                        </>
                    ) : 'Source Unavailable'}
                </a>

                {/* Authority Toggles */}
                {isOwner && (
                    <button
                        onClick={toggleAvailability}
                        disabled={isUpdating}
                        className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 border-2 ${isAvailable ? 'bg-slate-900 dark:bg-black text-white border-transparent' : 'bg-white dark:bg-zinc-900 text-emerald-600 border-emerald-600 hover:bg-emerald-50'}`}
                    >
                        {isUpdating ? 'SYNCING...' : isAvailable ? (
                            <>
                                <span className="material-symbols-outlined text-sm">power_settings_new</span>
                                Go Offline
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">bolt</span>
                                Activate Signal
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* God-Mode Authorization */}
            {(isModOrAdmin && !isOwner) && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-sm">delete</span>
                </button>
            )}
        </div>
    );
}
