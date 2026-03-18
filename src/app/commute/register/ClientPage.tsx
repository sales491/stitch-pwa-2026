'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import SuccessToast from '@/components/SuccessToast';

export default function RegisterDriver() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit'); // if set, we're editing an existing listing

    const [formData, setFormData] = useState({
        driver_name: '',
        vehicle_type: 'Tricycle',
        service_type: 'Passenger',
        base_town: 'Boac',
        contact_number: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // If ?edit=<id> is present, load that specific listing for editing
    useEffect(() => {
        if (!editId || !profile) return;

        async function loadListing() {
            const { data, error } = await supabase
                .from('transport_services')
                .select('*')
                .eq('id', editId)
                .eq('provider_id', profile!.id) // security: only own listings
                .single();

            if (data) {
                setIsEditing(true);
                setFormData({
                    driver_name: data.driver_name,
                    vehicle_type: data.vehicle_type,
                    service_type: data.service_type,
                    base_town: data.base_town,
                    contact_number: data.contact_number,
                    notes: data.notes || ''
                });
            }
        }

        loadListing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId, profile]);

    if (authLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Synchronizing Logistics Channels...</div>;
    if (!profile) {
        router.push('/login?next=/commute/register');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const submissionData = {
            ...formData,
            provider_id: profile.id,
            is_available: true,
        };

        let response;
        if (isEditing && editId) {
            // Update the specific listing being edited
            response = await supabase
                .from('transport_services')
                .update(submissionData)
                .eq('id', editId)
                .eq('provider_id', profile.id);
        } else {
            // Always insert — operators can have multiple listings
            response = await supabase
                .from('transport_services')
                .insert(submissionData);
        }

        if (response.error) {
            setError(response.error.message);
            setIsSubmitting(false);
        } else {
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/commute');
                router.refresh();
            }, 2000);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display text-slate-900 dark:text-white">
            <SuccessToast visible={showSuccess} message={isEditing ? 'Listing updated!' : "You're now listed!"} />

            {/* Visual Hub Header */}
            <div className="bg-surface-light dark:bg-surface-dark px-6 py-8 border-b border-border-light dark:border-zinc-800 mb-8 rounded-b-[2rem] shadow-sm">
                <div className="max-w-xl mx-auto flex items-center gap-5">
                    <Link href="/commute" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-moriones-red">
                            {isEditing ? 'Edit Listing' : 'Add a Vehicle Listing'}
                        </h1>
                        <p className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest mt-0.5">Commute &amp; Delivery Hub</p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Identity Intel */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-moriones-red flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person_pin</span>
                            Provider Intelligence
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Official Name / Handle</label>
                            <input
                                required
                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-4 focus:ring-moriones-red/10 transition-all"
                                placeholder="e.g. Mang Jun Tricycle"
                                value={formData.driver_name}
                                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Active Comms (Phone)</label>
                            <input
                                required
                                type="tel"
                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-4 focus:ring-moriones-red/10 transition-all font-mono"
                                placeholder="0917 XXX XXXX"
                                value={formData.contact_number}
                                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Logistics Class */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-moriones-red flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">settings_input_component</span>
                            Logistics Configuration
                        </h3>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Vehicle Classification</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Tricycle', 'Motorcycle', 'Van / UV Express', 'Truck', 'Jeepney', 'Private Car'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, vehicle_type: type })}
                                        className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest text-center ${formData.vehicle_type === type
                                            ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20'
                                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-50 dark:border-zinc-700 text-slate-500 hover:border-moriones-red/30'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Operational Base</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Santa Cruz'].map((town) => (
                                    <button
                                        key={town}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, base_town: town })}
                                        className={`p-3 rounded-xl border-2 transition-all font-black text-[9px] uppercase tracking-widest text-center ${formData.base_town === town
                                            ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20'
                                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-50 dark:border-zinc-700 text-slate-500 hover:border-moriones-red/30'
                                            }`}
                                    >
                                        {town}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Service Protocol</label>
                            <div className="flex gap-2">
                                {['Passenger', 'Delivery', 'Both'].map((serv) => (
                                    <button
                                        key={serv}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, service_type: serv })}
                                        className={`flex-1 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest text-center ${formData.service_type === serv
                                            ? 'bg-moriones-red border-moriones-red text-white'
                                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-50 dark:border-zinc-700 text-slate-500 hover:border-moriones-red/30'
                                            }`}
                                    >
                                        {serv}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Intel */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">campaign</span>
                            Specialized Directives
                        </h3>
                        <textarea
                            className="w-full h-32 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-6 text-sm font-medium leading-relaxed focus:ring-4 focus:ring-moriones-red/10 transition-all resize-none"
                            placeholder="e.g. Boac to Mogpog route only, accepts heavy cargo, available for 24h trips..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="p-5 bg-red-50 text-red-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">error</span>
                            Registry Alert: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-moriones-red text-white font-black py-5 rounded-2xl shadow-xl shadow-moriones-red/20 hover:bg-moriones-red/90 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                SYNCHRONIZING...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">{isEditing ? 'sync' : 'add_circle'}</span>
                                {isEditing ? 'SAVE CHANGES' : 'ADD LISTING'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
