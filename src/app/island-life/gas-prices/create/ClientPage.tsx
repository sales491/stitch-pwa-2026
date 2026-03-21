'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import SuccessToast from '@/components/SuccessToast';
import { submitGasPrice } from '@/app/actions/gas-prices';

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

const FUEL_TYPES = [
    { key: 'regular' as const, emoji: '⛽', label: 'Regular', color: 'bg-emerald-500 border-emerald-500 shadow-emerald-500/20 text-white', ring: 'focus:ring-emerald-400/30 focus:border-emerald-400' },
    { key: 'premium' as const, emoji: '💎', label: 'Premium', color: 'bg-blue-500 border-blue-500 shadow-blue-500/20 text-white',    ring: 'focus:ring-blue-400/30 focus:border-blue-400' },
    { key: 'diesel'  as const, emoji: '🚛', label: 'Diesel',  color: 'bg-amber-500 border-amber-500 shadow-amber-500/20 text-white',  ring: 'focus:ring-amber-400/30 focus:border-amber-400' },
];

type FuelKey = 'regular' | 'premium' | 'diesel';

const MAX_IMAGE_MB = 8;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

/** Compress + resize image via Canvas, output as JPEG blob ≤ target KB */
async function compressImage(file: File, maxWidthPx = 1200, qualityStart = 0.82): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, maxWidthPx / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas compression failed'));
            }, 'image/jpeg', qualityStart);
        };
        img.onerror = reject;
        img.src = url;
    });
}

export default function CreateGasPriceClientPage() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedFuels, setSelectedFuels] = useState<Set<FuelKey>>(new Set(['regular']));
    const [prices, setPrices] = useState<Record<FuelKey, string>>({ regular: '', premium: '', diesel: '' });
    const [municipality, setMunicipality] = useState('Boac');
    const [stationName, setStationName] = useState('');
    const [note, setNote] = useState('');

    // Photo upload state
    const [entryMode, setEntryMode] = useState<'manual' | 'photo'>('manual');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-8 h-8 border-4 border-moriones-red/30 border-t-moriones-red rounded-full animate-spin" />
                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Loading...</p>
            </div>
        );
    }
    if (!profile) { router.push('/login'); return null; }

    const toggleFuel = (key: FuelKey) => {
        setSelectedFuels(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size === 1) return prev; // keep at least one
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Only JPG, PNG, or WebP images are allowed.');
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
        try {
            const compressed = await compressImage(imageFile);
            const filePath = `gas-prices/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
            const { error: upErr } = await supabase.storage.from('listings').upload(filePath, compressed, {
                contentType: 'image/jpeg',
                cacheControl: '31536000',
            });
            if (upErr) { setError('Upload failed: ' + upErr.message); return null; }
            const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(filePath);
            return publicUrl;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!stationName.trim()) { setError('Please enter the gas station name.'); return; }
        if (entryMode === 'manual') {
            const anyFilled = [...selectedFuels].some(f => prices[f] && parseFloat(prices[f]) > 0);
            if (!anyFilled) { setError('Please enter at least one price.'); return; }
        } else {
            if (!imageFile) { setError('Please upload a photo of the price board.'); return; }
        }

        setIsSubmitting(true);

        let photo_url: string | null = null;
        if (entryMode === 'photo' && imageFile) {
            photo_url = await uploadImage();
            if (!photo_url) { setIsSubmitting(false); return; }
        }

        const fd = new FormData();
        fd.append('municipality', municipality);
        if (stationName) fd.append('station_name', stationName);
        if (note) fd.append('note', note);
        if (photo_url) fd.append('photo_url', photo_url);

        if (entryMode === 'manual') {
            for (const fuel of selectedFuels) {
                const p = prices[fuel];
                if (p && parseFloat(p) > 0) fd.append(`${fuel}_price`, p);
            }
        }

        const result = await submitGasPrice(fd);
        setIsSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/island-life/gas-prices');
                router.refresh();
            }, 2000);
        }
    };

    const NOTE_LIMIT = 120;

    return (
        <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">
            <SuccessToast visible={showSuccess} message="Gas price posted! Thanks for helping the community. 🙏" />

            {/* Sticky header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-20">
                <Link href="/island-life/gas-prices" className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                    <span className="material-symbols-outlined text-[24px] text-text-main dark:text-text-main-dark">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-base font-black text-text-main dark:text-text-main-dark leading-none">Share a Gas Price</h1>
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">Help neighbors find the best fuel prices</p>
                </div>
            </div>

            <div className="px-4 py-5 space-y-4">

                {/* Who's posting */}
                <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm">
                    {profile.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border-light shrink-0" />
                        : <div className="w-10 h-10 rounded-full bg-moriones-red flex items-center justify-center text-white font-black text-sm shrink-0">{profile.full_name?.[0] ?? 'M'}</div>
                    }
                    <div>
                        <p className="text-sm font-black text-text-main dark:text-text-main-dark">{profile.full_name ?? 'Fellow Resident'}</p>
                        <p className="text-[10px] text-text-muted dark:text-text-muted-dark">Posting as yourself · prices are community-sourced</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Entry mode toggle */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-3">
                        <label className="text-[10px] font-black text-moriones-red uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">edit_note</span>
                            How are you sharing prices?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {([
                                { mode: 'manual' as const, icon: 'payments', label: 'Enter prices' },
                                { mode: 'photo'  as const, icon: 'add_a_photo', label: 'Upload photo' },
                            ]).map(({ mode, icon, label }) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setEntryMode(mode)}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                                        entryMode === mode
                                            ? 'bg-moriones-red text-white border-moriones-red shadow-lg shadow-moriones-red/20'
                                            : 'bg-background-light dark:bg-background-dark text-text-muted dark:text-text-muted-dark border-border-light dark:border-border-dark'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MANUAL ENTRY */}
                    {entryMode === 'manual' && (
                        <>
                            {/* Fuel type multi-select */}
                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[13px]">local_gas_station</span>
                                        Fuel type
                                    </label>
                                    <span className="text-[9px] text-text-muted dark:text-text-muted-dark font-semibold">You can select more than one</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {FUEL_TYPES.map(f => (
                                        <button
                                            key={f.key}
                                            type="button"
                                            onClick={() => toggleFuel(f.key)}
                                            className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 shadow-sm ${
                                                selectedFuels.has(f.key)
                                                    ? `${f.color} shadow-lg`
                                                    : 'bg-background-light dark:bg-background-dark text-text-muted dark:text-text-muted-dark border-border-light dark:border-border-dark'
                                            }`}
                                        >
                                            <span className="text-xl">{f.emoji}</span>
                                            <span className="text-[11px]">{f.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Per-fuel price inputs */}
                                <div className="space-y-2 pt-1">
                                    {FUEL_TYPES.filter(f => selectedFuels.has(f.key)).map(f => (
                                        <div key={f.key} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 w-24 shrink-0">
                                                <span className="text-base">{f.emoji}</span>
                                                <span className="text-[11px] font-black text-text-muted dark:text-text-muted-dark uppercase">{f.label}</span>
                                            </div>
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-black text-sm pointer-events-none">₱</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    max="999"
                                                    value={prices[f.key]}
                                                    onChange={e => setPrices(prev => ({ ...prev, [f.key]: e.target.value }))}
                                                    placeholder="62.50"
                                                    className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl pl-8 pr-12 py-2.5 text-sm font-bold text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted pointer-events-none">/L</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* PHOTO ENTRY */}
                    {entryMode === 'photo' && (
                        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-3">
                            <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[13px]">add_a_photo</span>
                                Price board photo <span className="text-moriones-red ml-1">*</span>
                            </label>

                            {imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-black hover:bg-black/80 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                        Optimizing on upload ✓
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-moriones-red/50 transition-colors group">
                                    <span className="material-symbols-outlined text-4xl text-text-muted dark:text-text-muted-dark group-hover:text-moriones-red transition-colors mb-2">add_a_photo</span>
                                    <p className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark">Tap to upload price board photo</p>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">JPG, PNG, WebP · max {MAX_IMAGE_MB}MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            <p className="text-[10px] text-text-muted dark:text-text-muted-dark">
                                📸 Snap a photo of the price board at the station — photo will be compressed and optimized before uploading.
                            </p>
                        </div>
                    )}

                    {/* Municipality */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            Which town?
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={municipality}
                                onChange={e => setMunicipality(e.target.value)}
                                className="w-full appearance-none bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-bold text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none cursor-pointer"
                            >
                                {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">expand_more</span>
                        </div>
                    </div>

                    {/* Station name — required */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">storefront</span>
                            Station name <span className="text-moriones-red ml-0.5">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={stationName}
                            onChange={e => setStationName(e.target.value)}
                            maxLength={80}
                            placeholder="e.g. Petron Boac, Shell Sta. Cruz, Flying V Gasan"
                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium text-text-main dark:text-text-main-dark placeholder:text-text-muted focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none"
                        />
                    </div>

                    {/* Note */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">chat_bubble</span>
                            Note <span className="normal-case font-normal">(optional)</span>
                        </label>
                        <textarea
                            maxLength={NOTE_LIMIT}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={2}
                            placeholder="e.g. Price as of 8am. Lines were short."
                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium text-text-main dark:text-text-main-dark placeholder:text-text-muted focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none resize-none"
                        />
                        <p className={`text-[10px] font-bold text-right ${NOTE_LIMIT - note.length < 20 ? 'text-red-500' : 'text-text-muted dark:text-text-muted-dark'}`}>
                            {NOTE_LIMIT - note.length} left
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || uploading}
                        className="w-full bg-moriones-red text-white font-black py-4 rounded-2xl shadow-xl shadow-moriones-red/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                    >
                        {isSubmitting || uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {uploading ? 'Optimizing & uploading…' : 'Posting…'}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">local_gas_station</span>
                                Post Price Update
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-text-muted dark:text-text-muted-dark leading-relaxed">
                        Prices are community-sourced. Always verify at your local station. 🙏
                    </p>
                </form>
            </div>
        </div>
    );
}
