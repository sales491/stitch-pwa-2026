'use client';

import React, { useState, useRef, useEffect } from 'react';

import { BUSINESSES } from '@/data/businesses';
import PageHeader from '@/components/PageHeader';

// --- Types ---
interface SpotlightBusiness {
  id: string | number;
  name: string;
  category: string;
  hours: string;
  location: string;
  image: string;
}

// --- Mock Data ---
const MOCK_BUSINESSES: SpotlightBusiness[] = BUSINESSES.slice(0, 4).map(b => ({
  id: b.id,
  name: b.name,
  category: b.type,
  hours: b.status === 'Open Now' ? `Closes ${b.closingTime}` : b.status,
  location: b.location,
  image: b.image || ''
}));

const Modal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[70vh]">
        {children}
      </div>
    </div>
  </div>
);

export default function BestOfBoacMonthlySpotlight() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'saved'>('draft');

  // --- Modals State ---
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'month', 'photo', 'business'
  const [modalContext, setModalContext] = useState<any>(null);

  // --- Spotlight Content State ---
  const [title, setTitle] = useState("Discovering Local Gems");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [month, setMonth] = useState("July 2023");
  const [coverImage, setCoverImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuAZdA984PYXW7iZ2VQlSazRPyzYdEqWl5I3YHScMhVG-4z0g1MXcry8r8Q9hwzMqF3vltJWB-cBcapg2d5HtLnAiacrfGWjumRruePkeVIzzM6CFOU5LeuzbXClBI6vyrMDzaQTWhjAPDxaWmOdEDNDmTXGbkZW79DgQ29i52LjNehCe96a4a0MP8qJhhyAib77n9MwZVzcdsUX8bRpy7ERTlLyFVabtY_tjFP6mJvFTTpgmOgb1uR3-QR7_c5n2CsqnksQ23e-BFU");

  // --- Winner State ---
  const [winner, setWinner] = useState<SpotlightBusiness>(MOCK_BUSINESSES[0]);

  // --- Description Paragraphs ---
  const [paragraphs, setParagraphs] = useState([
    "Stepping into Casa de Don Emilio is like taking a delightful journey back in time. Nestled in the heart of Boac, this ancestral house-turned-restaurant perfectly captures the charm of old Marinduque while serving up some of the most authentic flavors on the island.",
    "What truly sets them apart this month is their renewed commitment to sourcing ingredients solely from local farmers in the Gasan and Mogpog areas."
  ]);

  // --- Photo Gallery (New) ---
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const available = 3 - galleryImages.length;
    const toAdd = files.slice(0, available).map(f => URL.createObjectURL(f));
    setGalleryImages([...galleryImages, ...toAdd]);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    setPublishStatus('draft');
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
    setPublishStatus('draft');
  };

  // --- Runners-up ---
  const [runnersUp, setRunnersUp] = useState<any[]>([
    { ...MOCK_BUSINESSES[1] },
    { ...MOCK_BUSINESSES[2] }
  ]);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishStatus('saved');
    }, 1200);
  };

  const handleUpdateBusiness = (bus: SpotlightBusiness) => {
    if (modalContext === 'winner') {
      setWinner(bus);
    } else if (modalContext === 'runner-up-add') {
      setRunnersUp([...runnersUp, { ...bus }]);
    } else if (typeof modalContext === 'number') {
      const newRunners = [...runnersUp];
      newRunners[modalContext] = { ...newRunners[modalContext], ...bus };
      setRunnersUp(newRunners);
    }
    setActiveModal(null);
    setPublishStatus('draft');
  };



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">

      {/* Modals Selection */}
      {activeModal === 'month' && (
        <Modal title="Select Month & Year" onClose={() => setActiveModal(null)}>
          <div className="space-y-6 text-center pb-2">
            <div className="grid grid-cols-3 gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
                const isSelected = month.startsWith(m);
                return (
                  <button
                    key={m}
                    id={`month-${m}`}
                    onClick={() => {
                      // Visual feedback immediately
                      const buttons = document.querySelectorAll('[id^="month-"]');
                      buttons.forEach(btn => btn.classList.remove('bg-primary', 'text-slate-950'));
                      buttons.forEach(btn => btn.classList.add('bg-slate-100', 'dark:bg-slate-800'));
                      document.getElementById(`month-${m}`)?.classList.add('bg-primary', 'text-slate-950');
                      document.getElementById(`month-${m}`)?.classList.remove('bg-slate-100', 'dark:bg-slate-800');
                    }}
                    className={`py-3 rounded-lg text-sm font-bold transition-all ${isSelected ? 'bg-primary text-slate-950' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 text-left ml-1">Select Year</label>
              <select id="year-select" defaultValue={month.split(' ')[1] || new Date().getFullYear().toString()} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none font-bold text-lg">
                {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const selectedMonth = Array.from(document.querySelectorAll('[id^="month-"]'))
                  .find(btn => btn.classList.contains('bg-primary'))?.textContent || month.split(' ')[0];
                const selectedYear = (document.getElementById('year-select') as HTMLSelectElement).value;
                setMonth(`${selectedMonth} ${selectedYear}`);
                setActiveModal(null);
                setPublishStatus('draft');
              }}
              className="w-full bg-slate-900 dark:bg-primary text-white dark:text-slate-900 py-4 rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all mt-4"
            >
              SAVE SELECTION
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'photo' && (
        <Modal title="Change Photo" onClose={() => setActiveModal(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-primary/10 transition-colors border-2 border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-3xl">upload</span>
              <div className="text-left">
                <p className="text-xs font-black">UPLOAD</p>
                <p className="text-[10px] opacity-60">From device</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-primary/10 transition-colors border-2 border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
              <div className="text-left">
                <p className="text-xs font-black">CAMERA</p>
                <p className="text-[10px] opacity-60">Snap new</p>
              </div>
            </button>
          </div>
          <p className="text-[10px] font-black tracking-widest uppercase mb-3 opacity-50 px-1">Gallery Favorites</p>
          <div className="grid grid-cols-3 gap-2">
            {[coverImage, winner.image, ...MOCK_BUSINESSES.map(b => b.image)].slice(0, 6).map((img, i) => (
              <button key={i} onClick={() => { setCoverImage(img || ''); setActiveModal(null); setPublishStatus('draft'); }} className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                <img src={img} className="w-full h-full object-cover" alt="fav" />
              </button>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === 'business' && (
        <Modal title="Business Directory" onClose={() => setActiveModal(null)}>
          <div className="space-y-3">
            <div className="relative mb-4">
              <input type="text" placeholder="Search businesses..." className="w-full bg-slate-100 dark:bg-slate-800 p-3 pl-10 rounded-xl outline-none" />
              <span className="material-symbols-outlined absolute left-3 top-3 opacity-40">search</span>
            </div>
            {MOCK_BUSINESSES.map(bus => (
              <button
                key={bus.id}
                onClick={() => handleUpdateBusiness(bus)}
                className="w-full flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700 text-left group"
              >
                <img src={bus.image} className="size-14 rounded-lg object-cover shadow-sm" alt={bus.name} />
                <div className="flex-1">
                  <p className="font-black text-sm">{bus.name}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{bus.category}</p>
                </div>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100">add_circle</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === 'manage-all' && (
        <Modal title="Manage Shoutouts" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Current Finalists ({runnersUp.length})</p>
            {runnersUp.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <img src={r.image} className="size-10 rounded-lg object-cover" alt={r.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{r.name}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const newRunners = [...runnersUp];
                      if (i > 0) {
                        [newRunners[i], newRunners[i - 1]] = [newRunners[i - 1], newRunners[i]];
                        setRunnersUp(newRunners);
                        setPublishStatus('draft');
                      }
                    }}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  </button>
                  <button
                    onClick={() => {
                      setRunnersUp(runnersUp.filter((_, idx) => idx !== i));
                      setPublishStatus('draft');
                    }}
                    className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => { setActiveModal('business'); setModalContext('runner-up-add'); }}
              className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span> Add Shoutout
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'card-settings' && modalContext !== null && (
        <Modal title="Card Settings" onClose={() => { setActiveModal(null); setModalContext(null); }}>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <img src={runnersUp[modalContext].image} className="size-16 rounded-xl object-cover shadow-sm" alt="curr" />
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase">Editing Card</p>
                <p className="font-bold">{runnersUp[modalContext].name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Display Name</label>
                <input
                  type="text"
                  defaultValue={runnersUp[modalContext].name}
                  onChange={(e) => {
                    const newRunners = [...runnersUp];
                    newRunners[modalContext] = { ...newRunners[modalContext], name: e.target.value };
                    setRunnersUp(newRunners);
                    setPublishStatus('draft');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Display Category</label>
                <input
                  type="text"
                  defaultValue={runnersUp[modalContext].category}
                  onChange={(e) => {
                    const newRunners = [...runnersUp];
                    newRunners[modalContext] = { ...newRunners[modalContext], category: e.target.value };
                    setRunnersUp(newRunners);
                    setPublishStatus('draft');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-primary py-4 rounded-xl font-black text-sm text-slate-900 shadow-xl active:scale-95 transition-all">
              SAVE SETTINGS
            </button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <PageHeader
        title="Best of Boac Admin"
        rightAction={
          <>
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${publishStatus === 'saved' ? 'text-green-500' : 'text-orange-500'}`}>
              {publishStatus === 'saved' ? 'LIVE SITE' : 'UNSAVED DRAFT'}
            </span>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`font-black py-2 px-6 rounded-full text-xs transition-all shadow-md flex items-center gap-2 ${isPublishing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-primary hover:bg-yellow-400 text-slate-900'
                }`}
            >
              {isPublishing ? 'PUBLISHING...' : 'PUBLISH NOW'}
            </button>
          </>
        }
      />

      <main className="flex flex-col w-full max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-2xl min-h-screen">

        {/* Hero Section */}
        <div className="@container group relative">
          <div className="absolute inset-0 z-10 m-3 rounded-2xl border-4 border-dashed border-white/30 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
            <button onClick={() => setActiveModal('photo')} className="bg-white text-slate-950 px-6 py-3 rounded-full font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">camera_enhance</span> CHANGE COVER IMAGE
            </button>
          </div>

          <div className="@[480px]:px-4 @[480px]:py-4">
            <div className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden bg-slate-200 dark:bg-slate-800 @[480px]:rounded-2xl min-h-[400px] shadow-lg" style={{ backgroundImage: `url("${coverImage}")` }}>

              <button
                onClick={() => setActiveModal('month')}
                className="absolute top-4 right-4 bg-primary text-slate-900 text-[10px] font-black px-4 py-2 rounded-full shadow-2xl uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all transform active:scale-95 z-20"
              >
                {month}
                <span className="material-symbols-outlined text-sm">calendar_month</span>
              </button>

              <div className="flex flex-col p-6 gap-3 relative z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                <span className="text-primary font-black text-xs tracking-[0.3em] uppercase drop-shadow-xl">FEATURED SPOTLIGHT</span>
                <div className="relative">
                  {isEditingTitle ? (
                    <input
                      autoFocus
                      onBlur={() => setIsEditingTitle(false)}
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setPublishStatus('draft'); }}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                      className="w-full bg-white/10 backdrop-blur-xl text-white text-3xl font-black leading-tight border-none outline-none p-3 rounded-xl ring-2 ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-white tracking-tight text-4xl font-black leading-tight drop-shadow-2xl flex-1">{title}</h1>
                      <button onClick={() => setIsEditingTitle(true)} className="bg-white/20 hover:bg-white/40 p-2 rounded-xl backdrop-blur-md transition-all shadow-lg">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Section */}
        <section className="px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-2 rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-slate-950 fill-1">workspace_premium</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Monthly Top Spot</h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl shadow-xl overflow-hidden border-2 border-primary/30 relative group/winner">
            <a href={`/business/${winner.id}`} className="absolute inset-0 z-0"></a>
            <button
              onClick={() => { setActiveModal('business'); setModalContext('winner'); }}
              className="absolute top-4 right-4 z-20 bg-slate-900 text-white font-black px-4 py-2 rounded-xl text-[10px] flex items-center gap-2 shadow-2xl hover:bg-primary hover:text-slate-950 transition-all active:scale-95 animate-pulse"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              REPLACE TOP SPOT
            </button>

            <div className="relative h-60">
              <img src={winner.image} className="w-full h-full object-cover" alt={winner.name} />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20" />
              <div className="absolute bottom-6 right-6 bg-primary text-slate-950 size-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800 z-10">
                <span className="material-symbols-outlined text-5xl font-black">verified</span>
              </div>
            </div>

            <div className="p-8">
              <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-3 block">CHAMPION SPOTLIGHT PAGE</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-6">{winner.name}</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-black opacity-40 uppercase">Category</p>
                    <p className="font-bold text-sm">{winner.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-black opacity-40 uppercase">Location</p>
                    <p className="font-bold text-sm">{winner.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary hover:text-slate-950 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl text-xs uppercase transition-all shadow-sm active:scale-95">
                  View Profile
                </button>
                <button className="flex-1 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary hover:text-slate-950 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl text-xs uppercase transition-all shadow-sm active:scale-95">
                  Update Details
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 pb-12">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary fill-1">auto_awesome</span>
            Expert Review Content
          </h3>
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <div key={i} className="relative group">
                <div className="absolute -right-3 -top-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                  <button onClick={() => { setParagraphs(paragraphs.filter((_, idx) => idx !== i)); setPublishStatus('draft'); }} className="bg-red-600 text-white size-10 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <textarea
                  value={p}
                  onChange={(e) => {
                    const newPs = [...paragraphs];
                    newPs[i] = e.target.value;
                    setParagraphs(newPs);
                    setPublishStatus('draft');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl text-sm leading-relaxed border-4 border-transparent focus:border-primary/40 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-inner font-medium h-40"
                />
              </div>
            ))}

            {/* Gallery Section */}
            <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Photo Gallery</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Main spotlight visuals</p>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{galleryImages.length}/3 shots</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-lg flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
                {galleryImages.length < 3 && (
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                    <span className="text-[8px] font-black uppercase tracking-tight">Add Photo</span>
                  </button>
                )}
              </div>
              <input type="file" ref={galleryInputRef} onChange={handleGalleryChange} className="hidden" multiple accept="image/*" />
            </div>

            <button
              onClick={() => { setParagraphs([...paragraphs, "Add new insights here..."]); setPublishStatus('draft'); }}
              className="w-full border-4 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-slate-400 hover:border-primary hover:text-primary transition-all font-black flex flex-col items-center justify-center gap-3 bg-slate-50/20"
            >
              <span className="material-symbols-outlined text-4xl">add_box</span>
              <span className="text-xs uppercase tracking-widest">Add Insight Block</span>
            </button>
          </div>
        </section>

        {/* Shoutouts Section */}
        <section className="px-4 pb-32 pt-12 rounded-t-[4rem] bg-slate-50 dark:bg-black/20">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">grade</span>
              Shoutouts
            </h2>
            <button
              onClick={() => setActiveModal('manage-all')}
              className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-slate-900 border-b-2 border-primary/30"
            >
              Manage Shoutouts
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {runnersUp.map((r, i) => (
              <div key={i} className="group relative bg-white dark:bg-slate-800/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700 overflow-hidden">
                <a href={`/business/${r.id}`} className="absolute inset-0 z-0"></a>
                <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button onClick={() => { setActiveModal('business'); setModalContext(i); }} className="bg-white/90 text-slate-900 p-2 rounded-xl shadow-2xl hover:bg-primary transition-all transform hover:scale-110">
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  </button>
                  <button onClick={() => { setRunnersUp(runnersUp.filter((_, idx) => idx !== i)); setPublishStatus('draft'); }} className="bg-red-600 text-white p-2 rounded-xl shadow-2xl transition-all transform hover:scale-110">
                    <span className="material-symbols-outlined text-sm text-[18px]">delete</span>
                  </button>
                </div>

                <div className="h-48 overflow-hidden relative">
                  <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={r.name} />
                </div>

                <div className="p-6">
                  <h4 className="font-black text-lg mb-1 leading-tight">{r.name}</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 opacity-70">{r.category}</p>
                  <button
                    onClick={() => { setActiveModal('card-settings'); setModalContext(i); }}
                    className="w-full py-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-slate-950 transition-all active:scale-95"
                  >
                    CARD SETTINGS
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => { setActiveModal('business'); setModalContext('runner-up-add'); }}
              className="flex flex-col items-center justify-center gap-4 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 text-slate-300 hover:border-primary hover:text-primary transition-all group bg-white/50 dark:bg-slate-900/50"
            >
              <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-all transform group-hover:rotate-90">
                <span className="material-symbols-outlined text-4xl">add</span>
              </div>
              <span className="font-black text-[10px] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100">Add Shoutout</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
