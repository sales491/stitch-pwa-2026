'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';
import { PostStatus, RoroCommunityPost, SHIPPING_LINES } from '@/data/roro';

export default function RoroPortInformationHub() {
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [postStatus, setPostStatus] = useState<PostStatus>('Normal');
  const [posts, setPosts] = useState<RoroCommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data } = await supabase
        .from('port_updates')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: RoroCommunityPost[] = data.map(d => ({
          id: d.id,
          initials: d.author?.full_name?.substring(0, 2).toUpperCase() || '??',
          name: d.author?.full_name || 'Anonymous',
          role: 'Community Member',
          time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: d.message,
          status: d.status === 'info' ? 'Normal' :
            d.status === 'delayed' ? 'Delayed' :
              d.status === 'cancelled' ? 'Cancelled' : 'Other',
          avatar: d.author?.avatar_url
        }));
        setPosts(mapped);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  const STATUS_STYLES: Record<PostStatus, { bg: string, text: string, icon: string }> = {
    'Normal': { bg: 'bg-green-500/10', text: 'text-green-600', icon: 'check_circle' },
    'Moderate Traffic': { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'warning' },
    'Delayed': { bg: 'bg-moriones-red/10', text: 'text-moriones-red', icon: 'error' },
    'Cancelled': { bg: 'bg-zinc-500/10', text: 'text-zinc-600', icon: 'cancel' },
    'Other': { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'info' },
  };

  const [imageFiles, setImageFiles] = useState<File[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageError(null);
    const available = MAX_IMAGES - imageFiles.length;
    if (files.length > available) {
      setImageError(`Max ${MAX_IMAGES} images allowed.`);
    }
    const toAdd = files.slice(0, available);
    setImageFiles(prev => [...prev, ...toAdd]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!postText.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please login to post.');
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const optimized = await optimizeImage(file, { maxWidth: 1024, quality: 0.8 });
          const fileExt = 'jpg';
          const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `port-updates/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('community_images')
            .upload(filePath, optimized);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('community_images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      }

      const { error } = await supabase.from('port_updates').insert({
        author_id: user.id,
        port_name: 'Balanacan',
        status: postStatus === 'Normal' ? 'info' :
          postStatus === 'Delayed' ? 'delayed' :
            postStatus === 'Cancelled' ? 'cancelled' : 'info',
        message: postText.trim(),
        images: imageUrls
      });

      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/marinduque-connect-home-feed" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red pl-1">RoRo & Port Tracker</h1>
              <p className="text-[10px] text-text-muted dark:text-text-muted-dark font-black uppercase tracking-widest pl-1">Live Marinduque Updates</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-background-light/50 dark:bg-background-dark/50 px-4 py-6 space-y-8 pb-32">
        {/* Sea Conditions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 font-black">air</span>
            </div>
            <h3 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-wider">Sea Conditions</h3>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border-light dark:border-zinc-700 shadow-xl">
            <iframe
              src="https://embed.windy.com/embed2.html?lat=13.476&lon=121.917&detailLat=13.476&detailLon=121.917&width=650&height=400&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
              title="Windy Sea Conditions"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </section>

        {/* Vessel Tracker */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-moriones-red/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-moriones-red font-black">directions_boat</span>
            </div>
            <h3 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-wider">Vessel Tracker</h3>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border-light dark:border-zinc-700 shadow-xl">
            <iframe
              src="https://www.vesselfinder.com/aismap?zoom=9&lat=13.7&lon=121.8&width=100%25&height=300&names=true&mmsi=&show_track=false&select=&clicktoact=false&ra=false&hd=false"
              title="Vessel Tracking"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </section>

        {/* Community Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 font-black">forum</span>
              </div>
              <h3 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-wider">Port Feed</h3>
            </div>
            <button
              onClick={() => setIsPosting(!isPosting)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-moriones-red text-white text-[10px] font-black uppercase tracking-tight shadow-lg shadow-moriones-red/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">{isPosting ? 'close' : 'add_task'}</span>
              {isPosting ? 'Close' : 'Update'}
            </button>
          </div>

          {isPosting && (
            <div className="mb-6 bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-moriones-red/20 shadow-xl p-4 animate-in slide-in-from-top-2">
              <div className="flex gap-3 mb-4">
                <div className="size-10 rounded-full bg-moriones-red flex items-center justify-center text-white text-xs font-black">ME</div>
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    placeholder="Reports from the port? Ferry delays, queues, rain..."
                    className="w-full bg-transparent p-1 outline-none text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted resize-none min-h-[60px]"
                  />
                </div>
              </div>

              {imageFiles.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="relative size-20 rounded-xl overflow-hidden border border-border-light dark:border-zinc-700 shrink-0 shadow-sm">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 size-5 bg-black/60 text-white rounded-lg flex items-center justify-center backdrop-blur-md hover:bg-moriones-red transition-colors"
                      >
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                {(Object.keys(STATUS_STYLES) as PostStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setPostStatus(s)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${postStatus === s ? `${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text} border-current` : 'bg-background-light dark:bg-background-dark border-border-light dark:border-zinc-700 text-text-muted'}`}
                  >
                    <span className="material-symbols-outlined text-[14px] font-black">{STATUS_STYLES[s].icon}</span>
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                  <span className="text-[10px] font-black uppercase">Photos</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!postText.trim()}
                  className="px-6 py-2.5 bg-moriones-red text-white rounded-xl text-xs font-black shadow-lg shadow-moriones-red/20 disabled:opacity-30 active:scale-95 transition-all"
                >
                  POST UPDATE
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" multiple accept="image/*" />
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="size-8 border-4 border-moriones-red/20 border-t-moriones-red rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center py-10 text-xs font-bold text-text-muted uppercase tracking-widest">No recent updates</p>
            ) : (
              posts.map(post => {
                const style = STATUS_STYLES[post.status] || STATUS_STYLES['Other'];
                return (
                  <article key={post.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-zinc-800 shadow-sm transition-all hover:border-moriones-red/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 border border-border-light overflow-hidden shadow-sm">
                          {post.avatar ? <img src={post.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-[10px] text-slate-400">{post.initials}</div>}
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-text-main dark:text-text-main-dark uppercase tracking-tight">{post.name}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{post.time} • Community</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${style.bg} ${style.text}`}>
                        <span className="material-symbols-outlined text-[14px] font-black">{style.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-tight">{post.status}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-text-main dark:text-text-main-dark leading-relaxed pl-11">{post.text}</p>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Shipping Lines */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 font-black">anchor</span>
            </div>
            <h3 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-wider">Shipping Lines</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SHIPPING_LINES.map(line => (
              <div key={line.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-zinc-800 shadow-sm transition-all hover:scale-[1.02]">
                <div className="size-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center mb-3 shadow-inner border border-border-light dark:border-zinc-700">
                  <span className={`material-symbols-outlined text-3xl font-black ${line.colorClass}`}>{line.icon}</span>
                </div>
                <h4 className="text-xs font-black text-text-main dark:text-text-main-dark uppercase tracking-tight leading-none mb-1">{line.name}</h4>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">{line.schedule}</p>
                <button className="w-full py-2 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-zinc-700 text-[10px] font-black uppercase tracking-tighter text-text-main dark:text-text-main-dark hover:bg-moriones-red hover:text-white transition-all">Schedule</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
