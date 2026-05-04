'use client';

// Marinduque Market — Seller Broadcast Component
// Phase 1: Uses 100ms useHMSActions to publish camera + mic
//           Fetches HMS token from /api/live-market/token
//           Shows: video preview, Go Live button, mute toggle, end stream button
//           "Next Item" and "Spotlight" controls sit alongside this in the seller view

export function SellerBroadcast({ sessionId: _sessionId }: { sessionId: string }) {
  // TODO — Phase 1 implementation

  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-900 rounded-2xl">
      <p className="text-zinc-600 text-sm">Seller camera — Phase 1</p>
    </div>
  );
}
