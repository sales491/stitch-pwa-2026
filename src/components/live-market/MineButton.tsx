'use client';

// Marinduque Market — Mine Button
// THE most important UI element in the feature.
// Appears as a large floating button when current_product_id is set.
// Pulses/glows to create "budol" urgency.
// Disabled immediately on first tap (optimistic UI — prevents spam).
// Triggers useMine() → lm_claim_item RPC → MINE_WIN or MINE_LOSE broadcast.
//
// Design notes:
//   - Must feel like a social impulse, not an e-commerce checkout button
//   - Red/warm color — excitement, urgency, Filipino market energy
//   - Large tap target (min 64px) — usable on phone while watching video
//   - After win: transforms into celebration animation
//   - After lose: dims with "Aww, next time!" text

interface MineButtonProps {
  productId: string;
  sessionId: string;
  isActive: boolean;       // true when seller has spotlighted this product
  onWin: (claimId: string, productName: string) => void;
  onLose: () => void;
}

export function MineButton({
  productId,
  sessionId,
  isActive,
  onWin,
  onLose,
}: MineButtonProps) {
  // TODO — Phase 1 implementation using useMine() hook

  if (!isActive) return null;

  return (
    <button
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                 bg-red-500 text-white font-black text-2xl uppercase tracking-widest
                 px-10 py-5 rounded-full shadow-2xl shadow-red-500/50
                 animate-pulse"
    >
      ⚡ MINE!
    </button>
  );
}
