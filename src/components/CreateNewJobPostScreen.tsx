'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';

export default function CreateNewJobPostScreen() {
  const [fbUsername, setFbUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);
  const hasContact = fbUsername.trim() || phone.trim() || email.trim();

  const handlePost = (e: React.MouseEvent) => {
    setFilterError(null);
    const result = filterAllFields({ title, description });
    if (!result.passed) {
      e.preventDefault();
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      return;
    }
    if (!hasContact) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div>
        {/* Header / Navigation */}
        <div className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-4 h-16">
            <Link href="/marinduque-jobs-listing-feed" className="text-slate-900 dark:text-slate-100 flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_back</span>
            </Link>
            <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Create Job Post</h1>
            <div className="w-10" /> {/* Spacer for center alignment */}
          </div>
          {/* Progress Stepper */}
          <div className="flex w-full flex-row items-center justify-center gap-3 pb-4">
            <div className="h-2 w-8 rounded-full bg-orange-500" />
            <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Auto-approved notice */}
        <div className="mx-4 mt-4 flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
          <span>Job openings go <strong>live immediately</strong> after passing our content guidelines check.</span>
        </div>

        {/* Filter error */}
        {filterError && (
          <div className="mx-4 mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
            <span><strong>Post blocked:</strong> {filterError}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
          <form className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Job Title</label>
              <input value={title} onChange={e => { setTitle(e.target.value); setFilterError(null); }} className="w-full h-14 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all" placeholder="e.g. Sales Associate" type="text" />
            </div>
            {/* Job Type */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Job Type</label>
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer">
                  <input defaultChecked className="peer sr-only" name="job_type" type="radio" />
                  <div className="px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:ring-1 peer-checked:ring-orange-500">
                    Full-time
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="peer sr-only" name="job_type" type="radio" />
                  <div className="px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:ring-1 peer-checked:ring-orange-500">
                    Part-time
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="peer sr-only" name="job_type" type="radio" />
                  <div className="px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:ring-1 peer-checked:ring-orange-500">
                    Casual
                  </div>
                </label>
              </div>
            </div>
            {/* Salary Range */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Salary Range (PHP)</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Min</span>
                  <input className="w-full h-14 pl-12 pr-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="0" type="number" />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Max</span>
                  <input className="w-full h-14 pl-12 pr-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="0" type="number" />
                </div>
              </div>
            </div>
            {/* Town Picker */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Location (Town)</label>
              <div className="relative">
                <select defaultValue="" className="w-full h-14 appearance-none rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 text-base text-slate-900 dark:text-slate-100 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none">
                  <option disabled value="">Select a town in Marinduque</option>
                  <option value="boac">Boac</option>
                  <option value="buenavista">Buenavista</option>
                  <option value="gasan">Gasan</option>
                  <option value="mogpog">Mogpog</option>
                  <option value="santa_cruz">Santa Cruz</option>
                  <option value="torrijos">Torrijos</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            {/* Job Description */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Description</label>
              <textarea value={description} onChange={e => { setDescription(e.target.value); setFilterError(null); }} className="w-full min-h-[140px] resize-none rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Describe the role, responsibilities, and what you're looking for..." />
            </div>
            {/* Requirements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Requirements</label>
                <button className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1" type="button">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Add more
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                <input className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none" placeholder="e.g. Must have own motorcycle" type="text" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                <input className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none" placeholder="e.g. Valid Driver's License" type="text" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 dark:text-gray-600 material-symbols-outlined" style={{ fontSize: 20 }}>radio_button_unchecked</span>
                <input className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none" placeholder="Add requirement..." type="text" />
              </div>
            </div>
            {/* Contact Info */}
            <ContactSection
              fbUsername={fbUsername} setFbUsername={setFbUsername}
              phone={phone} setPhone={setPhone}
              email={email} setEmail={setEmail}
              hint="At least one contact method required — job seekers will reach you here."
              colorClass="text-orange-500"
            />
            {/* Post Button */}
            <div className="pt-4 pb-8">
              <Link
                href={(hasContact && !filterError) ? '/marinduque-jobs-listing-feed' : '#'}
                onClick={handlePost}
                className={`block w-full text-center rounded-xl py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98] ${(hasContact && !filterError)
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 hover:shadow-orange-500/40'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
              >
                {hasContact ? 'Review & Post Job' : 'Add contact info to post'}
              </Link>
            </div>
          </form>
        </main>
        {/* Bottom Navigation */}
      </div>

    </>
  );
}
