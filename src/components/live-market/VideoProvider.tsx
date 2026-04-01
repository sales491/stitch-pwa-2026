'use client';

// Marinduque Market — VideoProvider
// Thin abstraction layer over the 100ms SDK.
// If we ever switch to Amazon IVS, only this file + SellerBroadcast + BuyerPlayer change.
// All Mine logic, chat, and Supabase Realtime are unaffected by video provider changes.
//
// Phase 1: Wrap HMSRoomProvider from @100mslive/react-sdk

import React from 'react';

interface VideoProviderProps {
  children: React.ReactNode;
}

export function VideoProvider({ children }: VideoProviderProps) {
  // TODO — Phase 1:
  // import { HMSRoomProvider } from '@100mslive/react-sdk';
  // return <HMSRoomProvider>{children}</HMSRoomProvider>;

  return <>{children}</>;
}
