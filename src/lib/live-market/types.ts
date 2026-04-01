// Marinduque Market — Shared Types
// All TypeScript types for the live-market feature

export type LmItemStatus = 'available' | 'reserved' | 'sold' | 'passed';
export type LmClaimStatus =
  | 'pending_payment'
  | 'verifying'
  | 'paid'
  | 'shipped'
  | 'received'
  | 'abandoned'
  | 'cancelled';
export type LmDeliveryMethod = 'local_rider' | 'jeepney_parcel' | 'meetup';

export interface LmSession {
  id: string;
  seller_id: string;
  hms_room_id: string | null;
  room_name: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  is_live: boolean;
  current_product_id: string | null;
  viewer_count: number;
  claim_window_minutes: number;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface LmProduct {
  id: string;
  session_id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  status: LmItemStatus;
  display_order: number;
  created_at: string;
}

export interface LmClaim {
  id: string;
  product_id: string;
  session_id: string;
  buyer_id: string;
  seller_id: string;
  status: LmClaimStatus;
  delivery_method: LmDeliveryMethod | null;
  buyer_municipality: string | null;
  buyer_barangay: string | null;
  buyer_landmark: string | null;
  buyer_phone: string | null;
  gcash_ref: string | null;
  receipt_url: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface LmMessage {
  id: string;
  session_id: string;
  user_id: string | null;
  display_name: string;
  body: string;
  created_at: string;
}

// Realtime broadcast event payloads
export interface MineWinEvent {
  type: 'MINE_WIN';
  productId: string;
  productName: string;
  winnerDisplayName: string;
  claimId: string;
}

export interface ProductSpotlightEvent {
  type: 'PRODUCT_SPOTLIGHT';
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export interface ChatMessageEvent {
  type: 'CHAT_MESSAGE';
  userId: string;
  displayName: string;
  body: string;
  timestamp: string;
}

export type LmRealtimeEvent =
  | MineWinEvent
  | ProductSpotlightEvent
  | ChatMessageEvent
  | { type: 'MINE_LOSE'; productId: string }
  | { type: 'SESSION_END' }
  | { type: 'SELLER_RECONNECT' };
