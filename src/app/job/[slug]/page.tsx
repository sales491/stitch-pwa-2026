import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import JobVacancyDetailsView from '@/components/JobVacancyDetailsView';
import type { Job } from '@/data/jobs';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).single();

    if (!job) {
        return {
            title: 'Job Not Found | Marinduque Jobs',
        };
    }

    const title = `${job.title} at ${job.company_name} | Marinduque Jobs`;
    const description = job.description?.slice(0, 160);

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: job.logo_url ? [job.logo_url] : [],
            url: `https://marinduque-connect.com/job/${job.slug}`,
            siteName: 'Marinduque Market Hub',
            locale: 'en_PH',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: job.logo_url ? [job.logo_url] : [],
        },
        keywords: [
            'Marinduque',
            'Jobs',
            job.location,
            job.company_name,
            job.title,
            'Marinduque Market Hub'
        ],
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: row } = await supabase.from('jobs').select('*').eq('slug', slug).single();

    if (!row) {
        notFound();
    }

    const job: Job = {
        id: row.id,
        slug: row.slug ?? '',
        title: row.title ?? '',
        company: row.company_name ?? '',
        location: row.location ?? '',
        type: row.employment_type as any,
        salary: row.salary_range ?? '',
        postedAgo: 'Recently',
        description: row.description ?? '',
        requirements: [], // Would need a separate table or JSON column if we want this live
        logo: row.logo_url,
        seo: {
            title: row.title,
            description: row.description?.slice(0, 160),
            keywords: []
        }
    };

    return <JobVacancyDetailsView job={job} />;
}
