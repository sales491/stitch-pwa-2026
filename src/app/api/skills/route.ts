import { NextRequest, NextResponse } from 'next/server';
import { getSkillListings } from '@/app/actions/skills';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const municipality = req.nextUrl.searchParams.get('municipality') ?? undefined;
    const category = req.nextUrl.searchParams.get('category') ?? undefined;
    const listings = await getSkillListings(municipality, category);
    return NextResponse.json(listings, {
        headers: { 'Cache-Control': 'no-store' },
    });
}
