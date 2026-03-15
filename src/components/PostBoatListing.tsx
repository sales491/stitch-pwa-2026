'use client';
import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';
import { createBoatService } from '@/app/actions/boat';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';
import SuccessToast from '@/components/SuccessToast';

const TOWNS = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];

const DESTINATIONS = [
    'Maniwaya Island', 'Palad Sandbar', 'Tres Reyes Islands',
    'Elephant Island', 'Mompog Island', 'Puting Buhangin', 'Other',
];

const DEPARTURE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type BoatType = 'Outrigger Bangka' | 'Motorboat' | 'Speedboat' | 'Passenger Ferry';
type ServiceType = 'Island Hopping' | 'Point-to-Point' | 'Charter' | 'All';

const BOAT_TYPES: { id: BoatType; icon: string; label: string; sub: string }[] = [
    { id: 'Outrigger Bangka', icon: '🚤', label: 'Outrigger Bangka', sub: 'Traditional island-hopping bangka, day trips' },
    { id: 'Motorboat', icon: '⛵', label: 'Motorboat', sub: 'Flexible point-to-point or tour runs' },
    { id: 'Speedboat', icon: '💨', label: 'Speedboat', sub: 'Fast inter-island or private transfers' },
    { id: 'Passenger Ferry', icon: '🛳️', label: 'Passenger Ferry', sub: 'Scheduled runs to islands or ports' },
];

function ScheduleRow({ day, time, onRemove }: { day: string; time: string; onRemove: () => void }) {
    return (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 rounded-xl px-3 py-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-8">{day}</span>
            <span className="text-slate-500 dark:text-slate-400 flex-1">{time}</span>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
}

export default function PostBoatListing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');
    const [isPending, startTransition] = useTransition();

    const [boatType, setBoatType] = useState<BoatType | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType>('Island Hopping');
    const [operatorName, setOperatorName] = useState('');
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [baseMunicipality, setBaseMunicipality] = useState('Boac');
    const [pricePerHead, setPricePerHead] = useState('');
    const [notes, setNotes] = useState('');

    // Charter
    const [charterAvail, setCharterAvail] = useState(false);
    const [charterRate, setCharterRate] = useState('');
    const [charterMinPax, setCharterMinPax] = useState(5);
    const [charterNotes, setCharterNotes] = useState('');

    // Schedule (for Ferry)
    const [scheduleDay, setScheduleDay] = useState('Mon');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleList, setScheduleList] = useState<{ day: string; time: string }[]>([]);

    // Contact
    const [fbUsername, setFbUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    // Images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [filterError, setFilterError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        async function fetchListing() {
            if (!editId) return;
            const { data } = await supabase.from('boat_services').select('*').eq('id', editId).single();
            if (data) {
                setBoatType(data.boat_type);
                setServiceType(data.service_type);
                setOperatorName(data.operator_name || '');
                setSelectedDestinations(data.destinations || []);
                setBaseMunicipality(data.base_municipality || 'Boac');
                setPricePerHead(data.price_per_head?.toString() || '');
                setNotes(data.notes || '');
                setCharterAvail(data.charter_avail || false);
                if (data.charter_details) {
                    setCharterRate(data.charter_details.rate?.toString() || '');
                    setCharterMinPax(data.charter_details.min_pax || 5);
                    setCharterNotes(data.charter_details.notes || '');
                }
                if (data.charter_rate) setCharterRate(data.charter_rate.toString());
                setScheduleList(data.schedule || []);
                if (data.contact_details) {
                    setFbUsername(data.contact_details.fb_username || '');
                    setEmail(data.contact_details.email || '');
                }
                setPhone(data.contact_number || '');
                setIsAvailable(data.is_available ?? true);
                setExistingImages(data.images || []);
            }
        }
        fetchListing();
    }, [editId]);

    const toggleDestination = (d: string) =>
        setSelectedDestinations(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_IMAGE_MB = 5;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = 2 - (imageFiles.length + existingImages.length);
        if (remaining <= 0) return;

        const validFiles: File[] = [];
        for (const file of files.slice(0, remaining)) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setFilterError('Only JPG, PNG, WebP, or GIF images are allowed.');
                e.target.value = '';
                return;
            }
            if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                setFilterError(`Each image must be under ${MAX_IMAGE_MB}MB.`);
                e.target.value = '';
                return;
            }
            validFiles.push(file);
        }
        setFilterError(null);
        setImageFiles(prev => [...prev, ...validFiles]);
    };

    const addSchedule = () => {
        if (!scheduleTime.trim()) return;
        setScheduleList(prev => [...prev, { day: scheduleDay, time: scheduleTime }]);
        setScheduleTime('');
    };

    const handlePost = async () => {
        if (!boatType) return;
        setFilterError(null);
        const errors: string[] = [];
        if (!operatorName.trim()) errors.push('Operator / Tour Name');
        if (selectedDestinations.length === 0) errors.push('At least one destination');
        if (!pricePerHead || parseFloat(pricePerHead) <= 0) errors.push('Price per head');
        if (!phone.trim() && !fbUsername.trim() && !email.trim()) errors.push('At least one contact method');
        if (imageFiles.length === 0 && existingImages.length === 0) errors.push('At least one verification photo');
        if (errors.length > 0) {
            setFilterError(`Please complete: ${errors.join(', ')}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const filterResult = filterAllFields({ operatorName, notes, charterNotes });
        if (!filterResult.passed) {
            setFilterError(`Content issue: ${filterResult.reason ?? 'Prohibited material detected.'}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsUploading(true);
        try {
            let uploadedImages: string[] = [];
            for (const file of imageFiles) {
                const optimized = await optimizeImage(file, { maxWidth: 1024, quality: 0.8 });
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
                const filePath = `boats/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('listings').upload(filePath, optimized);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(filePath);
                uploadedImages.push(publicUrl);
            }

            startTransition(async () => {
                try {
                    await createBoatService({
                        operator_name: operatorName,
                        boat_type: boatType,
                        service_type: serviceType,
                        destinations: selectedDestinations,
                        base_municipality: baseMunicipality,
                        price_per_head: parseFloat(pricePerHead) || 0,
                        charter_avail: charterAvail,
                        charter_rate: charterAvail ? (parseFloat(charterRate) || null) : null,
                        charter_details: charterAvail ? { min_pax: charterMinPax, notes: charterNotes } : null,
                        schedule: boatType === 'Passenger Ferry' ? scheduleList : null,
                        contact_number: phone,
                        contact_details: { fb_username: fbUsername, email },
                        notes,
                        is_available: isAvailable,
                        images: [...existingImages, ...uploadedImages],
                    });
                    setShowSuccess(true);
                    setTimeout(() => {
                        router.push('/island-hopping');
                        router.refresh();
                    }, 2000);
                } catch (err: any) {
                    // Rollback: delete any images uploaded in this session
                    if (uploadedImages.length > 0) {
                        const paths = uploadedImages
                            .map(url => url.split('/listings/')[1])
                            .filter(Boolean);
                        if (paths.length > 0) {
                            await supabase.storage.from('listings').remove(paths);
                        }
                    }
                    setFilterError(err.message || 'Failed to save listing');
                }
            });
        } catch (err: any) {
            setFilterError(err.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
            <SuccessToast visible={showSuccess} message={editId ? 'Listing updated! Taking you back…' : "You're listed! Taking you to the operator page…"} />
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10">
                <Link href="/island-hopping" className="text-slate-800 dark:text-slate-200">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{editId ? 'Edit Listing' : 'List Your Boat Service'}</h1>
                <div className="w-8" />
            </div>

            <div className="p-4 space-y-6 pb-32 flex-1 w-full max-w-md mx-auto">
                {filterError && (
                    <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400 shadow-sm animate-pulse">
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
                        <span><strong>Listing blocked:</strong> {filterError}</span>
                    </div>
                )}

                {/* Intro */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-cyan-100 dark:border-cyan-900/30">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">🏝️</span>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white">Island Hopping Operators</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">List your boat service for tourists visiting Maniwaya, Palad Sandbar, Tres Reyes Islands & more. Your listing will be reviewed by our admin team before going live.</p>
                        </div>
                    </div>
                </div>

                {/* Step 1 — Boat Type */}
                <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-cyan-600">directions_boat</span>
                        What type of boat do you operate?
                    </h2>
                    <div className="flex flex-col gap-2">
                        {BOAT_TYPES.map(opt => (
                            <button key={opt.id} onClick={() => setBoatType(opt.id)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${boatType === opt.id ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10' : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'}`}>
                                <span className="text-2xl shrink-0">{opt.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${boatType === opt.id ? 'text-cyan-600' : 'text-slate-900 dark:text-white'}`}>{opt.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.sub}</p>
                                </div>
                                {boatType === opt.id && <span className="material-symbols-outlined text-cyan-500 shrink-0">check_circle</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {boatType && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Operator Name */}
                        <div>
                            <label className="block text-sm font-bold text-cyan-600 mb-1">Operator / Tour Name</label>
                            <input type="text" placeholder="e.g. Juan's Island Tours" value={operatorName} onChange={e => setOperatorName(e.target.value)}
                                className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-cyan-500 placeholder-slate-400" />
                        </div>

                        {/* Photos */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verification Photos</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">BOAT & SELFIE SHOTS</p>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{(imageFiles.length + existingImages.length)}/2</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {existingImages.map((url, idx) => (
                                    <div key={`ex-${idx}`} className="relative aspect-square rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 overflow-hidden">
                                        <img src={url} className="w-full h-full object-cover opacity-80" alt="Existing" />
                                        <button type="button" onClick={() => setExistingImages(p => p.filter(u => u !== url))}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <div className="absolute top-1.5 left-1.5 bg-green-500/80 text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Saved</div>
                                    </div>
                                ))}
                                {imageFiles.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 overflow-hidden">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                                        <button type="button" onClick={() => setImageFiles(p => p.filter((_, i) => i !== idx))}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                        <div className="absolute top-1.5 left-1.5 bg-blue-500/80 text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">New</div>
                                    </div>
                                ))}
                                {(imageFiles.length + existingImages.length) < 2 && (
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-cyan-400/50 transition-all group">
                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-xl">add_a_photo</span>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Add Photo</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Service Type */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-cyan-600">water</span>
                                Type of service
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {(['Island Hopping', 'Point-to-Point', 'Charter', 'All'] as const).map(svc => (
                                    <button key={svc} onClick={() => setServiceType(svc)}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${serviceType === svc ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10 text-cyan-600' : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'}`}>
                                        {svc}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Destinations */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-cyan-600">location_on</span>
                                Destinations Covered
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {DESTINATIONS.map(d => (
                                    <button key={d} onClick={() => toggleDestination(d)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${selectedDestinations.includes(d) ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Base Municipality */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-cyan-600">anchor</span>
                                Home Port (Base Municipality)
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {TOWNS.map(t => (
                                    <button key={t} onClick={() => setBaseMunicipality(t)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${baseMunicipality === t ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-bold text-cyan-600 mb-1">Price Per Head (₱)</label>
                            <input type="number" placeholder="e.g. 500" value={pricePerHead} onChange={e => setPricePerHead(e.target.value)}
                                className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-cyan-500 placeholder-slate-400 text-lg shadow-sm" />
                            <p className="text-[10px] text-slate-400 mt-1">Starting rate; actual price may vary by headcount or season</p>
                        </div>

                        {/* Tour Inclusions / Notes */}
                        <div>
                            <label className="block text-sm font-bold text-cyan-600 mb-1">Tour Inclusions & Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Includes snorkeling gear, life vests, and packed lunch. Max 10 pax per trip."
                                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 outline-none text-slate-900 dark:text-white focus:border-cyan-500 placeholder-slate-400 h-24 resize-none text-sm shadow-sm" />
                        </div>

                        {/* Ferry Schedule */}
                        {boatType === 'Passenger Ferry' && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-3 shadow-sm">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-cyan-600">schedule</span>
                                    Departure Schedule
                                </h2>
                                {scheduleList.length > 0 && (
                                    <div className="space-y-2">
                                        {scheduleList.map((s, i) => <ScheduleRow key={i} day={s.day} time={s.time} onRemove={() => setScheduleList(p => p.filter((_, idx) => idx !== i))} />)}
                                    </div>
                                )}
                                <div className="flex gap-2 items-end">
                                    <div className="w-24">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Day</label>
                                        <select value={scheduleDay} onChange={e => setScheduleDay(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 appearance-none">
                                            {DEPARTURE_DAYS.map(d => <option key={d}>{d}</option>)}
                                            <option value="Daily">Daily</option>
                                            <option value="Weekends">Weekends</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Time</label>
                                        <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500" />
                                    </div>
                                    <button onClick={addSchedule} className="flex items-center justify-center w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors shrink-0 shadow-lg shadow-cyan-600/20">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Charter */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">anchor</span>
                                        Private Charter?
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Full Boat Bookings</p>
                                </div>
                                <button onClick={() => setCharterAvail(v => !v)}
                                    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${charterAvail ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${charterAvail ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                            {charterAvail && (
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Min. Pax</label>
                                            <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-1 h-10 shadow-inner">
                                                <button onClick={() => setCharterMinPax(p => Math.max(2, p - 1))} className="w-8 h-8 flex items-center justify-center text-cyan-600"><span className="material-symbols-outlined text-[20px]">remove</span></button>
                                                <span className="text-slate-900 dark:text-white font-bold">{charterMinPax}</span>
                                                <button onClick={() => setCharterMinPax(p => p + 1)} className="w-8 h-8 flex items-center justify-center text-cyan-600"><span className="material-symbols-outlined text-[20px]">add</span></button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Charter Rate (₱)</label>
                                            <input type="number" placeholder="Full trip rate" value={charterRate} onChange={e => setCharterRate(e.target.value)}
                                                className="w-full h-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 outline-none text-slate-900 dark:text-white focus:border-cyan-500 placeholder-slate-400 shadow-inner" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Charter Notes</label>
                                        <textarea placeholder="e.g. Call 2 days in advance. Includes life vests." value={charterNotes} onChange={e => setCharterNotes(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 outline-none text-slate-900 dark:text-white focus:border-cyan-500 placeholder-slate-400 h-20 resize-none text-sm shadow-inner" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Availability Toggle */}
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAvailable ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                                    <span className="material-symbols-outlined">{isAvailable ? 'visibility' : 'visibility_off'}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Status</h3>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{isAvailable ? 'Will publish once approved' : 'Hidden from feed'}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => setIsAvailable(!isAvailable)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Contact section */}
                {boatType && (
                    <ContactSection
                        fbUsername={fbUsername} setFbUsername={setFbUsername}
                        phone={phone} setPhone={setPhone}
                        email={email} setEmail={setEmail}
                        hint="Tourists will reach out here to book your service."
                    />
                )}

                {/* Submit */}
                {boatType && (
                    <button onClick={handlePost} disabled={isPending || isUploading}
                        className={`w-full block text-center font-bold text-lg py-4 rounded-xl shadow-lg mt-2 transition-all active:scale-95 ${isPending || isUploading ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed opacity-70' : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20'}`}>
                        {isPending || isUploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {isUploading ? 'Uploading Photos...' : 'Saving...'}
                            </div>
                        ) : (editId ? '✓ Save Changes' : '✓ Submit for Review')}
                    </button>
                )}

                {!boatType && (
                    <div className="text-center text-slate-400 dark:text-slate-600 text-sm py-8 animate-bounce">↑ Select your boat type above to continue</div>
                )}
            </div>
        </div>
    );
}
