'use client';

// Marinduque Market — Supabase Realtime Room Hook
// Manages the broadcast channel for a live session.
// Handles: MINE_WIN, MINE_LOSE, CHAT_MESSAGE, PRODUCT_SPOTLIGHT, SESSION_END, SELLER_RECONNECT
//
// Phase 1 implementation: connect channel, subscribe to broadcasts,
// expose sendEvent() for Mine button and chat input

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { REALTIME_CHANNEL_PREFIX } from './constants';
import type { LmRealtimeEvent } from './types';

export function useRealtimeRoom(
  sessionId: string,
  onEvent: (event: LmRealtimeEvent) => void
) {
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // TODO — Phase 1:
    // const channel = supabase.channel(`${REALTIME_CHANNEL_PREFIX}${sessionId}`)
    //   .on('broadcast', { event: '*' }, ({ event, payload }) => {
    //     onEvent(payload as LmRealtimeEvent);
    //   })
    //   .subscribe();
    // channelRef.current = channel;
    // return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const sendEvent = useCallback(async (event: LmRealtimeEvent) => {
    // TODO — Phase 1:
    // await channelRef.current?.send({
    //   type: 'broadcast',
    //   event: event.type,
    //   payload: event,
    // });
  }, []);

  return { sendEvent };
}
