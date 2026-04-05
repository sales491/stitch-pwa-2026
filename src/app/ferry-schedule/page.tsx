import type { Metadata } from 'next';
import Link from 'next/link';
import SeoTextBlock from '@/components/SeoTextBlock';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Marinduque Ferry Schedule 2026 — RoRo Routes, Fares & Port Info',
    description: 'Complete Marinduque ferry schedule for 2026. RoRo routes from Dalahican & Lucena to Balanacan & Buyabod. Fares, travel times, port information, and real-time updates.',
    keywords: [
        'Marinduque ferry schedule', 'Marinduque ferry schedule 2026',
        'RoRo Marinduque', 'Balanacan port schedule', 'Buyabod port schedule',
        'Dalahican to Marinduque', 'Lucena to Marinduque', 'how to get to Marinduque',
        'Marinduque boat schedule', 'ferry to Marinduque', 'BAPOR Marinduque',
        'Starlite ferry Marinduque', 'Montenegro Marinduque',
    ],
    openGraph: {
        title: 'Marinduque Ferry Schedule 2026 — Routes, Fares & Ports',
        description: 'Complete guide to ferry travel between Marinduque and the mainland. RoRo schedules, fares, and live port status updates.',
        url: 'https://marinduquemarket.com/ferry-schedule',
        type: 'article',
    },
    alternates: { canonical: 'https://marinduquemarket.com/ferry-schedule' },
};

// Ferry route data
const ROUTES = [
    {
        id: 'dalahican-balanacan',
        from: 'Dalahican, Lucena City',
        to: 'Balanacan Port, Mogpog',
        operators: ['Starlite Ferries', 'Montenegro Shipping'],
        duration: '3–4 hours',
        frequency: 'Multiple daily departures',
        farePassenger: '₱200–₱400',
        fareVehicle: '₱1,500–₱3,000 (car)',
        notes: 'Most popular route. Dalahican Wharf is the primary departure point from Quezon Province.',
        departureTimesFrom: ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM'],
        departureTimesTo: ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM'],
    },
    {
        id: 'lucena-balanacan',
        from: 'Lucena Grand Terminal',
        to: 'Balanacan Port, Mogpog',
        operators: ['Starlite Ferries'],
        duration: '4–5 hours',
        frequency: 'Selected departures',
        farePassenger: '₱250–₱450',
        fareVehicle: '₱1,800–₱3,500 (car)',
        notes: 'Less frequent than Dalahican route. Some travelers prefer this for its bus terminal accessibility.',
        departureTimesFrom: ['7:00 AM', '1:00 PM'],
        departureTimesTo: ['7:00 AM', '1:00 PM'],
    },
    {
        id: 'pinamalayan-buyabod',
        from: 'Pinamalayan, Oriental Mindoro',
        to: 'Buyabod Port, Santa Cruz',
        operators: ['Montenegro Shipping'],
        duration: '2–3 hours',
        frequency: 'Daily (weather-dependent)',
        farePassenger: '₱180–₱300',
        fareVehicle: '₱1,200–₱2,500 (car)',
        notes: 'Shortest crossing. Alternative route via Oriental Mindoro, useful for travelers from the Visayas.',
        departureTimesFrom: ['6:00 AM', '11:00 AM'],
        departureTimesTo: ['8:00 AM', '2:00 PM'],
    },
];

const PORTS = [
    {
        name: 'Balanacan Port',
        municipality: 'Mogpog',
        type: 'Primary',
        description: 'The main gateway to Marinduque. Handles most RoRo passenger and vehicle ferries from Quezon Province. Located on the northern coast of the island.',
        facilities: ['Passenger waiting area', 'Ticketing booths', 'Parking area', 'Tricycle terminal', 'Small eateries'],
    },
    {
        name: 'Buyabod Port',
        municipality: 'Santa Cruz',
        type: 'Secondary',
        description: 'Secondary port on the eastern coast. Serves the Pinamalayan (Oriental Mindoro) route. Closer to the popular island hopping destinations of Santa Cruz.',
        facilities: ['Passenger shed', 'Ticketing', 'Tricycle stand', 'Nearby restaurants'],
    },
    {
        name: 'Cawit Port',
        municipality: 'Boac',
        type: 'Cargo',
        description: 'Primarily handles LCT (Landing Craft Tank) cargo vessels. Used for bulk freight and commercial shipments rather than passenger travel.',
        facilities: ['Cargo handling area', 'Commercial docking'],
    },
];

const FAQ_ITEMS = [
    {
        q: 'How do I get to Marinduque from Manila?',
        a: 'From Manila, take a bus from Cubao or Buendia to Lucena City or Dalahican (4–5 hours, ₱300–₱500). From Dalahican Wharf, board a RoRo ferry to Balanacan Port, Marinduque (3–4 hours, ₱200–₱400). The entire trip takes approximately 7–9 hours.',
    },
    {
        q: 'What are the ferry operating hours?',
        a: 'Ferries typically operate from 6:00 AM to 3:00 PM on the Dalahican–Balanacan route, with multiple daily departures. Schedules may vary during typhoon season (June–November) or during peak travel periods like Holy Week (Moriones Festival).',
    },
    {
        q: 'Can I bring my car or motorcycle to Marinduque?',
        a: 'Yes, all RoRo ferries accept vehicles. Car fares range from ₱1,500–₱3,500 depending on the route and vehicle size. Motorcycles are approximately ₱500–₱800. Vehicles must arrive at the port at least 1 hour before departure.',
    },
    {
        q: 'Are ferries cancelled during typhoons?',
        a: 'Yes. The Philippine Coast Guard suspends all ferry operations when typhoon signals are raised. During the rainy season (June–November), check the real-time port status updates on this site before traveling. The Marinduque strait can have rough seas during southwest monsoon (Habagat) season.',
    },
    {
        q: 'Which port should I use — Balanacan or Buyabod?',
        a: 'Balanacan Port (Mogpog) is the primary port with the most frequent sailings from Quezon Province. Use Buyabod Port (Santa Cruz) if you are coming from Oriental Mindoro, or if you are heading directly to the eastern side of Marinduque or the island hopping destinations in Santa Cruz.',
    },
    {
        q: 'What is the best time to visit Marinduque?',
        a: 'The best time to visit is during the dry season (March–May). The Moriones Festival during Holy Week (March/April) is the island\'s most famous cultural event. December to February is also pleasant but can have occasional rain. Avoid June–November if possible due to typhoon risk.',
    },
];

export default function FerrySchedulePage() {
    // FAQ JSON-LD
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24">
            {/* FAQPage JSON-LD + Article schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    faqJsonLd,
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: 'Marinduque Ferry Schedule 2026 — Complete Guide',
                        description: 'Complete ferry schedule from Manila/Lucena to Marinduque island. Routes, fares, port information, and travel tips.',
                        author: { '@type': 'Organization', name: 'Marinduque Market Hub' },
                        publisher: { '@type': 'Organization', name: 'Marinduque Market Hub' },
                        url: 'https://marinduquemarket.com/ferry-schedule',
                        mainEntityOfPage: 'https://marinduquemarket.com/ferry-schedule',
                        about: {
                            '@type': 'TouristDestination',
                            name: 'Marinduque Island',
                            description: 'A heart-shaped island province in the MIMAROPA region of the Philippines.',
                        },
                    },
                ]) }}
            />

            <PageHeader title="Ferry Schedule" subtitle="Getting to Marinduque" />

            <div className="max-w-2xl mx-auto px-6 py-6">
                {/* Hero intro */}
                <article className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-4">
                        Marinduque Ferry Schedule 2026
                    </h1>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-4">
                        Marinduque is accessible by Roll-on/Roll-off (RoRo) ferry from <strong>Quezon Province</strong> and <strong>Oriental Mindoro</strong>. Three ports serve the island: <strong>Balanacan Port</strong> (Mogpog), <strong>Buyabod Port</strong> (Santa Cruz), and <strong>Cawit Port</strong> (Boac). This guide covers all routes, fares, schedules, and travel tips.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/ports"
                            className="inline-flex items-center gap-2 bg-moriones-red text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md"
                        >
                            <span className="material-symbols-outlined text-sm">update</span>
                            Live Port Updates
                        </Link>
                        <Link
                            href="/just-landed"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            <span className="material-symbols-outlined text-sm">flight_land</span>
                            Just Landed Guide
                        </Link>
                    </div>
                </article>

                {/* Ferry Routes */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">directions_boat</span>
                        Ferry Routes & Schedules
                    </h2>

                    <div className="space-y-6">
                        {ROUTES.map(route => (
                            <div key={route.id} className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-white text-lg">sailing</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                                            {route.from} → {route.to}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">
                                            {route.operators.join(' · ')} · {route.duration}
                                        </p>
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 border border-slate-100 dark:border-zinc-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Passenger Fare</p>
                                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{route.farePassenger}</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 border border-slate-100 dark:border-zinc-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle Fare</p>
                                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">{route.fareVehicle}</p>
                                    </div>
                                </div>

                                {/* Departure schedule */}
                                <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 border border-slate-100 dark:border-zinc-700 mb-3">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Typical Departures</p>
                                    <div className="flex flex-wrap gap-2">
                                        {route.departureTimesFrom.map(time => (
                                            <span key={time} className="text-xs font-bold bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg">
                                                {time}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                                    {route.notes}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/50">
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                            ⚠️ Schedules are approximate and may change without notice. Ferry operations are suspended during typhoons and rough seas. Always check the <Link href="/ports" className="underline font-black">live port updates</Link> before traveling.
                        </p>
                    </div>
                </section>

                {/* Ports */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        Marinduque Ports
                    </h2>

                    <div className="space-y-4">
                        {PORTS.map(port => (
                            <div key={port.name} className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-5 border border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{port.name}</h3>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        port.type === 'Primary'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                            : port.type === 'Secondary'
                                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                                    }`}>
                                        {port.type}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-2">{port.municipality}, Marinduque</p>
                                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">{port.description}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {port.facilities.map(f => (
                                        <span key={f} className="text-[10px] font-bold bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-1 rounded-lg border border-slate-100 dark:border-zinc-700">{f}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to get to Marinduque - step by step */}
                <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">route</span>
                        How to Get to Marinduque from Manila
                    </h2>

                    <div className="space-y-3">
                        {[
                            { step: 1, icon: 'directions_bus', title: 'Bus to Lucena / Dalahican', desc: 'From Manila (Cubao or Buendia), take a DLTB, JAC Liner, or JAM Transit bus to Dalahican Wharf. Travel time: 4–5 hours, Fare: ₱300–₱500.', color: 'bg-violet-500' },
                            { step: 2, icon: 'confirmation_number', title: 'Buy ferry ticket at the port', desc: 'Purchase your ticket at the Starlite or Montenegro counter. Arrive at least 1 hour early, especially during peak season. Keep your ticket — you\'ll need it to board.', color: 'bg-blue-500' },
                            { step: 3, icon: 'sailing', title: 'Board the RoRo ferry', desc: 'The ferry departs from Dalahican Wharf bound for Balanacan Port, Mogpog. The crossing takes 3–4 hours. RoRo ferries have seating areas, small canteens, and restrooms.', color: 'bg-cyan-500' },
                            { step: 4, icon: 'local_taxi', title: 'Arrive at Balanacan — take a tricycle', desc: 'Tricycles and vans meet arriving ferries. Tricycle fare to Boac town proper is ₱30–₱50. For other towns, arrange a special trip (₱200–₱500) or wait for a jeepney.', color: 'bg-emerald-500' },
                        ].map(s => (
                            <div key={s.step} className="flex gap-4 items-start">
                                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                                    <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-300 dark:text-zinc-600 mb-0.5">Step {s.step}</p>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight mb-1">{s.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
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

                {/* CTA to live port updates */}
                <section className="bg-moriones-red/5 dark:bg-moriones-red/10 rounded-3xl p-6 border border-moriones-red/10 dark:border-moriones-red/20 text-center mb-8">
                    <h2 className="font-black text-lg text-slate-900 dark:text-white tracking-tight mb-2">Need real-time port updates?</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4 font-medium">Residents and travelers report live ferry status, delays, and cancellations on our Port Updates page.</p>
                    <Link
                        href="/ports"
                        className="inline-flex items-center gap-2 bg-moriones-red text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg"
                    >
                        <span className="material-symbols-outlined text-sm">update</span>
                        View Live Port Status
                    </Link>
                </section>
            </div>
        </div>
    );
}
