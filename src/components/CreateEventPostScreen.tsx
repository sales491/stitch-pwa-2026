'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { filterAllFields } from '@/utils/contentFilter';
import { createClient } from '@/utils/supabase/client';

export default function CreateEventPostScreen() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [town, setTown] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [loading, setLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !town) {
      alert('Please fill in all required fields.');
      return;
    }

    setFilterError(null);
    const result = filterAllFields({ title, description });
    if (!result.passed) {
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      return;
    }

    setLoading(true);

    // Parse date for day_of_month and month
    const dateObj = new Date(date);
    const month = dateObj.getMonth();
    const dayOfMonth = dateObj.getDate();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const dateStr = `${monthNames[month]} ${dayOfMonth}`;
    const fullDateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Format time to AM/PM
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const timeStr = `${h12}:${minutes} ${ampm}`;

    const newEvent = {
      title,
      description,
      location: `${town} Center`,
      town,
      date: dateStr,
      full_date: fullDateStr,
      time: timeStr,
      category,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
      attendees: 0,
      trending: false,
      day_of_month: dayOfMonth,
      month: month
    };

    const { error } = await supabase
      .from('events')
      .insert([newEvent]);

    if (error) {
      alert(`Error publishing event: ${error.message}`);
      setLoading(false);
    } else {
      alert('Event published successfully!');
      router.push('/marinduque-events-calendar');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-zinc-900 shadow-xl overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-zinc-900 px-4 py-3 justify-between border-b border-gray-100 dark:border-zinc-800">
        <Link href="/marinduque-events-calendar" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">Create Event</h2>
      </header>

      {/* Filter error */}
      {filterError && (
        <div className="mx-4 mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
          <span><strong>Event blocked:</strong> {filterError}</span>
        </div>
      )}

      {/* Main Content Form */}
      <form onSubmit={handlePublish} className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Upload Section */}
        <div className="px-4 py-5">
          <div className="w-full aspect-[16/9] bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-primary/40 dark:border-primary/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group">
            <div className="bg-primary/20 text-primary p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Cover Photo</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">1200 x 630 recommended</p>
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
            {/* Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                <input required className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Time</label>
                <input required className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 px-4 text-base" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
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

        <div className="h-20" />
      </form>

      {/* Fixed Bottom Action Bar */}
      <div className="sticky bottom-0 z-10 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-center gap-1.5 mb-3 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
          <span className="material-symbols-outlined text-sm">public</span>
          Creates SEO-Optimized Public Event Page
        </div>
        <button
          disabled={loading}
          onClick={handlePublish}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Publishing...' : 'Publish Event'}</span>
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </div>
    </div>
  );
}
