'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import SuccessToast from '@/components/SuccessToast';
import BackButton from '@/components/BackButton';

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

export default function CreateBusiness() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Basic Info State
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('Restaurant / Food');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Boac');
    const [operatingHours, setOperatingHours] = useState('');

    // JSONB Data State (Contact & Social)
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebook, setFacebook] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return setError('You must be logged in to create a business profile.');
        setIsSubmitting(true);
        setError('');

        try {
            // 1. Package the JSONB objects
            const contactInfo = { phone: phone.trim(), email: email.trim() };
            const socialMedia = { facebook: facebook.trim() };

            // 2. Insert into the database
            const { data: newBusiness, error: insertError } = await supabase
                .from('business_profiles')
                .insert({
                    owner_id: profile.id,
                    business_name: businessName,
                    business_type: businessType,
                    description,
                    location,
                    operating_hours: operatingHours,
                    contact_info: contactInfo,
                    social_media: socialMedia,
                })
                .select('id')
                .single();

            if (insertError) {
                // Handle the unique constraint error if they already have a business
                if (insertError.code === '23505' && insertError.message.includes('owner_id')) {
                    throw new Error('You already have a business profile registered to this account.');
                }
                // Handle unique business name error
                if (insertError.code === '23505' && insertError.message.includes('business_name')) {
                    throw new Error('A business with this name already exists.');
                }
                throw insertError;
            }

            // 3. Update the user's role to 'business' for specialized dashboard features
            await supabase.from('profiles').update({ role: 'business' }).eq('id', profile.id);

            // 4. Redirect to their shiny new business page
            if (newBusiness) {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push(`/directory/${newBusiness.id}`);
                    router.refresh();
                }, 2000);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong while creating your business.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moriones-red mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Portal...</p>
        </div>
    );

    if (!profile) return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-slate-300 text-5xl">lock</span>
            </div>
            <h2 className="text-xl font-black mb-2">Sign In Required</h2>
            <p className="text-slate-500 text-sm font-bold max-w-[240px] mb-8">Please sign in to list your business in the community directory.</p>
            <Link href="/login?next=/directory/create" className="bg-moriones-red text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-transform shadow-xl shadow-moriones-red/20">
                Sign In to Continue
            </Link>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
            <SuccessToast visible={showSuccess} message="Profile submitted for review! We'll publish it after approval." />
            {/* Premium Header */}
            <div className="bg-surface-light dark:bg-surface-dark px-6 pt-8 pb-6 rounded-b-[2rem] shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton />
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-moriones-red leading-tight">Register Business</h1>
                        <p className="text-[10px] text-text-muted dark:text-text-muted-dark font-black uppercase tracking-[0.2em] mt-0.5">Marinduque Business Directory</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 text-xs font-bold flex items-center gap-3 animate-shake">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}
            </div>

            <div className="px-6 pb-24 -mt-4 max-w-md mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* SECTION 1: Identity */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">
                            <span className="material-symbols-outlined text-moriones-red">store</span>
                            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Identity & Brand</h2>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Name</label>
                                <input
                                    type="text" required maxLength={100}
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all placeholder:text-slate-300"
                                    placeholder="e.g., Boac Flower Shop"
                                    value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all appearance-none"
                                        value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Town</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all appearance-none"
                                        value={location} onChange={(e) => setLocation(e.target.value)}
                                    >
                                        {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About Your Work</label>
                                <textarea
                                    required rows={4}
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all resize-none placeholder:text-slate-300"
                                    placeholder="Tell the community what you provide..."
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Connectivity */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">
                            <span className="material-symbols-outlined text-moriones-red">contact_phone</span>
                            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Public Connectivity</h2>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Mobile</label>
                                <input
                                    type="tel"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all placeholder:text-slate-300"
                                    placeholder="e.g., 0917 123 4567"
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operating Hours</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all placeholder:text-slate-300"
                                    placeholder="e.g., Mon-Sat: 8AM - 5PM"
                                    value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Facebook Page URL</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">link</span>
                                    <input
                                        type="url"
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-moriones-red/20 transition-all placeholder:text-slate-300"
                                        placeholder="https://facebook.com/..."
                                        value={facebook} onChange={(e) => setFacebook(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-moriones-red text-white font-black py-5 rounded-[2rem] mt-4 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-moriones-red/20 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span className="text-xs uppercase tracking-[0.2em]">Deploying Profile...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">rocket_launch</span>
                                <span className="text-xs uppercase tracking-[0.2em]">Launch Business Profile</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
