import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Listing } from '@/data/listings';
import ListingDetailPage from '@/components/ListingDetailPage';
import { createClient } from '@/utils/supabase/server';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: row } = await supabase.from('listings').select('*').eq('slug', slug).single();

    if (!row) return { title: 'Listing Not Found | Marinduque Market Hub' };

    const seoTitle = row.seo?.title || `${row.title} - Marinduque Market Hub`;
    const seoDesc = row.seo?.description || row.description?.slice(0, 160) || '';
    const imgUrl = row.img || '';

    return {
        title: seoTitle,
        description: seoDesc,
        keywords: row.seo?.keywords || [],
        openGraph: {
            title: seoTitle,
            description: seoDesc,
            images: [{ url: imgUrl, width: 600, height: 750, alt: row.title }],
            type: 'website',
            siteName: 'Marinduque Market Hub',
            locale: 'en_PH',
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDesc,
            images: [imgUrl],
        },
        alternates: {
            canonical: `https://marinduquemarket.com/listing/${slug}`,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: row } = await supabase.from('listings').select('*').eq('slug', slug).single();

    if (!row) notFound();

    const listing: Listing = {
        id: row.id,
        slug: row.slug ?? '',
        title: row.title ?? '',
        price: row.price ?? '',
        priceValue: row.price_value ?? 0,
        category: row.category ?? '',
        town: row.town ?? '',
        postedAgo: row.posted_ago ?? '',
        postedDate: row.posted_date ?? '',
        img: row.img ?? '',
        images: row.images ?? [],
        alt: row.title ?? '',
        description: row.description ?? '',
        condition: row.condition ?? 'Good',
        seller: row.seller ?? { name: 'Local User', avatar: '', memberSince: '', responseRate: '', phone: '' },
        seo: row.seo ?? { title: '', description: '', keywords: [] },
    };

    return <ListingDetailPage listing={listing} />;
}
