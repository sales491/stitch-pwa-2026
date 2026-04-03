// Marinduque Market — Public Session Feed
// Phase 2: Lists active + upcoming live sessions by municipality
// Phase 0: Placeholder only — not linked in navigation

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Market — Live Selling for Marinduque',
    description: 'Watch and shop live selling sessions from local Marinduque sellers. Real-time commerce for the island community.',
};

export default function LiveMarketFeedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <h1 className="text-3xl font-black tracking-tighter">🌺 Marinduque Market</h1>
      <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
        Coming Soon — Live Selling for Marinduque
      </p>
    </div>
  );
}
