import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isAdmin } from '@/utils/roles';

export async function GET() {
    // 1. Auth guard — must be logged-in admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const hasAccess = profile?.role === 'admin' || isAdmin(user.email);
    if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Use service role to query system catalogs (bypasses RLS)
    const admin = await createAdminClient();

    const [dbSizeResult, tableStatsResult] = await Promise.all([
        // Total database size in bytes
        admin.rpc('get_db_size'),
        // Per-table live row counts from pg_stat_user_tables
        admin.rpc('get_table_stats'),
    ]);

    // Fallback: if RPCs don't exist yet, use raw SQL via execute
    // (RPCs will be created via migration below)
    if (dbSizeResult.error || tableStatsResult.error) {
        return NextResponse.json(
            { error: 'RPC not available. Run the migration first.', details: dbSizeResult.error?.message || tableStatsResult.error?.message },
            { status: 500 }
        );
    }

    const dbSizeBytes = dbSizeResult.data as number;
    const dbSizeMB = +(dbSizeBytes / (1024 * 1024)).toFixed(2);
    const dbSizeGB = +(dbSizeBytes / (1024 * 1024 * 1024)).toFixed(4);
    const limitMB = 500;
    const usedPercent = +((dbSizeMB / limitMB) * 100).toFixed(1);

    const tables = (tableStatsResult.data as { table_name: string; live_rows: number; dead_rows: number; total_size_bytes: number }[])
        .map(t => ({
            name: t.table_name,
            rows: t.live_rows,
            deadRows: t.dead_rows,
            sizeMB: +(t.total_size_bytes / (1024 * 1024)).toFixed(3),
        }))
        .sort((a, b) => b.rows - a.rows);

    return NextResponse.json({
        dbSizeBytes,
        dbSizeMB,
        dbSizeGB,
        limitMB,
        usedPercent,
        tables,
        fetchedAt: new Date().toISOString(),
    });
}
