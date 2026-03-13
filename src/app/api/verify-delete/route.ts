import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// 🔒 Debug route — blocked in production
export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    try {
        const adminSupabase = await createAdminClient();
        const { data: listings } = await adminSupabase.from('listings').select('id, title').limit(1);

        if (!listings || listings.length === 0) {
            return NextResponse.json({ message: "No listings found to delete!" });
        }

        const targetId = listings[0].id;
        const { data, error, count } = await adminSupabase.from('listings').delete().eq('id', targetId).select();

        return NextResponse.json({ message: "Attempted delete", targetId, targetTitle: listings[0].title, data, error, count });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
