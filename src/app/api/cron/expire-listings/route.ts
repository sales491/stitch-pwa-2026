import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Cron job: expire jobs and skills_exchange listings past their expires_at date.
 * Call via: GET /api/cron/expire-listings
 * Protect with CRON_SECRET header in production (set in Vercel cron config).
 */
export async function GET(req: Request) {
    const secret = req.headers.get('x-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await createAdminClient();
    const now = new Date().toISOString();

    const [jobsResult, skillsResult] = await Promise.all([
        admin
            .from('jobs')
            .update({ is_active: false })
            .lt('expires_at', now)
            .eq('is_active', true)
            .select('id'),
        admin
            .from('skills_exchange')
            .delete()
            .lt('expires_at', now),
    ]);

    if (jobsResult.error || skillsResult.error) {
        console.error('Expiry cron error:', jobsResult.error, skillsResult.error);
        return NextResponse.json({ error: 'Partial failure', jobs: jobsResult.error, skills: skillsResult.error }, { status: 500 });
    }

    const expiredJobs = jobsResult.data?.length ?? 0;
    console.log(`[expire-listings] Expired ${expiredJobs} jobs, deleted expired skill listings.`);

    return NextResponse.json({
        success: true,
        expiredJobs,
        expiredSkillsDeleted: true,
        at: now,
    });
}
