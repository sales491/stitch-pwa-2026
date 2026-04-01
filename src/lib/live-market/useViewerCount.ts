'use client';

// Marinduque Market — Viewer Count Hook
// Uses Supabase Realtime Presence to track how many people are watching.
// Each buyer joining creates a presence entry; leaving removes it.
//
// Phase 1 implementation

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { REALTIME_CHANNEL_PREFIX } from './constants';

export function useViewerCount(sessionId: string) {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // TODO — Phase 1:
    // const supabase = createClient();
    // const channel = supabase.channel(`${REALTIME_CHANNEL_PREFIX}${sessionId}:presence`)
    //   .on('presence', { event: 'sync' }, () => {
    //     const state = channel.presenceState();
    //     setViewerCount(Object.keys(state).length);
    //   })
    //   .subscribe(async (status) => {
    //     if (status === 'SUBSCRIBED') {
    //       await channel.track({ joined_at: Date.now() });
    //     }
    //   });
    // return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  return viewerCount;
}
