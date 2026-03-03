import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LISTINGS, getListingBySlug } from '@/data/listings';
import ListingDetailPage from '@/components/ListingDetailPage';

type Props = { params: Promise<{ slug: string }> };

// Generate static paths for all mock listings
export async function generateStaticParams() {
    return LISTINGS.map((listing) => ({ slug: listing.slug }));
}

// Per-listing SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const listing = getListingBySlug(slug);
    if (!listing) return { title: 'Listing Not Found | Marinduque Market Hub' };

    return {
        title: listing.seo.title,
        description: listing.seo.description,
        keywords: listing.seo.keywords,
        openGraph: {
            title: listing.seo.title,
            description: listing.seo.description,
            images: [{ url: listing.img, width: 600, height: 750, alt: listing.alt }],
            type: 'website',
            siteName: 'Marinduque Market Hub',
            locale: 'en_PH',
        },
        twitter: {
            card: 'summary_large_image',
            title: listing.seo.title,
            description: listing.seo.description,
            images: [listing.img],
        },
        alternates: {
            canonical: `https://marinduqueconnect.ph/listing/${slug}`,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const listing = getListingBySlug(slug);
    if (!listing) notFound();
    return <ListingDetailPage listing={listing} />;
}
