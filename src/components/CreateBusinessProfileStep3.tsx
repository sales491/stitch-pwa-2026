'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBusinessProfile } from '@/app/actions/business';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';
import SuccessToast from '@/components/SuccessToast';

export default function CreateBusinessProfileStep3() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Local state for Step 3 specific fields
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const businessCategories = [
    'Food & Beverage', 'Retail', 'Handicrafts', 'Accommodation',
    'Transport', 'Services', 'Tours & Travel', 'Others'
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const newUrls: string[] = [];
      const toProcess = Array.from(files).slice(0, 4 - imageUrls.length);

      for (const file of toProcess) {
        // Optimize image (covers usually need higher quality, resizable to 1440px)
        const optimizedFile = await optimizeImage(file, { maxWidth: 1440, quality: 0.9 });

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
    } catch (err: any) {
      setError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Read data from localStorage
      const name = localStorage.getItem('bp_name') || '';
      const desc = localStorage.getItem('bp_description') || '';
      const location = localStorage.getItem('bp_location') || '';
      const address = localStorage.getItem('bp_address') || '';
      const phone = localStorage.getItem('bp_phone') || '';
      const messenger = localStorage.getItem('bp_messenger') || '';
      const fbPage = localStorage.getItem('bp_fb_page') || '';
      const email = localStorage.getItem('bp_email') || '';

      if (!name || !desc || !location) {
        throw new Error("Missing required information from previous steps.");
      }

      await createBusinessProfile({
        business_name: name,
        description: desc,
        location: `${location}${address ? `, ${address}` : ''}`,
        contact_info: {
          phone: phone || undefined,
          email: email || undefined,
          address: address || undefined,
        },
        social_media: {
          messenger: messenger || undefined,
          facebook: fbPage || undefined,
          logo: imageUrls[0] || undefined, // Using first image as logo fallback
        },
        categories: selectedCategories,
        gallery_image: imageUrls[0] || undefined,
        gallery_images: imageUrls,
      });

      // Clear localStorage
      ['bp_name', 'bp_description', 'bp_location', 'bp_address', 'bp_phone', 'bp_messenger', 'bp_fb_page', 'bp_email'].forEach(
        k => localStorage.removeItem(k)
      );

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/directory');
      }, 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to publish profile.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-white dark:bg-zinc-950 overflow-x-hidden shadow-xl sm:my-8 sm:rounded-2xl sm:border sm:border-slate-200 dark:sm:border-zinc-800">
      <SuccessToast visible={showSuccess} message="Profile submitted for review! We'll go live after admin approval." />
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-zinc-800">
        <Link href="/create-business-profile-step2" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-800 dark:text-slate-200">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-moriones-red">Create Business Profile</h1>
        <div className="w-10" />
      </header>

      {/* Progress */}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-2">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest">Step 3 of 3</p>
          <p className="text-moriones-red text-[10px] font-black uppercase tracking-widest">Finalization</p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
          <div className="h-full rounded-full bg-moriones-red" style={{ width: '100%' }} />
        </div>
      </div>

      <main className="flex-1 pb-32 py-6 px-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span><strong>Issue:</strong> {error}</span>
          </div>
        )}

        {/* Photos */}
        <section className="mb-10">
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Business Photos</h3>
              <span className="text-[10px] bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-black uppercase tracking-widest px-2 py-1 rounded">Max 4 Photos</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              The <strong className="text-moriones-red">first photo</strong> you upload will be used as your main directory card cover. Show off your storefront, products, or services!
            </p>
          </div>

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
              <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 shadow-sm">
                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-moriones-red py-1.5 text-[8px] font-black text-white text-center tracking-widest leading-none shadow-t-sm">MAIN DIRECTORY CARD</div>}
              </div>
            ))}

            {imageUrls.length < 4 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center gap-2 hover:border-moriones-red/30 transition-all group"
              >
                {uploading ? (
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
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Select Categories</h3>
          <div className="flex flex-wrap gap-2">
            {businessCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategories.includes(cat)
                  ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:border-moriones-red/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Visibility Badge */}
        <section className="bg-moriones-red/5 dark:bg-moriones-red/10 rounded-3xl p-6 border border-moriones-red/10 relative overflow-hidden mb-8">
          <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-8xl text-moriones-red/5 rotate-12 pointer-events-none">verified</span>
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-moriones-red/20 flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-moriones-red font-bold text-2xl">verified</span>
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-slate-900 dark:text-white mb-1">Get Verified Visibility</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your profile will go through a verification check. Verified businesses appear higher in search results.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-30 w-full border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-4 backdrop-blur-md">
        <button
          onClick={handlePublish}
          disabled={isSubmitting || uploading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-moriones-red px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-moriones-red/20 transition-all active:scale-[0.98] hover:bg-moriones-red/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined font-black">check_circle</span>
              <span>Publish Business Profile</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
