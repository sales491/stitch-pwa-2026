'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { filterAllFields } from '@/utils/contentFilter';
import { useRouter } from 'next/navigation';

export default function CreateBusinessProfileStep1() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    setFilterError(null);
    const result = filterAllFields({ businessName, description });
    if (!result.passed) {
      e.preventDefault();
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      return;
    }
    router.push('/create-business-profile-step2');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark overflow-x-hidden shadow-xl sm:my-8 sm:rounded-xl sm:border sm:border-border-light dark:sm:border-border-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 border-b border-border-light dark:border-border-dark justify-between">
        <Link href="/marinduque-business-directory" className="text-text-main dark:text-text-main-dark flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10 text-slate-900 dark:text-white">Create Business Profile</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-2">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-text-main dark:text-text-main-dark text-sm font-semibold uppercase tracking-wider">Step 1 of 3</p>
          <p className="text-teal-accent dark:text-teal-accent text-xs font-medium">Basic Info</p>
        </div>
        <div className="h-2 w-full rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: '33%' }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Text */}
        <div className="px-6 py-4">
          <h1 className="text-3xl font-extrabold leading-tight text-text-main dark:text-text-main-dark mb-2">Let&apos;s start with the basics</h1>
          <p className="text-text-sub dark:text-text-sub-dark text-base">Tell us about your business so people in Marinduque can find you easily.</p>
        </div>

        {/* Filter error */}
        {filterError && (
          <div className="mx-6 mb-4 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
            <span><strong>Profile blocked:</strong> {filterError}</span>
          </div>
        )}

        {/* Pending Review Notice */}
        <div className="mx-6 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-400 mb-4 mt-2">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">how_to_reg</span>
          <span>To ensure safety and quality, all Business Profiles must be <strong>approved by a moderator</strong> before appearing publicly.</span>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-6 px-6 pb-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-main dark:text-text-main-dark">Business Name</label>
            <input
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3.5 text-base text-text-main dark:text-text-main-dark placeholder:text-text-sub/50 dark:placeholder:text-text-sub-dark/50 focus:border-primary focus:outline-none transition-shadow"
              placeholder="e.g., Boac Heritage Hotel"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-main dark:text-text-main-dark">Description</label>
            <textarea
              className="w-full resize-none rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3.5 text-base text-text-main dark:text-text-main-dark placeholder:text-text-sub/50 dark:placeholder:text-text-sub-dark/50 focus:border-primary focus:outline-none transition-shadow"
              placeholder="Briefly describe what you offer..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer Action */}
      <div className="sticky bottom-0 z-10 w-full border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-4 backdrop-blur-md">
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] hover:bg-primary/90"
        >
          <span>Next Step</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
