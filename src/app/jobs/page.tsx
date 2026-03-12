export const revalidate = 60;

import MarinduqueJobsListingFeed from '@/components/MarinduqueJobsListingFeed';
import { createClient } from '@/utils/supabase/server';

const PAGE_SIZE = 10;

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; type?: string; town?: string; query?: string }>;
}) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const type = params.type || '';
    const town = params.town || '';
    const query = params.query || '';

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const supabase = await createClient();
    const now = new Date().toISOString();

    let dbQuery = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .gt('expires_at', now); // only non-expired

    if (type) dbQuery = dbQuery.eq('employment_type', type);
    if (town) dbQuery = dbQuery.ilike('location', `%${town}%`);
    if (query) dbQuery = (dbQuery as any).or(
        `title.ilike.%${query}%,company_name.ilike.%${query}%,location.ilike.%${query}%`
    );

    const { data: jobs, count } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to);

    return (
        <MarinduqueJobsListingFeed
            initialJobs={jobs || []}
            totalCount={count || 0}
            currentPage={page}
            pageSize={PAGE_SIZE}
            filters={{ type, town, query }}
        />
    );
}
