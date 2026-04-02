'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { filterAllFields } from '@/utils/contentFilter';
import { createClient } from '@/utils/supabase/client';
import { createEvent } from '@/app/actions/events';
import { optimizeImage } from '@/utils/image-optimization';
import SuccessToast from '@/components/SuccessToast';
import BackButton from '@/components/BackButton';

export default function CreateEventPostScreen() {
  const router = useRouter();
  const supabase = createClient();

  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const isEditing = !!eventId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [town, setTown] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [posterRole, setPosterRole] = useState<'organizer' | 'community_poster' | 'barangay_rep' | 'event_reporter'>('organizer');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [filterError, setFilterError] = useState<string | null>(null);

  // Fetch initial data if editing
  React.useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (data && !error) {
          setTitle(data.title);
          setDescription(data.description);
          setDate(data.event_date);
          setEndDate(data.event_date_end || '');
          setTime(data.event_time);
          setTown(data.town);
          setVenue(data.location);
          setCategory(data.category);
          setPosterRole(data.poster_role || 'organizer');
          setExistingImages(data.images || [data.image].filter(Boolean));
        }
        setInitialLoading(false);
      };
      fetchEvent();
    }
  }, [eventId, isEditing, supabase]);

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_IMAGE_MB = 5;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const available = 2 - imageFiles.length;

    const validFiles: File[] = [];
    for (const file of files.slice(0, available)) {
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

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };


  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !town || !venue) {
      setFilterError('Please fill in all required fields: Title, Venue, Date, Time, Town, and Description.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFilterError(null);
    const result = filterAllFields({ title, description, venue });
    if (!result.passed) {
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // ── Sync with Server Schema ──
    if (title.length < 5) {
      setFilterError('Title must be at least 5 characters long.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (description.length < 20) {
      setFilterError('About section must be at least 20 characters long.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (venue.length < 2) {
      setFilterError('Please provide a more specific venue/location.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (endDate && new Date(endDate) < new Date(date)) {
      setFilterError('End date cannot be earlier than the start date.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    // Hoisted outside try so catch block can access it for Storage rollback
    const imageUrls: string[] = [];

    try {

      // 1. Upload Images if they exist
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          // Optimize for high-quality banner (1200px)
          const optimizedFile = await optimizeImage(file, { maxWidth: 1200, quality: 0.85 });

          const fileExt = 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `events/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('community_images')
            .upload(filePath, optimizedFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('community_images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      }

      // 2. Parse date/time
      const dateObj = new Date(date);
      const month = dateObj.getMonth();
      const dayOfMonth = dateObj.getDate();
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dateStr = `${monthNames[month]} ${dayOfMonth}`;
      const fullDateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      // Format time
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      const timeStr = `${h12}:${minutes} ${ampm}`;

      // 3. Prepare Payload
      const payload = {
        title,
        description,
        location: venue,
        town,
        event_date: date,
        event_time: time,
        date: dateStr,
        full_date: fullDateStr,
        time: timeStr,
        category,
        image: imageUrls[0] || existingImages[0] || '',
        images: [...existingImages, ...imageUrls],
        day_of_month: dayOfMonth,
        month: month,
        event_date_end: endDate || undefined,
        poster_role: posterRole,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('events')
          .update(payload)
          .eq('id', eventId);
        if (updateError) throw updateError;
      } else {
        const actionResult = await createEvent(payload);
        if (!actionResult.success) {
          setFilterError(actionResult.message || 'Failed to create event.');
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/events");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      // Rollback: remove any event images just uploaded if the DB save failed
      if (imageUrls.length > 0) {
        const paths = imageUrls
          .map(url => url.split('/community_images/')[1])
          .filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from('community_images').remove(paths);
        }
      }
      setFilterError(err.message || 'Error publishing event. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="relative flex w-full flex-col max-w-md mx-auto bg-white dark:bg-zinc-900 shadow-xl">
      <SuccessToast visible={showSuccess} message={isEditing ? 'Event updated!' : 'Event published!'} />
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-zinc-900 px-4 py-3 justify-between border-b border-gray-100 dark:border-zinc-800">
        <BackButton />
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">{isEditing ? 'Edit Event' : 'Create Event'}</h2>
      </header>

      {/* Filter error */}
      {filterError && (
        <div className="mx-4 mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
          <span><strong>Event blocked:</strong> {filterError}</span>
        </div>
      )}

      {/* Main Content Form */}
      <form onSubmit={handlePublish} className="flex-1 pb-24">
        {/* Upload Section */}
        <div className="px-4 py-5">
          <div className="grid grid-cols-2 gap-3">
            {existingImages.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-sm bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-700">
                <img src={url} className="w-full h-full object-cover" alt="Saved" />
                <button
                  type="button"
                  onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-sm text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Saved</div>
              </div>
            ))}

            {imageFiles.map((file, idx) => (
              <div key={idx} className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-sm bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-700">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                {idx === 0 && existingImages.length === 0 && <div className="absolute bottom-0 left-0 right-0 bg-primary/90 py-0.5 text-[8px] font-black text-slate-900 text-center uppercase tracking-tighter">Main Banner</div>}
              </div>
            ))}

            {(imageFiles.length + existingImages.length) < 2 && (
              <label className="aspect-[16/9] bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-primary/40 dark:border-primary/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden">
                <div className="bg-primary/20 text-primary p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{imageFiles.length + existingImages.length}/2 Photos</p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>


        <div className="h-2 bg-slate-50 dark:bg-zinc-950 w-full" />

        {/* Event Details Section */}
        <div className="px-4 py-5 space-y-5">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Event Details</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Title</label>
              <input
                required
                className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base placeholder:text-gray-400"
                placeholder="e.g., Moriones Festival Parade"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Venue / Specific Location</label>
              <input
                required
                className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base placeholder:text-gray-400"
                placeholder="e.g., Boac Town Plaza"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                  <input required className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date (Optional)</label>
                  <input className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Time</label>
                <input required className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            {/* Town */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Town Location</label>
              <select required value={town} onChange={(e) => setTown(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary h-12 px-4 text-base">
                <option disabled value="">Select a town</option>
                <option value="Boac">Boac</option>
                <option value="Mogpog">Mogpog</option>
                <option value="Gasan">Gasan</option>
                <option value="Buenavista">Buenavista</option>
                <option value="Torrijos">Torrijos</option>
                <option value="Santa Cruz">Santa Cruz</option>
              </select>
            </div>
            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Role</label>
              <select
                value={posterRole}
                onChange={(e) => setPosterRole(e.target.value as typeof posterRole)}
                className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary h-12 px-4 text-base"
              >
                <option value="organizer">🎯 Organizer — Ako ang nag-organisa</option>
                <option value="community_poster">📢 Community Poster — Nagbabahagi para sa komunidad</option>
                <option value="barangay_rep">🏛️ Barangay/LGU Rep — Opisyal na kinatawan</option>
                <option value="event_reporter">📰 Event Reporter — Press / media coverage</option>
              </select>
            </div>
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary h-12 px-4 text-base">
                <option value="Cultural">Cultural</option>
                <option value="Community">Community</option>
                <option value="Sports">Sports</option>
                <option value="Religious">Religious</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-2 bg-slate-50 dark:bg-zinc-950 w-full" />

        {/* About Section */}
        <div className="px-4 py-5 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About the Event</h3>
          <textarea
            required
            className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary min-h-[140px] p-4 text-base placeholder:text-gray-400 resize-none"
            placeholder="Describe what people can expect at this event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Inline Action Bar (Moved from fixed bottom) */}
        <div className="px-4 py-8 space-y-4 bg-slate-50/50 dark:bg-zinc-950/20 border-t border-gray-100 dark:border-zinc-800/50">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
            <span className="material-symbols-outlined text-sm">public</span>
            Creates SEO-Optimized Public Event Page
          </div>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-moriones-red px-6 py-4 text-base font-bold text-white shadow-lg shadow-moriones-red/20 transition-all active:scale-[0.98] hover:bg-moriones-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Processing...' : (isEditing ? 'Save Changes' : 'Publish Event')}</span>
            <span className="material-symbols-outlined text-xl">{isEditing ? 'save' : 'send'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
