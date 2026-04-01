// Marinduque Market — 100ms Token Generator
// Generates a signed JWT for a user to join a 100ms room as broadcaster or viewer.
// HMS_ACCESS_KEY and HMS_APP_SECRET never leave the server.
//
// POST /api/live-market/token
// Body: { roomId: string, role: 'broadcaster' | 'viewer-near-realtime', userId: string }
// Returns: { token: string }

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // TODO — Phase 1 implementation:
  // 1. Verify user session (Supabase auth)
  // 2. Sign JWT with HMS_ACCESS_KEY + HMS_APP_SECRET using jose or jsonwebtoken
  // 3. Return token to client
  // Reference: https://www.100ms.live/docs/get-started/v2/get-started/security-and-tokens

  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1' },
    { status: 501 }
  );
}
