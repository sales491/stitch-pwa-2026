'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { createLostFoundPost } from '@/app/actions/lost-found';
import SuccessToast from '@/components/SuccessToast';

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

type FormType = 'lost' | 'found';
type FormCategory = 'animal' | 'item' | 'document' | 'person';

export default function CreateLostFoundForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [type, setType] = useState<FormType>('lost');
    const [category, setCategory] = useState<FormCategory>('item');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [municipality, setMunicipality] = useState('Boac');
    const [contact, setContact] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_IMAGE_MB = 5;

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError('Only JPG, PNG, WebP, or GIF images are allowed.');
            e.target.value = '';
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setError(`Image must be under ${MAX_IMAGE_MB}MB.`);
            e.target.value = '';
            return;
        }
        setError(null);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;
        setUploading(true);
        const ext = imageFile.name.split('.').pop();
        const filePath = `lost-found/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(filePath, imageFile);
        setUploading(false);
        if (uploadError) { setError('Image upload failed: ' + uploadError.message); return null; }
        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(filePath);
        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!title.trim()) { setError('Please enter a title.'); return; }

        const imageUrl = imageFile ? await uploadImage() : null;
        if (imageFile && !imageUrl) return; // upload failed, error already set

        startTransition(async () => {
            const result = await createLostFoundPost({
                type,
                category,
                title: title.trim(),
                description: description.trim() || undefined,
                image_url: imageUrl ?? undefined,
                location: location.trim() || undefined,
                municipality,
                contact: contact.trim() || undefined,
            });

            if (result.success && result.id) {
                const msg = type === 'lost' ? 'Lost item posted!' : 'Found item reported!';
                setSuccessMsg(msg);
                setShowSuccess(true);
                setTimeout(() => {
                    router.push(`/my-barangay/lost-found/${result.id}`);
                }, 2000);
            } else {
                setError(result.error ?? 'Something went wrong. Please try again.');
            }
        });
    };

    const isSubmitting = isPending || uploading;

    return (
        <form onSubmit={handleSubmit} className="px-4 pt-4 pb-32 space-y-4">
            <SuccessToast visible={showSuccess} message={successMsg} />
            {/* Type picker */}
            <div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">I am reporting something…</p>
                <div className="grid grid-cols-2 gap-2">
                    {(['lost', 'found'] as FormType[]).map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`py-3 rounded-2xl font-black text-sm transition-all ${
                                type === t
                                    ? t === 'lost'
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {t === 'lost' ? '🔴 Lost' : '🟢 Found'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                <div className="grid grid-cols-4 gap-2">
                    {([
                        { v: 'animal' as FormCategory, icon: '🐾', label: 'Animal' },
                        { v: 'item' as FormCategory, icon: '📦', label: 'Item' },
                        { v: 'document' as FormCategory, icon: '📄', label: 'Document' },
                        { v: 'person' as FormCategory, icon: '👤', label: 'Person' },
                    ]).map(({ v, icon, label }) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setCategory(v)}
                            className={`flex flex-col items-center py-2.5 rounded-xl font-bold text-[10px] transition-all gap-1 ${
                                category === v
                                    ? 'bg-indigo-500 text-white shadow'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <span className="text-xl">{icon}</span>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                    Title <span className="text-rose-400">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={type === 'lost' ? 'e.g. Lost brown dog near Boac plaza' : 'e.g. Found black wallet near Gasan church'}
                    maxLength={120}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the item, animal, or person. Include distinctive features, colors, identifying marks…"
                    rows={3}
                    maxLength={1000}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
                <p className="text-[10px] text-slate-400 dark:text-zinc-600 text-right mt-1">{description.length}/1000</p>
            </div>

            {/* Photo */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Photo (optional)</label>
                {imagePreview ? (
                    <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                        <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black"
                        >✕</button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-rose-400 transition-colors">
                        <span className="text-2xl mb-1">📸</span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-semibold">Tap to add photo</span>
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                )}
            </div>

            {/* Location + Municipality */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Last seen / Found at</label>
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Near Jollibee, Boac "
                        maxLength={150}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-[12px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Municipality</label>
                    <select
                        value={municipality}
                        onChange={e => setMunicipality(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-[12px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none"
                    >
                        {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Contact */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Contact info</label>
                <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="Phone number or Messenger name"
                    maxLength={100}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl px-4 py-3 text-[12px] font-semibold">
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[14px] py-4 rounded-2xl shadow-lg shadow-rose-500/25 transition-all active:scale-95"
            >
                {isSubmitting ? (uploading ? 'Uploading photo…' : 'Posting…') : `Post ${type === 'lost' ? 'Lost' : 'Found'} Report`}
            </button>
        </form>
    );
}
