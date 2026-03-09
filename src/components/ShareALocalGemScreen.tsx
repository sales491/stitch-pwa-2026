'use client';
import React, { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { createGem } from '@/app/actions/gems';
import { optimizeImage } from '@/utils/image-optimization';

export default function ShareALocalGemScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const gemId = searchParams.get('id');
  const isEditing = !!gemId;

  const [title, setTitle] = useState('');
  const [town, setTown] = useState('');
  const [description, setDescription] = useState('');

  // Location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Images
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Fetch initial data if editing
  React.useEffect(() => {
    if (isEditing) {
      const fetchGem = async () => {
        const { data, error } = await supabase
          .from('gems')
          .select('*')
          .eq('id', gemId)
          .single();

        if (data && !error) {
          setTitle(data.title);
          setTown(data.town);
          setDescription(data.description);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setImageUrls(data.images || []);
        }
        setInitialLoading(false);
      };
      fetchGem();
    }
  }, [gemId, isEditing, supabase]);

  const isFormValid = title.trim() && town && description.trim() && imageUrls.length > 0;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > 3) {
      setErrorMsg('You can only upload up to 3 photos.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const originalFile = files[i];

        // Optimize image client-side if needed (will also convert to JPEG)
        let fileToUpload = originalFile;
        if (originalFile.type.startsWith('image/')) {
          try {
            fileToUpload = await optimizeImage(originalFile, { maxWidth: 1080, quality: 0.8 });
          } catch {
            // Fallback to original if compression fails
          }
        }

        // Final size check (Fallback for 5MB)
        if (fileToUpload.size > 5 * 1024 * 1024) {
          throw new Error(`File ${originalFile.name} is still too large after compression.`);
        }

        const fileExt = 'jpg'; // We converted to jpeg in compressImage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gem-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gem-images')
          .upload(filePath, fileToUpload, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gem-images')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setImageUrls((prev) => [...prev, ...newUrls].slice(0, 3));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload images.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        setErrorMsg('Unable to retrieve your location. Please check browser permissions.');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setErrorMsg(null);

    startTransition(async () => {
      try {
        if (isEditing) {
          const { error } = await supabase
            .from('gems')
            .update({
              title,
              town,
              description,
              images: imageUrls,
              latitude,
              longitude,
            })
            .eq('id', gemId);
          if (error) throw error;
        } else {
          await createGem({
            title,
            town,
            description,
            images: imageUrls,
            latitude,
            longitude,
          });
        }

        router.push("/gems");
      } catch (err: any) {
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-main-light dark:text-text-main-dark">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-lg font-bold">{isEditing ? 'Edit Gem' : 'Post a Gem'}</h1>
        <div className="w-10"></div> {/* Spacer to keep title centered since Drafts is removed */}
      </header>

      {/* Main Content */}
      <main className="flex-1 no-scrollbar pb-32">
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {errorMsg}
          </div>
        )}

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
          {imageUrls.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${uploading ? 'bg-primary/5 cursor-not-allowed border-primary/20' : 'border-primary/40 bg-primary/5 hover:bg-primary/10 cursor-pointer'}`}
            >
              {uploading ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <p className="font-semibold text-primary">Compressing & Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm flex items-center justify-center text-primary transition-transform">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  </div>
                  <div className="text-center px-4">
                    <p className="font-semibold text-text-main-light dark:text-text-main-dark">Tap to upload photos</p>
                    <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">Show us the beauty of Marinduque (Max 3)</p>
                  </div>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 animate-in zoom-in">
                    <img src={url} alt="Uploaded Gem" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}

                {imageUrls.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center hover:border-primary bg-stone-50 dark:bg-stone-900 transition-colors"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-stone-500">add_a_photo</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark" htmlFor="place-name">
              What is this place?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark">
                <span className="material-symbols-outlined text-[20px]">flag</span>
              </span>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                id="place-name"
                placeholder="e.g., Poctoy White Beach"
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light dark:placeholder:text-text-sub-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
              />
            </div>
          </div>

          {/* Town Select */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark" htmlFor="town-select">
              Where in Marinduque?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark pointer-events-none">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </span>
              <select
                required
                value={town}
                onChange={e => setTown(e.target.value)}
                id="town-select"
                className="w-full pl-10 pr-10 py-3 appearance-none bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none cursor-pointer"
              >
                <option disabled value="">Select a municipality</option>
                <option value="Boac">Boac</option>
                <option value="Buenavista">Buenavista</option>
                <option value="Gasan">Gasan</option>
                <option value="Mogpog">Mogpog</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Torrijos">Torrijos</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark pointer-events-none">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </span>
            </div>
          </div>

          {/* Location Tagger Button */}
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${latitude ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/20 text-primary-dark dark:text-primary'}`}>
                {isLocating ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">
                    {latitude ? 'check' : 'map'}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start translate-y-0.5">
                <span className="font-medium text-sm text-text-main-light dark:text-text-main-dark">
                  {latitude ? 'Location Pinned' : 'Pin exact location with GPS (Optional)'}
                </span>
                {latitude && (
                  <span className="text-xs text-text-sub-light dark:text-text-sub-dark mb-1">
                    {latitude.toFixed(4)}, {longitude?.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
            {!latitude && <span className="material-symbols-outlined text-text-sub-light dark:text-text-sub-dark group-hover:translate-x-1 transition-transform">chevron_right</span>}
          </button>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark" htmlFor="story">
              Why is it a gem?
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              id="story"
              placeholder="Share the story, history, or your personal experience..."
              rows={4}
              className="w-full p-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light dark:placeholder:text-text-sub-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none resize-none"
            />
          </div>

          <div className="h-4" /> {/* Spacer */}
        </div>
      </main>

      {/* Bottom Action Bar (Floating) */}
      <div className="fixed bottom-[88px] left-0 right-0 p-4 bg-gradient-to-t from-background-light to-transparent dark:from-background-dark pointer-events-none z-40 max-w-md mx-auto">
        <button
          type="submit"
          disabled={!isFormValid || isPending}
          className={`pointer-events-auto w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isFormValid ? 'bg-primary hover:bg-primary-hover text-text-main-light shadow-primary/20 active:scale-[0.98]' : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'} ${isPending ? 'opacity-70' : ''}`}
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">{isEditing ? 'save' : 'send'}</span>
              {isEditing ? 'Save Changes' : 'Share with Community'}
            </>
          )}
        </button>
      </div>

      {/* Bottom Navigation spacer */}
      <div className="h-6 w-full bg-surface-light dark:bg-surface-dark hidden" />
    </form>
  );
}
