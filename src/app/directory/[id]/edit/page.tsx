'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import PageHeader from '@/components/PageHeader';

const TOWNS = [
    "Boac",
    "Mogpog",
    "Gasan",
    "Buenavista",
    "Torrijos",
    "Santa Cruz"
];

const CATEGORIES = [
    "Restaurant / Food",
    "Retail / Shop",
    "Services / Repair",
    "Transportation",
    "Accommodation",
    "Other"
];

export default function EditBusiness({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Basic Info State
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('Restaurant / Food');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Boac');
    const [operatingHours, setOperatingHours] = useState('');

    // JSONB Data State
    const [phone, setPhone] = useState('');
    const [facebook, setFacebook] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchBusiness() {
            const { data, error } = await supabase
                .from('business_profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                setError('Business profile not found.');
                setIsLoadingData(false);
                return;
            }

            // Security check
            if (profile && profile.id !== data.owner_id && profile.role !== 'admin' && profile.role !== 'moderator') {
                router.push(`/directory/${id}`);
                return;
            }

            // Populate states
            setBusinessName(data.business_name || '');
            setBusinessType(data.business_type || 'Restaurant / Food');
            setDescription(data.description || '');
            setLocation(data.location || 'Boac');
            setOperatingHours(data.operating_hours || '');
            setPhone(data.contact_info?.phone || '');
            setFacebook(data.social_media?.facebook || '');

            setIsLoadingData(false);
        }

        if (!authLoading && profile) {
            fetchBusiness();
        } else if (!authLoading && !profile) {
            router.push('/login');
        }
    }, [id, profile, authLoading, router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const contactInfo = { phone: phone.trim() };
            const socialMedia = { facebook: facebook.trim() };

            const { error: updateError } = await supabase
                .from('business_profiles')
                .update({
                    business_name: businessName,
                    business_type: businessType,
                    description,
                    location,
                    operating_hours: operatingHours,
                    contact_info: contactInfo,
                    social_media: socialMedia,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (updateError) throw updateError;

            router.push(`/directory/${id}`);
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to update business profile.');
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoadingData) return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moriones-red mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Business Dashboard...</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 pb-24">
            <PageHeader title="Edit Business" subtitle="Update Listing" />

            <div className="px-6 pb-24 -mt-4 max-w-lg mx-auto w-full">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 text-xs font-bold mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Identity Card */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">Brand Information</h2>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Title</label>
                                <input
                                    type="text" required maxLength={100}
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-moriones-red/20 transition-all"
                                    value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Market Category</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black appearance-none focus:ring-2 focus:ring-blue-500/20"
                                        value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Town Hub</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black appearance-none focus:ring-2 focus:ring-blue-500/20"
                                        value={location} onChange={(e) => setLocation(e.target.value)}
                                    >
                                        {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Description</label>
                                <textarea
                                    required rows={6}
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logistics Card */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">Logistics & Social</h2>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Mobile</label>
                                <input
                                    type="tel"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black placeholder:text-slate-300"
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Standard Operating Hours</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black placeholder:text-slate-300"
                                    value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Facebook Integration</label>
                                <input
                                    type="url"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black placeholder:text-slate-300"
                                    value={facebook} onChange={(e) => setFacebook(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-black py-4 rounded-3xl text-[11px] uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-moriones-red text-white font-black py-4 rounded-3xl text-[11px] uppercase tracking-widest disabled:bg-slate-100 transition-all shadow-xl shadow-moriones-red/20 active:scale-95"
                        >
                            {isSubmitting ? 'Sycing Changes...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
