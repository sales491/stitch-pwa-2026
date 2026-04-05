'use client';

import React, { useTransition, useState, useEffect } from 'react';
import Link from 'next/link';
import { deleteGem, approveGem } from '@/app/actions/gems';
import GemLikeButton from '@/components/GemLikeButton';
import AdminActions from './AdminActions';
import PageHeader from '@/components/PageHeader';

type Author = {
  id: string;
  name: string;
  avatar: string | null;
  initials: string;
};

type Gem = {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  images: string[];
  imageAlt: string;
  author: Author;
  aspectRatio: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isApproved: boolean;
  category?: string;
};

type Props = {
  initialGems: Gem[];
  currentUserId: string | null;
  isAdmin: boolean;
};

export default function GemsOfMarinduqueFeed({ initialGems = [], currentUserId, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const filters = [
    { id: 'All', label: 'All', icon: 'diamond' },
    { id: 'Beaches', label: 'Beaches', icon: 'beach_access' },
    { id: 'Heritage', label: 'Heritage', icon: 'church' },
    { id: 'Food', label: 'Food', icon: 'restaurant' },
    { id: 'Nature', label: 'Nature', icon: 'hiking' }
  ];

  const filteredGems = initialGems.filter(gem => {
    const matchesSearch = gem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || gem.description.toLowerCase().includes(activeFilter.toLowerCase()) || gem.title.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-white dark:bg-zinc-950 overflow-x-hidden shadow-2xl sm:my-8 sm:rounded-3xl sm:border sm:border-slate-200 dark:sm:border-zinc-800">
      {/* Premium Header */}
      <PageHeader title="Local Gems" subtitle="Found in Marinduque">
        {/* Search & Filters */}
        <div className="px-4 pb-4 flex flex-col gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-moriones-red transition-colors">search</span>
            <input
              type="text"
              placeholder="Search hidden wonders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 pl-11 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:border-moriones-red focus:ring-4 focus:ring-moriones-red/5 outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === filter.id
                  ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20 scale-105'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-text-muted'
                  }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${activeFilter === filter.id ? 'text-white' : 'text-moriones-red'}`}>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <main className="flex-1 px-4 py-2 pb-32">
        {/* Intro Section */}
        {!isScrolled && !searchQuery && (
          <section className="mb-6 px-1 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-2xl font-black text-text-main leading-tight">Secret spots &<br /><span className="text-moriones-red">hidden treasures</span></h2>
            <p className="text-sm font-medium text-text-muted mt-2">Discover the heart of Marinduque through the eyes of its people.</p>
          </section>
        )}

        {filteredGems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="size-24 bg-moriones-red/5 dark:bg-moriones-red/10 rounded-full flex items-center justify-center mb-6 relative">
              <span className="material-symbols-outlined text-5xl text-moriones-red">search_off</span>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-moriones-red/20 animate-[spin_10s_linear_infinite]" />
            </div>
            <h2 className="text-xl font-black text-text-main mb-2">No wonders found</h2>
            <p className="text-xs font-medium text-text-muted max-w-[200px] leading-relaxed">Try adjusting your search or be the first to share this treasure!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredGems.map(gem => {
              const canDelete = currentUserId === gem.author.id || isAdmin;
              return (
                <div key={gem.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image & Overlay */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Link href={`/gems/${gem.id}`} className="block w-full h-full">
                      <img
                        alt={gem.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={gem.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full shadow-lg">
                        <GemLikeButton
                          gemId={gem.id}
                          initialLiked={gem.isLikedByMe}
                          initialCount={gem.likesCount}
                          iconSize={16}
                        />
                      </div>
                      
                      {!gem.isApproved && isAdmin && (
                        <div className="flex items-center gap-1">
                          <div className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-zinc-950">
                            Pending
                          </div>
                          <button
                            onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await approveGem(gem.id); }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-zinc-950 transition-colors cursor-pointer pointer-events-auto"
                          >
                            Approve
                          </button>
                        </div>
                      )}

                      <AdminActions
                        contentType="gem"
                        contentId={gem.id}
                        authorId={gem.author.id}
                        className="scale-90 origin-top-right"
                      />
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 shadow-lg transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-moriones-red text-[12px] font-black">location_on</span>
                      <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest truncate">{gem.location}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-1 text-moriones-red mb-1 group-hover:translate-x-0.5 transition-transform">
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{gem.location}</span>
                    </div>
                    <Link href={`/gems/${gem.id}`}>
                      <h3 className="text-[11px] font-black leading-tight text-text-main line-clamp-2 min-h-[2.4rem] tracking-tight">{gem.title}</h3>
                    </Link>

                    {/* Footer / Author */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-zinc-800">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="size-5 rounded-full ring-2 ring-white dark:ring-zinc-950 overflow-hidden shrink-0 shadow-sm">
                          {gem.author.avatar ? (
                            <img src={gem.author.avatar} className="w-full h-full object-cover" alt={gem.author.name} />
                          ) : (
                            <div className="w-full h-full bg-moriones-red/10 flex items-center justify-center text-[7px] font-black text-moriones-red">{(gem.author.name[0] || 'A').toUpperCase()}</div>
                          )}
                        </div>
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest truncate">{gem.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 dark:text-slate-700">
                        <span className="material-symbols-outlined text-[12px] group-hover:text-moriones-red transition-colors">chat_bubble</span>
                        <span className="text-[9px] font-bold">{gem.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Action FAB */}
      <Link
        href="/gems/create"
        className="fixed bottom-24 right-6 size-14 bg-moriones-red text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-moriones-red/40 hover:scale-110 hover:rotate-3 active:scale-95 transition-all z-50 border-4 border-white dark:border-zinc-950 group"
      >
        <div className="absolute -top-12 right-0 bg-moriones-red text-white text-[9px] font-black px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
          SHARE A GEM
        </div>
        <span className="material-symbols-outlined text-[28px] font-black">photo_camera</span>
      </Link>
    </div>
  );
}

