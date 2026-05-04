'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useSupabase } from '@/hooks/useSupabase'
import Link from 'next/link'
import { optimizeImage } from '@/utils/image-optimization'
import SuccessToast from '@/components/SuccessToast';
import { deleteBusinessProfile, updateBusinessProfile } from '@/app/actions/business';
import PageHeader from '@/components/PageHeader';
import ImageUploadHint from '@/components/ImageUploadHint';

const CATEGORIES = [
    'Accommodation',
    'Agriculture / Farming',
    'Beauty / Personal Care',
    'Construction / Hardware',
    'Education / School',
    'Events / Party Needs',
    'Finance / Banking',
    'Gas / Fuel Station',
    'Healthcare / Medical',
    'Legal / Professional',
    'Pets / Veterinary',
    'Real Estate / Property',
    'Restaurant / Food',
    'Retail / Shop',
    'Services / Repair',
    'Tourism / Experiences',
    'Transportation',
    'Other'
];

const FOOD_CATEGORY_TYPES = new Set([
    'food & dining', 'restaurant', 'cafe', 'coffee shop', 'bar', 'eatery',
    'bakery', 'karenderia', 'carinderia', 'fast food', 'catering', 'food stall',
    'snack bar', 'bistro', 'grill', 'diner', 'buffet', 'kainan', 'ihaw-ihaw', 'bbq',
]);

export default function BusinessOnboarding() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading form...</div>}>
            <BusinessOnboardingForm />
        </Suspense>
    )
}

function BusinessOnboardingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const edit_id = searchParams.get('edit_id');
    const { user, profile } = useAuth();
    const supabase = useSupabase();

    // Form State
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebook, setFacebook] = useState('');
    const [messenger, setMessenger] = useState('');
    const [operatingHours, setOperatingHours] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [menuImageUrls, setMenuImageUrls] = useState<string[]>([]);
    const [deliveryAvailable, setDeliveryAvailable] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingMenuImages, setUploadingMenuImages] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Auto-fill email if available from Google OAuth
    useEffect(() => {
        if (user?.email && !email) {
            setEmail(user.email);
        }
    }, [user, email]);

    useEffect(() => {
        if (!edit_id || !user) return;
        async function fetchBusiness() {
            const { data, error } = await supabase.from('business_profiles').select('*').eq('id', edit_id).single();
            if (data && !error) {
                setBusinessName(data.business_name || '');
                setCategory(data.categories?.[0] || '');
                setBusinessType(data.business_type || '');
                setDescription(data.description || '');
                setLocation(data.location || '');
                setAddress(data.contact_info?.address || '');
                setPhone(data.contact_info?.phone || '');
                setEmail(data.contact_info?.email || '');
                setFacebook(data.social_media?.facebook || '');
                setMessenger(data.social_media?.messenger || '');
                setOperatingHours(data.operating_hours || '');
                setDeliveryAvailable(data.delivery_available ?? false);

                const urls: string[] = [];
                if (data.gallery_images && data.gallery_images.length > 0) {
                    urls.push(...data.gallery_images);
                } else if (data.gallery_image) {
                    urls.push(data.gallery_image);
                }
                setImageUrls(urls);

                if (data.menu_images && data.menu_images.length > 0) {
                    setMenuImageUrls(data.menu_images);
                }
            }
        }
        fetchBusiness();
    }, [edit_id, user, supabase]);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        setErrorMsg('');

        try {
            const newUrls: string[] = [];
            const toProcess = Array.from(files).slice(0, 4 - imageUrls.length);

            for (const file of toProcess) {
                const optimizedFile = await optimizeImage(file, { maxWidth: 1200, quality: 0.9, aspectRatio: 4/3 });
                const fileExt = 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `business-photos/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('listings')
                    .upload(filePath, optimizedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('listings')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            setImageUrls(prev => [...prev, ...newUrls].slice(0, 4));
        } catch (err) {
            setErrorMsg((err as Error).message || "Failed to upload photo");
        } finally {
            setUploadingImages(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingMenuImages(true);
        setErrorMsg('');

        try {
            const newUrls: string[] = [];
            const toProcess = Array.from(files).slice(0, 8 - menuImageUrls.length);

            for (const file of toProcess) {
                const optimizedFile = await optimizeImage(file, { maxWidth: 1080, quality: 0.85, aspectRatio: 3/4 });
                const fileExt = 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `business-photos/menu/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('listings')
                    .upload(filePath, optimizedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('listings')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            setMenuImageUrls(prev => [...prev, ...newUrls].slice(0, 8));
        } catch (err) {
            setErrorMsg((err as Error).message || "Failed to upload menu photo");
        } finally {
            setUploadingMenuImages(false);
            if (menuFileInputRef.current) menuFileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!user) {
            setErrorMsg('You must be logged in to create a business profile.');
            return;
        }

        if (!businessName || !category || !description || !location) {
            setErrorMsg('Please fill out all text fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 2. Insert or Update database
            const contactInfo = { phone: phone.trim(), email: email.trim(), address: address.trim() };
            const socialMedia = { 
                facebook: facebook.trim(), 
                messenger: messenger.trim() || facebook.trim(), // Fallback to FB page if empty
                logo: imageUrls[0] || undefined 
            };

            interface BusinessPayload {
                business_name: string;
                categories: string[];
                description: string;
                location: string;
                operating_hours: string;
                contact_info: { phone: string; email: string; address: string };
                social_media: { facebook: string; messenger: string; logo?: string };
                gallery_image: string | null;
                gallery_images: string[];
                delivery_available: boolean;
                menu_images: string[];
                owner_id?: string;
                is_verified?: boolean;
            }

            const payload: BusinessPayload = {
                business_name: businessName,
                categories: [category],
                description: description,
                location: location,
                operating_hours: operatingHours,
                contact_info: contactInfo,
                social_media: socialMedia,
                gallery_image: imageUrls[0] || null,
                gallery_images: imageUrls,
                delivery_available: deliveryAvailable,
                menu_images: menuImageUrls,
            };

            let newBusinessId = edit_id;

            if (edit_id) {
                // Update via server action (handles admin RLS bypass automatically)
                await updateBusinessProfile(edit_id, {
                    business_name: businessName,
                    categories: [category],
                    description: description,
                    location: location,
                    operating_hours: operatingHours,
                    contact_info: contactInfo,
                    social_media: socialMedia,
                    gallery_image: imageUrls[0] || undefined,
                    gallery_images: imageUrls,
                    delivery_available: deliveryAvailable,
                    menu_images: menuImageUrls,
                });
            } else {
                // Insert — check business count cap first (max 5 per user)
                const { count, error: countError } = await supabase
                    .from('business_profiles')
                    .select('id', { count: 'exact', head: true })
                    .eq('owner_id', user.id);

                if (countError) throw new Error(countError.message);

                if ((count ?? 0) >= 5) {
                    throw new Error('You have reached the maximum of 5 business listings per account.');
                }

                payload.owner_id = user.id;
                payload.is_verified = false;

                const { data: newProfile, error: insertError } = await supabase
                    .from('business_profiles')
                    .insert(payload)
                    .select('id')
                    .single();

                if (insertError) {
                    // 23505 = unique violation — the only unique constraint is on business_name
                    if (insertError.code === '23505') {
                        throw new Error('A business with that name is already registered. Please use a different business name.');
                    }
                    throw new Error(insertError.message);
                }

                newBusinessId = newProfile.id;
            }

            // Show success toast, wait, then redirect to the specific business profile
            setShowSuccessToast(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push(`/directory/b/${newBusinessId}`);
            
        } catch (err) {
            setErrorMsg((err as Error).message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!edit_id) return;
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            console.log('Calling deleteBusinessProfile action...'); 
            await deleteBusinessProfile(edit_id);
            console.log('Action successful.'); 

            // Give the database and Next.js cache a moment to settle
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to directory page and refresh
            window.location.href = '/directory';
        } catch (err) {
            console.error('Delete action failed:', err); 
            setErrorMsg((err as Error).message || 'Failed to delete business profile.');
            setIsSubmitting(false);
            setShowDeleteConfirm(false);
        }
    };



    return (
        <div className="min-h-screen pb-24 relative selection:bg-moriones-red/20">
            {/* Background Aesthetic */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-moriones-red/10 via-orange-500/5 to-transparent dark:from-moriones-red/5 z-0 pointer-events-none"></div>

            <div className="relative z-10 px-4 pt-10 pb-10 max-w-lg mx-auto">
                <PageHeader title={edit_id ? 'Manage Business' : 'Create Business'} subtitle="Marinduque Market Hub" />

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/5">

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3 rounded-xl text-sm flex gap-3 items-start border border-red-100 dark:border-red-900/30">
                            <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    {/* Photos */}
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Business Photos</label>
                            <span className="text-[10px] bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-black uppercase tracking-widest px-2 py-1 rounded">Max 4 Photos</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-2">
                            The <strong className="text-moriones-red">first photo</strong> you upload will be used as your main directory card cover. Show off your storefront, products, or services!
                        </p>
                        <ImageUploadHint
                            aspectRatio="4:3 Landscape"
                            minSize="800 x 600 px"
                            usedFor="Directory card & business profile gallery"
                            tip="Landscape photos work best. Show your shopfront, interior, or products."
                        />

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 shadow-sm">
                                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors z-10"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-moriones-red py-1.5 text-[8px] font-black text-white text-center tracking-widest leading-none shadow-t-sm z-10">MAIN DIRECTORY CARD</div>}
                                </div>
                            ))}

                            {imageUrls.length < 4 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages}
                                    className="aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center gap-2 hover:border-moriones-red/50 transition-all group cursor-pointer overflow-hidden"
                                >
                                    {uploadingImages ? (
                                        <div className="w-6 h-6 border-2 border-moriones-red border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center text-moriones-red group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">add_a_photo</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{imageUrls.length}/4 Photos</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Business Name</label>
                        <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Boac Heritage Cafe"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 focus:border-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Category</label>
                        <div className="relative">
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 focus:border-moriones-red/50 transition-all font-medium text-slate-700 dark:text-gray-200"
                            >
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Town</label>
                        <div className="relative">
                            <select
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 focus:border-moriones-red/50 transition-all font-medium text-slate-700 dark:text-gray-200"
                            >
                                <option value="" disabled>Select your Town</option>
                                {['Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos'].map(town => (
                                    <option key={town} value={town}>{town}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Street Address</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Where exactly are you located?"
                                className="w-full pl-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Operating Hours</label>
                        <input
                            type="text"
                            value={operatingHours}
                            onChange={(e) => setOperatingHours(e.target.value)}
                            placeholder="e.g., Mon-Sat: 8AM - 5PM, Sun: Closed"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                        />
                    </div>

                    {/* ── Food & Dining Only: Delivery + Menu Images ─────── */}
                    {(FOOD_CATEGORY_TYPES.has(category.toLowerCase()) || FOOD_CATEGORY_TYPES.has(businessType.toLowerCase())) && (
                        <>
                            {/* Delivery Available — simple Yes/No toggle switch */}
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-gray-300 cursor-pointer" htmlFor="delivery-toggle">
                                    <span className="material-symbols-outlined text-[18px] text-teal-500">delivery_dining</span>
                                    Delivery Available?
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-black transition-colors ${deliveryAvailable ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {deliveryAvailable ? 'Yes' : 'No'}
                                    </span>
                                    <button
                                        id="delivery-toggle"
                                        type="button"
                                        role="switch"
                                        aria-checked={deliveryAvailable}
                                        onClick={() => setDeliveryAvailable(d => !d)}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                                            deliveryAvailable ? 'bg-teal-500' : 'bg-slate-200 dark:bg-zinc-600'
                                        }`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                                            deliveryAvailable ? 'translate-x-7' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Menu Images upload */}
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-moriones-red">restaurant_menu</span>
                                        Menu &amp; Dish Photos
                                    </label>
                                    <span className="text-[10px] bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-black uppercase tracking-widest px-2 py-1 rounded">Max 8</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-3">
                                    Upload your <strong className="text-moriones-red">menu board</strong> photo first, then add dish photos. These appear in the Menu carousel on your profile.
                                </p>
                                <ImageUploadHint
                                    aspectRatio="3:4 Portrait"
                                    minSize="900 x 1200 px"
                                    usedFor="Menu carousel on your business profile"
                                    tip="Portrait format works best - photograph printed menus vertically."
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={menuFileInputRef}
                                    onChange={handleMenuImageUpload}
                                    className="hidden"
                                />

                                <div className="grid grid-cols-3 gap-2">
                                    {menuImageUrls.map((url, idx) => (
                                        <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 shadow-sm">
                                            <img src={url} alt={`Menu ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setMenuImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors z-10"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                            {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-moriones-red py-1 text-[7px] font-black text-white text-center tracking-widest">MENU BOARD</div>}
                                        </div>
                                    ))}

                                    {menuImageUrls.length < 8 && (
                                        <button
                                            type="button"
                                            onClick={() => menuFileInputRef.current?.click()}
                                            disabled={uploadingMenuImages}
                                            className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center gap-1.5 hover:border-moriones-red/50 transition-all group cursor-pointer"
                                        >
                                            {uploadingMenuImages ? (
                                                <div className="w-5 h-5 border-2 border-moriones-red border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-moriones-red text-[22px] group-hover:scale-110 transition-transform">add_a_photo</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{menuImageUrls.length}/8</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Contact Details</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09XX XXX XXXX or +639..."
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 ">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Social Media</label>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <div className="relative flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-moriones-red/50 transition-all">
                                    <div className="pl-4 pr-1 py-3.5 bg-slate-100 dark:bg-white/10 border-r border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 text-sm font-medium shrink-0 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                        facebook.com/
                                    </div>
                                    <input
                                        type="text"
                                        value={facebook}
                                        onChange={(e) => setFacebook(e.target.value.replace(/^(?:https?:\/\/)?(?:www\.)?facebook\.com\//i, '').replace(/^\//, ''))}
                                        placeholder="your.username"
                                        className="w-full bg-transparent border-none px-3 py-3.5 focus:outline-none focus:ring-0 font-bold placeholder:font-normal placeholder:text-slate-400"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 ml-1 leading-relaxed">
                                    <strong>How to find your FB username:</strong> Open the Facebook App &gt; Go to your Business Page &gt; Tap the <strong>three dots (...)</strong> below your cover photo &gt; Tap <strong>Copy Page Link</strong>. Paste it here!
                                </p>
                            </div>
                            
                            <div>
                                <div className="relative flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                                    <div className="pl-4 pr-1 py-3.5 bg-slate-100 dark:bg-white/10 border-r border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 text-sm font-medium shrink-0 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z"/>
                                        </svg>
                                        m.me/
                                    </div>
                                    <input
                                        type="text"
                                        value={messenger}
                                        onChange={(e) => setMessenger(e.target.value.replace(/^(?:https?:\/\/)?(?:www\.)?m\.me\//i, '').replace(/^\//, ''))}
                                        placeholder="your.username"
                                        className="w-full bg-transparent border-none px-3 py-3.5 focus:outline-none focus:ring-0 font-bold placeholder:font-normal placeholder:text-slate-400"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 ml-1 leading-relaxed">
                                    <strong>Messenger Link:</strong> Your chat username is often the same as your FB Account username. If left blank, we will try to use your Facebook Page username.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell customers what your business does..."
                            rows={4}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 focus:border-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400 resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 pb-2 space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || !user}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                ${isSubmitting || !user ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed shadow-none' : 'bg-moriones-red text-white hover:bg-moriones-red/90 shadow-moriones-red/20 hover:shadow-moriones-red/40 hover:-translate-y-0.5'}
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">{edit_id ? 'save' : 'storefront'}</span>
                                    {edit_id ? 'Save Changes' : 'Register Business'}
                                </>
                            )}
                        </button>

                        {edit_id && !showDeleteConfirm && (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleDeleteClick}
                                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-500 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                Delete Business
                            </button>
                        )}
                        
                        {showDeleteConfirm && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex flex-col items-center justify-center text-center mt-4">
                                <span className="material-symbols-outlined text-red-500 mb-2">warning</span>
                                <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-4">Are you sure you want to delete this business profile? This cannot be undone.</p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-zinc-800 dark:text-slate-300 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            'Yes, Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </form>
            </div>
            <SuccessToast 
                visible={showSuccessToast} 
                message={edit_id ? "Business profile updated successfully!" : "Business profile submitted for review!"} 
            />
        </div>
    )
}
