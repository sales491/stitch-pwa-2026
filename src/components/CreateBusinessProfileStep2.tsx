'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BarangayPicker from '@/components/BarangayPicker';

export default function CreateBusinessProfileStep2() {
  const [phone, setPhone] = useState('');
  const [messengerUsername, setMessengerUsername] = useState('');
  const [fbPageUsername, setFbPageUsername] = useState('');
  const [email, setEmail] = useState('');
  const [town, setTown] = useState('');
  const [barangay, setBarangay] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPhone(localStorage.getItem('bp_phone') || '');
      setMessengerUsername(localStorage.getItem('bp_messenger') || '');
      setFbPageUsername(localStorage.getItem('bp_fb_page') || '');
      setEmail(localStorage.getItem('bp_email') || '');
      setTown(localStorage.getItem('bp_location')?.split(',')[0] || '');
      setBarangay(localStorage.getItem('bp_barangay') || '');
      setAddress(localStorage.getItem('bp_address') || '');
    }
  }, []);

  const save = (key: string, value: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
  };

  const handleTownChange = (val: string) => {
    setTown(val);
    save('bp_location', val);
    setBarangay('');
    save('bp_barangay', '');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-white dark:bg-zinc-950 overflow-x-hidden shadow-xl sm:my-8 sm:rounded-2xl sm:border sm:border-slate-200 dark:sm:border-zinc-800">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-zinc-800 shadow-sm">
        <Link href="/create-business-profile-step1" className="text-slate-800 dark:text-slate-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-moriones-red">Create Business Profile</h2>
      </div>

      <div className="flex flex-col gap-2 px-6 pt-6 pb-2">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest">Step 2 of 3</p>
          <p className="text-moriones-red text-[10px] font-black uppercase tracking-widest">Location &amp; Contact</p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
          <div className="h-full rounded-full bg-moriones-red transition-all duration-500 ease-out" style={{ width: '66%' }} />
        </div>
      </div>

      <div className="flex-1 pb-32">
        <div className="px-6 space-y-10 py-6">
          {/* Location Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-moriones-red/10 flex items-center justify-center text-moriones-red">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Where can customers find you?</h1>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Select Town</label>
                <div className="relative">
                  <select
                    value={town}
                    onChange={(e) => handleTownChange(e.target.value)}
                    className="appearance-none w-full rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 px-4 py-4 pr-10 text-base text-slate-900 dark:text-white focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none transition-all shadow-sm"
                  >
                    <option disabled value="">Choose a town</option>
                    <option value="Boac">Boac</option>
                    <option value="Mogpog">Mogpog</option>
                    <option value="Gasan">Gasan</option>
                    <option value="Buenavista">Buenavista</option>
                    <option value="Torrijos">Torrijos</option>
                    <option value="Sta. Cruz">Sta. Cruz</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Barangay (optional)</label>
                <BarangayPicker
                  value={barangay}
                  onChange={(v) => { setBarangay(v); save('bp_barangay', v); }}
                  municipality={town}
                  accentColor="red"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Street Address (optional)</label>
                <input
                  className="w-full rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 px-4 py-4 text-base text-slate-900 dark:text-white focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none placeholder:text-slate-400 transition-all shadow-sm"
                  placeholder="e.g. Purok 2, near the plaza"
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); save('bp_address', e.target.value); }}
                />
              </div>

              <div className="pt-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-2 block">Map Pin (Optional)</label>
                <div className="relative w-full h-40 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-zinc-800 shadow-sm transition-all hover:border-moriones-red/30">
                  <img alt="Map view" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuYxIjop0n1P1fE_cEgEWZrOzxXLiBKFKoB8nqyCW8XCX4mShqyrthhCS1HOD7qBReBqMD0LN72JxOA3eyqAPADBHxG7fiklegvqHH6AavHu7P-pN_0W5Tpc_n1MgjAghmwSvKFkWpDqYJ5T1iryP4RbnCX8js_nh3NLJXRUQ9il1-d3DbOu4yPMZXnL6RzEzJOtP_FR0JVgFO5VeUIEIrUAFHF_Wb8oJzeu8N5YPFODE97lXcKn_yOQW5VdytWefvVzu4m2_Rvt8" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-100 dark:border-zinc-700 flex items-center gap-2 transform group-hover:-translate-y-1 transition-transform">
                      <span className="material-symbols-outlined text-moriones-red font-bold text-[18px]">push_pin</span>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Set Pin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100 dark:bg-zinc-900" />

          {/* Contact Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-moriones-red/10 flex items-center justify-center text-moriones-red">
                <span className="material-symbols-outlined">contact_page</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Contact Details</h1>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Mobile Number</label>
                <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 overflow-hidden focus-within:border-moriones-red focus-within:ring-4 focus-within:ring-moriones-red/5 transition-all shadow-sm">
                  <span className="px-4 py-4 text-slate-500 text-xs font-black tracking-widest border-r border-slate-200 dark:border-zinc-800">+63</span>
                  <input
                    type="tel"
                    placeholder="912 345 6789"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); save('bp_phone', e.target.value); }}
                    className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Messenger Username (Optional)</label>
                <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 overflow-hidden focus-within:border-[#0084FF] focus-within:ring-4 focus-within:ring-[#0084FF]/5 transition-all shadow-sm">
                  <div className="px-4 py-4 border-r border-slate-200 dark:border-zinc-800 shrink-0">
                    <svg className="w-4 h-4 text-[#0084FF]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="yourbusiness"
                    value={messengerUsername}
                    onChange={(e) => { setMessengerUsername(e.target.value); save('bp_messenger', e.target.value); }}
                    className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Other Facebook Info (Optional)</label>
                <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 overflow-hidden focus-within:border-[#1877F2] focus-within:ring-4 focus-within:ring-[#1877F2]/5 transition-all shadow-sm">
                  <div className="px-4 py-4 border-r border-slate-200 dark:border-zinc-800 shrink-0">
                    <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.525 8H14V6c0-1.03.838-1.608 2-1.608h1.975V1.1c-.341-.047-1.536-.1-2.932-.1C12.024 1 10 2.8 10 5.748V8H7v3h3v9h4v-9h2.525L17.525 8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="yourbusinesspage"
                    value={fbPageUsername}
                    onChange={(e) => { setFbPageUsername(e.target.value); save('bp_fb_page', e.target.value); }}
                    className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="hello@business.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); save('bp_email', e.target.value); }}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 px-4 py-4 text-base text-slate-900 dark:text-white focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none placeholder:text-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-30 w-full border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-4 backdrop-blur-md">
        <Link
          href="/create-business-profile-step3"
          className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-moriones-red px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-moriones-red/20 transition-all active:scale-[0.98] hover:bg-moriones-red/90 ${!town ? 'opacity-50 grayscale pointer-events-none' : ''}`}
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
        </Link>
      </div>
    </div>
  );
}
