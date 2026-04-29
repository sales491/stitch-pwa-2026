import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_DIRECTORY } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import BusinessDirectoryClient from '@/components/BusinessDirectoryClient';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Marinduque Business Directory | Local Shops & Services',
    description: 'Hanapin ang mga lokal na negosyo sa Marinduque — restaurants, shops, services, at accommodations. The most comprehensive verified directory for Boac, Gasan, and all municipalities.',
    keywords: [
        'Marinduque business directory', 
        'local businesses Marinduque', 
        'shops Marinduque', 
        'restaurants Marinduque', 
        'services Marinduque Philippines', 
        'saan makakabili sa Marinduque',
        'mga negosyo sa Boac',
        'kainan sa Marinduque',
        'Marinduque local shops',
        ...TAGALOG_KEYWORDS_DIRECTORY
    ],
    openGraph: {
        title: 'Marinduque Business Directory',
        description: 'Discover and support verified local businesses across all of Marinduque island.',
        url: 'https://marinduquemarket.com/directory',
        type: 'website',
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

    // Prepare Schema.org JSON-LD
    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: metadata.openGraph?.title || 'Marinduque Business Directory',
        description: metadata.openGraph?.description || 'Discover and support verified local businesses across all of Marinduque island.',
        url: 'https://marinduquemarket.com/directory',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: (businesses || []).slice(0, 30).map((biz, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'LocalBusiness',
                    name: biz.business_name,
                    url: `https://marinduquemarket.com/directory/b/${biz.id}`,
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: biz.location,
                        addressRegion: 'Marinduque',
                        addressCountry: 'PH'
                    }
                }
            }))
        }
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What types of businesses are listed in the Marinduque Business Directory?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The directory includes a wide variety of verified local enterprises across Marinduque, including restaurants, cafes, retail shops, hardware stores, health clinics, pharmacies, accommodations, and professional services.'
                }
            },
            {
                '@type': 'Question',
                name: 'Saan pwede maghanap ng mga lokal na negosyo sa Marinduque?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Maaari kang maghanap ng mga lokal na negosyo tulad ng kainan, hardware, at bilihan ng mga souvenir dito sa Marinduque Market Hub directory. Sakop nito ang Boac, Gasan, Mogpog, Santa Cruz, Torrijos, at Buenavista.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do I know if a business in Marinduque is verified?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Verified businesses in our directory display a prominent checkmark badge, confirming their legitimacy, active operation, and commitment to serving the community.'
                }
            }
        ]
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            <BusinessDirectoryClient initialBusinesses={businesses || []} />
            
            <section className="bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 mt-12 pb-12">
                <SeoTextBlock heading="About the Marinduque Business Directory">
                    <p>The Marinduque Business Directory is the island’s most comprehensive listing of local enterprises. It includes restaurants, cafes, retail shops, hardware stores, health clinics, pharmacies, schools, resorts, guesthouses, agricultural suppliers, and professional services across all six municipalities: <strong>Boac</strong>, <strong>Mogpog</strong>, <strong>Gasan</strong>, <strong>Santa Cruz</strong>, <strong>Torrijos</strong>, and <strong>Buenavista</strong>.</p>
                    <p>Verified businesses display a checkmark badge, confirming their legitimacy and active operation. Business owners can claim and manage their profile, upload photos, update contact information, and respond to customer reviews. The directory supports categories like Food &amp; Dining, Retail &amp; Shopping, Health &amp; Wellness, Education, Transport, and Accommodations.</p>
                </SeoTextBlock>
                
                <SeoTextBlock heading="Mga Madalas Itanong (Frequently Asked Questions)">
                    <div className="space-y-6 mt-4">
                        <article>
                            <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-2">Ano ang Marinduque Business Directory?</h3>
                            <p className="text-sm">Ito ay isang online na listahan ng mga mapagkakatiwalaang negosyo sa probinsya ng Marinduque. Layunin nitong tulungan ang mga residente at turista na madaling mahanap ang mga kailangan nilang serbisyo—mula sa mga murang kainan, hardware, botika, hanggang sa mga resorts at hotels.</p>
                        </article>
                        <article>
                            <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-2">Paano malalaman kung lehitimo ang isang negosyo?</h3>
                            <p className="text-sm">Hanapin lamang ang "Verified" badge (checkmark icon) sa profile ng negosyo. Ibig sabihin nito ay nakumpirma na ng aming team ang lokasyon at operasyon ng establisyimento.</p>
                        </article>
                        <article>
                            <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-2">Can I add my own business to the directory?</h3>
                            <p className="text-sm">Yes! Local business owners can register and submit their profiles for verification. Once approved, you can showcase your menu, services, hours of operation, and even receive customer reviews to boost your online visibility.</p>
                        </article>
                    </div>
                </SeoTextBlock>
            </section>
        </main>
    );
}
