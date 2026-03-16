'use client';
import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';
import { createTransportService } from '@/app/actions/transport';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';
import SuccessToast from '@/components/SuccessToast';

const TOWNS = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];

type VehicleType = 'Tricycle' | 'Motorcycle' | 'Jeepney' | 'Van / UV Express' | 'Private Car' | 'Truck';
type ServiceType = 'Passenger' | 'Delivery' | 'Both';

const OPERATOR_TYPES: {
    id: VehicleType;
    icon: string;
    label: string;
    sub: string;
    mode: 'on-demand' | 'scheduled';
}[] = [
        {
            id: 'Motorcycle',
            icon: '🏍️',
            label: 'Motorcycle (Habal-habal)',
            sub: 'On-demand rides & small deliveries',
            mode: 'on-demand',
        },
        {
            id: 'Tricycle',
            icon: '🛺',
            label: 'Tricycle',
            sub: 'Local on-demand transport within or between towns',
            mode: 'on-demand',
        },
        {
            id: 'Private Car',
            icon: '🚗',
            label: 'Car / Private Van',
            sub: 'Flexible — on-demand or semi-scheduled',
            mode: 'on-demand',
        },
        {
            id: 'Jeepney',
            icon: '🚌',
            label: 'Jeepney',
            sub: 'Fixed route with regular schedule; charters available',
            mode: 'scheduled',
        },
        {
            id: 'Van / UV Express',
            icon: '🚐',
            label: 'Door-to-Door Van (RoRo)',
            sub: 'Manila / Lucena routes via RoRo ferry; group bookings',
            mode: 'scheduled',
        },
    ];

const DEPARTURE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ScheduleRow({
    day,
    time,
    onRemove,
}: {
    day: string;
    time: string;
    onRemove: () => void;
}) {
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

export default function PostCommuteOrDeliveryListing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');
    const [isPending, startTransition] = useTransition();
    const [operatorType, setOperatorType] = useState<VehicleType | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType>('Passenger');
    const [selectedTowns, setSelectedTowns] = useState<string[]>([]);

    // Scheduled-specific state
    const [routeFrom, setRouteFrom] = useState('');
    const [routeTo, setRouteTo] = useState('');
    const [scheduleDay, setScheduleDay] = useState('Mon');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleList, setScheduleList] = useState<{ day: string; time: string }[]>([]);
    const [seats, setSeats] = useState(10);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [charterAvail, setCharterAvail] = useState(false);
    const [charterMinPax, setCharterMinPax] = useState(10);
    const [charterRate, setCharterRate] = useState('');
    const [charterNotes, setCharterNotes] = useState('');
    const [filterError, setFilterError] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // On-demand-specific state
    const [baseRate, setBaseRate] = useState('');
    const [availHours, setAvailHours] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    // Driver Name (New)
    const [driverName, setDriverName] = useState('');

    // Contact
    const [fbUsername, setFbUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        async function fetchListing() {
            if (!editId) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from('transport_services')
                .select('*')
                .eq('id', editId)
                .single();

            if (data && !error) {
                setOperatorType(data.vehicle_type);
                setServiceType(data.service_type);
                setSelectedTowns(data.towns_covered || []);
                setDriverName(data.driver_name || '');
                setPhone(data.contact_number || '');

                if (data.route) {
                    setRouteFrom(data.route.from || '');
                    setRouteTo(data.route.to || '');
                }

                if (data.schedule) {
                    setScheduleList(data.schedule || []);
                }

                setSeats(data.seats_available || 10);
                setPricePerSeat(data.price_per_seat?.toString() || '');
                setBaseRate(data.price_per_seat?.toString() || ''); // Reused
                setAvailHours(data.notes || '');

                setCharterAvail(data.charter_avail || false);
                if (data.charter_details) {
                    setCharterMinPax(data.charter_details.min_pax || 10);
                    setCharterRate(data.charter_details.rate || '');
                    setCharterNotes(data.charter_details.notes || '');
                }

                if (data.contact_details) {
                    setFbUsername(data.contact_details.fb_username || '');
                    setEmail(data.contact_details.email || '');
                }

                setIsAvailable(data.is_available ?? true);

                if (data.images) {
                    setExistingImages(data.images);
                }
            }
        }
        fetchListing();
    }, [editId]);

    const hasContact = fbUsername.trim() || phone.trim() || email.trim();
    const selected = OPERATOR_TYPES.find((o) => o.id === operatorType);
    const isScheduled = selected?.mode === 'scheduled';

    const toggleTown = (t: string) =>
        setSelectedTowns((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );

    const supabase = createClient();

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_IMAGE_MB = 5;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalCount = imageFiles.length + existingImages.length;
        const remaining = 2 - totalCount;
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

    const removeExistingImage = (url: string) => {
        setExistingImages(prev => prev.filter(u => u !== url));
    };

    const removeImage = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const addSchedule = () => {
        if (!scheduleTime.trim()) return;
        setScheduleList((prev) => [...prev, { day: scheduleDay, time: scheduleTime }]);
        setScheduleTime('');
    };

    const handlePost = async () => {
        if (!operatorType) return;

        setFilterError(null);

        // Validation
        const errors: string[] = [];
        if (!driverName.trim()) errors.push("Driver/Contact Name");
        if (imageFiles.length === 0 && existingImages.length === 0) errors.push("At least one verification photo (Selfie/Vehicle)");
        if (selectedTowns.length === 0) errors.push("At least one Town/Base Area");

        if (isScheduled) {
            if (!routeFrom.trim()) errors.push("Origin (From)");
            if (!routeTo.trim()) errors.push("Destination (To)");
            if (scheduleList.length === 0) errors.push("At least one Departure Schedule entry");
            if (!pricePerSeat || parseFloat(pricePerSeat) <= 0) errors.push("Price per Seat");
        } else {
            if (!availHours.trim()) errors.push("Availability Hours");
        }

        if (!hasContact) errors.push("At least one contact method (FB, Phone, or Email)");

        if (errors.length > 0) {
            setFilterError(`Please complete the following required fields: ${errors.join(", ")}`);
            // Scroll to error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const filterResult = filterAllFields({ routeFrom, routeTo, charterNotes, driverName, availHours });
        if (!filterResult.passed) {
            setFilterError(`Content issue: ${filterResult.reason ?? 'Prohibited material detected.'}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsUploading(true);
        try {
            let uploadedImages: string[] = [];
            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    const optimized = await optimizeImage(file, { maxWidth: 1024, quality: 0.8 });
                    const fileExt = 'jpg';
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `transport/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('listings')
                        .upload(filePath, optimized);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('listings')
                        .getPublicUrl(filePath);

                    uploadedImages.push(publicUrl);
                }
            }

            startTransition(async () => {
                    try {
                        const payload = {
                            driver_name: driverName,
                            vehicle_type: operatorType,
                            service_type: serviceType,
                            base_town: selectedTowns[0] || 'TBD',
                            towns_covered: selectedTowns,
                            contact_number: phone,
                            notes: availHours || charterNotes,
                            route: isScheduled ? { from: routeFrom, to: routeTo } : undefined,
                            schedule: isScheduled ? scheduleList : undefined,
                            charter_avail: charterAvail,
                            charter_details: charterAvail ? {
                                min_pax: charterMinPax,
                                rate: parseFloat(charterRate) || 0,
                                notes: charterNotes
                            } : undefined,
                            seats_available: seats,
                            price_per_seat: parseFloat(pricePerSeat) || parseFloat(baseRate) || 0,
                            contact_details: {
                                fb_username: fbUsername,
                                email: email
                            },
                            is_available: isAvailable,
                            images: [...existingImages, ...uploadedImages]
                        };

                        await createTransportService(payload, editId);
                        setShowSuccess(true);
                        setTimeout(() => {
                            router.push("/commute");
                            router.refresh();
                        }, 2000);
                    } catch (error: any) {
                        // Rollback: delete any images that were just uploaded
                        // to prevent orphaned blobs in Storage
                        if (uploadedImages.length > 0) {
                            const paths = uploadedImages.map(
                                (url) => url.split('/listings/')[1]
                            ).filter(Boolean);
                            if (paths.length > 0) {
                                await supabase.storage.from('listings').remove(paths);
                            }
                        }
                        setFilterError(error.message || 'Failed to save listing');
                    }
                });
        } catch (error: any) {
            setFilterError(error.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
            <SuccessToast visible={showSuccess} message={editId ? 'Listing updated!' : 'Transport service listed!'} />
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10">
                <Link href="/commute" className="text-slate-800 dark:text-slate-200">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">List Your Service</h1>
                <div className="w-8" />
            </div>

            <div className="p-4 space-y-6 pb-32 flex-1 w-full max-w-md mx-auto">


                {/* Filter error */}
                {filterError && (
                    <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400 shadow-sm animate-pulse">
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
                        <span><strong>Listing blocked:</strong> {filterError}</span>
                    </div>
                )}

                {/* Step 1 — Operator Type */}
                <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-moriones-red">commute</span>
                        What type of operator are you?
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        This determines which details you&apos;ll fill in below.
                    </p>
                    <div className="flex flex-col gap-2">
                        {OPERATOR_TYPES.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setOperatorType(opt.id)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${operatorType === opt.id
                                    ? 'border-moriones-red bg-moriones-red/5 dark:bg-moriones-red/10'
                                    : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                                    }`}
                            >
                                <span className="text-2xl shrink-0">{opt.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${operatorType === opt.id ? 'text-moriones-red dark:text-moriones-red/80' : 'text-slate-900 dark:text-white'}`}>
                                        {opt.label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.sub}</p>
                                </div>
                                {operatorType === opt.id && (
                                    <span className="material-symbols-outlined text-moriones-red shrink-0">check_circle</span>
                                )}
                                {opt.mode === 'scheduled' && (
                                    <span className="shrink-0 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                        Scheduled
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2 — Basic Info */}
                {operatorType && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-moriones-red mb-1">Contact/Driver Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Mang Jun or Jun's Express"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400"
                            />
                        </div>

                        {/* Visual Asset Uplink */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verification Photos</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">SELFIE & Vehicle Shots</p>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{(imageFiles.length + existingImages.length)}/2</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {existingImages.map((url, idx) => (
                                    <div key={`existing-${idx}`} className="relative aspect-square rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 overflow-hidden group">
                                        <img src={url} className="w-full h-full object-cover opacity-80" alt="Existing" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(url)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-moriones-red transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <div className="absolute top-1.5 left-1.5 bg-green-500/80 backdrop-blur-sm text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                                            Saved
                                        </div>
                                    </div>
                                ))}

                                {imageFiles.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 overflow-hidden group">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-moriones-red transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                        <div className="absolute top-1.5 left-1.5 bg-blue-500/80 backdrop-blur-sm text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                                            New
                                        </div>
                                    </div>
                                ))}

                                {(imageFiles.length + existingImages.length) < 2 && (
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-moriones-red/30 transition-all group">
                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-moriones-red group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-xl">add_a_photo</span>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Add Photo</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Service Type */}
                        {!isScheduled && (
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-moriones-red">swap_horiz</span>
                                    What do you offer?
                                </h2>
                                <div className="flex gap-2">
                                    {([
                                        { id: 'Passenger', icon: 'directions_car', label: 'Rides' },
                                        { id: 'Delivery', icon: 'local_shipping', label: 'Deliveries' },
                                        { id: 'Both', icon: 'swap_horiz', label: 'Both' },
                                    ] as const).map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setServiceType(opt.id)}
                                            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${serviceType === opt.id
                                                ? 'border-moriones-red bg-moriones-red/5 text-moriones-red'
                                                : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Towns Covered */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-moriones-red">location_on</span>
                                Towns / Base Area
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {TOWNS.map((town) => (
                                    <button
                                        key={town}
                                        onClick={() => toggleTown(town)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${selectedTowns.includes(town)
                                            ? 'bg-moriones-red border-moriones-red text-white'
                                            : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {town}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Base Rate & Hours */}
                        {!isScheduled && (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-moriones-red mb-1">Base Rate (₱)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 50"
                                        value={baseRate}
                                        onChange={(e) => setBaseRate(e.target.value)}
                                        className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-moriones-red mb-1">Hours</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 6AM–8PM"
                                        value={availHours}
                                        onChange={(e) => setAvailHours(e.target.value)}
                                        className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Availability Toggle */}
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAvailable ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                                    <span className="material-symbols-outlined">{isAvailable ? 'visibility' : 'visibility_off'}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Status</h3>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{isAvailable ? 'Visible to everyone' : 'Hidden from feed'}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAvailable(!isAvailable)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- SCHEDULED FIELDS (Jeepney + Door-to-Door) --- */}
                {operatorType && isScheduled && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Route */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4 shadow-sm">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-moriones-red">route</span>
                                Route
                            </h2>

                            <div className="relative border-l-2 border-slate-200 dark:border-zinc-700 ml-3 pl-6 space-y-4 py-2">
                                <div className="absolute w-3 h-3 rounded-full bg-moriones-red -left-[7px] top-4 border-2 border-white dark:border-zinc-900 shadow-sm" />
                                <div className="absolute w-3 h-3 rounded-full bg-slate-500 -left-[7px] bottom-4 border-2 border-white dark:border-zinc-900" />

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">From (Origin)</label>
                                    <input
                                        type="text"
                                        placeholder={operatorType === 'Van / UV Express' ? 'e.g. Boac, Marinduque' : 'e.g. Boac'}
                                        value={routeFrom}
                                        onChange={(e) => setRouteFrom(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-moriones-red placeholder-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">To (Destination)</label>
                                    <input
                                        type="text"
                                        placeholder={operatorType === 'Van / UV Express' ? 'e.g. Manila (via RoRo)' : 'e.g. Sta. Cruz'}
                                        value={routeTo}
                                        onChange={(e) => setRouteTo(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-moriones-red placeholder-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-3 shadow-sm">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-moriones-red">schedule</span>
                                Departure Schedule
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Add each departure day + time.</p>

                            {scheduleList.length > 0 && (
                                <div className="space-y-2">
                                    {scheduleList.map((s, i) => (
                                        <ScheduleRow
                                            key={i}
                                            day={s.day}
                                            time={s.time}
                                            onRemove={() =>
                                                setScheduleList((prev) => prev.filter((_, idx) => idx !== i))
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 items-end">
                                <div className="w-24">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Day</label>
                                    <select
                                        value={scheduleDay}
                                        onChange={(e) => setScheduleDay(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-moriones-red appearance-none"
                                    >
                                        {DEPARTURE_DAYS.map((d) => (
                                            <option key={d}>{d}</option>
                                        ))}
                                        <option value="Daily">Daily</option>
                                        <option value="Mon–Fri">Mon–Fri</option>
                                        <option value="Weekends">Weekends</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-moriones-red"
                                    />
                                </div>
                                <button
                                    onClick={addSchedule}
                                    className="flex items-center justify-center w-10 h-10 bg-moriones-red hover:bg-moriones-red/90 text-white rounded-xl transition-colors shrink-0 shadow-lg shadow-moriones-red/20"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Seats & Price */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-moriones-red mb-1">
                                    {operatorType === 'Van / UV Express' ? 'Seats' : 'Capacity'}
                                </label>
                                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-1 h-12 shadow-sm">
                                    <button
                                        onClick={() => setSeats((s) => Math.max(1, s - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-moriones-red"
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-slate-900 dark:text-white text-lg font-bold">{seats}</span>
                                    <button
                                        onClick={() => setSeats((s) => s + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-moriones-red"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-moriones-red mb-1">Price / Seat (₱)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={pricePerSeat}
                                    onChange={(e) => setPricePerSeat(e.target.value)}
                                    className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400 text-lg shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Group / Charter */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">groups</span>
                                        Charters?
                                    </h2>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark font-black uppercase tracking-widest mt-0.5">
                                        Private Bookings
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCharterAvail((v) => !v)}
                                    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${charterAvail ? 'bg-moriones-red' : 'bg-slate-300 dark:bg-zinc-700'}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${charterAvail ? 'translate-x-6' : ''}`}
                                    />
                                </button>
                            </div>

                            {charterAvail && (
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Min. Pax</label>
                                            <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-1 h-10 shadow-inner">
                                                <button onClick={() => setCharterMinPax((p) => Math.max(2, p - 1))} className="w-8 h-8 flex items-center justify-center text-moriones-red">
                                                    <span className="material-symbols-outlined text-[20px]">remove</span>
                                                </button>
                                                <span className="text-slate-900 dark:text-white font-bold">{charterMinPax}</span>
                                                <button onClick={() => setCharterMinPax((p) => p + 1)} className="w-8 h-8 flex items-center justify-center text-moriones-red">
                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Charter Rate (₱)</label>
                                            <input
                                                type="number"
                                                placeholder="Full trip"
                                                value={charterRate}
                                                onChange={(e) => setCharterRate(e.target.value)}
                                                className="w-full h-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400 shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                            Charter Notes
                                        </label>
                                        <textarea
                                            placeholder="e.g. Call 3 days in advance."
                                            value={charterNotes}
                                            onChange={(e) => setCharterNotes(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 outline-none text-slate-900 dark:text-white focus:border-moriones-red placeholder-slate-400 h-20 resize-none text-sm shadow-inner"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Contact Info — always shown once operator type is chosen */}
                {operatorType && (
                    <ContactSection
                        fbUsername={fbUsername} setFbUsername={setFbUsername}
                        phone={phone} setPhone={setPhone}
                        email={email} setEmail={setEmail}
                        hint="At least one contact method required — passengers will reach you here."
                    />
                )}

                {/* Post Button */}
                {operatorType && (
                    <button
                        onClick={handlePost}
                        disabled={isPending || isUploading}
                        className={`w-full block text-center font-bold text-lg py-4 rounded-xl shadow-lg mt-2 transition-all active:scale-95 ${isPending || isUploading
                            ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70'
                            : 'bg-moriones-red hover:bg-moriones-red/90 text-white shadow-moriones-red/20'
                            }`}
                    >
                        {isPending || isUploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {isUploading ? 'Uploading Photos...' : 'Saving...'}
                            </div>
                        ) : (editId ? '✓ Save Changes' : '✓ Post Listing')}
                    </button>
                )}

                {!operatorType && (
                    <div className="text-center text-slate-400 dark:text-slate-600 text-sm py-8 animate-bounce">
                        ↑ Select your operator type above to continue
                    </div>
                )}
            </div>
        </div>
    );
}
