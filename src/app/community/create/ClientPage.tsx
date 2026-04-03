'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeImage } from '@/utils/image-optimization';
import SuccessToast from '@/components/SuccessToast';
import PageHeader from '@/components/PageHeader';

export default function CreatePost() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const editId = searchParams?.get('id');
    const isEditing = !!editId;

    // Form State
    const [content, setContent] = useState('');
    const [type, setType] = useState('community'); // Default category
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [existingImages, setExistingImages] = useState<string[]>([]);

    useState(() => {
        if (isEditing) {
            const fetchPost = async () => {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', editId)
                    .single();

                if (data && !error) {
                    setContent(data.content);
                    setType(data.type);
                    setExistingImages(data.images || []);
                }
            };
            fetchPost();
        }
    });

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_IMAGE_MB = 5;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return setError('You must be logged in to post.');
        if (!content.trim()) return setError('Post content cannot be empty.');
        if (content.length > 2000) return setError('Post is too long (max 2000 characters).');

        setIsSubmitting(true);
        setError('');

        try {
            let imageUrls: string[] = [];

            // 1. Upload Images (If the user attached any)
            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    // Optimize for social feed (1080px is standard)
                    const optimizedFile = await optimizeImage(file, { maxWidth: 1080, quality: 0.8 });

                    const fileExt = 'jpg';
                    const fileName = `${profile.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `posts/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('community_images')
                        .upload(filePath, optimizedFile);

                    if (uploadError) throw uploadError;

                    const { data: publicUrlData } = supabase.storage
                        .from('community_images')
                        .getPublicUrl(filePath);

                    imageUrls.push(publicUrlData.publicUrl);
                }
            }

            // 2. Insert or Update the Post
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({
                        content: content.trim(),
                        type: type,
                        images: [...existingImages, ...imageUrls],
                        status: 'published',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editId);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('posts')
                    .insert({
                        author_id: profile.id,
                        content: content.trim(),
                        type: type,
                        images: imageUrls,
                        status: 'published',
                    });

                if (insertError) throw insertError;
            }

            // 3. Success! Send them back to the feed
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/community');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong while posting.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.3em] text-slate-400">Syncing Intelligence...</div>;

    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <span className="material-symbols-outlined text-4xl">lock</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Sign In Required</h2>
            <p className="text-slate-500 font-bold text-sm mb-8">Please sign in to post to the community board.</p>
            <Link href="/login?next=/community/create" className="w-full bg-moriones-red text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-moriones-red/20 active:scale-95 transition-transform">
                Go to Sign In
            </Link>
        </div>
    );

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">
            <SuccessToast visible={showSuccess} message={isEditing ? 'Post updated!' : 'Post shared with the community!'} />

            <PageHeader title="New Post" subtitle="Community Board" />

            <div className="max-w-xl mx-auto px-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Intel Source & Classification */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm transition-all focus-within:shadow-xl focus-within:shadow-moriones-red/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative shadow-inner border border-slate-50 dark:border-zinc-700">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="You" className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-900 dark:text-white leading-none mb-2">{profile.full_name || 'Anonymous'}</p>

                                <div className="relative inline-block">
                                    <select
                                        className="appearance-none bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-600 dark:text-zinc-400 font-black uppercase tracking-[0.1em] px-4 py-2 pr-10 rounded-xl border-none focus:ring-2 focus:ring-moriones-red/20 cursor-pointer transition-all"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="community">💬 General Community</option>
                                        <option value="news">📰 Local News</option>
                                        <option value="request">🙋‍♂️ Request / Help</option>
                                        <option value="cultural">🎭 Cultural / Event</option>

                                        {(profile.role === 'admin' || profile.role === 'moderator') && (
                                            <>
                                                <option value="emergency">🚨 Emergency Signal</option>
                                                <option value="official">📢 Official Hub Report</option>
                                            </>
                                        )}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <textarea
                            required
                            rows={6}
                            maxLength={2000}
                            className="w-full bg-transparent border-none p-0 text-xl font-medium text-slate-800 dark:text-zinc-200 placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 resize-none leading-relaxed"
                            placeholder="Wield your microphone, Marinduque... What's currently on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <p className="text-[10px] text-slate-400 dark:text-zinc-600 text-right mt-1">{content.length}/2000</p>
                    </div>

                    {/* Tactical Assets (Image) */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <label className={`flex items-center gap-3 text-moriones-red font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-moriones-red/5 px-4 py-3 rounded-2xl transition-all border border-transparent hover:border-moriones-red/20 ${imageFiles.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                    Attach Visual Evidence
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        disabled={imageFiles.length >= 2}
                                        className="hidden"
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.files || []);
                                            const valid = selected.filter(f => {
                                                if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
                                                    setError('Only JPG, PNG, WebP, or GIF images are allowed.');
                                                    return false;
                                                }
                                                if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
                                                    setError(`Each image must be under ${MAX_IMAGE_MB}MB.`);
                                                    return false;
                                                }
                                                return true;
                                            });
                                            if (valid.length > 0) {
                                                setError('');
                                                const total = [...imageFiles, ...valid].slice(0, 2);
                                                setImageFiles(total);
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{imageFiles.length + existingImages.length}/2 Assets</span>
                            </div>

                            {existingImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {existingImages.map((url, idx) => (
                                        <div key={`existing-${idx}`} className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800">
                                            <img src={url} className="w-full h-full object-cover" alt="Asset" />
                                            <button
                                                type="button"
                                                onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-moriones-red transition-colors backdrop-blur-sm"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                            <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-sm text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Saved</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imageFiles.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {imageFiles.map((file, idx) => (
                                        <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                                alt="Asset"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-moriones-red transition-colors backdrop-blur-sm"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                                <p className="text-[8px] text-white font-black uppercase tracking-widest truncate">{file.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Broadcast Command */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="w-full bg-moriones-red text-white font-black py-5 rounded-2xl shadow-xl shadow-moriones-red/20 hover:bg-moriones-red/90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Broadcasting...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">{isEditing ? 'save' : 'send'}</span>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">{isEditing ? 'Save Changes' : 'Transmit Signal'}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}


