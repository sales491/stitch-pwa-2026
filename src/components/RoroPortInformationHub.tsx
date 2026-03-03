'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';

type PostStatus = 'Normal' | 'Moderate Traffic' | 'Delayed' | 'Cancelled' | 'Other';

const STATUS_STYLES: Record<PostStatus, string> = {
  'Normal': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'Moderate Traffic': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  'Delayed': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'Cancelled': 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  'Other': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

interface CommunityPost {
  id: string;
  initials: string;
  name: string;
  role: string;
  time: string;
  text: string;
  status: PostStatus;
}

const INITIAL_POSTS: CommunityPost[] = [
  { id: '1', initials: 'JD', name: 'Juan Dela Cruz', role: 'Verified Traveler', time: '10 mins ago', text: 'Line is getting a bit long at the terminal entrance, but processing is fast. Bring water!', status: 'Moderate Traffic' },
  { id: '2', initials: 'MS', name: 'Maria Santos', role: 'Local Guide', time: '45 mins ago', text: 'Montenegro ferry departure delayed by 30 mins due to loading cargo.', status: 'Delayed' },
];

export default function RoroPortInformationHub() {
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [postStatus, setPostStatus] = useState<PostStatus>('Normal');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 2;
  const MAX_FILE_SIZE_MB = 5;

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
          const MAX_DIM = 1200;
          if (width > height && width > MAX_DIM) {
            height *= MAX_DIM / width; width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width *= MAX_DIM / height; height = MAX_DIM;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImageError(null);
    const available = MAX_IMAGES - attachedImages.length;
    if (files.length > available) {
      setImageError(`Max ${MAX_IMAGES} images. Only first ${available} added.`);
    }
    const toProcess = Array.from(files).slice(0, available);
    const results: string[] = [];
    for (const file of toProcess) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setImageError(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB — skipped.`);
        continue;
      }
      try { results.push(await compressImage(file)); }
      catch { /* skip corrupt files */ }
    }
    setAttachedImages(prev => [...prev, ...results]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!postText.trim()) return;
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      initials: 'ME',
      name: 'You',
      role: 'Community Member',
      time: 'Just now',
      text: postText.trim(),
      status: postStatus,
    };
    setPosts(prev => [newPost, ...prev]);
    setPostText('');
    setPostStatus('Normal');
    setAttachedImages([]);
    setImageError(null);
    setIsPosting(false);
  };

  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <div className="flex items-center bg-surface-light dark:bg-surface-dark px-4 py-4 justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/marinduque-connect-home-feed" className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_back</span>
            </Link>
            <div>
              <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">RoRo &amp; Port Tracker</h2>
              <p className="text-xs text-text-sub dark:text-gray-400 font-medium">Marinduque Live Updates</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 p-2 text-primary-dark dark:text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-full bg-accent-gold/10 p-2 text-accent-gold dark:text-yellow-400">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>star</span>
            </button>
          </div>
        </div>

        {/* Main Content Scroll Area */}
        <div className="flex flex-col gap-6 px-4 pt-2">
          {/* Sea Conditions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-dark dark:text-primary">tsunami</span>
              <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">Sea Conditions</h3>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800" style={{ height: '300px' }}>
              <iframe
                src="https://embed.windy.com/embed2.html?lat=13.476&lon=121.917&detailLat=13.476&detailLon=121.917&width=650&height=400&zoom=9&level=surface&overlay=waves&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
                title="Windy Sea Conditions - Tablas Strait"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="text-[10px] text-text-sub dark:text-gray-500 mt-1.5 px-1">Tip: Click layers to view waves, rain, and temperature</p>
          </section>
          {/* Vessel Tracker */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-accent-gold">directions_boat</span>
              <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">Vessel Tracker</h3>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800" style={{ height: '300px' }}>
              <iframe
                src="https://www.vesselfinder.com/aismap?zoom=9&lat=13.7&lon=121.8&width=100%25&height=300&names=true&mmsi=&show_track=false&select=&clicktoact=false&ra=false&hd=false"
                title="VesselFinder - Live Vessel Tracking Tablas Strait"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="text-[10px] text-text-sub dark:text-gray-500 mt-1.5 px-1">Live AIS Data: Click any vessel to see details, speed, and destination</p>
          </section>
          {/* Crowdsourced Updates */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">campaign</span>
                <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">Community Feed</h3>
              </div>
              <button
                onClick={() => setIsPosting(p => !p)}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full transition-all ${isPosting
                  ? 'bg-gray-200 dark:bg-gray-700 text-text-sub dark:text-gray-300'
                  : 'bg-primary text-black shadow-sm shadow-primary/30 active:scale-95'
                  }`}>
                <span className="material-symbols-outlined text-base">{isPosting ? 'close' : 'edit'}</span>
                {isPosting ? 'Cancel' : 'Post Update'}
              </button>
            </div>

            {/* Inline Composer */}
            {isPosting && (
              <div className="mb-4 bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-primary/50 shadow-lg animate-in slide-in-from-top-2 duration-200">
                {/* Composer Header */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-black font-black text-sm shrink-0">ME</div>
                  <div>
                    <p className="text-sm font-bold text-text-main dark:text-white">Share a port update</p>
                    <p className="text-[10px] text-text-sub">Help others plan their trip</p>
                  </div>
                </div>
                {/* Textarea */}
                <div className="px-4 pb-3">
                  <textarea
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    placeholder="What's happening at the port? e.g. Ferry delayed, queue is long, choppy seas..."
                    rows={3}
                    className="w-full text-sm text-text-main dark:text-white bg-background-light dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
                  />
                </div>
                {/* Image Error */}
                {imageError && (
                  <div className="px-4 pb-2">
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {imageError}
                    </p>
                  </div>
                )}

                {/* Image Previews */}
                {attachedImages.length > 0 && (
                  <div className="px-4 pb-3 flex gap-2">
                    {attachedImages.map((src, i) => (
                      <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                        <img src={src} alt={`Attached ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setAttachedImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Photos Button */}
                <div className="px-4 pb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={attachedImages.length >= MAX_IMAGES}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all w-full justify-center ${attachedImages.length >= MAX_IMAGES
                      ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                      : 'border-primary/40 text-primary hover:bg-primary/5 active:scale-95'
                      }`}>
                    <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                    {attachedImages.length >= MAX_IMAGES
                      ? 'Max 2 images reached'
                      : `Add Photo (${attachedImages.length}/${MAX_IMAGES}) • max 5MB each`}
                  </button>
                </div>

                {/* Status Picker */}
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-bold text-text-sub uppercase tracking-widest mb-2">Status Tag</p>
                  <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
                    {(Object.keys(STATUS_STYLES) as PostStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setPostStatus(s)}
                        className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border-2 transition-all whitespace-nowrap ${postStatus === s
                          ? `${STATUS_STYLES[s]} border-current`
                          : 'border-gray-200 dark:border-gray-700 text-text-sub dark:text-gray-400'
                          }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Submit */}
                <div className="px-4 pb-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!postText.trim()}
                    className="w-full py-3 rounded-xl bg-primary text-black font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm shadow-primary/30 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">send</span>
                    Post to Community Feed
                  </button>
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shrink-0">{post.initials}</div>
                      <div>
                        <p className="text-sm font-bold text-text-main dark:text-white">{post.name}</p>
                        <p className="text-[10px] text-text-sub">{post.role} • {post.time}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[post.status]}`}>{post.status}</span>
                  </div>
                  <p className="text-sm text-text-main dark:text-gray-300">{post.text}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Shipping Lines Directory */}
          <section>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <span className="material-symbols-outlined text-blue-500">anchor</span>
              <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">Shipping Lines</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Montenegro */}
              <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 p-1 shadow-sm mb-2 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">sailing</span>
                </div>
                <h4 className="font-bold text-sm text-text-main dark:text-white">Montenegro</h4>
                <p className="text-[10px] text-text-sub mb-2">Daily • Every 2 hours</p>
                <button className="w-full py-1.5 rounded-lg bg-background-light dark:bg-background-dark text-xs font-bold text-text-main dark:text-gray-300">View Sched</button>
              </div>
              {/* Starhorse */}
              <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 p-1 shadow-sm mb-2 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-3xl">directions_boat_filled</span>
                </div>
                <h4 className="font-bold text-sm text-text-main dark:text-white">Starhorse</h4>
                <p className="text-[10px] text-text-sub mb-2">Daily • Every 3 hours</p>
                <button className="w-full py-1.5 rounded-lg bg-background-light dark:bg-background-dark text-xs font-bold text-text-main dark:text-gray-300">View Sched</button>
              </div>
            </div>
          </section>
          {/* Spacer for bottom nav */}
          <div className="h-6" />
        </div>


      </div>
    </>
  );
}
