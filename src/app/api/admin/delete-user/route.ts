import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/utils/roles';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const supabaseAdmin = await createAdminClient();
        const { userId, adminEmail } = await req.json();

        // 1. Security Check: Only hardcoded admins can call this
        if (!isAdmin(adminEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 2. Delete from Auth (This also deletes the profile due to ON DELETE CASCADE)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'User deleted from Supabase Auth' });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
