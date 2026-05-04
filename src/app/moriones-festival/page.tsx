import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_EVENTS, TAGALOG_KEYWORDS_TRAVEL } from '@/utils/seo';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Moriones Festival 2026 — Schedule, History & Travel Guide | Marinduque',
    description: 'Complete guide to the Moriones Festival 2026 in Marinduque, Philippines. Holy Week schedule, history, activities, costumes, travel tips, and where to stay.',
    keywords: [
        'Moriones Festival', 'Moriones Festival 2026', 'Moriones Marinduque',
        'Holy Week Philippines 2026', 'Marinduque Holy Week', 'Moriones Festival schedule',
        'Moriones mask', 'Moriones costume', 'Lenten festival Philippines',
        'Marinduque festival', 'Pugutan Moriones', 'Roman centurion festival',
        ...TAGALOG_KEYWORDS_EVENTS, ...TAGALOG_KEYWORDS_TRAVEL,
    ],
    openGraph: {
        title: 'Moriones Festival 2026 — Marinduque, Philippines',
        description: 'The world-famous Holy Week tradition of Marinduque. Masked centurions roam the streets reenacting the story of Longinus.',
        url: 'https://marinduquemarket.com/moriones-festival',
        type: 'article',
    },
    alternates: hreflangAlternates('/moriones-festival'),
};

const SCHEDULE = [
    { day: 'Monday', title: 'Festival Opening & Mask Parade', desc: 'Moriones-clad participants begin appearing on the streets. Opening ceremonies at the municipal plaza. Mask-making exhibits and workshops.' },
    { day: 'Tuesday', title: 'Via Crucis & Street Theater', desc: 'Dramatic street reenactments of the Passion of Christ. Moriones roam the streets in full Roman centurion regalia, interacting with crowds.' },
    { day: 'Wednesday', title: 'Cenaculo (Passion Play)', desc: 'The traditional Cenaculo is performed — a dramatic stage play depicting the life, death, and resurrection of Jesus Christ.' },
    { day: 'Thursday', title: 'Hugas Paa & Visita Iglesia', desc: 'The washing of feet ceremony (Hugas Paa) at parish churches. Families visit seven churches across the island (Visita Iglesia).' },
    { day: 'Good Friday', title: 'Senakulo & Procession of the Dead Christ', desc: 'The most solemn day. The crucifixion scene is reenacted, followed by a candlelit procession of the Santo Entierro (Dead Christ) through the streets.' },
    { day: 'Black Saturday', title: 'The Chase of Longinus', desc: 'The climactic event. Moriones chase the character of Longinus through the streets, reenacting his capture after his conversion to Christianity.' },
    { day: 'Easter Sunday', title: 'Pugutan (Beheading) & Salubong', desc: 'The dramatic finale — the public beheading of Longinus at the town plaza. Followed by the Salubong (joyful meeting of the Risen Christ and the Blessed Virgin).' },
];

const FAQ_ITEMS = [
    {
        q: 'When is the Moriones Festival 2026?',
        a: 'The Moriones Festival coincides with Holy Week, which in 2026 falls on March 30 (Palm Sunday) through April 5 (Easter Sunday). The main festivities run from Monday of Holy Week through Easter Sunday.',
    },
    {
        q: 'What is the Moriones Festival about?',
        a: 'The Moriones Festival reenacts the biblical story of Longinus, the Roman centurion who pierced the side of Jesus Christ on the cross. According to tradition, Longinus was blind in one eye and was healed when Christ\'s blood touched his face. He converted to Christianity and was eventually captured and beheaded by his fellow soldiers. Locals wear colorful Roman centurion masks and costumes to portray this story throughout Holy Week.',
    },
    {
        q: 'Where does the Moriones Festival take place?',
        a: 'The festival is celebrated across all six municipalities of Marinduque, but the largest and most famous celebrations take place in Boac (the capital), Mogpog, and Gasan. Each town has its own unique variations of the traditions.',
    },
    {
        q: 'Can tourists participate in the Moriones Festival?',
        a: 'Yes! Tourists are welcome and encouraged to watch and photograph the festivities. Some visitors even commission local mask-makers to create their own Moriones masks as souvenirs. The festival is a public, community-wide event with no admission fees.',
    },
    {
        q: 'Where should I stay during the Moriones Festival?',
        a: 'Accommodation fills up fast during Holy Week — book at least 1–2 months in advance. Options include hotels and guesthouses in Boac town proper, beach resorts in Santa Cruz and Gasan, and homestays across the island. Check the Marinduque Market Hub business directory for listings.',
    },
    {
        q: 'How do I get to Marinduque for the festival?',
        a: 'From Manila, take a bus to Dalahican, Lucena City (4–5 hours), then a RoRo ferry to Balanacan Port, Mogpog (3–4 hours). During Holy Week, expect heavier traffic and longer wait times at the port. Book ferry tickets in advance if possible.',
    },
];

export default function MorionesFestivalPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Moriones Festival 2026',
            description: 'Annual Holy Week festival in Marinduque, Philippines, featuring masked Roman centurion reenactments of the story of Longinus.',
            startDate: '2026-03-30',
            endDate: '2026-04-05',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
                '@type': 'Place',
                name: 'Marinduque Island',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Boac',
                    addressRegion: 'Marinduque',
                    addressCountry: 'PH',
                },
            },
            organizer: {
                '@type': 'Organization',
                name: 'Provincial Government of Marinduque',
                url: 'https://marinduquemarket.com/moriones-festival',
            },
            performer: {
                '@type': 'PerformingGroup',
                name: 'Moriones Festival Performers — Local Communities of Marinduque',
            },
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'PHP',
                description: 'Free public event',
                availability: 'https://schema.org/InStock',
                url: 'https://marinduquemarket.com/moriones-festival',
                validFrom: '2025-01-01',
            },
            image: 'https://marinduquemarket.com/images/moriones-hero.jpg',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
        },
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <PageHeader title="Moriones Festival" subtitle="Holy Week in Marinduque" />

            <div className="max-w-2xl mx-auto px-6 py-6">
                {/* Hero */}
                <article className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-4">
                        Moriones Festival 2026
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-black bg-moriones-red/10 text-moriones-red px-3 py-1 rounded-full uppercase tracking-widest">Holy Week 2026</span>
                        <span className="text-xs font-black bg-slate-100 dark:bg-zinc-800 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">March 30 – April 5</span>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-3">
                        The <strong>Moriones Festival</strong> is Marinduque&apos;s most famous cultural event and one of the oldest Lenten traditions in the Philippines. Every Holy Week, locals don elaborate <strong>painted wooden masks</strong> and full <strong>Roman centurion costumes</strong>, transforming the island into a living stage for the biblical story of <strong>Longinus</strong> &mdash; the Roman soldier who pierced Christ&apos;s side and was later converted and martyred.
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-4">
                        The festival has been celebrated for <strong>over 200 years</strong> and draws thousands of visitors annually. It was recognized by the Philippine government as a National Cultural Treasure and is a candidate for UNESCO Intangible Cultural Heritage listing.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 bg-moriones-red text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md"
                        >
                            <span className="material-symbols-outlined text-sm">event</span>
                            View All Local Events
                        </Link>
                        <Link
                            href="/moriones-festival/artisans"
                            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700 shadow-sm"
                        >
                            Meet the Mask Makers
                        </Link>
                    </div>
                </article>

                {/* Schedule */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        Holy Week Schedule
                    </h2>

                    <div className="space-y-3">
                        {SCHEDULE.map((day, i) => (
                            <div key={day.day} className="flex gap-4 items-start">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm ${
                                        day.day === 'Good Friday' ? 'bg-slate-800 dark:bg-zinc-300 dark:text-zinc-900'
                                        : day.day === 'Easter Sunday' ? 'bg-amber-500'
                                        : 'bg-moriones-red'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    {i < SCHEDULE.length - 1 && (
                                        <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mt-1" />
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{day.day}</p>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight mb-1">{day.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{day.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* The Story of Longinus */}
                <section className="mb-12 bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        The Story of Longinus
                    </h2>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed space-y-3 font-medium">
                        <p>According to Philippine folk tradition &mdash; and the biblical apocrypha &mdash; <strong>Longinus</strong> was the Roman centurion who pierced the side of Jesus Christ with his lance during the crucifixion. Born blind in one eye, Longinus was miraculously healed when drops of Christ&apos;s blood fell upon his face.</p>
                        <p>Overwhelmed by this miracle, Longinus converted to Christianity and began preaching about the resurrection. His fellow Roman soldiers, loyal to the empire, considered this an act of treason. They hunted Longinus through the streets, eventually capturing him and having him beheaded.</p>
                        <p>This narrative is the core of the Moriones Festival. Throughout Holy Week, <strong>&quot;Moriones&quot;</strong> &mdash; locals wearing hand-carved and painted masks of Roman centurions &mdash; roam the streets, performing scenes from this story. The festival culminates on Easter Sunday with the <strong>Pugutan</strong> (beheading), a dramatic public reenactment at the town plaza.</p>
                    </div>
                </section>

                {/* Practical Tips */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                        Travel Tips for Moriones Festival
                    </h2>

                    <div className="space-y-3">
                        {[
                            { icon: '🏨', title: 'Book accommodation early', desc: 'Hotels and homestays fill up 1&ndash;2 months before Holy Week. Consider beachside resorts in Santa Cruz or Gasan if Boac is full.' },
                            { icon: '⛴️', title: 'Secure ferry tickets in advance', desc: 'Expect long queues at Dalahican port. The exodus from Manila begins on Palm Sunday. Consider traveling earlier (Saturday) to avoid crowds.' },
                            { icon: '📸', title: 'Bring a good camera', desc: 'The masks, costumes, and dramatic street scenes are incredibly photogenic. The Moriones are generally happy to pose for photos.' },
                            { icon: '☀️', title: 'Prepare for the heat', desc: 'Holy Week falls in the hot season. Bring sunscreen, hats, and stay hydrated. Temperatures can reach 34&ndash;36°C (93&ndash;97°F).' },
                            { icon: '💵', title: 'Carry cash', desc: 'Many vendors and businesses on the island don&apos;t accept cards. GCash is widely accepted. ATMs are available in Boac and Santa Cruz.' },
                            { icon: '🤫', title: 'Respect the traditions', desc: 'While the festival is vibrant, Holy Week is a deeply religious time. Be respectful during solemn processions and church ceremonies.' },
                        ].map(tip => (
                            <div key={tip.title} className="flex gap-3 items-start bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800">
                                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight mb-0.5">{tip.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">help</span>
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, i) => (
                            <details key={i} className="group bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
                                <summary className="cursor-pointer p-5 text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-between gap-2 list-none">
                                    {item.q}
                                    <span className="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-lg group-open:rotate-180 transition-transform flex-shrink-0">expand_more</span>
                                </summary>
                                <div className="px-5 pb-5">
                                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">{item.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* CTAs */}
                <section className="bg-moriones-red/5 dark:bg-moriones-red/10 rounded-3xl p-6 border border-moriones-red/10 dark:border-moriones-red/20 text-center">
                    <h2 className="font-black text-lg text-slate-900 dark:text-white tracking-tight mb-2">Planning your trip?</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4 font-medium">Get ferry schedules, find places to stay, and explore what else to do on the island.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/ferry-schedule" className="inline-flex items-center gap-2 bg-moriones-red text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md">
                            <span className="material-symbols-outlined text-sm">sailing</span>
                            Ferry Schedule
                        </Link>
                        <Link href="/things-to-do" className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-sm">explore</span>
                            Things to Do
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
