import React from 'react';
import Link from 'next/link';

export default function CreateBusinessProfileStep2() {
  return (
    <>
      <div>
        <div className="sticky top-0 z-50 flex items-center bg-white p-4 pb-2 border-b border-slate-100 shadow-sm">
          <Link href="/create-business-profile-step1" className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Create Business Profile</h2>
        </div>
        <div className="flex flex-col gap-3 px-4 py-6 bg-white">
          <div className="flex gap-6 justify-between items-center">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Step 2 of 3: Location &amp; Contact</p>
            <span className="text-secondary text-xs font-bold">66%</span>
          </div>
          <div className="rounded-full bg-slate-100 h-2 overflow-hidden">
            <div className="h-full rounded-full bg-secondary transition-all duration-300 ease-out" style={{ width: '66%' }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-32 bg-white">
          <div className="px-4 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <h1 className="text-xl font-bold leading-tight text-slate-900">Where can customers find you?</h1>
              </div>
              <div className="space-y-5">
                <label className="block group">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Select Town</p>
                  <div className="relative">
                    <select defaultValue="" className="appearance-none w-full rounded-xl bg-surface border border-slate-200 px-4 py-4 pr-10 text-base text-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all shadow-sm group-hover:border-slate-300">
                      <option disabled value="">Choose a town</option>
                      <option value="boac">Boac</option>
                      <option value="mogpog">Mogpog</option>
                      <option value="gasan">Gasan</option>
                      <option value="buenavista">Buenavista</option>
                      <option value="torrijos">Torrijos</option>
                      <option value="sta_cruz">Sta. Cruz</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </label>
                <label className="block group">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Street Address / Barangay</p>
                  <input className="w-full rounded-xl bg-surface border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none placeholder:text-slate-400 transition-all shadow-sm group-hover:border-slate-300" placeholder="e.g. Purok 2, Brgy. Balanacan" type="text" />
                </label>
                <div className="pt-2">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Pin Exact Location</p>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden group cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full h-full bg-blue-50 relative overflow-hidden">
                      <img alt="Map view of Marinduque province" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuYxIjop0n1P1fE_cEgEWZrOzxXLiBKFKoB8nqyCW8XCX4mShqyrthhCS1HOD7qBReBqMD0LN72JxOA3eyqAPADBHxG7fiklegvqHH6AavHu7P-pN_0W5Tpc_n1MgjAghmwSvKFkWpDqYJ5T1iryP4RbnCX8js_nh3NLJXRUQ9il1-d3DbOu4yPMZXnL6RzEzJOtP_FR0JVgFO5VeUIEIrUAFHF_Wb8oJzeu8N5YPFODE97lXcKn_yOQW5VdytWefvVzu4m2_Rvt8" />
                      <div className="absolute inset-0 bg-white/10" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                        <span className="material-symbols-outlined text-red-500">push_pin</span>
                        <span className="text-sm font-bold text-slate-700">Tap to set pin</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5 ml-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                    Moving the pin helps customers find you easily.
                  </p>
                </div>
              </div>
            </section>
            <div className="h-px bg-slate-100 my-6" />
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                  <span className="material-symbols-outlined">perm_contact_calendar</span>
                </div>
                <h1 className="text-xl font-bold leading-tight text-slate-900">Contact Details</h1>
              </div>
              <div className="space-y-5">
                <label className="block group">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Mobile Number</p>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
                      <span className="text-slate-500 text-sm font-medium">+63</span>
                    </div>
                    <input className="w-full rounded-xl bg-surface border border-slate-200 pl-16 pr-4 py-4 text-base text-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none placeholder:text-slate-400 transition-all shadow-sm group-hover:border-slate-300" placeholder="912 345 6789" type="tel" />
                  </div>
                </label>
                <label className="block group">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Facebook Messenger Link</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">chat</span>
                    <input className="w-full rounded-xl bg-surface border border-slate-200 pl-12 pr-4 py-4 text-base text-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none placeholder:text-slate-400 transition-all shadow-sm group-hover:border-slate-300" placeholder="m.me/yourbusiness" type="url" />
                  </div>
                </label>
                <label className="block group">
                  <p className="text-slate-700 text-sm font-semibold mb-2 ml-1">Email Address <span className="text-slate-400 font-normal italic">(Optional)</span></p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                    <input className="w-full rounded-xl bg-surface border border-slate-200 pl-12 pr-4 py-4 text-base text-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none placeholder:text-slate-400 transition-all shadow-sm group-hover:border-slate-300" placeholder="hello@business.com" type="email" />
                  </div>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-slate-100 p-4">
        <Link href="/create-business-profile-step3" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] hover:bg-primary/90">
          <span>Next Step</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </Link>
      </div>

    </>
  );
}
