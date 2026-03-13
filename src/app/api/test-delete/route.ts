import { NextResponse } from 'next/server';
import { adminDeleteContent } from '@/app/actions/admin';
import { createAdminClient } from '@/utils/supabase/admin';

// 🔒 Debug route — blocked in production
export async function GET(request: Request) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    let id = searchParams.get('id');

    try {
        if (!id) {
            const adminSupabase = await createAdminClient();
            const { data } = await adminSupabase.from('listings').select('id').limit(1);
            if (data && data.length > 0) {
                id = data[0].id;
            }
        }

        if (!id) return NextResponse.json({ error: 'No item found to test delete' }, { status: 400 });

        const result = await adminDeleteContent(type || 'listing', id);
        return NextResponse.json({ result, testId: id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
