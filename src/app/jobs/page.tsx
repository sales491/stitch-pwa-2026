export const revalidate = 0; // Always dynamic — jobs change frequently

import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_JOBS } from '@/utils/seo';

export const metadata: Metadata = {
    title: 'Job Listings in Marinduque',
    description: 'Hanapin ang trabaho sa Marinduque — full-time, part-time, at freelance positions sa Boac, Gasan, Mogpog, Santa Cruz, Torrijos, at Buenavista.',
    keywords: ['jobs Marinduque', 'job vacancies Philippines', 'work Marinduque', 'employment Boac', 'job opportunities Marinduque island', ...TAGALOG_KEYWORDS_JOBS],
    openGraph: {
        title: 'Job Listings in Marinduque',
        description: 'Discover full-time, part-time, and freelance jobs across Marinduque island.',
        url: 'https://marinduquemarket.com/jobs',
    },
    alternates: hreflangAlternates('/jobs'),
};

import MarinduqueJobsListingFeed from '@/components/MarinduqueJobsListingFeed';
import { createClient } from '@/utils/supabase/server';
import SeoTextBlock from '@/components/SeoTextBlock';

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
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Job Listings in Marinduque',
                    description: metadata.openGraph?.description || 'Discover jobs across Marinduque island.',
                    url: 'https://marinduquemarket.com/jobs'
                }) }}
            />
            <MarinduqueJobsListingFeed
                initialJobs={jobs || []}
                totalCount={count || 0}
                currentPage={page}
                pageSize={PAGE_SIZE}
                filters={{ type, town, query }}
            />
            <SeoTextBlock heading="Jobs in Marinduque">
                <p>Marinduque’s local economy is driven by agriculture (coconut, rice, and fishing), government employment, small retail businesses, and a growing tourism sector. Job opportunities include positions at local government units (LGUs), schools, health centers, resorts, restaurants, and retail stores across all six municipalities.</p>
                <p>Common job types on the island include teaching, healthcare, construction trades, agriculture, food service, and tourism-related roles like tour guides and boat operators. Many businesses also seek skilled workers such as electricians, welders, mechanics, and carpenters. Salaries in Marinduque typically follow MIMAROPA regional minimum wage rates.</p>
            </SeoTextBlock>
        </>
    );
}
