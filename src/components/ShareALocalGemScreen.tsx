import React from 'react';

export default function ShareALocalGemScreen() {
  return (
    <>
      <div>
  {/* Header */}
  <header className="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
    <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-main-light dark:text-text-main-dark">
      <span className="material-symbols-outlined">close</span>
    </button>
    <h1 className="text-lg font-bold">Post a Gem</h1>
    <button className="text-primary font-bold text-sm hover:opacity-80 transition-opacity">
      Drafts
    </button>
  </header>
  {/* Main Content */}
  <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
    {/* Photo Upload Section */}
    <div className="p-4">
      <div className="relative w-full aspect-[4/3] rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 dark:bg-primary/10 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-primary/10 dark:hover:bg-primary/15 cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl">add_a_photo</span>
        </div>
        <div className="text-center px-4">
          <p className="font-semibold text-text-main-light dark:text-text-main-dark">Tap to upload photos</p>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">Show us the beauty of Marinduque</p>
        </div>
        {/* Hidden Input */}
        <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple type="file" />
      </div>
      {/* Horizontal scroll for uploaded previews (empty state placeholder hidden) */}
      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar hidden">
        {/* Example preview item */}
        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
          <img alt="Preview" className="w-full h-full object-cover" data-alt="Small beach thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDziNUi6RNwohnf6MLnbq0FB-487Elg5667_HYlHZV2r1dF0d0_zg-tQ0XWS9xv68IKsFq7l5zVaFxN9YT9ZdYCCOBQM73WW3nxO_vH8st-9WbYbDnWIHGIqsCQxBQCp2CFeQ4hfOKk1My2HYlPYYPAnvCiITwxVA5G8k4CHvq3USlzxiWElThn2wcoLPhhHrP4YgYY0EgW7LXzMzLeej7mgn3WGvKdRNfAtuuRSTxBxE4bCmjnWo8JbOokRCxNvwpVwkuyJT1DqxE" />
        </div>
      </div>
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
          <input className="w-full pl-10 pr-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light dark:placeholder:text-text-sub-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none" id="place-name" placeholder="e.g., Poctoy White Beach" type="text" />
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
          <select defaultValue="" className="w-full pl-10 pr-10 py-3 appearance-none bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none cursor-pointer" id="town-select">
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
      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary-dark dark:text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">map</span>
          </div>
          <span className="font-medium text-sm text-text-main-light dark:text-text-main-dark">Pin exact location on map</span>
        </div>
        <span className="material-symbols-outlined text-text-sub-light dark:text-text-sub-dark group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>
      {/* Description Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark" htmlFor="story">
          Why is it a gem?
        </label>
        <textarea className="w-full p-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light dark:placeholder:text-text-sub-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none resize-none" id="story" placeholder="Share the story, history, or your personal experience..." rows={4} defaultValue={""} />
      </div>
      <div className="h-4" /> {/* Spacer */}
    </div>
  </main>
  {/* Bottom Action Bar (Floating) */}
  <div className="fixed bottom-[88px] left-0 right-0 p-4 bg-gradient-to-t from-background-light to-transparent dark:from-background-dark pointer-events-none z-40 max-w-md mx-auto">
    <button className="pointer-events-auto w-full bg-primary hover:bg-primary-hover text-text-main-light font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
      <span className="material-symbols-outlined">send</span>
      Share with Community
    </button>
  </div>
  {/* Bottom Navigation */}
  {/* Safe area padding for iPhones without home button */}
  <div className="h-6 w-full bg-surface-light dark:bg-surface-dark hidden" />
</div>

    </>
  );
}
