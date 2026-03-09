'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const CATEGORIES = [
    "Food & Dining",
    "Retail & Shopping",
    "Home Services",
    "Professional Services",
    "Health & Wellness",
    "Accommodation",
    "Automotive",
    "Other"
];

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
    const supabase = createClient();

    // Form State
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebook, setFacebook] = useState('');
    const [operatingHours, setOperatingHours] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingGalleryImage, setExistingGalleryImage] = useState<string | null>(null);

    // Auto-fill email if available from Google OAuth
    useEffect(() => {
        if (user?.email && !email) {
            setEmail(user.email);
        }
    }, [user]);

    // Pre-fill form if editing an existing business profile
    useEffect(() => {
        if (!edit_id || !user) return;
        async function fetchBusiness() {
            const { data, error } = await supabase.from('business_profiles').select('*').eq('id', edit_id).single();
            if (data && !error) {
                setBusinessName(data.business_name || '');
                setCategory(data.categories?.[0] || '');
                setDescription(data.description || '');
                setLocation(data.location || '');
                setAddress(data.contact_info?.address || '');
                setPhone(data.contact_info?.phone || '');
                setEmail(data.contact_info?.email || '');
                setFacebook(data.social_media?.facebook || '');
                setOperatingHours(data.operating_hours || '');

                if (data.gallery_image) {
                    setImagePreview(data.gallery_image);
                    setExistingGalleryImage(data.gallery_image);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
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
            let galleryImageUrl = existingGalleryImage;

            // 1. Upload Image (If any)
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('business-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);

                const { data } = supabase.storage
                    .from('business-images')
                    .getPublicUrl(fileName);

                galleryImageUrl = data.publicUrl;
            }

            // 2. Insert or Update database
            const contactInfo = { phone: phone.trim(), email: email.trim(), address: address.trim() };
            const socialMedia = { facebook: facebook.trim(), messenger: facebook.trim() };

            const payload: any = {
                business_name: businessName,
                categories: [category],
                description: description,
                location: location,
                operating_hours: operatingHours,
                contact_info: contactInfo,
                social_media: socialMedia,
                gallery_image: galleryImageUrl,
            };

            if (edit_id) {
                // Update
                const { error: updateError } = await supabase
                    .from('business_profiles')
                    .update(payload)
                    .eq('id', edit_id);

                if (updateError) {
                    throw new Error(updateError.message);
                }
            } else {
                // Insert
                payload.owner_id = user.id;
                payload.is_verified = false;

                const { error: insertError } = await supabase
                    .from('business_profiles')
                    .insert(payload);

                if (insertError) {
                    // Determine if it violated the unique owner_id constraint
                    if (insertError.code === '23505') {
                        throw new Error('You already have a registered business profile!');
                    }
                    throw new Error(insertError.message);
                }
            }

            // Redirect automatically to the Business Directory
            if (edit_id) {
                router.push(`/business/${edit_id}`);
            } else {
                router.push('/directory');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen pb-24 relative selection:bg-moriones-red/20">
            {/* Background Aesthetic */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-moriones-red/10 via-orange-500/5 to-transparent dark:from-moriones-red/5 z-0 pointer-events-none"></div>

            <div className="relative z-10 px-4 pt-10 pb-10 max-w-lg mx-auto">
                <div className="mb-8 items-center flex gap-4">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1A1A1A] shadow-sm rounded-full border border-black/5 dark:border-white/5 text-slate-600 dark:text-gray-300">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight leading-tight">
                            {edit_id ? 'Manage Business' : 'Create Business'}
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                            {edit_id ? 'Update your business profile settings' : 'Join the Marinduque Market Hub'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/5">

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3 rounded-xl text-sm flex gap-3 items-start border border-red-100 dark:border-red-900/30">
                            <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Cover Image</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300
                                ${imagePreview ? 'border-transparent' : 'border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-moriones-red/50'}
                            `}
                        >
                            {imagePreview ? (
                                <>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                        <span className="text-white font-bold flex items-center gap-2 drop-shadow-md">
                                            <span className="material-symbols-outlined">edit</span> Change Image
                                        </span>
                                    </div>
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                </>
                            ) : (
                                <div className="text-center p-6 text-slate-500 dark:text-gray-400">
                                    <div className="w-12 h-12 mx-auto bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-gray-500">add_photo_alternate</span>
                                    </div>
                                    <span className="font-medium">Upload Image</span>
                                    <p className="text-xs opacity-70 mt-1">High quality, wide format works best</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
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

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Social & Hours</label>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                value={operatingHours}
                                onChange={(e) => setOperatingHours(e.target.value)}
                                placeholder="Operating Hours (e.g., Mon-Sat: 8AM - 5PM)"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                            />
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">@</span>
                                <input
                                    type="text"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    placeholder="Facebook Page Username (e.g. BoacCafe)"
                                    className="w-full pl-9 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                                />
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

                    <div className="pt-4 pb-2">
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
                    </div>

                </form>
            </div>
        </div>
    )
}
