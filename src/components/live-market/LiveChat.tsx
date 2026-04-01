'use client';

// Marinduque Market — Live Chat Overlay
// Phase 1: Subscribes to Supabase Realtime CHAT_MESSAGE events
//           Displays scrolling chat bubbles with Ate/Kuya prefixed names
//           Buyers can type and send messages
//           Messages optionally persisted to lm_messages table

export function LiveChat({ sessionId }: { sessionId: string }) {
  // TODO — Phase 1 implementation

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl p-2">
      <p className="text-zinc-600 text-xs text-center">Chat — Phase 1</p>
    </div>
  );
}
