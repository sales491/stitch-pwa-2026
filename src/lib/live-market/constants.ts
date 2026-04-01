// Marinduque Market — Constants

export const CLAIM_WINDOW_OPTIONS = [
  { label: '1 hour',  minutes: 60  },
  { label: '2 hours', minutes: 120 }, // default
  { label: '4 hours', minutes: 240 },
  { label: 'Manual', minutes: null }, // seller closes manually
] as const;

export const DEFAULT_CLAIM_WINDOW_MINUTES = 120;

export const MAX_SESSION_DURATION_HOURS = 2;

export const HMS_ROLES = {
  BROADCASTER: 'broadcaster',
  VIEWER: 'viewer-near-realtime',
} as const;

export const HMS_REGION = 'in'; // India — closest 100ms region to Philippines

export const REALTIME_CHANNEL_PREFIX = 'live-market:session:';

export const MUNICIPALITIES = [
  'Boac',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Buenavista',
  'Torrijos',
] as const;

export type Municipality = typeof MUNICIPALITIES[number];

export const STRIKE_THRESHOLD = 3; // strikes before buyer flagged for review
