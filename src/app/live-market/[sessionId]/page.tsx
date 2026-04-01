// Marinduque Market — Buyer View (Watch + Mine)
// Phase 1: Streams seller video via 100ms BuyerPlayer
//           Chat overlay via Supabase Realtime LiveChat
//           MineButton appears when current_product_id is set
//           WinnerAnnouncement fires on MINE_WIN broadcast

interface Props {
  params: { sessionId: string };
}

export default function BuyerStreamPage({ params }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-zinc-500 text-sm">
        Buyer stream view — Session: {params.sessionId}
      </p>
    </div>
  );
}
