'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost } from '@/app/actions/blog';
import Link from 'next/link';
import BottomNav from './BottomNav';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';

export default function AdminCreateBlogPost() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverageImageUrl, setCoverageImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      // 1. Optimize
      const optimized = await optimizeImage(file, { maxWidth: 1200, quality: 0.8 });

      // 2. Upload
      const fileExt = 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, optimized);

      if (uploadError) throw uploadError;

      // 3. Get URL
      const { data: { publicUrl } } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      setCoverageImageUrl(publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploading) return;
    setIsPublishing(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    if (coverageImageUrl) {
      formData.set('cover_image', coverageImageUrl);
    }

    const res = await createBlogPost(formData);

    if (res?.error) {
      setErrorMsg(res.error);
      setIsPublishing(false);
    } else {
      router.push('/the-hidden-foreigner-blog-feed');
      router.refresh();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center bg-white dark:bg-zinc-900 p-4 pb-2 justify-between border-b border-gray-100 dark:border-zinc-800">
          <Link href="/the-hidden-foreigner-blog-feed" className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">New Blog Post</h2>
          <div className="flex w-12 items-center justify-end"></div>
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex flex-col gap-5 p-4 pb-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-white text-sm font-bold">Cover Image</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative ${uploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 dark:bg-zinc-800 border-moriones-red/30 hover:bg-moriones-red/5'
                  }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-moriones-red/10 p-3 rounded-full text-moriones-red">
                      <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Tap to upload or take photo</p>
                    <p className="text-[10px] text-slate-500">1200 x 630 recommended</p>
                  </>
                )}
              </button>
              {coverageImageUrl && !uploading && (
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Image ready for publish
                </p>
              )}
            </div>

            {/* Blog Title */}
            <label className="flex flex-col gap-1.5">
              <span className="text-slate-900 dark:text-white text-sm font-bold">Blog Title</span>
              <input required name="title" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-moriones-red focus:ring-1 focus:ring-moriones-red transition-all outline-none" placeholder="e.g. The Hidden Falls of Paadjao" type="text" />
            </label>

            {/* Town Selector */}
            <label className="flex flex-col gap-1.5">
              <span className="text-slate-900 dark:text-white text-sm font-bold">Select Town</span>
              <div className="relative">
                <select name="location_tag" defaultValue="" className="w-full appearance-none rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-slate-900 dark:text-white focus:border-moriones-red focus:ring-1 focus:ring-moriones-red transition-all outline-none">
                  <option disabled value="">Choose a location...</option>
                  <option value="boac">Boac</option>
                  <option value="mogpog">Mogpog</option>
                  <option value="gasan">Gasan</option>
                  <option value="buenavista">Buenavista</option>
                  <option value="torrijos">Torrijos</option>
                  <option value="santa_cruz">Santa Cruz</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </label>

            {/* Rich Text Editor (Simulated) */}
            <label className="flex flex-col gap-1.5 flex-1">
              <div className="flex justify-between items-end">
                <span className="text-slate-900 dark:text-white text-sm font-bold">Write-up</span>
              </div>
              <div className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden focus-within:border-moriones-red focus-within:ring-1 focus-within:ring-moriones-red transition-all">
                <textarea required name="content" className="w-full p-4 h-64 bg-transparent border-none focus:ring-0 resize-none text-slate-900 dark:text-white placeholder-slate-400 text-sm leading-relaxed" placeholder="Tell the story of the hidden foreigner..." />
              </div>
            </label>

            {/* Options */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-900 dark:text-white text-sm font-medium">Save as Draft</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input name="is_draft" value="true" className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-moriones-red" />
              </label>
            </div>
          </div>
          <div className="h-8" />
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-[70px] z-20 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-900 dark:via-zinc-900">
          <button disabled={isPublishing} type="submit" className="w-full bg-moriones-red hover:bg-moriones-red/90 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100">
            {isPublishing ? (
              <span className="material-symbols-outlined animate-spin hidden">sync</span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
            {isPublishing ? 'Publishing...' : 'Publish to Feed'}
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute w-full bottom-0 z-30">
          <BottomNav />
        </div>
      </form>
    </>
  );
}
