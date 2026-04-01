'use client';

// Marinduque Market — Claim Timer
// Countdown displayed to the winner on the claim/payment page.
// Counts down from seller's configured claim window (default 2 hours).
// Shows urgency color changes: green → yellow → red as time runs out.
// Timer expiry does NOT auto-strike in v1 — only alerts the buyer.

import { useState, useEffect } from 'react';

interface ClaimTimerProps {
  expiresAt: string; // ISO timestamp from lm_claims.expires_at
}

export function ClaimTimer({ expiresAt }: ClaimTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isUrgent = secondsLeft < 900;   // last 15 min
  const isCritical = secondsLeft < 300; // last 5 min
  const isExpired = secondsLeft === 0;

  const color = isExpired
    ? 'text-zinc-500'
    : isCritical
    ? 'text-red-400'
    : isUrgent
    ? 'text-yellow-400'
    : 'text-green-400';

  return (
    <div className="text-center">
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
        {isExpired ? 'Window Closed' : 'Time Remaining to Pay'}
      </p>
      <p className={`font-black text-4xl tabular-nums ${color}`}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      {isUrgent && !isExpired && (
        <p className="text-yellow-400 text-xs mt-1 font-bold">
          Padali na! Send your GCash payment soon 🙏
        </p>
      )}
    </div>
  );
}
