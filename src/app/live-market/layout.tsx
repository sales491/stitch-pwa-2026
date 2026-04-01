// Marinduque Market — Feature Layout
// This layout is intentionally isolated from the main app's BottomNav and layout.
// Nothing in the main app imports from live-market/ until launch.

export default function LiveMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="live-market-root min-h-screen bg-zinc-950 text-white">
      {children}
    </div>
  );
}
