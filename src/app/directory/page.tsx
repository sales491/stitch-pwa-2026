import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_DIRECTORY } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import BusinessDirectoryClient from '@/components/BusinessDirectoryClient';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Marinduque Business Directory',
    description: 'Hanapin ang mga lokal na negosyo sa Marinduque — restaurants, shops, services, at accommodations. Support local sa inyong bayan.',
    keywords: ['Marinduque business directory', 'local businesses Marinduque', 'shops Marinduque', 'restaurants Marinduque', 'services Marinduque Philippines', ...TAGALOG_KEYWORDS_DIRECTORY],
    openGraph: {
        title: 'Marinduque Business Directory',
        description: 'Discover and support verified local businesses across all of Marinduque island.',
        url: 'https://marinduquemarket.com/directory',
    },
    alternates: hreflangAlternates('/directory'),
};

export default async function BusinessDirectory() {
    const supabase = await createClient();

    // 1. Get current user session to check role
    const { data: { session } } = await supabase.auth.getSession();
    let isAdmin = false;

    if (session?.user?.id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        isAdmin = profile?.role === 'admin';
    }

    // 2. Fetch businesses based on role
    let query = supabase
        .from('business_profiles')
        .select('id, business_name, business_type, location, is_verified, average_rating, review_count, gallery_image, categories, delivery_available, owner_id')
        .order('is_verified', { ascending: false })
        .order('business_name', { ascending: true });

    // Ensure general public only sees verified businesses
    if (!isAdmin) {
        if (session?.user?.id) {
            // Logged in users see verified + their own pending listings
            query = query.or(`is_verified.eq.true,owner_id.eq.${session.user.id}`);
        } else {
            // General public only sees verified
            query = query.eq('is_verified', true);
        }
    }

    const { data: businesses, error } = await query;

    if (error) {
        const detail = (error as any).details || error.message || JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.error('Directory error details:', detail);
        return <div className="p-8 text-center font-black text-moriones-red">Failed to load local directory. Please refresh.</div>;
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Marinduque Business Directory',
                    description: metadata.openGraph?.description || 'Discover and support verified local businesses across all of Marinduque island.',
                    url: 'https://marinduquemarket.com/directory'
                }) }}
            />
            <BusinessDirectoryClient initialBusinesses={businesses || []} />
            <SeoTextBlock heading="About the Marinduque Business Directory">
                <p>The Marinduque Business Directory is the island’s most comprehensive listing of local enterprises. It includes restaurants, cafes, retail shops, hardware stores, health clinics, pharmacies, schools, resorts, guesthouses, agricultural suppliers, and professional services across all six municipalities: <strong>Boac</strong>, <strong>Mogpog</strong>, <strong>Gasan</strong>, <strong>Santa Cruz</strong>, <strong>Torrijos</strong>, and <strong>Buenavista</strong>.</p>
                <p>Verified businesses display a checkmark badge, confirming their legitimacy and active operation. Business owners can claim and manage their profile, upload photos, update contact information, and respond to customer reviews. The directory supports categories like Food &amp; Dining, Retail &amp; Shopping, Health &amp; Wellness, Education, Transport, and Accommodations.</p>
            </SeoTextBlock>
        </>
    );
}
