'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';

export default function CreateNewListing() {
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
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
          <Link href="/marinduque-classifieds-marketplace" className="p-2 -ml-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold text-center flex-1">New Listing</h1>
          <button className="text-stone-500 dark:text-stone-400 font-semibold text-sm hover:text-primary transition-colors">
            Drafts
          </button>
        </header>

        {/* Auto-approved notice */}
        <div className="mx-4 mt-4 flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
          <span>Classified ads go <strong>live immediately</strong> after passing our content guidelines check.</span>
        </div>

        {/* Filter error */}
        {filterError && (
          <div className="mx-4 mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
            <span><strong>Listing blocked:</strong> {filterError}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {/* Photo Upload Section */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="col-span-2 aspect-[4/3] rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors group relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-stone-600 dark:text-stone-400 group-hover:text-primary text-2xl">add_a_photo</span>
                </div>
                <span className="text-stone-600 dark:text-stone-400 font-medium group-hover:text-primary">Add Photos</span>
                <span className="text-xs text-stone-400 dark:text-stone-500">0/10 photos added</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 px-1">Tip: Listings with photos sell 50% faster in Marinduque.</p>
          </div>

          {/* Form Fields */}
          <div className="px-4 space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Title</label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setFilterError(null); }}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 placeholder-stone-400"
                placeholder="What are you selling?"
                type="text"
              />
            </div>
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Price</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-stone-500">₱</span>
                <input className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 pl-8 pr-4 text-slate-900 dark:text-slate-100 placeholder-stone-400" placeholder="0.00" type="number" />
              </div>
            </div>
            {/* Category */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Category</label>
              <div className="relative">
                <select defaultValue="" className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 appearance-none">
                  <option disabled value="">Select Category</option>
                  <option value="barter">Barter</option>
                  <option value="health-beauty">Health &amp; Beauty</option>
                  <option value="bikes-parts">Bikes &amp; Parts</option>
                  <option value="boats-parts">Boats &amp; Parts</option>
                  <option value="business">Business</option>
                  <option value="cars-trucks-parts">Cars, Trucks &amp; Parts</option>
                  <option value="clothes-accessories">Clothes &amp; Accessories</option>
                  <option value="construction-materials">Construction &amp; Materials</option>
                  <option value="crafts">Crafts</option>
                  <option value="education">Education</option>
                  <option value="electronics">Electronics</option>
                  <option value="farm-garden">Farm &amp; Garden</option>
                  <option value="foods">Foods</option>
                  <option value="general">General</option>
                  <option value="heavy-equipment">Heavy Equipment</option>
                  <option value="home-appliances">Home &amp; Appliances</option>
                  <option value="motorcycles-parts">Motorcycles &amp; Parts</option>
                  <option value="services">Services</option>
                  <option value="tools">Tools</option>
                  <option value="toys-games">Toys &amp; Games</option>
                  <option value="wanted">Wanted</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-3.5 text-stone-500 pointer-events-none">expand_more</span>
              </div>
            </div>
            {/* Town */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Town</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-stone-500">location_on</span>
                <select defaultValue="" className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 appearance-none">
                  <option disabled value="">Select Town</option>
                  <option value="boac">Boac</option>
                  <option value="mogpog">Mogpog</option>
                  <option value="gasan">Gasan</option>
                  <option value="buenavista">Buenavista</option>
                  <option value="torrijos">Torrijos</option>
                  <option value="sta_cruz">Sta. Cruz</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-3.5 text-stone-500 pointer-events-none">expand_more</span>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Description</label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setFilterError(null); }}
                className="w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-slate-900 dark:text-slate-100 placeholder-stone-400 resize-none"
                placeholder="Describe your item in detail (condition, reason for selling, meet-up preferences)..."
                rows={4}
              />
            </div>
            {/* Delivery toggle */}
            <div className="flex items-center justify-between py-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-slate-100">Delivery Available</span>
                <span className="text-xs text-stone-500">Willing to deliver within Marinduque?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" defaultValue="" />
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
            <Link
              href={(hasContact && !filterError) ? '/marinduque-classifieds-marketplace' : '#'}
              onClick={handlePost}
              className={`w-full block text-center font-bold text-lg py-4 rounded-full shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${(hasContact && !filterError)
                  ? 'bg-primary hover:bg-yellow-400 text-slate-900'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed pointer-events-none'
                }`}
            >
              <span>{hasContact ? 'Post Listing' : 'Add contact info to post'}</span>
              {hasContact && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
            </Link>
            <p className="text-center text-xs text-stone-400 mt-3">
              By posting, you agree to our <Link className="text-primary hover:underline" href="/help-community-guidelines">Community Guidelines</Link>.
            </p>
          </div>
        </main>
        <div className="h-6 w-full bg-transparent" />
      </div>
    </>
  );
}
