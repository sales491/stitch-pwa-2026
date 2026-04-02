'use client';

import React from 'react';
import BackButton from '@/components/BackButton';

export default function ListingDetailsView() {
  return (
    <>
      <div>
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-4 h-16">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-slate-100">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold truncate px-4">Honda Click 125i</h2>
            <div className="flex gap-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-slate-100">
                <span className="material-symbols-outlined text-2xl">favorite</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-slate-100">
                <span className="material-symbols-outlined text-2xl">share</span>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden pb-24">
          {/* Image Gallery */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full">
              {/* Image 1 */}
              <div className="snap-center shrink-0 w-full h-full bg-cover bg-center" data-alt="Red Honda motorcycle side view parked on street" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQYWzN4kJah5jeUy7GSoE_v6ZEMNSl06pKD-Ug1MenKDqAEHPzD5cBNdAAD_QBYM-6BLWYYIGgDySt1OFdo8XW42kKDxABu0xuOYj64LsotmBd8exBGq8epCNnQOEZSoeB2keC6yyg5PylpaSOkYuykRfCA_TDKPBFPgkNWCwR-9gEYWU9eb7m59Ka6fuhxSIoC2pFJAlMJ4zk4f3G0jYzAdaOZsJEbPGB9TJ0uyEnldhaMSE9VPMc5stiLQi-U9VTM3HACn7TF9Y")' }} />
              {/* Image 2 */}
              <div className="snap-center shrink-0 w-full h-full bg-cover bg-center" data-alt="Motorcycle dashboard close up detail" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBMgINyr_74GqeHPc4vWgu2INH_Nrssw7Ru7Z1EsPn6MAg3CnfZt_rmbXnk-i81G_Ibcw7AxNJ8nHhGOWixSfamEuN2XUuLGHF030JFh5uZnRNr9mldVIIZbkIUIjS-n9uz42h6xG_WcB6tp9yZGn2zNhXPnYNkOmKoxgHCAjLTeINhqr6X5CIq5RvhYo6kzgJ9R0fQbcjFMmNibppn_TrWjL2y6cR7RgZLsFWA8B1nTCAXivl94vzveDnAuLaZSXJQ55bEefU37Y")' }} />
              {/* Image 3 */}
              <div className="snap-center shrink-0 w-full h-full bg-cover bg-center" data-alt="Motorcycle rear view with exhaust pipe" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqJpjzin9OT2NzjS-YvCWTx0LUfBQluZpu5m_MwFvty7dYblBFeQRq71PKt4PrKDvyYtwd2NIK9phc5H4WiPlNIiKvsRcbmr_Y49EHGP3t8CKC3nnkgp-3h1B8rLh8DYMLTF9PnUtdhWYuKNb3Ue9irhvYF4BOsuEBmcrdlUZwXOsQ4j0gMQjO3pZcGNja3Ukjltln8n68lN0zUAYY4P676oAdZPiGUFeNSxjbWADtlaIMiUji-GrAVCnDQUkdFQ7rh4y5QYBz6Us")' }} />
            </div>
            {/* Image Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-sm" />
              <div className="w-2 h-2 rounded-full bg-white/60 shadow-sm" />
              <div className="w-2 h-2 rounded-full bg-white/60 shadow-sm" />
            </div>
            {/* Category Tag */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-black/60 text-slate-800 dark:text-white backdrop-blur-sm shadow-sm">
                Vehicles
              </span>
            </div>
          </div>
          {/* Listing Details */}
          <div className="px-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Honda Click 125i Game Changer 2021</h1>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">₱68,500</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">₱72,000</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>Santa Cruz, Marinduque</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-[18px]">speed</span>
                <span>12,000 km</span>
              </div>
            </div>
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-6" />
            {/* Seller Info */}
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                      <img alt="Seller profile picture" className="w-full h-full object-cover" data-alt="Smiling man portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVDAI4ZJbc3Hj8_TSgFN1ugD-Jnot6hkdbWf3mq8Gw4Zdka7icSrRdxdwlIbyO8SynPlwr_9gb8GL24CL2QMhKS4MN-jOfRVBO9Vy_gcI9kwdc9xkcLR34m1M9J-N9YEvtAldrc-Dhi25byLasnB790riFVjYae2sIZYTAh6j2NJfKZhyjcl9n_kFoXnrv-MaquQMQQwACu8a5cDXvM2-_1R1zi_iPeFrqX6020IUKYB4k8u4W-lIpFW2PWGdiHIlurrOg_PHjB54" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-slate-800 w-4 h-4 rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Juan Dela Cruz</h3>
                      <span className="material-symbols-outlined text-primary text-[18px]" title="Verified Local">verified</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Member since 2019 • Response: Fast</p>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 bg-primary text-slate-900 font-bold py-2.5 px-4 rounded-lg active:scale-95 transition-transform hover:bg-primary/90">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  Chat
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold py-2.5 px-4 rounded-lg active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-600">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Call
                </button>
              </div>
            </div>
            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Description</h3>
              <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-2">
                <p>Selling my well-maintained Honda Click 125i. Used mostly for city driving around Poblacion. All stock parts, never been opened. Regular change oil every 1,500km.</p>
                <p>RFS: Upgrading to 4 wheels.</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Registered until Oct 2024</li>
                  <li>Complete original papers (OR/CR)</li>
                  <li>First owner</li>
                  <li>No issues, sasakyan na lang</li>
                </ul>
              </div>
              <button className="mt-2 text-primary text-sm font-semibold flex items-center gap-1">
                Read more <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
            {/* Attributes */}
            <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Condition</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Used - Good</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Brand</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Honda</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Model Year</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">2021</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Color</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Matte Black</p>
              </div>
            </div>
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-6" />
            {/* Map Location */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Location</h3>
              <div className="rounded-xl overflow-hidden relative h-48 w-full shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* Static Map Placeholder */}
                <div className="absolute inset-0 bg-cover bg-center opacity-80" data-alt="Map view of Santa Cruz Marinduque" data-location="Santa Cruz, Marinduque" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzPjGYFl_piuoXIIUVMXYLLFzyn-kD2k2kWXbdSP3rZntfxxUQ-PTR9sc2U5VcZUTKIkUKgd7h5-7fCz353jDC7u24V493vUm8mw3cv_dFFFvFG29aILx0TB_oYGyGmMH6tLijHA9w5VBbGnuWbRMOD-o1ZWCmqUQPbHNfcEzbKZbTOebCQtlmNY87VG_sKMyM26szYRvei_ZAkRbmv4mM-PcIyr8hO0zPBQ78cu73p8oKMlPKzgJt0pNuho0H0o_G_E0ty2_IvsU")' }} />
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform -translate-y-4">
                    <span className="material-symbols-outlined text-2xl">location_on</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">near_me</span>
                Santa Cruz, Marinduque (Approximate location)
              </p>
            </div>
            {/* Safety Tips */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 mb-8">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">security</span>
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Safety Tips</h4>
                  <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                    Meet in public places. Check the item before buying. Don&apos;t pay in advance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Bottom Navigation Bar (Sticky at bottom) */}
        {/* Floating Action Buttons for quick contact (visible on scroll up typically, but fixed here for simplicity) */}
        <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40 max-w-md mx-auto">
          <button className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 p-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 active:scale-90 transition-transform">
            <span className="material-symbols-outlined block">sms</span>
          </button>
        </div>
      </div>

    </>
  );
}
