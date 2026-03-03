import React from 'react';

export default function AdminCreateBlogPost() {
  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-white dark:bg-zinc-900">
  {/* Header */}
  <div className="sticky top-0 z-10 flex items-center bg-white dark:bg-zinc-900 p-4 pb-2 justify-between border-b border-gray-100 dark:border-zinc-800">
    <div className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full justify-center transition-colors">
      <span className="material-symbols-outlined">arrow_back</span>
    </div>
    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">New Blog Post</h2>
    <div className="flex w-16 items-center justify-end">
      <button className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-base font-bold leading-normal tracking-[0.015em] shrink-0">
        Drafts
      </button>
    </div>
  </div>
  {/* Main Content Scrollable Area */}
  <div className="flex-1 overflow-y-auto pb-24">
    {/* Image Upload Section */}
    <div className="flex w-full flex-col p-4 gap-4">
      <div className="w-full gap-2 overflow-hidden bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center py-8 px-4 transition-colors hover:border-primary/50 group cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
        </div>
        <div className="text-center mt-2">
          <p className="text-slate-900 dark:text-white font-bold text-sm">Upload Photos</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Tap to select from gallery</p>
        </div>
      </div>
      {/* Preview of uploaded images (Empty state shown above, populated state simulation below) */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden group">
          <img alt="Marinduque Beach Sunset" className="w-full h-full object-cover" data-alt="Marinduque Beach Sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK7AOoXG-2EYfTvsSQasEKTmLkufSXi-5Ho7DqDGVvmfuTzQYV6OkJfKWGcZN7-ObMCIEl1B8XOU9DZRXQ-u_sGvSsmPeB2RxXkM1JDmZt-z6FX-zqEVSzorUl3Owj5MYSN4gwgGjDuFghC9ZPc_6nzZULpN97meJ1BT4HD3Z48cVt2ddtl-RIU23mwRq2-ofdxN2whRRo94K4P1A0gBZTm0ixMLViwRO5qcP53f9O2kGRRsD_7Imz4jVPOTQoiUZ8rtvafZHwAqA" />
          <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden group">
          <img alt="Traditional Moriones Mask" className="w-full h-full object-cover" data-alt="Traditional Moriones Mask" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7gatq62NGHSemy2WHJEAdcHESuOGmEoRPpIwPYLASkoB2_LtGlcgiERW0xdlbFgmMG4AqUY34BSZpzgV6XCXpH7OJIuCQMW-B6Lb_uRb1mklaooT8LvF9Dqkdte_F6I0iYkFmJtSbF7tZSFtIYRcYY5ye_h4WbAKAkmutKMJKYi8JOslmvu-7DgtKLaUQyVLbrUMRf2thaMm14lVFxTrBtSR-xCoUsPuUVDpAeufV3OoMY4MbsCkejBaQCpQ9h5h-rNcrYrRFHZU" />
          <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div className="flex-shrink-0 w-24 h-24 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700">
          <span className="material-symbols-outlined text-slate-400">add</span>
        </div>
      </div>
    </div>
    {/* Form Fields */}
    <div className="flex flex-col gap-5 px-4 pb-6">
      {/* Blog Title */}
      <label className="flex flex-col gap-1.5">
        <span className="text-slate-900 dark:text-white text-sm font-bold">Blog Title</span>
        <input className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="e.g. The Hidden Falls of Paadjao" type="text" />
      </label>
      {/* Town Selector */}
      <label className="flex flex-col gap-1.5">
        <span className="text-slate-900 dark:text-white text-sm font-bold">Select Town</span>
        <div className="relative">
          <select defaultValue="" className="w-full appearance-none rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none">
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
          <span className="text-xs text-slate-400">Markdown supported</span>
        </div>
        <div className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          {/* Toolbar */}
          <div className="flex items-center gap-1 border-b border-gray-100 dark:border-zinc-700 p-2 bg-gray-50 dark:bg-zinc-800/50 overflow-x-auto">
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">format_bold</span>
            </button>
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">format_italic</span>
            </button>
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-zinc-600 mx-1" />
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
            </button>
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">format_quote</span>
            </button>
          </div>
          <textarea className="w-full p-4 h-48 bg-transparent border-none focus:ring-0 resize-none text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed" placeholder="Tell the story of the hidden foreigner..." defaultValue={""} />
        </div>
      </label>
      {/* Options */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-900 dark:text-white text-sm font-medium">Preview Mode</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input className="sr-only peer" type="checkbox" defaultValue="" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
        </label>
      </div>
    </div>
    {/* Bottom Spacer for NavBar */}
    <div className="h-8" />
  </div>
  {/* Sticky Action Bar */}
  <div className="sticky bottom-[70px] z-20 px-4 pb-4 pt-2 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark">
    <button className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
      <span className="material-symbols-outlined">send</span>
      Publish to Feed
    </button>
  </div>
  {/* Bottom Navigation Bar */}
  <div className="sticky bottom-0 z-30 flex gap-2 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pb-5 pt-2">
    <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors" href="/marinduque-events-calendar">
      <span className="material-symbols-outlined text-2xl">home</span>
      <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
    </a>
    <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors" href="/marinduque-connect-home-feed">
      <span className="material-symbols-outlined text-2xl">newspaper</span>
      <p className="text-xs font-medium leading-normal tracking-[0.015em]">Blog</p>
    </a>
    <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors" href="/marinduque-connect-home-feed">
      <span className="material-symbols-outlined text-2xl">calendar_month</span>
      <p className="text-xs font-medium leading-normal tracking-[0.015em]">Events</p>
    </a>
    <a className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-primary dark:text-primary" href="/marinduque-connect-home-feed">
      <span className="material-symbols-outlined text-2xl font-variation-settings-fill">admin_panel_settings</span>
      <p className="text-xs font-medium leading-normal tracking-[0.015em]">Admin</p>
    </a>
  </div>
</div>

    </>
  );
}
