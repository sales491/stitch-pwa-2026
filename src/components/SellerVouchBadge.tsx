'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

export default function SellerVouchBadge({ sellerId }: { sellerId: string }) {
  const [vouchCount, setVouchCount] = useState(0);
  const [hasVouched, setHasVouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVouching, setIsVouching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = useSupabase();

  useEffect(() => {
    let isMounted = true;
    async function fetchVouches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUserId(user?.id || null);

      const { data } = await supabase
        .from('seller_vouches')
        .select('vouched_by_user_id')
        .eq('vouched_seller_id', sellerId);

      if (!isMounted) return;
      if (data) {
        setVouchCount(data.length);
        if (user) {
          setHasVouched(data.some(v => v.vouched_by_user_id === user.id));
        }
      }
      setLoading(false);
    }
    fetchVouches();

    return () => { isMounted = false; };
  }, [sellerId, supabase]);

  const toggleVouch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert('Sign in to recommend this seller.');
      return;
    }
    
    // Don't let users recommend themselves
    if (userId === sellerId) return;

    setIsVouching(true);
    try {
      if (hasVouched) {
        await supabase
          .from('seller_vouches')
          .delete()
          .eq('vouched_by_user_id', userId)
          .eq('vouched_seller_id', sellerId);
        setVouchCount(p => Math.max(0, p - 1));
        setHasVouched(false);
      } else {
        await supabase
          .from('seller_vouches')
          .insert({ vouched_by_user_id: userId, vouched_seller_id: sellerId });
        setVouchCount(p => p + 1);
        setHasVouched(true);
      }
    } catch (err) {
      const error = err as { code?: string };
      if (error.code !== '23505') alert('Failed to update vouch.');
    } finally {
      setIsVouching(false);
    }
  };

  if (loading) return null;

  return (
    <button 
      onClick={toggleVouch}
      disabled={isVouching || userId === sellerId}
      className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all active:scale-95 border ${
        hasVouched 
          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
          : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300 hover:text-emerald-600'
      } ${isVouching ? 'opacity-50 animate-pulse' : ''} ${userId === sellerId ? 'pointer-events-none opacity-80' : ''}`}
      title={userId === sellerId ? "You cannot recommend yourself" : (hasVouched ? 'Remove recommendation' : 'Recommend this seller')}
    >
      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: hasVouched ? '"FILL" 1' : '"FILL" 0' }}>
        thumb_up
      </span>
      {vouchCount > 0 ? `${vouchCount} Recommend${vouchCount !== 1 ? 's' : ''}` : 'Recommend'}
    </button>
  );
}
