'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import PageHeader from '@/components/PageHeader';
import { optimizeImage } from '@/utils/image-optimization';
import { createGem } from '@/app/actions/gems';
import Link from 'next/link';

const GEM_CATEGORIES = [
    'Beaches & Islands',
    'Heritage & Culture',
    'Food & Dining',
    'Nature & Hiking',
    'Waterfalls & Springs',
    'Secret Spots',
    'Other'
];

export default function CreateGem() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        town: '',
        category: '',
        latitude: '',
        longitude: ''
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Synchronizing Exploration Data...</div>;
    if (!profile) {
        router.push('/login');
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImageFiles(prev => {
                const combined = [...prev, ...newFiles];
                return combined.slice(0, 4); // Limit to 4 images
            });
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let imageUrls: string[] = [];

            // 1. Upload Visuals
            for (const file of imageFiles) {
                // Compress image before upload
                const optimizedFile = await optimizeImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });

                const fileExt = optimizedFile.name.split('.').pop();
                const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
                const filePath = `gems/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gems_images')
                    .upload(filePath, optimizedFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('gems_images')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
            }

            // 2. Register Gem in Database via Server Action
            await createGem({
                title: formData.title,
                town: formData.town,
                category: formData.category,
                description: formData.description,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                images: imageUrls
            });

            setIsSuccess(true);
            setIsSubmitting(false);

        } catch (err: any) {
            setError(err.message || 'Transmission failure during registration.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display flex flex-col items-center justify-center pt-20">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl max-w-sm w-full mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                    </div>
                    <h2 className="text-xl font-black text-text-main leading-tight">Discovery <br/>Submitted!</h2>
                    <p className="text-xs font-medium text-text-muted leading-relaxed px-4">
                        Your gem has been submitted successfully and is currently pending review by an admin. Once approved, it will be visible on the public feed.
                    </p>
                    
                    <div className="pt-4 flex flex-col gap-3">
                        <button onClick={() => { setIsSuccess(false); setFormData({ title: '', description: '', town: '', category: '', latitude: '', longitude: '' }); setImageFiles([]); }} className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">
                            Submit Another
                        </button>
                        <Link href="/gems" className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold py-4 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest">
                            Back to Feed
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">

            <PageHeader title="Share a Gem" subtitle="Hidden Treasure" />

            <div className="max-w-xl mx-auto px-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Visual Evidence Section */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4 text-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Hero Visual Registry (Max 4)</h3>
                        
                        {imageFiles.length < 4 && (
                            <label className="flex flex-col items-center justify-center w-full aspect-video bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-700 cursor-pointer hover:border-emerald-500/50 transition-all group mb-4">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors mb-2">add_a_photo</span>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Attach Photos</p>
                                </div>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}

                        {imageFiles.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {imageFiles.map((file, idx) => (
                                    <div key={idx} className="relative aspect-auto bg-slate-100 dark:bg-zinc-800 rounded-xl p-2 flex items-center justify-between border border-slate-200 dark:border-zinc-700">
                                        <p className="text-[9px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest truncate max-w-[100px]">
                                            {file.name}
                                        </p>
                                        <button type="button" onClick={() => removeImage(idx)} className="text-moriones-red hover:text-red-700 transition-colors bg-white dark:bg-black rounded-full size-6 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full appearance-none bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {GEM_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
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
