import React from 'react';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  location_tag: string;
  created_at: string;
};

type Props = {
  posts: BlogPost[];
  isAdmin: boolean;
};

export default function TheHiddenForeignerBlogFeed({ posts, isAdmin }: Props) {
  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-surface-light dark:bg-surface-dark pb-24">
        {/* Header Section */}
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-text-main dark:text-slate-100">arrow_back</span>
              </Link>
              <div className="bg-moriones-red/10 p-2 rounded-full text-moriones-red">
                <span className="material-symbols-outlined !text-[28px]">explore</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-text-main dark:text-slate-100 leading-none">The Hidden Foreigner</h1>
                <p className="text-xs text-text-muted dark:text-slate-400 font-medium">Uncovering Marinduque&apos;s Soul</p>
              </div>
            </div>
            {isAdmin && (
              <Link href="/admin-create-blog-post" className="flex items-center justify-center bg-moriones-red hover:bg-moriones-red/90 text-white rounded-full px-3 py-1.5 transition-colors gap-1 text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined !text-[16px]">edit_note</span>
                New
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Feed */}
        <main className="flex flex-col gap-6 p-4">
          {/* About Tagline / Intro */}
          <div className="text-center mb-2 px-2 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
            <p className="text-sm text-text-muted dark:text-slate-300 leading-relaxed italic">
              "A traveler observing the island unnoticed, leaving behind stories of hidden gems, local flavors, and the vibrant spirit of Marinduque."
            </p>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-zinc-700 mb-4">history_edu</span>
              <p className="text-gray-500 font-medium">No journal entries yet.</p>
            </div>
          )}

          {posts.map((post) => (
            <article key={post.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 relative group cursor-pointer transition-transform hover:-translate-y-1">
              <Link href={`/the-hidden-foreigner-blog-feed/${post.id}`} className="absolute inset-0 z-0"></Link>
              <div className="h-56 w-full bg-gray-200 relative overflow-hidden">
                <img alt={post.title} className="w-full h-full object-cover" src={post.cover_image || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-10 pr-3 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1">
                    {post.location_tag && (
                      <span className="bg-moriones-red text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">{post.location_tag}</span>
                    )}
                    <span className="text-xs text-white/90 font-medium dropshadow-md">{formatDate(post.created_at)}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white leading-tight dropshadow-lg">{post.title}</h3>
                </div>
              </div>
              <div className="p-4 relative z-10 pointer-events-none">
                <p className="text-text-main dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </main>
      </div>
    </>
  );
}
