'use client';

"use client";

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import AdminActions from './AdminActions';
import FlagButton from './FlagButton';
import CommunityGuidelinesGate from './CommunityGuidelinesGate';
import { createClient } from '@/utils/supabase/client';
import { optimizeImage } from '@/utils/image-optimization';
import { useAuth } from './AuthProvider';
import UniversalComments from './UniversalComments';
import { getCommunityPosts, createCommunityPost, voteInPoll, toggleLike, getUserLikedPostIds } from '@/app/actions/community';
import PageHeader from '@/components/PageHeader';
import ImageUploadHint from '@/components/ImageUploadHint';

const TOWNS = ['All Towns', 'Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Santa Cruz', 'Torrijos'];
const MOODS = ['😊 Happy', '😇 Blessed', '🥳 Excited', '🤔 Thinking', '😴 Tired', '📍 Traveling'];
const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'forum', color: 'text-slate-500' },
  { key: 'news', label: 'News', icon: 'newspaper', color: 'text-sky-600' },
  { key: 'event', label: 'Events', icon: 'event', color: 'text-purple-600' },
  { key: 'emergency', label: 'Alerts', icon: 'crisis_alert', color: 'text-moriones-red' },
  { key: 'general', label: 'General', icon: 'chat_bubble', color: 'text-emerald-600' },
] as const;

export default function CommunityBoardCommuterHub({ initialPosts = [] }: { initialPosts?: any[] }) {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [postText, setPostText] = useState('');
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [postCategory, setPostCategory] = useState('general');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Guidelines gate
  const [showGuidelinesGate, setShowGuidelinesGate] = useState(false);
  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useState<boolean | null>(null);
  const [isAcceptingGuidelines, setIsAcceptingGuidelines] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [taggedTown, setTaggedTown] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [showPoll, setShowPoll] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [isPostTownOpen, setIsPostTownOpen] = useState(false);

  // ── Likes ──────────────────────────────────────────────────
  // Set of post IDs the current user has liked (client-side source of truth)
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  // Track in-flight like requests to prevent double-taps
  const pendingLikes = useRef<Set<string>>(new Set());

  // ── Share Toast ────────────────────────────────────────────
  const [shareToast, setShareToast] = useState<string | null>(null);

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const MAX_PHOTOS = 3;
  const MAX_FILE_SIZE_MB = 5;

  const handlePhotoClick = () => fileInputRef.current?.click();

  const isInitialMount = useRef(true);

  // Reset and reload when filters change
  useEffect(() => {
    if (isInitialMount.current && initialPosts.length > 0) {
      isInitialMount.current = false;
      return;
    }
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPage(0, true);
  }, [selectedTown, selectedCategory]);

  const hasHydratedLikes = useRef(false);
  // Seed initial user likes for SSR posts
  useEffect(() => {
    if (profile && initialPosts.length > 0 && !hasHydratedLikes.current) {
       hasHydratedLikes.current = true;
       const ids = initialPosts.map((p: any) => p.id);
       getUserLikedPostIds(ids).then(liked => {
         setLikedPostIds(prev => {
           const next = new Set(prev);
           liked.forEach(id => next.add(id));
           return next;
         });
       });
    }
  }, [profile]);

  // Load more when page increments (skip page 0 — handled above)
  useEffect(() => {
    if (page > 0) fetchPage(page, false);
  }, [page]);

  // Infinite scroll — trigger when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoadingMore) setPage(p => p + 1);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isLoadingMore]);

  const fetchPage = async (pg: number, replace: boolean) => {
    if (pg > 0) setIsLoadingMore(true);
    const data = await getCommunityPosts(selectedTown, selectedCategory, pg);
    if (replace) {
      setPosts(data);
    } else {
      setPosts(prev => [...prev, ...data]);
    }
    setHasMore(data.length === 15);
    setIsLoadingMore(false);

    // Seed which posts the logged-in user has already liked
    if (data.length > 0 && profile) {
      const ids = data.map((p: any) => p.id);
      const liked = await getUserLikedPostIds(ids);
      setLikedPostIds(prev => {
        const next = new Set(prev);
        liked.forEach(id => next.add(id));
        return next;
      });
    }
  };

  const fetchPosts = () => fetchPage(0, true);

  // Check guidelines acceptance before allowing a post
  const checkGuidelinesAndPost = async () => {
    if (!profile) {
      setErrorHeader('Please sign in to post.');
      return;
    }
    if (!postText.trim() && imageFiles.length === 0) return;

    // Already confirmed in this session — proceed
    if (hasAcceptedGuidelines === true) {
      await handlePost();
      return;
    }

    // First time: query DB for accepted_guidelines
    const { data } = await supabase
      .from('profiles')
      .select('accepted_guidelines')
      .eq('id', profile.id)
      .single();

    const accepted = data?.accepted_guidelines ?? false;
    setHasAcceptedGuidelines(accepted);

    if (accepted) {
      await handlePost();
    } else {
      setShowGuidelinesGate(true);
    }
  };

  // Save acceptance to profiles, then fire the post they were making
  const acceptGuidelines = async () => {
    if (!profile) return;
    setIsAcceptingGuidelines(true);
    await supabase
      .from('profiles')
      .update({ accepted_guidelines: true })
      .eq('id', profile.id);
    setHasAcceptedGuidelines(true);
    setIsAcceptingGuidelines(false);
    setShowGuidelinesGate(false);
    await handlePost(); // proceed with their original post
  };

  const handlePost = async () => {
    if (!profile) {
      setErrorHeader('Please sign in to post.');
      return;
    }
    if (!postText.trim() && imageFiles.length === 0) return;

    setIsUploading(true);
    setErrorHeader(null);

    try {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const optimized = await optimizeImage(file, { maxWidth: 1024, quality: 0.8, aspectRatio: 4/3 });
        const filePath = `community/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('listings').upload(filePath, optimized);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(filePath);
        imageUrls.push(publicUrl);
      }

      const pollData = showPoll && pollOptions.some(o => o.trim()) ? {
        options: pollOptions.filter(o => o.trim()).map((o, i) => ({ id: `opt-${i}`, text: o, votes: [] }))
      } : null;

      const result = await createCommunityPost({
        content: postText,
        location: taggedTown || 'Marinduque',
        images: imageUrls,
        poll_data: pollData,
        type: showPoll ? 'poll' : postCategory,
        tags: postText.match(/#\w+/g)?.map(t => t.slice(1)) || []
      });

      if (result.success) {
        // Prepend instantly — no full refetch needed
        const newPost = {
          ...result.data,
          author: { id: profile?.id, full_name: profile?.full_name, avatar_url: profile?.avatar_url }
        };
        setPosts(prev => [newPost, ...prev]);
        setPostText('');
        setAttachedPhotos([]);
        setImageFiles([]);
        setShowPoll(false);
        setPollOptions(['', '']);
        setTaggedTown(null);
      } else {
        setErrorHeader(result.error || 'Failed to post.');
      }
    } catch (err: any) {
      setErrorHeader(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVote = async (postId: string, optionId: string) => {
    if (!profile) return;
    const result = await voteInPoll(postId, optionId);
    if (result.success) fetchPosts();
    else alert(result.error);
  };

  // ── Like handler (Optimistic UI) ───────────────────────────
  const handleLike = async (postId: string) => {
    if (!profile) {
      setErrorHeader('Sign in to like posts.');
      return;
    }
    // Prevent double-clicks
    if (pendingLikes.current.has(postId)) return;
    pendingLikes.current.add(postId);

    const wasLiked = likedPostIds.has(postId);

    // Optimistic update: flip heart and count immediately
    setLikedPostIds(prev => {
      const next = new Set(prev);
      wasLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) + (wasLiked ? -1 : 1)) }
          : p
      )
    );

    // Sync with server
    try {
      const result = await toggleLike(postId);
      if (!result.success) {
        // Revert on error
        setLikedPostIds(prev => {
          const next = new Set(prev);
          wasLiked ? next.add(postId) : next.delete(postId);
          return next;
        });
        setPosts(prev =>
          prev.map(p =>
            p.id === postId
              ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) + (wasLiked ? 1 : -1)) }
              : p
          )
        );
      }
    } finally {
      pendingLikes.current.delete(postId);
    }
  };

  // ── Share handler ──────────────────────────────────────────
  const handleShare = async (postId: string, content: string) => {
    const url = `${window.location.origin}/community#${postId}`;
    const text = content.length > 100 ? content.slice(0, 97) + '...' : content;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Marinduque Market Hub',
          text,
          url,
        });
      } catch (err: any) {
        // User cancelled — not an error
        if (err?.name !== 'AbortError') console.warn('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShareToast('Link copied!');
        setTimeout(() => setShareToast(null), 2500);
      } catch {
        setShareToast('Could not copy link.');
        setTimeout(() => setShareToast(null), 2500);
      }
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorHeader(null);
    const available = MAX_PHOTOS - attachedPhotos.length;
    const toProcess = files.slice(0, available);

    setImageFiles(prev => [...prev, ...toProcess]);
    setAttachedPhotos(prev => [...prev, ...toProcess.map(f => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setAttachedPhotos(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addPollOption = () => setPollOptions([...pollOptions, '']);
  const updatePollOption = (index: number, val: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = val;
    setPollOptions(newOptions);
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <PageHeader
        title="Community Board"
        rightAction={
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-moriones-red text-[16px]">location_on</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-main dark:text-text-main-dark">{selectedTown}</span>
              <span className={`material-symbols-outlined text-[16px] text-text-muted transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-border-light dark:border-zinc-700 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {TOWNS.map((town) => (
                    <button
                      key={town}
                      onClick={() => { setSelectedTown(town); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${selectedTown === town ? 'bg-moriones-red text-white' : 'text-text-main dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
                    >
                      {town}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        }
      >
        {/* Quick Links */}
        <div className="px-2 pb-3 flex justify-between gap-1">
          <Link href="/best-of-boac-monthly-spotlight" className="flex-1 flex items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[8.5px] font-black uppercase tracking-tighter text-text-main dark:text-text-main-dark shadow-sm active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[14px] text-amber-500">workspace_premium</span> Boac
          </Link>
          <Link href="/events" className="flex-1 flex items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[8.5px] font-black uppercase tracking-tighter text-text-main dark:text-text-main-dark shadow-sm active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[14px] text-moriones-red">event</span> Events
          </Link>
          <Link href="/gems" className="flex-1 flex items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[8.5px] font-black uppercase tracking-tighter text-text-main dark:text-text-main-dark shadow-sm active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[14px] text-blue-500">diamond</span> Gems
          </Link>
          <Link href="/ports" className="flex-1 flex items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[8.5px] font-black uppercase tracking-tighter text-text-main dark:text-text-main-dark shadow-sm active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[14px] text-cyan-600">directions_boat</span> RoRo
          </Link>
        </div>
      </PageHeader>

      {/* Category filter tabs */}
      <div className="sticky top-[var(--header-h,0px)] z-20 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark overflow-x-auto no-scrollbar">
        <div className="flex items-center px-2 py-2 gap-1 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all active:scale-95 whitespace-nowrap ${selectedCategory === cat.key
                ? 'bg-moriones-red text-white shadow-sm shadow-moriones-red/30'
                : 'bg-background-light dark:bg-background-dark text-slate-500 dark:text-slate-400 border border-border-light dark:border-border-dark hover:border-moriones-red/30'
                }`}
            >
              <span className={`material-symbols-outlined text-[13px] ${selectedCategory === cat.key ? 'text-white' : cat.color}`}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-background-light/50 dark:bg-background-dark/50 px-4 py-5 space-y-6 pb-24">
        {/* Create Post Section */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-4">
          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-moriones-red overflow-hidden shrink-0 border border-border-light dark:border-zinc-700 shadow-sm flex items-center justify-center text-white font-black text-xs">
              {profile?.avatar_url ? (
                <img alt="User avatar" className="object-cover w-full h-full" src={profile.avatar_url} />
              ) : (
                <span>{profile?.full_name?.charAt(0) || 'L'}</span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder={`What's up in ${taggedTown || 'Marinduque'}?`}
                className="w-full bg-transparent p-1 pt-2 outline-none text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted resize-none min-h-[60px]"
              />
            </div>
          </div>

          {showPoll && (
            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">Create Poll</span>
                <button onClick={() => setShowPoll(false)} className="material-symbols-outlined text-sm text-slate-400">close</button>
              </div>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updatePollOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold"
                  />
                  {pollOptions.length > 2 && (
                    <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="material-symbols-outlined text-red-500 text-sm">remove_circle</button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="text-[10px] font-black uppercase text-purple-500 pl-2">+ Add Option</button>
              )}
            </div>
          )}

          {taggedTown && (
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">location_on</span> {taggedTown}
                <button onClick={() => setTaggedTown(null)} className="material-symbols-outlined text-[12px] ml-1">close</button>
              </span>
            </div>
          )}

          {errorHeader && <p className="text-red-500 text-[10px] font-bold mt-2 px-1">{errorHeader}</p>}

          {attachedPhotos.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {attachedPhotos.map((photo, i) => (
                <div key={i} className="relative size-20 rounded-xl overflow-hidden shrink-0 border border-border-light shadow-md">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-xl">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Category selector for the post being created */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
              <button
                key={cat.key}
                onClick={() => setPostCategory(cat.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide transition-all border ${postCategory === cat.key
                  ? 'bg-moriones-red border-moriones-red text-white'
                  : 'border-border-light dark:border-border-dark text-slate-400 dark:text-slate-500 hover:border-moriones-red/30'
                  }`}
              >
                <span className={`material-symbols-outlined text-[11px] ${postCategory === cat.key ? 'text-white' : cat.color}`}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="mt-4 px-2">
            <ImageUploadHint
              aspectRatio="4:3 Landscape"
              minSize="1024 × 768 px"
              usedFor="Community feed photos"
              tip="Landscape photos look best on the board."
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light dark:border-border-dark">
            <div className="flex gap-1">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*" />
              <button onClick={handlePhotoClick} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-moriones-red/80 transition-all flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-[20px]">image</span>
                <span className="text-[9px] font-black uppercase">Photo</span>
              </button>
              <button onClick={() => setShowPoll(!showPoll)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-purple-500 transition-all flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-[20px]">poll</span>
                <span className="text-[9px] font-black uppercase">Poll</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsPostTownOpen(!isPostTownOpen)}
                  className={`p-2 rounded-xl transition-all flex flex-col items-center gap-0.5 ${taggedTown ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-blue-500'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span className="text-[9px] font-black uppercase">Town</span>
                </button>
                {isPostTownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] animate-in fade-in duration-200"
                      onClick={() => setIsPostTownOpen(false)}
                    />
                    {/* Bottom Sheet Modal */}
                    <div className="fixed bottom-0 left-0 right-0 z-[1000] flex justify-center p-4">
                      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-6 pb-8 animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-black text-text-main dark:text-text-main-dark">Select Town</h3>
                            <p className="text-[10px] text-text-muted dark:text-text-muted-dark font-black uppercase tracking-widest">Tag your post location</p>
                          </div>
                          <button
                            onClick={() => setIsPostTownOpen(false)}
                            className="size-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500"
                          >
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {TOWNS.filter(t => t !== 'All Towns').map((town) => (
                            <button
                              key={town}
                              onClick={() => { setTaggedTown(town); setIsPostTownOpen(false); }}
                              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-xs font-black transition-all active:scale-95 border-2 ${taggedTown === town
                                ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20'
                                : 'bg-slate-50 dark:bg-zinc-800 border-transparent text-text-main dark:text-text-main-dark hover:bg-slate-100 dark:hover:bg-zinc-750'
                                }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">location_on</span>
                              {town}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => { setTaggedTown(null); setIsPostTownOpen(false); }}
                          className="w-full mt-4 py-4 rounded-2xl text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-zinc-750 transition-all uppercase tracking-widest"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={checkGuidelinesAndPost}
              disabled={isUploading || (!postText.trim() && attachedPhotos.length === 0)}
              className="px-6 py-2.5 bg-moriones-red text-white rounded-xl text-xs font-black shadow-lg shadow-moriones-red/20 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {isUploading ? (
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              ) : 'POST'}
            </button>
          </div>
        </section>

        {/* Board Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-4 transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-moriones-red/10 border border-border-light overflow-hidden shadow-sm flex items-center justify-center text-moriones-red font-black text-xs">
                    {post.author?.avatar_url ? (
                      <img src={post.author.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <span>{post.author?.full_name?.charAt(0) || 'L'}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-main dark:text-text-main-dark flex items-center gap-1.5">
                      {post.author?.full_name || 'Marinduque Local'}
                      {post.type === 'announcement' && <span className="material-symbols-outlined text-[16px] text-moriones-red font-black">verified</span>}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
                      <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">location_on</span> {post.location}</span>
                      <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <AdminActions contentType="post" contentId={post.id} authorId={post.author_id} onDelete={fetchPosts} />
              </div>

              {post.title && <h3 className="text-base font-black text-text-main dark:text-text-main-dark mb-2 leading-tight">{post.title}</h3>}
              <p className="text-sm text-text-main dark:text-text-main-dark leading-relaxed mb-4">{post.content}</p>

              {/* Poll Module */}
              {post.poll_data && (
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 mb-4 space-y-3">
                  <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">poll</span> Public Poll
                  </p>
                  {post.poll_data.options.map((opt: any) => {
                    const totalVotes = post.poll_data.options.reduce((acc: number, o: any) => acc + (o.votes?.length || 0), 0);
                    const voteCount = opt.votes?.length || 0;
                    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                    const hasVoted = profile && opt.votes?.includes(profile.id);

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVote(post.id, opt.id)}
                        disabled={!profile || post.poll_data.options.some((o: any) => o.votes?.includes(profile.id))}
                        className="w-full group relative overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 text-left transition-all active:scale-[0.98]"
                      >
                        <div className={`absolute inset-0 bg-purple-500/10 transition-all`} style={{ width: `${percentage}%` }} />
                        <div className="relative px-4 py-3 flex justify-between items-center text-xs font-bold">
                          <span className="flex items-center gap-2">
                            {opt.text}
                            {hasVoted && <span className="material-symbols-outlined text-purple-600 text-[14px] font-black">check_circle</span>}
                          </span>
                          <span className="text-text-muted">{Math.round(percentage)}%</span>
                        </div>
                      </button>
                    );
                  })}
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight pl-1">
                    {post.poll_data.options.reduce((acc: number, o: any) => acc + (o.votes?.length || 0), 0)} Total Votes
                  </p>
                </div>
              )}

              {post.images && post.images.length > 0 && (
                <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4 rounded-2xl overflow-hidden`}>
                  {post.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} className="w-full aspect-square object-cover border border-border-light dark:border-border-dark" />
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-background-light dark:bg-background-dark text-[10px] font-black text-moriones-red uppercase tracking-tight border border-moriones-red/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                <div className="flex gap-4">
                  {/* ❤️ Like button — optimistic UI, toggles heart fill + count */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-all group active:scale-110 ${likedPostIds.has(post.id)
                        ? 'text-moriones-red'
                        : 'text-text-muted hover:text-moriones-red'
                      }`}
                    aria-label={likedPostIds.has(post.id) ? 'Unlike' : 'Like'}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] transition-all duration-150"
                      style={{
                        fontVariationSettings: likedPostIds.has(post.id)
                          ? '"FILL" 1'
                          : '"FILL" 0',
                      }}
                    >
                      favorite
                    </span>
                    <span className="text-[11px] font-black">{post.likes_count || 0}</span>
                  </button>

                  <button onClick={() => toggleComments(post.id)} className={`flex items-center gap-1.5 transition-all group ${expandedComments.includes(post.id) ? 'text-moriones-red' : 'text-text-muted hover:text-moriones-red'}`}>
                    <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                    <span className="text-[11px] font-black">{post.comments_count || 0}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {/* Flag button — 3-strike: 3 flags hides post via DB trigger */}
                  <FlagButton contentType="post" contentId={post.id.toString()} />
                  {/* 📤 Share button — native share sheet on mobile, clipboard fallback on desktop */}
                  <button
                    onClick={() => handleShare(post.id, post.content)}
                    className="text-text-muted hover:text-moriones-red transition-all active:scale-110"
                    aria-label="Share post"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Comments */}
              {expandedComments.includes(post.id) && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <UniversalComments entityId={post.id} entityType="post" />
                </div>
              )}
            </article>
          ))}

          {posts.length === 0 && !isLoadingMore && (
            <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-zinc-800 shadow-xl flex flex-col items-center p-8">
              <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">forum</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">The board is quiet...</h3>
              <p className="text-slate-500 text-xs font-bold max-w-xs mb-8">Be the first to share something with {selectedTown === 'All Towns' ? 'the community' : selectedTown}!</p>
            </div>
          )}

          {/* Infinite scroll sentinel — IntersectionObserver watches this */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-6">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Loading more...</span>
                </div>
              )}
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">— End of feed —</p>
          )}
        </div>
      </div>

      {/* One-time Community Guidelines Gate */}
      {showGuidelinesGate && (
        <CommunityGuidelinesGate
          onAccept={acceptGuidelines}
          onDismiss={() => setShowGuidelinesGate(false)}
          isAccepting={isAcceptingGuidelines}
        />
      )}

      {/* Share / Clipboard Toast */}
      {shareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold bg-zinc-900 text-white animate-in slide-in-from-bottom-4 duration-300 whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">link</span>
          {shareToast}
        </div>
      )}
    </div>
  );
}
