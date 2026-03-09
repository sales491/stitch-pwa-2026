'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  cover_image?: string | null;
  location_tag?: string | null;
  created_at: string;
  status?: string | null;
};

type Props = { posts: BlogPost[]; isAdmin: boolean };

export default function TheHiddenForeignerBlogFeed({ posts, isAdmin }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleShare = async (postId: string, title: string) => {
    const url = `${window.location.origin}/the-hidden-foreigner-blog-feed/${postId}`;
    if (navigator.share) {
      try { await navigator.share({ title: `The Hidden Foreigner: ${title}`, url }); }
      catch (e: any) { if (e?.name !== 'AbortError') console.warn(e); }
    } else {
      try { await navigator.clipboard.writeText(url); setToast('Link copied!'); }
      catch { setToast('Could not copy link.'); }
      setTimeout(() => setToast(null), 2500);
    }
  };

  const featured = posts[0] ?? null;
  const feed = posts.slice(1);

  return (
    <div className="relative flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

      {/* ── Header — matches live site red circle + compass icon ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-20 shadow-sm">
        <Link href="/" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        {/* Red circle compass badge — exactly like live site */}
        <div className="bg-moriones-red/10 dark:bg-moriones-red/20 rounded-full p-2.5 flex items-center justify-center">
          <span className="material-symbols-outlined text-moriones-red text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>explore</span>
        </div>
        <div>
          <h1 className="text-base font-black text-text-main dark:text-text-main-dark leading-none tracking-tight">
            The Hidden Foreigner
          </h1>
          <p className="text-[10px] text-text-muted dark:text-text-muted-dark">Uncovering Marinduque&apos;s Soul</p>
        </div>
        {isAdmin && (
          <Link href="/admin-create-blog-post" className="ml-auto bg-moriones-red text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-moriones-red/30 active:scale-95 transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">edit_note</span>
            New
          </Link>
        )}
      </div>

      {/* ── Italic quote box — matches live site exactly ────────── */}
      <div className="mx-4 mt-4">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5 shadow-sm">
          <p className="text-sm italic text-center text-text-muted dark:text-text-muted-dark leading-relaxed">
            &ldquo;A traveler observing the island unnoticed, leaving behind stories of hidden gems, local flavors, and the vibrant spirit of Marinduque.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────── */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <span className="material-symbols-outlined text-[56px] text-text-muted/20 dark:text-text-muted-dark/20 mb-4">history_edu</span>
          <p className="text-sm font-black text-text-main dark:text-text-main-dark">No journal entries yet.</p>
          <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-1">Stories of Marinduque will appear here.</p>
        </div>
      )}

      {/* ── Featured post ──────────────────────────────────────── */}
      {featured && (
        <article className="mx-4 mt-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden shadow-md group">
          {/* Cover image */}
          <Link href={`/the-hidden-foreigner-blog-feed/${featured.id}`}>
            <div className="relative h-56 w-full bg-background-light dark:bg-background-dark overflow-hidden">
              <img
                src={featured.cover_image || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80'}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Featured badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-moriones-red text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Featured
                </span>
              </div>
              {featured.location_tag && (
                <div className="absolute top-3 right-3">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                    {featured.location_tag}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Body */}
          <div className="p-5">
            <p className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-wide mb-2">
              {formatDate(featured.created_at)}
            </p>
            <Link href={`/the-hidden-foreigner-blog-feed/${featured.id}`}>
              <h2 className="text-xl font-black text-text-main dark:text-text-main-dark leading-tight mb-3 hover:text-moriones-red transition-colors line-clamp-2">
                {featured.title}
              </h2>
            </Link>
            <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed line-clamp-3 mb-4">
              {featured.excerpt}
            </p>

            {/* Footer action row */}
            <div className="flex items-center justify-between pt-3 border-t border-border-light dark:border-border-dark">
              <button
                onClick={() => handleShare(featured.id, featured.title)}
                className="flex items-center gap-1.5 text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-wide hover:text-moriones-red transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Share
              </button>
              <Link
                href={`/the-hidden-foreigner-blog-feed/${featured.id}`}
                className="bg-moriones-red text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-moriones-red/20 active:scale-95 transition-all flex items-center gap-1"
              >
                Read Story
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* ── Feed: remaining posts ────────────────────────────────── */}
      <div className="px-4 mt-4 flex flex-col gap-4">
        {feed.map(post => (
          <article
            key={post.id}
            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm group flex flex-col sm:flex-row"
          >
            {/* Thumbnail */}
            <Link href={`/the-hidden-foreigner-blog-feed/${post.id}`} className="sm:w-32 shrink-0">
              <div className="relative h-40 sm:h-full w-full bg-background-light dark:bg-background-dark overflow-hidden">
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {post.location_tag && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-moriones-red text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                      {post.location_tag}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Body */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <p className="text-[9px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-wide mb-1">
                  {formatDate(post.created_at)}
                </p>
                <Link href={`/the-hidden-foreigner-blog-feed/${post.id}`}>
                  <h3 className="text-base font-black text-text-main dark:text-text-main-dark leading-snug hover:text-moriones-red transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                <button
                  onClick={() => handleShare(post.id, post.title)}
                  className="flex items-center gap-1 text-[9px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-wide hover:text-moriones-red transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">share</span>
                  Share
                </button>
                <Link
                  href={`/the-hidden-foreigner-blog-feed/${post.id}`}
                  className="flex items-center gap-1 text-moriones-red font-black text-[10px] uppercase tracking-wide hover:underline"
                >
                  Read <span className="material-symbols-outlined text-[14px]">trending_flat</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Share toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl text-sm font-black bg-zinc-900 text-white whitespace-nowrap border border-zinc-700">
          <span className="material-symbols-outlined text-moriones-red text-[18px]">link</span>
          {toast}
        </div>
      )}
    </div>
  );
}
