'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import BackButton from '@/components/BackButton';

export default function CreateGem() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        town: '',
        latitude: '',
        longitude: ''
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Synchronizing Exploration Data...</div>;
    if (!profile) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let imageUrls: string[] = [];

            // 1. Upload Hero Visual
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
                const filePath = `gems/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gems_images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('gems_images')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
            }

            // 2. Register Gem in Database
            const { error: insertError } = await supabase
                .from('gems')
                .insert({
                    ...formData,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                    author_id: profile.id,
                    images: imageUrls
                });

            if (insertError) throw insertError;

            router.push('/gems');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Transmission failure during registration.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">

            {/* Tactical Header */}
            <div className="bg-white dark:bg-zinc-900 px-6 py-8 border-b border-slate-100 dark:border-zinc-800 mb-8 rounded-b-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="max-w-xl mx-auto flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Register Sanctuary</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geographic Discovery Portal</p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Visual Evidence Section */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4 text-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Hero Visual Registry</h3>
                        <label className="flex flex-col items-center justify-center w-full aspect-video bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-700 cursor-pointer hover:border-emerald-500/50 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors mb-2">add_a_photo</span>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Attach Sanctuary Photo</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        </label>
                        {imageFile && (
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                Asset Staged: {imageFile.name}
                            </p>
                        )}
                    </div>

                    {/* Core Intelligence Area */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">edit_location</span>
                            Core Intelligence
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Sanctuary Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                                placeholder="e.g. Maniwaya Sandbar"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Town</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full appearance-none bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white cursor-pointer"
                                    value={formData.town}
                                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                                >
                                    <option value="">Select Town</option>
                                    <option value="Boac">Boac</option>
                                    <option value="Mogpog">Mogpog</option>
                                    <option value="Gasan">Gasan</option>
                                    <option value="Buenavista">Buenavista</option>
                                    <option value="Torrijos">Torrijos</option>
                                    <option value="Santa Cruz">Santa Cruz</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Latitude (Optional)</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                                    placeholder="e.g. 13.5132"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Longitude (Optional)</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                                    placeholder="e.g. 122.1234"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Narrative Segment */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">subject</span>
                            Discovery Narrative
                        </h3>
                        <textarea
                            required
                            className="w-full h-40 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white resize-none"
                            placeholder="Describe why this place is special, how to get there, and any traveler tips..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Broadcasting Discovery...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">explore</span>
                                Launch Discovery
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}


