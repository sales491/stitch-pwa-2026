import React from 'react';

export default function UserProfileDashboard2() {
  return (
    <>
      <div>
  <div className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
    <button className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-900 dark:text-white transition-colors">
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
    <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Edit Profile</h2>
    <button className="text-teal-accent font-semibold text-sm hover:opacity-80 transition-opacity">
      Save
    </button>
  </div>
  <form className="max-w-md mx-auto w-full px-4 pt-6 space-y-6">
    <div className="flex flex-col items-center justify-center">
      <div className="relative group cursor-pointer">
        <div className="h-32 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800 bg-cover bg-center border-4 border-white dark:border-neutral-700 shadow-md flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-neutral-400 text-[48px]" style={{fontVariationSettings: '"FILL" 1'}}>account_circle</span>
        </div>
        <div className="absolute bottom-1 right-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-2 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[18px] leading-none">photo_camera</span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 font-medium">Tap to change profile picture</p>
    </div>
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-accent text-[18px]">badge</span>
        Basic Info
      </h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 dark:border-neutral-700">
          <label className="block px-4 pt-3 pb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400" htmlFor="fullName">Full Name</label>
          <input className="w-full px-4 pb-3 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 sm:text-sm font-medium" id="fullName" placeholder="e.g. Juan dela Cruz" type="text" defaultValue="Juan dela Cruz" />
        </div>
        <div>
          <label className="block px-4 pt-3 pb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400" htmlFor="town">Home Town</label>
          <select defaultValue="" className="w-full px-4 pb-3 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white focus:ring-0 sm:text-sm font-medium appearance-none" id="town">
            <option disabled>Select your town</option>
            <option value="boac">Boac</option>
            <option value="buenavista">Buenavista</option>
            <option value="gasan">Gasan</option>
            <option value="mogpog">Mogpog</option>
            <option value="santa-cruz">Santa Cruz</option>
            <option value="torrijos">Torrijos</option>
          </select>
        </div>
      </div>
    </div>
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-accent text-[18px]">contact_phone</span>
          Contact Methods
        </h3>
        <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full font-medium">Pick at least one</span>
      </div>
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700">
        <div className="flex items-center px-4 py-1">
          <div className="flex-shrink-0 w-8 flex justify-center">
            <span className="material-symbols-outlined text-blue-500">chat</span>
          </div>
          <div className="flex-grow">
            <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="messenger">FB Messenger Link</label>
            <input className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm" id="messenger" placeholder="m.me/username" type="text" />
          </div>
        </div>
        <div className="flex items-center px-4 py-1">
          <div className="flex-shrink-0 w-8 flex justify-center">
            <span className="material-symbols-outlined text-green-600">call</span>
          </div>
          <div className="flex-grow">
            <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="phone">Phone Number</label>
            <input className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm" id="phone" placeholder="09XX XXX XXXX" type="tel" />
          </div>
        </div>
        <div className="flex items-center px-4 py-1">
          <div className="flex-shrink-0 w-8 flex justify-center">
            <span className="material-symbols-outlined text-green-500">chat_bubble</span>
          </div>
          <div className="flex-grow">
            <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="whatsapp">WhatsApp</label>
            <input className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm" id="whatsapp" placeholder="+63 9XX XXX XXXX" type="tel" />
          </div>
        </div>
        <div className="flex items-center px-4 py-1">
          <div className="flex-shrink-0 w-8 flex justify-center">
            <span className="material-symbols-outlined text-red-500">mail</span>
          </div>
          <div className="flex-grow">
            <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="email">Email Address</label>
            <input className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm" id="email" placeholder="juan@example.com" type="email" />
          </div>
        </div>
      </div>
      <p className="text-xs text-neutral-400 px-2 leading-relaxed">
        Your contact details will only be visible to verified members when you inquire about a listing.
      </p>
    </div>
    <div className="pt-6 pb-8">
      <button className="w-full bg-primary hover:bg-yellow-500 text-neutral-900 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2" type="button">
        <span>Save Profile</span>
        <span className="material-symbols-outlined text-[20px]">check_circle</span>
      </button>
    </div>
  </form>
</div>

    </>
  );
}
