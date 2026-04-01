'use client';

// Marinduque Market — Winner Announcement
// Fires for ALL viewers when MINE_WIN Realtime event is received.
// The win is a PUBLIC social moment — not a quiet private notification.
// Full-screen overlay with celebration animation, winner's name, product name.
// After 4 seconds, auto-dismisses and shows "Next item pa lang!" prompt.
//
// Design notes:
//   - Confetti/particle burst effect
//   - Winner's name displayed as "Ate [Name]" or "Kuya [Name]"
//   - Product name shown prominently
//   - For the LOSER: overlay fades with "Aww! Next time ha! 😊" message

interface WinnerAnnouncementProps {
  winnerName: string;
  productName: string;
  isCurrentUser: boolean;
  onDismiss: () => void;
}

export function WinnerAnnouncement({
  winnerName,
  productName,
  isCurrentUser,
  onDismiss,
}: WinnerAnnouncementProps) {
  // TODO — Phase 1 implementation

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="text-center p-8">
        <p className="text-6xl mb-4">🎉</p>
        <p className="text-2xl font-black text-white">{winnerName} wins!</p>
        <p className="text-zinc-300 mt-2">{productName}</p>
        {!isCurrentUser && (
          <p className="text-yellow-400 mt-4 font-bold">Aww! Next time ha! 😊</p>
        )}
      </div>
    </div>
  );
}
