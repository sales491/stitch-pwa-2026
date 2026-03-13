import { NextRequest, NextResponse } from 'next/server';
import { getPalengkePrices } from '@/app/actions/palengke';
import { Municipality, MUNICIPALITIES } from '@/lib/palengke-constants';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const muni = req.nextUrl.searchParams.get('municipality') as Municipality | null;
    if (!muni || !MUNICIPALITIES.includes(muni as Municipality)) {
        return NextResponse.json({ error: 'Invalid municipality' }, { status: 400 });
    }
    const prices = await getPalengkePrices(muni);
    return NextResponse.json(prices, {
        headers: { 'Cache-Control': 'no-store' },
    });
}
