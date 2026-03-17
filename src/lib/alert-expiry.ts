// ─── Default Expiry Hours by Alert Type ──────────────────────────────────────

export const CALAMITY_EXPIRY_HOURS: Record<string, number> = {
  typhoon:    72,
  flood:      48,
  earthquake: 24,
  fire:        6,
  road:        8,
  other:      24,
};

export const OUTAGE_EXPIRY_HOURS: Record<string, number> = {
  power: 12,
  water: 24,
};

/** Returns an ISO timestamp N hours from now */
export function expiresAt(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

// ─── Unified Priority Weights (lower = more urgent) ──────────────────────────
// Used to sort mixed calamity + outage alerts on the home banner

export const CALAMITY_PRIORITY: Record<string, number> = {
  typhoon:    10,
  fire:       20,
  flood:      30,
  earthquake: 40,
  road:       60,
  other:      70,
};

export const SEVERITY_OFFSET: Record<string, number> = {
  critical: 0,
  high:     1,
  moderate: 2,
  low:      3,
};

export const OUTAGE_PRIORITY: Record<string, number> = {
  power: 50,
  water: 65,
};

/** Returns a sortable numeric priority for any alert (lower = show first) */
export function alertPriority(alert: {
  type: string;
  severity?: string;
  expires_at?: string | null;
}): number {
  const base =
    CALAMITY_PRIORITY[alert.type] ??
    OUTAGE_PRIORITY[alert.type] ??
    80;
  const severityBonus = alert.severity ? (SEVERITY_OFFSET[alert.severity] ?? 2) : 0;
  return base + severityBonus;
}

/** Human-readable countdown: "expires in 6h", "expires in 2d 4h", "expired" */
export function expiryLabel(expiresAtIso: string | null | undefined): string | null {
  if (!expiresAtIso) return null;
  const diff = new Date(expiresAtIso).getTime() - Date.now();
  if (diff <= 0) return 'expired';
  const totalMins = Math.floor(diff / 60000);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h === 0) return `expires in ${m}m`;
  if (h < 24) return `expires in ${h}h`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh > 0 ? `expires in ${d}d ${rh}h` : `expires in ${d}d`;
}
