import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import BackButton from '@/components/BackButton';
import ShareButton from '@/components/ShareButton';

const BASE = 'https://marinduquemarket.com';

export const metadata: Metadata = {
    title: 'Just Arrived at Balanacan Port? — Marinduque Travel Guide & First Steps',
    description: "Just landed in Marinduque? Here's exactly what to do after arriving at Balanacan Port — find a ride, discover nearby tourist spots in Mogpog and Boac, and plan your island adventure.",
    keywords: [
        'Balanacan Port Marinduque', 'arriving Marinduque what to do', 'just arrived Marinduque',
        'Marinduque travel tips', 'things to do near Balanacan Port', 'Mogpog tourist spots',
        'Boac tourist spots', 'tricycle Balanacan Port', 'Marinduque first time visitor',
        'how to get around Marinduque', 'Marinduque travel guide 2026',
    ],
    openGraph: {
        title: 'Just Arrived at Balanacan Port? — Your Marinduque First Steps',
        description: 'Find a ride, discover nearby tourist spots, and plan your Marinduque adventure — all in one guide for new arrivals at Balanacan Port.',
        url: `${BASE}/just-landed`,
        type: 'article',
        images: [{ url: `${BASE}/images/gems/balanacan.png`, alt: 'Balanacan Shrine (Our Lady of Biglang Awa) — the iconic welcome landmark at Balanacan Port, Mogpog, Marinduque' }],
    },
    alternates: { canonical: `${BASE}/just-landed` },
};

// ── FAQ + WebPage JSON-LD — AEO/AIO: answers implicit questions new arrivals ask ──
const PAGE_SCHEMA = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Just Arrived at Balanacan Port — Marinduque Travel Guide',
        description: 'A guide for tourists and travelers who have just arrived at Balanacan Port in Mogpog, Marinduque. Covers local transport, nearby tourist attractions, hotels, food, and island hopping.',
        url: `${BASE}/just-landed`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
                { '@type': 'ListItem', position: 2, name: 'Just Landed Guide', item: `${BASE}/just-landed` },
            ],
        },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What should I do after arriving at Balanacan Port in Marinduque?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'After arriving at Balanacan Port in Mogpog, Marinduque, you can hire a tricycle or van to take you to your accommodation or directly to tourist spots. Most tourists head to Boac, the capital, which is about 30 minutes away. You can also visit the Balanacan Shrine right at the port, or the Luzon Datum of 1911 landmark nearby.',
                },
            },
            {
                '@type': 'Question',
                name: 'Where is Balanacan Port located?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Balanacan Port is located in the municipality of Mogpog in the province of Marinduque, Philippines. It is the primary gateway to the island, serving RoRo (Roll-on/Roll-off) ferries from Dalahican Wharf and Lucena City in Quezon Province.',
                },
            },
            {
                '@type': 'Question',
                name: 'How do I get a ride from Balanacan Port?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tricycles and vans are available directly at Balanacan Port when ferries arrive. Tricycles typically charge ₱30–₱50 per person to Boac town center. For further destinations or private trips, you can hire a special-trip van or jeep at the port for ₱200–₱500 depending on the destination.',
                },
            },
            {
                '@type': 'Question',
                name: 'What tourist spots are close to Balanacan Port?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Nearby tourist spots include the Balanacan Shrine (Our Lady of Biglang Awa) right at the port, the Luzon Datum of 1911 historical marker on Mt. Mataas in Mogpog, Paadyao Cascades waterfall, and the Tarug Rock Formation and Cave. In Boac (30 minutes away), the iconic Boac Cathedral and Marinduque National Museum are popular first stops.',
                },
            },
            {
                '@type': 'Question',
                name: 'Where should I stay after arriving in Marinduque?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Most first-time visitors to Marinduque stay in Boac, the provincial capital, which has the most hotels, restaurants, and services. It is about 30 minutes from Balanacan Port by tricycle or van. From Boac, you can easily access most of the island's major attractions.",
                },
            },
        ],
    },
];

// Reusable component to render a fetched gem
function GemMiniCard({ gem }: { gem: any }) {
  return (
    <Link href={`/gems/${gem.id}`} className="block group">
      <div className="relative h-40 rounded-2xl overflow-hidden mb-2 shadow-sm border border-slate-100 dark:border-zinc-800">
        <Image
          src={gem.images?.[0] || '/images/marinduque-map.webp'}
          alt={`${gem.title} — hidden gem in ${gem.town}, Marinduque`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-black leading-tight text-sm drop-shadow-md">{gem.title}</p>
          <p className="text-white/80 font-bold text-[10px] uppercase tracking-wider">{gem.town}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function JustLandedPage() {
  const supabase = await createClient();

  // Fetch the recently added Mogpog and Boac gems to showcase
  const { data: nearbyGems } = await supabase
    .from('gems')
    .select('id, title, town, images')
    .in('town', ['Mogpog', 'Boac'])
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_SCHEMA) }}
      />
      <div className="pb-32 max-w-md mx-auto">
        <div className="px-4 pt-4 flex flex-col gap-6">
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            <BackButton />
            <ShareButton
              title="Just Landed in Marinduque"
              text="Check out this guide for what to do right after you hop off the ferry!"
              url="/just-landed"
              variant="icon"
            />
          </div>

          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
            <Image
              src="/images/gems/balanacan.png"
              alt="Balanacan Shrine, Our Lady of Biglang Awa — the iconic welcome statue at Balanacan Port, Mogpog, Marinduque, Philippines"
              width={600}
              height={400}
              className="w-full h-48 object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center">
              <span className="bg-moriones-red text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded mb-3 shadow-md border border-red-500/50">Welcome to Marinduque</span>
              <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg">Just Landed.</h1>
              <p className="text-slate-200 text-xs mt-2 max-w-[250px] drop-shadow-md font-medium">You&apos;ve arrived at Balanacan Port. Let&apos;s get your island adventure started.</p>
            </div>
          </div>

          {/* Transportation Quick Actions */}
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-moriones-red" aria-hidden="true">hail</span>
              Need a Ride from the Port?
            </h2>
            <Link href="/commute?town=Mogpog" className="block">
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group hover:border-moriones-red/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-moriones-red/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl" role="img" aria-label="Tricycle">🛺</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Find a Local Driver</h3>
                  <p className="text-xs text-slate-500 font-medium leading-tight mt-1">Hire a tricycle, van, or jeep waiting near the port or town center.</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-moriones-red group-hover:translate-x-1 transition-all" aria-hidden="true">arrow_forward</span>
              </div>
            </Link>
          </div>

          {/* Nearby Tourist Spots */}
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-moriones-red" aria-hidden="true">photo_camera</span>
              Sites Near the Port
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {nearbyGems && nearbyGems.length > 0 ? (
                nearbyGems.map((gem: any) => <GemMiniCard key={gem.id} gem={gem} />)
              ) : (
                <p className="text-xs text-slate-500 italic col-span-2">No nearby spots found.</p>
              )}
            </div>
            <div className="mt-3 text-center">
              <Link href="/gems" className="inline-block bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors hover:bg-slate-200">
                View All Marinduque Gems
              </Link>
            </div>
          </div>

          {/* Next Stops */}
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-moriones-red" aria-hidden="true">map</span>
              Where to Next?
            </h2>
            <div className="flex flex-col gap-3">
              <Link href="/directory?category=Accommodations" className="bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400" aria-hidden="true">hotel</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Find a Hotel</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Most tourists head to Boac</p>
                </div>
              </Link>
              <Link href="/directory?category=Food%20%26%20Dining" className="bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400" aria-hidden="true">restaurant</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Grab Some Food</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Restaurants &amp; Cafes</p>
                </div>
              </Link>
              <Link href="/island-hopping" className="bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400" aria-hidden="true">sailing</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Island Hopping</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Maniwaya &amp; Tres Reyes</p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
