'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

const TOWNS = [
    "Boac",
    "Mogpog",
    "Gasan",
    "Buenavista",
    "Torrijos",
    "Santa Cruz"
];

export default function EditListing({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Form State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [town, setTown] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch existing data when the page loads
    useEffect(() => {
        async function fetchListing() {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                setError('Listing not found.');
                setIsLoadingData(false);
                return;
            }

            // SECURITY CHECK: Kick them out if they don't own it (and aren't a mod)
            const sellerId = data.seller_id || data.user_id;
            if (profile && profile.id !== sellerId && profile.role !== 'admin' && profile.role !== 'moderator') {
                router.push(`/marketplace/${id}`);
                return;
            }

            // Populate the form with existing data
            setTitle(data.title || '');
            setPrice((data.price_value || 0).toString());
            setDescription(data.description || '');
            setTown(data.town || 'Boac');
            setIsLoadingData(false);
        }

        if (!authLoading && profile) {
            fetchListing();
        } else if (!authLoading && !profile) {
            // Not logged in at all
            router.push('/login');
        }
    }, [id, profile, authLoading, router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Update the database row
            const { error: updateError } = await supabase
                .from('listings')
                .update({
                    title,
                    price: `₱${parseFloat(price).toLocaleString()}`,
                    price_value: parseFloat(price),
                    description,
                    town,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // Success! Send them back to the item page
            router.push(`/marketplace/${id}`);
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to update listing.');
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoadingData) return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Editor...</p>
        </div>
    );

    if (error) return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span className="material-symbols-outlined text-moriones-red text-6xl mb-4">error</span>
            <h2 className="text-xl font-black">{error}</h2>
            <Link href="/marketplace" className="mt-6 text-primary font-black text-sm uppercase">Back to Marketplace</Link>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen pb-24">
            {/* Header */}
            <div className="p-6 pb-2 flex items-center gap-4">
                <Link href={`/marketplace/${id}`} className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Edit Listing</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Updating your item details</p>
                </div>
            </div>

            <div className="px-6 pb-24 max-w-md mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Title</label>
                        <input
                            type="text" required maxLength={50}
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (₱)</label>
                            <div className="relative">
                                <span className="absolute left-4 inset-y-0 flex items-center text-slate-400 font-black text-sm">₱</span>
                                <input
                                    type="number" required min="0" step="0.01"
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 pl-8 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={price} onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Town</label>
                            <select
                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                value={town} onChange={(e) => setTown(e.target.value)}
                            >
                                {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                        <textarea
                            required rows={6}
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-black font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-primary/20 active:scale-95"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
