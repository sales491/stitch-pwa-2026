// Marinduque Market — Claim / Payment Page
// Phase 3: Winner lands here after Mine win
//           Shows: seller GCash/Maya QR, claim countdown timer
//           Buyer uploads receipt screenshot
//           Pre-filled delivery info from profile

interface Props {
  params: { claimId: string };
}

export default function ClaimPage({ params }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-zinc-500 text-sm">
        Claim Payment — Claim: {params.claimId}
      </p>
    </div>
  );
}
