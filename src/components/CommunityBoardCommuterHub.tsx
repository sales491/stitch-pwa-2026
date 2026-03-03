"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import AdminActions from './AdminActions';

export default function CommunityBoardCommuterHub() {
  const [postText, setPostText] = useState('');
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // New State for interactivity
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);
  const [taggedTown, setTaggedTown] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [showPoll, setShowPoll] = useState(false);
  const [checkInLocation, setCheckInLocation] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const towns = ['All Towns', 'Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Santa Cruz', 'Torrijos'];
  const moods = ['😊 Happy', '😇 Blessed', '🥳 Excited', '🤔 Thinking', '😴 Tired', '📍 Traveling'];

  // Limits
  const MAX_PHOTOS = 3;
  const MAX_FILE_SIZE_MB = 5;

  const handlePhotoClick = () => fileInputRef.current?.click();

  // Image Compression/Scaling Helper
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension for scaling (e.g., 1200px)
          const MAX_DIM = 1200;
          if (width > height && width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert back to base64 with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setErrorHeader(null);

    // Filter valid files and limit to remaining slots
    const totalCurrent = attachedPhotos.length;
    const availableSlots = MAX_PHOTOS - totalCurrent;

    if (files.length > availableSlots) {
      setErrorHeader(`You can only upload up to ${MAX_PHOTOS} photos. Skipping extras.`);
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const processedPhotos: string[] = [];

    for (const file of filesToProcess) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrorHeader(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB and will be skipped.`);
        continue;
      }

      try {
        const compressed = await compressImage(file);
        processedPhotos.push(compressed);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    setAttachedPhotos(prev => [...prev, ...processedPhotos]);
    // Reset input for same file re-selection
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setAttachedPhotos(prev => prev.filter((_, i) => i !== index));
    if (attachedPhotos.length <= MAX_PHOTOS) setErrorHeader(null);
  };

  const addPollOption = () => setPollOptions([...pollOptions, '']);
  const updatePollOption = (index: number, val: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = val;
    setPollOptions(newOptions);
  };

  return (
    <>
      <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-hidden bg-buntal-pattern">
        <header className="sticky top-0 z-30 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-accent-gold/20 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/marinduque-connect-home-feed" className="text-text-main-light dark:text-text-main-dark p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </Link>
              <div className="relative">
                <h1 className="text-lg font-bold leading-tight text-primary dark:text-primary-dark">Marinduque Board</h1>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px] text-accent-gold">location_on</span>
                  {selectedTown === 'All Towns' ? 'Marinduque' : selectedTown}
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-3 w-52 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Town</span>
                    </div>
                    {towns.map((town) => (
                      <button
                        key={town}
                        onClick={() => {
                          setSelectedTown(town);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${selectedTown === town ? 'text-primary font-black bg-primary/10' : 'text-slate-700 dark:text-zinc-300 font-medium'}`}
                      >
                        {town}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-main-light dark:text-text-main-dark">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </button>
              <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-main-light dark:text-text-main-dark">
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-surface-light dark:border-surface-dark" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4">
            <div className="flex gap-2 w-full">
              <Link href="/marinduque-events-calendar" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all">
                📅 Events
              </Link>
              <Link href="/roro-port-information-hub" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all">
                🚢 RoRo & Port
              </Link>
              <Link href="/best-of-boac-monthly-spotlight" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all">
                🏆 Best of Boac
              </Link>
            </div>
            <div className="flex gap-2 w-full">
              <Link href="/gems-of-marinduque-feed" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all">
                💎 Gems of Marinduque
              </Link>
              <Link href="/the-hidden-foreigner-blog-feed" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all">
                👤 Hidden Foreigner
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 px-4 pt-4 space-y-6">
          <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5 p-4">
            {errorHeader && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg flex items-center gap-2 text-[11px] text-red-600 font-bold animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                {errorHeader}
              </div>
            )}
            <div className="flex gap-3">
              <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 border border-black/10 mt-1">
                <img alt="User avatar" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq08U6DBK5u3Q3afMW7xC6ygULra62e9KfGl8xWNUUrbPa3WUijqwEY66RTZqPLN8lud0wcLtndun5DRw1ySg4NqannnvCKwiaZ6pS2NWN3A8gMoOfKqvLgzHsqfp1UrvIzdmHvVGNhslq8YRsDAwI5wFATEATVW3Pkh4jr4cAdUEvg7pJLq4IPzXJuHvCHkZp0vFZ4KjABtSDojin-Pd1oQZMes8g_lUp2GowD-QB81Ic-tedmSRoOk3LgapJFiiGJ9DISWGcxRw" />
              </div>
              <div className="flex-1 min-h-[44px]">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={`What's happening in ${selectedTown === 'All Towns' ? 'Marinduque' : selectedTown}?`}
                  className="w-full bg-background-light dark:bg-background-dark rounded-2xl px-4 py-2.5 border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none overflow-hidden min-h-[44px]"
                  style={{ height: postText.length > 0 ? 'auto' : '44px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = '44px';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>
            </div>

            {/* Attached Photos Preview */}
            {attachedPhotos.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
                {attachedPhotos.map((photo, i) => (
                  <div key={i} className="relative size-20 rounded-lg overflow-hidden shrink-0 border border-black/5 shadow-sm">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Poll Section */}
            {showPoll && (
              <div className="mt-4 p-3 bg-background-light dark:bg-background-dark rounded-xl border border-primary/20 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-primary">Poll Options</span>
                  <button onClick={() => setShowPoll(false)} className="text-text-sub-light hover:text-red-500">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {pollOptions.map((opt, i) => (
                    <input
                      key={i}
                      value={opt}
                      onChange={(e) => updatePollOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full bg-surface-light dark:bg-surface-dark border border-black/5 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-primary"
                    />
                  ))}
                  <button onClick={addPollOption} className="text-[10px] font-bold text-primary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Active Tags / Contexts */}
            {(taggedTown || checkInLocation || activeMood) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {taggedTown && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-bold border border-accent-gold/20">
                    📍 {taggedTown}
                    <button onClick={() => setTaggedTown(null)} className="material-symbols-outlined text-[12px]">close</button>
                  </span>
                )}
                {checkInLocation && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 text-[10px] font-bold border border-red-200">
                    🏢 {checkInLocation}
                    <button onClick={() => setCheckInLocation(null)} className="material-symbols-outlined text-[12px]">close</button>
                  </span>
                )}
                {activeMood && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-[10px] font-bold border border-blue-200">
                    {activeMood}
                    <button onClick={() => setActiveMood(null)} className="material-symbols-outlined text-[12px]">close</button>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 dark:border-white/5 px-1">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*" />
              <button
                onClick={handlePhotoClick}
                disabled={attachedPhotos.length >= MAX_PHOTOS}
                className={`flex flex-col items-center gap-1 transition-colors min-w-[50px] ${attachedPhotos.length >= MAX_PHOTOS ? 'opacity-30 cursor-not-allowed' : 'text-text-sub-light hover:text-primary cursor-pointer'}`}
              >
                <span className="material-symbols-outlined text-[22px] text-green-600">photo_library</span>
                <span className="text-[10px] font-bold">Photo</span>
              </button>

              <div className="relative group">
                <button className="flex flex-col items-center gap-1 text-text-sub-light hover:text-primary transition-colors min-w-[50px]">
                  <span className="material-symbols-outlined text-[22px] text-accent-gold">tag</span>
                  <span className="text-[10px] font-bold">Tag Town</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-white dark:bg-zinc-800 shadow-xl border border-slate-200 rounded-xl z-50 p-1">
                  {towns.filter(t => t !== 'All Towns').map(t => (
                    <button key={t} onClick={() => setTaggedTown(t)} className="w-full text-left px-2 py-1.5 rounded-lg text-[10px] hover:bg-black/5 dark:hover:bg-white/5">{t}</button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="flex flex-col items-center gap-1 text-text-sub-light hover:text-primary transition-colors min-w-[50px]">
                  <span className="material-symbols-outlined text-[22px] text-blue-500">mood</span>
                  <span className="text-[10px] font-bold">Feeling</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-white dark:bg-zinc-800 shadow-xl border border-slate-200 rounded-xl z-50 p-1">
                  {moods.map(m => (
                    <button key={m} onClick={() => setActiveMood(m)} className="w-full text-left px-2 py-1.5 rounded-lg text-[10px] hover:bg-black/5 dark:hover:bg-white/5">{m}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => setShowPoll(true)} className="flex flex-col items-center gap-1 text-text-sub-light hover:text-primary transition-colors min-w-[50px]">
                <span className="material-symbols-outlined text-[22px] text-purple-600">bar_chart</span>
                <span className="text-[10px] font-bold">Polls</span>
              </button>

              <button
                onClick={() => setCheckInLocation(selectedTown === 'All Towns' ? 'Marinduque Boac' : selectedTown + ' Center')}
                className="flex flex-col items-center gap-1 text-text-sub-light hover:text-primary transition-colors min-w-[50px]"
              >
                <span className="material-symbols-outlined text-[22px] text-red-500">location_on</span>
                <span className="text-[10px] font-bold">Check-in</span>
              </button>
            </div>

            {(postText.length > 0 || attachedPhotos.length > 0 || showPoll) && (
              <div className="mt-3 flex justify-end animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    setPostText('');
                    setAttachedPhotos([]);
                    setShowPoll(false);
                    setTaggedTown(null);
                    setCheckInLocation(null);
                    setActiveMood(null);
                    setErrorHeader(null);
                  }}
                  className="px-6 py-1.5 bg-primary text-white rounded-full text-xs font-bold shadow-sm shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Post
                </button>
              </div>
            )}
          </section>

          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-bold text-text-sub-light uppercase tracking-wider">Board Feed</span>
            <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
              {selectedTown}
            </span>
          </div>

          <section className="space-y-4">
            <article className="relative bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-accent-gold/30 p-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent-gold" />
              <div className="flex items-start justify-between mb-3 pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-[18px] fill-current" style={{ fontVariationSettings: '"FILL" 1' }}>campaign</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Barangay Announcement</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-sub-light">Official • 2h ago</span>
                  <AdminActions contentType="post" contentId="ann-1" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-text-main-light dark:text-text-main-dark mb-2 pl-2">🎭 Moriones Festival Preparation Meeting</h3>
              <p className="text-sm text-text-sub-light dark:text-text-sub-dark leading-relaxed mb-3 pl-2">
                Calling all barangay officials and volunteers for the upcoming Moriones Festival 2024. Assembly at the Boac Plaza Covered Court this Saturday, 2:00 PM.
              </p>
              <div className="pl-2 flex gap-2 mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-primary text-[10px] font-bold border border-primary/20">
                  📍 Boac Proper
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-background-light dark:bg-background-dark text-text-sub-light text-[10px] font-medium border border-black/5">
                  #Culture
                </span>
              </div>
              <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2 ml-2 w-[calc(100%-0.5rem)]">
                <img alt="Moriones masks display" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3IvmBlggjaOln_QWojzQ_ugozsv82eGmjz5nlkB2Ut1X08NYyMNhQ2PWOSWBOH2aWf8gJ_nTxoHina169NqagMxLpP5WCCOMjf6hcZa23OHjnI89LOsHdzPT8SemPiBl3PyaNj-YWxb_Lukxql9q8x_7zUYKLjGjCHrijQoYtn-X7zWNenzmMaWFdamJWY2ESA0g-qKxUeJH1dLFAE3z1rrrDqroAbmY2BlnshIUcKogMTxokhP0g-bzNd9-i-TlErddSLm2E30w" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                  <p className="text-white text-xs font-medium">See event details</p>
                </div>
              </div>
            </article>
            <article className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative border border-white dark:border-surface-dark shadow-sm">
                  <img alt="User avatar" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYmvYp4NCCrQoZ-49KCk0OK03zLs8FGuMD8dqykJWDI2AiFI6D3OOTQmKRg12aZUrlqk5pwV0Ja8e4RorxP4rnunh-JDoXQ3MHwB89tMFoT4MqBYHOpL2S-Iv6BwZpUmjkWhVZlb2s--7TgmsuTNj293w_qxTtD7JSxzZbEBfMYxO55jAiWI9BNDTuWr0mJ3gbaPac7oU523B0VUoMKojif_1gU-bhBVEEmRcGE5iFSEzNeJGPbYXqDooVNpnnoMc49IAF7iDz1Ic" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-main-light dark:text-text-main-dark truncate">Ramon Magdurulang</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px] text-text-sub-light">location_on</span>
                    <span className="text-[11px] font-medium text-text-sub-light">Mogpog</span>
                    <span className="text-[11px] text-text-sub-light">• 45m ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AdminActions contentType="post" contentId="post-1" />
                  <button className="text-text-sub-light hover:text-text-main-light">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wide mb-2">
                  Lost &amp; Found
                </span>
                <p className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed">
                  Hello neighbors! Has anyone seen a brown Labrador puppy near the market area? He answers to &quot;Bantay&quot;. Please DM me if you&apos;ve seen him. 🙏🐕
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 group">
                    <span className="material-symbols-outlined text-[20px] text-text-sub-light group-hover:text-primary transition-colors">favorite</span>
                    <span className="text-xs font-medium text-text-sub-light">12</span>
                  </button>
                  <button className="flex items-center gap-1.5 group">
                    <span className="material-symbols-outlined text-[20px] text-text-sub-light group-hover:text-primary transition-colors">chat_bubble</span>
                    <span className="text-xs font-medium text-text-sub-light">4 Comments</span>
                  </button>
                </div>
                <button className="text-text-sub-light hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </>
  );
}
