import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import JobVacancyDetailsView from '@/components/JobVacancyDetailsView';
import { getJobBySlug } from '@/data/jobs';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const job = getJobBySlug(slug);

    if (!job) {
        return {
            title: 'Job Not Found | Marinduque Jobs',
        };
    }

    return {
        title: job.seo.title,
        description: job.seo.description,
        openGraph: {
            title: job.seo.title,
            description: job.seo.description,
            images: job.logo ? [job.logo] : [],
            url: `https://marinduque-connect.com/job/${job.slug}`,
            siteName: 'Marinduque Market Hub',
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: job.seo.title,
            description: job.seo.description,
            images: job.logo ? [job.logo] : [],
        },
        keywords: [
            'Marinduque',
            'Jobs',
            job.location,
            job.company,
            job.title,
            'Marinduque Market Hub',
            ...job.seo.keywords
        ],
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const job = getJobBySlug(slug);

    if (!job) {
        notFound();
    }

    return <JobVacancyDetailsView job={job} />;
}
