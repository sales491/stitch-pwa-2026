'use client';
import React, { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';
import { createListing } from '@/app/actions/listings';
import { generateSlug } from '@/data/listings';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';

export default function CreateNewListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [town, setTown] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair' | 'For Parts'>('Good');
  const [description, setDescription] = useState('');
  const [delivery, setDelivery] = useState(false);

  // Contact state
  const [fbUsername, setFbUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [filterError, setFilterError] = useState<string | null>(null);

  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListing() {
      if (!editId) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', editId)
        .single();

      if (data && !error) {
        setTitle(data.title);
        // data.price might be "₱1,000", price_value is 1000
        setPrice((data.price_value || 0).toString());
        setCategory(data.category);
        setTown(data.town);
        setCondition(data.condition || 'Good');
        setDescription(data.description);
        setImageUrls(data.images || [data.img].filter(Boolean));

        // Populate contact from DB if available
        if (data.contact_details) {
          setFbUsername(data.contact_details.fb_username || '');
          setPhone(data.contact_details.phone || '');
          setEmail(data.contact_details.email || '');
        }
      }
    }
    fetchListing();
  }, [editId, supabase]);

  const hasContact = fbUsername.trim() || phone.trim() || email.trim();
  const isFormValid = title.trim() && price.trim() && category && town && description.trim() && hasContact;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setFilterError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Optimize image (resizes to 1280px and converts to JPEG)
        const optimizedFile = await optimizeImage(file, { maxWidth: 1280, quality: 0.85 });

        const fileExt = 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `listing-photos/${fileName}`;

        // 2. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, optimizedFile, { upsert: true });

        if (uploadError) throw uploadError;

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setImageUrls((prev) => [...prev, ...newUrls].slice(0, 6)); // Limit to 6
    } catch (err: any) {
      setFilterError(err.message || "Failed to upload images. Ensure 'listings' bucket is created.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setFilterError(null);

    // Content filter check
    const filterResult = filterAllFields({ title, description });
    if (!filterResult.passed) {
      setFilterError(filterResult.reason ?? 'Content contains prohibited material.');
      return;
    }

    startTransition(async () => {
      try {
        const slug = generateSlug(title, town);
        // Format price for display
        const displayPrice = `₱${parseFloat(price).toLocaleString()}`;

        const payload = {
          title,
          price: displayPrice,
          price_value: parseFloat(price),
          category,
          town,
          description,
          condition,
          slug,
          img: imageUrls[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop',
          images: imageUrls,
          contact_details: {
            fb_username: fbUsername,
            phone: phone,
            email: email
          }
        };

        if (isEditing) {
          const { error: updateError } = await supabase
            .from('listings')
            .update(payload)
            .eq('id', editId);
          if (updateError) throw updateError;
        } else {
          await createListing(payload);
        }

        router.push("/marketplace?posted=1");
      } catch (err: any) {
        setFilterError(err.message || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
        <Link href="/marketplace" className="p-2 -ml-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-slate-900 dark:text-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold text-center flex-1">{isEditing ? 'Edit Listing' : 'New Listing'}</h1>
        <button type="button" className="text-stone-500 dark:text-stone-400 font-semibold text-sm hover:text-primary transition-colors">
          Drafts
        </button>
      </header>

      {/* Status messages */}
      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">pending</span>
          <span>Your listing will be <strong>reviewed by our team</strong> before going live in the Marketplace. Most listings are approved within minutes.</span>
        </div>

        {filterError && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span><strong>Listing error:</strong> {filterError}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="pb-24">
        {/* Photo Upload Section */}
        <div className="p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="grid grid-cols-3 gap-3">
            {/* Image Gallery Thumbnails */}
            {imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-sm animate-in zoom-in-50">
                <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/90 py-0.5 text-[8px] font-bold text-center text-slate-900">MAIN PHOTO</div>
                )}
              </div>
            ))}

            {/* Upload Button (only if < 6) */}
            {imageUrls.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden ${uploading
                  ? 'bg-stone-50 dark:bg-stone-900 border-stone-200 cursor-not-allowed'
                  : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 hover:border-primary'
                  }`}
              >
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-[10px] text-stone-500 font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-stone-600 dark:text-stone-400 group-hover:text-primary text-xl">add_a_photo</span>
                    </div>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 font-medium group-hover:text-primary">Add Photo</span>
                    <span className="text-[8px] text-stone-400">{imageUrls.length}/6</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 px-1">Tip: High-quality photos help your listing stand out in Marinduque.</p>
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Title</label>
            <input
              required
              value={title}
              onChange={(e) => { setTitle(e.target.value); setFilterError(null); }}
              className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 placeholder-stone-400"
              placeholder="What are you selling?"
              type="text"
              minLength={5}
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-stone-500 font-medium">₱</span>
              <input
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 pl-8 pr-4 text-slate-900 dark:text-slate-100 placeholder-stone-400"
                placeholder="0.00"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Category</label>
            <div className="relative">
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 appearance-none"
              >
                <option disabled value="">Select Category</option>
                <option value="Barter">Barter</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Bikes & Parts">Bikes & Parts</option>
                <option value="Boats & Parts">Boats & Parts</option>
                <option value="Business">Business</option>
                <option value="Cars, Trucks & Parts">Cars, Trucks & Parts</option>
                <option value="Clothes & Accessories">Clothes & Accessories</option>
                <option value="Construction & Materials">Construction & Materials</option>
                <option value="Crafts">Crafts</option>
                <option value="Education">Education</option>
                <option value="Electronics">Electronics</option>
                <option value="Farm & Garden">Farm & Garden</option>
                <option value="Foods">Foods</option>
                <option value="General">General</option>
                <option value="Heavy Equipment">Heavy Equipment</option>
                <option value="Home & Appliances">Home & Appliances</option>
                <option value="Motorcycles & Parts">Motorcycles & Parts</option>
                <option value="Services">Services</option>
                <option value="Tools">Tools</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Wanted">Wanted</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3.5 text-stone-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Condition</label>
            <div className="relative">
              <select
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 appearance-none"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="For Parts">For Parts</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3.5 text-stone-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Town */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Town</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-3.5 text-stone-500">location_on</span>
              <select
                required
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 appearance-none"
              >
                <option disabled value="">Select Town</option>
                <option value="Boac">Boac</option>
                <option value="Mogpog">Mogpog</option>
                <option value="Gasan">Gasan</option>
                <option value="Buenavista">Buenavista</option>
                <option value="Torrijos">Torrijos</option>
                <option value="Sta. Cruz">Sta. Cruz</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3.5 text-stone-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => { setDescription(e.target.value); setFilterError(null); }}
              className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 placeholder-stone-400 resize-none"
              placeholder="Describe your item in detail (condition, reason for selling, meet-up preferences)..."
              rows={4}
              minLength={20}
            />
          </div>

          {/* Delivery toggle */}
          <div className="flex items-center justify-between py-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-slate-100">Delivery Available</span>
              <span className="text-xs text-stone-500">Willing to deliver within Marinduque?</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={delivery}
                onChange={(e) => setDelivery(e.target.checked)}
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </div>

          {/* Contact Info */}
          <ContactSection
            fbUsername={fbUsername} setFbUsername={setFbUsername}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
          />
        </div>

        {/* Action Button */}
        <div className="p-4 mt-4">
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            className={`w-full block text-center font-bold text-lg py-4 rounded-full shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isFormValid
              ? 'bg-primary hover:opacity-90 text-white shadow-moriones-red/20'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
              } ${isPending ? 'opacity-70' : ''}`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Posting...
              </span>
            ) : (
              <>
                <span>{isPending ? 'Processing...' : (isEditing ? 'Save Changes' : 'Publish Listing')}</span>
                {hasContact && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-400 mt-3">
            By posting, you agree to our <Link className="text-primary hover:underline" href="/help-community-guidelines">Community Guidelines</Link>.
          </p>
        </div>
      </main>
      <div className="h-6 w-full bg-transparent" />
    </form>
  );
}
