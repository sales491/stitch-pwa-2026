import MarinduqueJobsListingFeed from '@/components/MarinduqueJobsListingFeed';
import { createClient } from '@/utils/supabase/server';

export default async function JobsPage() {
    const supabase = await createClient();
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    return <MarinduqueJobsListingFeed initialJobs={jobs || []} />;
}
