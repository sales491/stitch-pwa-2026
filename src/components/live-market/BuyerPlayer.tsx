'use client';

// Marinduque Market — Buyer Player Component
// Phase 1: Subscribes to seller's HLS stream via 100ms useHMSStore
//           Fetches HMS token (viewer-near-realtime role) from /api/live-market/token
//           Renders video element fullscreen in portrait on mobile
//           MineButton floats over video when current_product_id is set

export function BuyerPlayer({ sessionId: _sessionId }: { sessionId: string }) {
  // TODO — Phase 1 implementation

  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-900">
      <p className="text-zinc-600 text-sm">Stream player — Phase 1</p>
    </div>
  );
}
