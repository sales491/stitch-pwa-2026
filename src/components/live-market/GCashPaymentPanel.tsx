'use client';

// Marinduque Market — GCash/Maya Payment Panel
// Shown to winner on the claim page.
// Displays seller's GCash QR and/or Maya QR from their profile.
// Buyer uploads a receipt screenshot which is stored in Supabase Storage.
// Optional: buyer enters GCash reference number for easier seller verification.

interface GCashPaymentPanelProps {
  gcashQrUrl: string | null;
  mayaQrUrl: string | null;
  claimId: string;
  onReceiptUploaded: (receiptUrl: string) => void;
}

export function GCashPaymentPanel({
  gcashQrUrl,
  mayaQrUrl,
  claimId,
  onReceiptUploaded,
}: GCashPaymentPanelProps) {
  // TODO — Phase 3 implementation:
  // - Display QR image (seller's gcash_qr_url from profiles)
  // - Receipt image upload → Supabase Storage bucket: live-market-receipts
  // - On upload success: update lm_claims.receipt_url + status = 'verifying'
  // - Call onReceiptUploaded() to update UI

  return (
    <div className="flex flex-col gap-6 p-6 bg-zinc-900 rounded-2xl">
      <div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
          Scan to Pay
        </p>
        {gcashQrUrl ? (
          <img
            src={gcashQrUrl}
            alt="GCash QR Code"
            className="w-48 h-48 mx-auto rounded-2xl"
          />
        ) : (
          <div className="w-48 h-48 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
            <p className="text-zinc-600 text-sm">No QR set</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
          Upload Receipt Screenshot
        </p>
        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-zinc-400"
          disabled
        />
        <p className="text-zinc-600 text-xs mt-2">Receipt upload — Phase 3</p>
      </div>
    </div>
  );
}
