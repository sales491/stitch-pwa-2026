import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
    try {
        const adminSupabase = await createAdminClient();

        // Simulate cleanup
        const contentType = 'listing';
        const contentId = 'test-id';

        const { error: modError } = await adminSupabase.from('moderation_queue')
            .delete()
            .eq('content_type', contentType)
            .eq('content_id', contentId);

        if (modError) {
            return NextResponse.json({ error: modError.message });
        }

        return NextResponse.json({ success: true, message: "Moderation queue delete worked!" });
    } catch (error: any) {
        return NextResponse.json({ catchError: error.message }, { status: 500 });
    }
}
