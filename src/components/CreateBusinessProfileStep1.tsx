'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { filterAllFields } from '@/utils/contentFilter';
import { useRouter } from 'next/navigation';

export default function CreateBusinessProfileStep1() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);

  useEffect(() => {
    // Load existing data if any
    if (typeof window !== 'undefined') {
      setBusinessName(localStorage.getItem('bp_name') || '');
      setDescription(localStorage.getItem('bp_description') || '');
    }
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    setFilterError(null);
    const result = filterAllFields({ businessName, description });
    if (!result.passed) {
      e.preventDefault();
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      return;
    }

    // Persist data
    if (typeof window !== 'undefined') {
      localStorage.setItem('bp_name', businessName);
      localStorage.setItem('bp_description', description);
    }

    router.push('/create-business-profile-step2');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-white dark:bg-zinc-950 overflow-x-hidden shadow-xl sm:my-8 sm:rounded-2xl sm:border sm:border-slate-200 dark:sm:border-zinc-800">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-zinc-800 justify-between">
        <Link href="/directory" className="text-slate-800 dark:text-slate-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-moriones-red">Create Business Profile</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-2">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest">Step 1 of 3</p>
          <p className="text-moriones-red text-[10px] font-black uppercase tracking-widest">Basic Info</p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
          <div className="h-full rounded-full bg-moriones-red" style={{ width: '33%' }} />
        </div>
      </div>

      <div className="flex-1">
        {/* Hero Text */}
        <div className="px-6 py-4">
          <h1 className="text-2xl font-black leading-tight text-slate-900 dark:text-white mb-2">Let&apos;s start with the basics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tell us about your business so people in Marinduque can find you easily.</p>
        </div>

        {/* Filter error */}
        {filterError && (
          <div className="mx-6 mb-4 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
            <span><strong>Profile blocked:</strong> {filterError}</span>
          </div>
        )}

        {/* Notice */}
        <div className="mx-6 flex items-start gap-3 bg-moriones-red/[0.03] dark:bg-moriones-red/5 border border-moriones-red/10 rounded-2xl px-4 py-4 text-xs text-slate-600 dark:text-slate-400 mb-6 mt-2 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-moriones-red/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-moriones-red font-bold">verified_user</span>
          </div>
          <p className="leading-relaxed">
            All Business Profiles are reviewed by our team to maintain community trust. Your profile will go <strong>live after approval</strong>.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-6 px-6 pb-8">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Business Name</label>
            <input
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none transition-all shadow-sm"
              placeholder="e.g., Boac Heritage Hotel"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Description</label>
            <textarea
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none transition-all shadow-sm"
              placeholder="Briefly describe what you offer, your history, or specialty..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-30 w-full border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-4 backdrop-blur-md">
        <button
          onClick={handleNext}
          disabled={!businessName.trim() || description.length < 10}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-moriones-red px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-moriones-red/20 transition-all active:scale-[0.98] hover:bg-moriones-red/90 disabled:opacity-50 disabled:grayscale"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}
