'use client';

// Marinduque Market — Mine Claim Hook
// Calls the lm_claim_item Supabase RPC (atomic, race-condition-safe).
// Handles optimistic UI disable and broadcast of win/lose result.
//
// Phase 1 implementation

import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DEFAULT_CLAIM_WINDOW_MINUTES } from './constants';

interface UseMineOptions {
  sessionId: string;
  claimWindowMinutes?: number;
  onWin: (claimId: string, productName: string) => void;
  onLose: () => void;
}

export function useMine({
  sessionId,
  claimWindowMinutes = DEFAULT_CLAIM_WINDOW_MINUTES,
  onWin,
  onLose,
}: UseMineOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const supabase = createClient();

  const claimItem = useCallback(async (productId: string) => {
    if (isLoading || hasClaimed) return;

    // Optimistic disable — prevent spam clicks
    setIsLoading(true);
    setHasClaimed(true);

    const expiresAt = new Date(Date.now() + claimWindowMinutes * 60 * 1000).toISOString();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        onLose();
        setIsLoading(false);
        return;
    }

    const { data, error } = await supabase.rpc('lm_claim_item', {
      p_product_id: productId,
      p_buyer_id: user.id,
      p_session_id: sessionId,
      p_expires_at: expiresAt,
    });

    if (error || !data?.success) { 
        onLose(); 
    } else { 
        onWin(data.claim_id, data.product_name); 
    }
    setIsLoading(false);
  }, [isLoading, hasClaimed, sessionId, claimWindowMinutes, onWin, onLose, supabase]);

  const reset = useCallback(() => {
    setHasClaimed(false);
    setIsLoading(false);
  }, []);

  return { claimItem, isLoading, hasClaimed, reset };
}
