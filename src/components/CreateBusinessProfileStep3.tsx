import React from 'react';
import Link from 'next/link';

export default function CreateBusinessProfileStep3() {
  return (
    <>
      <div>
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <Link href="/create-business-profile-step2" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors text-slate-900">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Create Business Profile</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 flex flex-col w-full max-w-md mx-auto pb-32">
          <div className="px-5 py-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Step 3 of 3</p>
                <h2 className="text-2xl font-bold mt-1 text-slate-900">Gallery &amp; Finalization</h2>
              </div>
              <span className="text-sm font-medium text-slate-500">100%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-full" />
            </div>
          </div>
          <section className="px-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Business Photos</h3>
              <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">Required</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="col-span-2 aspect-[2/1] border-2 border-dashed border-slate-300 rounded-xl bg-surface-light hover:bg-slate-100 hover:border-primary transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Upload Cover Photo</span>
              </button>
              <div className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                <div className="absolute inset-0 bg-cover bg-center" data-alt="Modern store interior with warm lighting" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB01JTD_l3rVgYuy8LTrEIX3G8QedoAkSuDF2J3_4M3R07dBUwcvSmT-R58qX_c3bxgqNBe_chsFdnS11BwnvZmxWWfxk99ETI8PyYqMIXzxchG-2L6bsUTEDRb7_mHGaL_tAUwmVCYD3aBUsckUZx4GBrb2vU_PCR_kIvnovnBmDEoW2Hr0vPFrIPyy_Xzfb8gws68yTOGtCHSaMNjViWQK8aIdZ6JRm0hptkcMytBCs_zrwwR_AcHUmqOy5Ls7b7dM1HT9QDI6jQ")' }} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/90 p-2 rounded-full hover:bg-white text-red-500 shadow-sm transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                <div className="absolute inset-0 bg-cover bg-center" data-alt="Detailed shot of handmade products on display" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5ecdLtNKr-bKviKXIDhyZkjNaH6G7Vb9lNrLHVUUJKS5HrwOOyMIgdO6I6mGQmrglV4JqLMAhS7Qm0tV1p31HWDK4BiVgQI0iaBtpvm-oWLg36U2_epHFZU1ypKgcLua7Fu7urtgaKUVkPpwkranFO80Vrhki5T-9l8C8IbF9X48f8deZeE_bCc9rCh9GWv0qCOf2FMrviVDnFZr7lKMd0gOL7skX5DFC0yUvzV4tThQdNJfgHmrtWBbIgxzsNR73yoKYjTE7Vb0")' }} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/90 p-2 rounded-full hover:bg-white text-red-500 shadow-sm transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
              <button className="aspect-square border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center gap-1 hover:border-primary hover:shadow-sm transition-all">
                <span className="material-symbols-outlined text-slate-400 text-3xl">add</span>
                <span className="text-xs font-medium text-slate-500">Add More</span>
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Add high-quality photos of your storefront, products, or services to attract more customers in Marinduque.
            </p>
          </section>
          <div className="h-px bg-slate-100 w-full mb-8" />
          <section className="px-5 mb-8">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Opening Hours</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-primary/30 transition-colors">
                <span className="font-semibold text-slate-800">Monday - Friday</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">8:00 AM - 5:00 PM</span>
                  <button className="text-primary hover:text-primary-hover">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-primary/30 transition-colors">
                <span className="font-semibold text-slate-800">Saturday</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">9:00 AM - 12:00 PM</span>
                  <button className="text-primary hover:text-primary-hover">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-transparent opacity-80">
                <span className="font-semibold text-slate-400">Sunday</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Closed</span>
                  <button className="text-slate-300 pointer-events-none">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="px-5 mb-6">
            <div className="bg-white border border-primary/40 rounded-xl p-5 relative overflow-hidden shadow-gold">
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-primary/10 rotate-12 pointer-events-none select-none">verified</span>
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center shrink-0 shadow-md text-white">
                  <span className="material-symbols-outlined font-bold text-2xl">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Get Verified Visibility</h4>
                  <p className="text-sm text-slate-600 leading-snug">
                    Your profile will include the <span className="font-semibold text-slate-800">Verified Badge</span>, boosting trust within the Marinduque community.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        {/* Publish Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-slate-100 p-4">
          <Link href="/business/gasan-garden-cafe" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] hover:bg-primary/90">
            <span className="material-symbols-outlined text-xl">verified</span>
            <span>Publish Business Profile</span>
          </Link>
        </div>
      </div>

    </>
  );
}
