import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { hreflangAlternates, TAGALOG_KEYWORDS_TRAVEL } from '@/utils/seo';
import BackButton from '@/components/BackButton';
import ShareButton from '@/components/ShareButton';

const title = 'Manila to Marinduque: The "Pro" Travel Guide (2026)';
const description = 'The most efficient, reliable, and "island-vibe" way to travel from Manila to Marinduque using the classic Bus + RoRo route. Skip the slow vans.';
const url = 'https://marinduquemarket.com/guides/manila-to-marinduque';
const imageUrl = 'https://marinduquemarket.com/images/manila_marinduque_map.jpg';

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'Manila to Marinduque', 'how to get to Marinduque', 'Marinduque travel guide', 
        'RoRo Marinduque', 'Dalahican Port to Balanacan', 'bus to Lucena', 
        'ferry to Marinduque', 'travel hack Marinduque',
        ...TAGALOG_KEYWORDS_TRAVEL
    ],
    alternates: hreflangAlternates('/guides/manila-to-marinduque'),
    openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: new Date().toISOString(),
        authors: ['Marinduque Market Hub'],
        images: [{ url: imageUrl, width: 1920, height: 1080, alt: 'Infographic travel map from Manila to Marinduque' }],
        siteName: 'Marinduque Market Hub',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
    },
};

export default function ManilaToMarinduqueGuide() {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Travel from Manila to Marinduque (Bus + RoRo)",
        "description": "The most efficient, reliable, and 'island-vibe' way to travel from Manila to Marinduque using the classic Bus to Lucena City and RoRo ferry to Balanacan Port.",
        "image": imageUrl,
        "estimatedCost": { "@type": "MonetaryAmount", "currency": "PHP", "value": "1000" },
        "step": [
            {
                "@type": "HowToStep",
                "name": "The Land Leg (Bus to Lucena)",
                "text": "Head to the Buendia (LRT-1) Terminal area. Board a JAC Liner, JAM Transit, or DLTB bus bound for Lucena City. The trip takes about 3 to 4 hours.",
                "url": `${url}#land`
            },
            {
                "@type": "HowToStep",
                "name": "The Sea Leg (Ferry to Marinduque)",
                "text": "Arrive at Dalahican Ferry Terminal in Lucena City. Board a Montenegro Lines or Starhorse Shipping Lines RoRo ferry. The voyage takes about 3 hours to reach Balanacan Port in Mogpog.",
                "url": `${url}#sea`
            },
            {
                "@type": "HowToStep",
                "name": "Arrival & Ground Transport",
                "text": "Upon docking at Balanacan Port, quickly disembark to catch waiting jeeps and buses bound for Boac, Gasan, or Santa Cruz before they fill up.",
                "url": `${url}#arrival`
            }
        ]
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "author": { "@type": "Organization", "name": "Marinduque Market Hub", "url": "https://marinduquemarket.com" },
        "publisher": { 
            "@type": "Organization", 
            "name": "Marinduque Market Hub", 
            "logo": { "@type": "ImageObject", "url": "https://marinduquemarket.com/markethub-logo.png" } 
        },
        "datePublished": new Date().toISOString()
    };

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([howToSchema, articleSchema]) }} />
            {/* Hero Image Section - Natural Aspect Ratio */}
            <div className="w-full bg-[#cde8f6] relative border-b border-slate-200">
                <div className="absolute top-4 left-4 z-20">
                    <BackButton className="text-slate-800 bg-white/90 hover:bg-white shadow-sm border-white" />
                </div>
                
                <Image
                    src="/images/manila_marinduque_map.jpg"
                    alt="Infographic map showing travel from Manila to Marinduque"
                    width={1920}
                    height={1080}
                    className="w-full h-auto block"
                    priority
                />
            </div>

            {/* Title Card - Positioned below the image */}
            <div className="max-w-4xl mx-auto px-4 -mt-3 relative z-10 mb-6">
                <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col text-left">
                    <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-[#0077be] text-white rounded-full shadow-sm">
                            Insider Travel Guide
                        </span>
                        <ShareButton 
                            title={title} 
                            text={description} 
                            url={url} 
                            variant="icon" 
                            className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl" 
                        />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-1">
                        Manila to Marinduque
                    </h1>
                    <p className="text-emerald-400 text-sm md:text-base font-bold mb-3">
                        The "Pro" Way to Cross the Sea
                    </p>
                    <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed mb-5">
                        Skip the slow vans. Discover the fastest, most reliable, and comfortable route to the Heart of the Philippines (2026 Edition).
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-2 border-t border-slate-700 pt-5">
                        <Link href="/map" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0077be] hover:bg-blue-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors w-full sm:w-auto shadow-lg shadow-blue-900/20">
                            <span className="material-symbols-outlined text-[18px]">map</span>
                            Open Offline Tourist Map
                        </Link>
                        <Link href="/ferry-schedule" className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors w-full sm:w-auto">
                            <span className="material-symbols-outlined text-[18px]">directions_boat</span>
                            View Ferry Schedules
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="relative z-30 border-b border-slate-200 pb-2">
                <ul className="flex items-center gap-6 px-4 py-3 overflow-x-auto hide-scrollbar max-w-4xl mx-auto text-sm font-bold text-slate-600">
                    <li className="shrink-0"><a href="#intro" className="hover:text-[#0077be] transition-colors">Intro</a></li>
                    <li className="shrink-0"><a href="#land" className="hover:text-[#0077be] transition-colors">1. Land Leg</a></li>
                    <li className="shrink-0"><a href="#sea" className="hover:text-[#0077be] transition-colors">2. Sea Leg</a></li>
                    <li className="shrink-0"><a href="#arrival" className="hover:text-[#0077be] transition-colors">3. Arrival</a></li>
                    <li className="shrink-0"><a href="#checklist" className="hover:text-[#0077be] transition-colors">Checklist</a></li>
                </ul>
            </nav>

            <article className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-12">
                
                {/* Intro */}
                <section id="intro" className="prose prose-slate max-w-none text-lg leading-relaxed">
                    <p>
                        If you’re looking at a map of the Philippines and wondering why there aren't more flights to the "Heart of the Philippines," join the club. While the Marinduque airport is technically there, it’s currently closed to commercial airlines. 
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl my-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-amber-600">warning</span>
                            <h3 className="font-black text-amber-800 m-0">THE VAN WARNING</h3>
                        </div>
                        <p className="text-amber-900/80 text-base m-0">
                            You might see "door-to-door" van services advertised online, but take it from someone who has done this trip many times: they are often painfully slow due to waiting for passengers to fill up, or navigating multi-stop drop-offs. 
                        </p>
                    </div>
                    <p>
                        The most efficient, reliable, and honestly most "island-vibe" way to get there is the classic <strong>Bus + RoRo combo</strong>. For the latest 2026 fares and departure times, check out our <Link href="/ferry-schedule" className="text-[#0077be] font-bold hover:underline">Complete Ferry Schedule</Link>.
                    </p>
                </section>

                {/* Hack Card Highlight */}
                <div className="bg-gradient-to-br from-[#0077be] to-blue-800 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-900/20 my-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-yellow-300 text-3xl">lightbulb</span>
                        <h2 className="text-2xl font-black m-0 tracking-tight">The Ultimate Travel Hack</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h3 className="font-bold text-emerald-300 mb-2">1. The 8 AM Departure</h3>
                            <p className="text-sm text-blue-50 leading-relaxed">
                                Leave the Buendia terminal around <strong>8:00 AM</strong>. This avoids the worst of the Manila rush hour and guarantees you arrive at the Dalahican port in time for an afternoon ferry, reaching Marinduque before dark.
                            </p>
                        </div>
                        <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h3 className="font-bold text-emerald-300 mb-2">2. The Sleeping Bunks</h3>
                            <p className="text-sm text-blue-50 leading-relaxed">
                                On the RoRo ferry, immediately head for the air-conditioned rooms and claim a sleeping bunk. A 3-hour nap on a bunk with the sea air is the ultimate travel recharge!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phase 1 */}
                <section id="land" className="scroll-mt-[100px]">
                    <h2 className="text-3xl font-black text-[#0077be] mb-6 flex items-center gap-3">
                        <span className="bg-[#0077be]/10 text-[#0077be] w-10 h-10 rounded-xl flex items-center justify-center text-xl">1</span>
                        The Land Leg
                    </h2>
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <ul className="space-y-4 text-slate-700">
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">directions_bus</span>
                                <div>
                                    <strong className="text-slate-900 block">The Departure Hub</strong>
                                    Always head to the <a href="https://www.google.com/maps/search/?api=1&query=Jam+Liner+Buendia" target="_blank" rel="noreferrer" className="text-[#0077be] hover:underline font-bold">Buendia (LRT-1) Terminal</a> area. It’s the closest major hub for anyone coming from Makati or the South.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">local_shipping</span>
                                <div>
                                    <strong className="text-slate-900 block">Top Bus Liners</strong>
                                    Look for <strong>JAC Liner, JAM Transit, or DLTB</strong>. These are the most reliable fleets servicing the route.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">schedule</span>
                                <div>
                                    <strong className="text-slate-900 block">Travel Time</strong>
                                    The bus ride to Lucena City takes about <strong>3 to 4 hours</strong>, depending on traffic on the SLEX and Quezon highways.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">fastfood</span>
                                <div>
                                    <strong className="text-slate-900 block">Snack Hack</strong>
                                    Local vendors will board the bus selling goodies like chicharon and bibingka. Eat these or grab food at the scheduled bus stops along the highway. <em>Avoid eating at the Lucena port terminal</em>—options are limited, expensive, and lower quality.
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Phase 2 */}
                <section id="sea" className="scroll-mt-[100px]">
                    <h2 className="text-3xl font-black text-[#0077be] mb-6 flex items-center gap-3">
                        <span className="bg-[#0077be]/10 text-[#0077be] w-10 h-10 rounded-xl flex items-center justify-center text-xl">2</span>
                        The Sea Leg
                    </h2>
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <ul className="space-y-4 text-slate-700">
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">anchor</span>
                                <div>
                                    <strong className="text-slate-900 block">The Port</strong>
                                    You will arrive at the <a href="https://www.google.com/maps/search/?api=1&query=Dalahican+Ferry+Terminal" target="_blank" rel="noreferrer" className="text-[#0077be] hover:underline font-bold">Dalahican Ferry Terminal</a> in Lucena City. The terminal is quite decent and easy to navigate.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">sailing</span>
                                <div>
                                    <strong className="text-slate-900 block">The Vessels</strong>
                                    You’ll likely board a <strong>Montenegro Lines</strong> or <strong>Starhorse Shipping Lines</strong> RoRo (Roll-on/Roll-off) ferry.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">airline_seat_flat</span>
                                <div>
                                    <strong className="text-slate-900 block">The "Nap Factor"</strong>
                                    Aim for the larger <em>barkos</em>. They usually feature air-conditioned rooms and sleeping bunks. Smaller fastcrafts are usually open-air and seating only.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">landscape</span>
                                <div>
                                    <strong className="text-slate-900 block">The Approach</strong>
                                    The ferry takes about <strong>3 hours</strong>. You'll see the main island from afar, but keep your eyes open as you get close. You’ll traverse beautiful mini-islets before the port reveals itself. Look for the massive, colorful new mural painted at <a href="https://www.google.com/maps/search/?api=1&query=Balanacan+Port+Marinduque" target="_blank" rel="noreferrer" className="text-[#0077be] hover:underline font-bold">Balanacan Port</a> in Mogpog!
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Phase 3 */}
                <section id="arrival" className="scroll-mt-[100px]">
                    <h2 className="text-3xl font-black text-[#0077be] mb-6 flex items-center gap-3">
                        <span className="bg-[#0077be]/10 text-[#0077be] w-10 h-10 rounded-xl flex items-center justify-center text-xl">3</span>
                        The Arrival & Return
                    </h2>
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <ul className="space-y-4 text-slate-700">
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">directions_run</span>
                                <div>
                                    <strong className="text-slate-900 block">The "Pro" Hustle</strong>
                                    As the ship docks, be ready to move! Hurry off the ship to get your luggage stowed and grab a choice seat on the waiting buses or jeeps. They fill up extremely fast for the trips to Boac, Gasan, or Santa Cruz.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-symbols-outlined text-emerald-500 shrink-0 mt-1">replay</span>
                                <div>
                                    <strong className="text-slate-900 block">The Return Trip</strong>
                                    When your vacation is over and you arrive back at Lucena from Marinduque, buses bound for Manila/Buendia are always lined up and ready for immediate boarding outside the port.
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Interactive Checklist */}
                <section id="checklist" className="scroll-mt-[100px] pb-12">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-3xl">checklist</span>
                        Departure Checklist
                    </h2>
                    <div className="bg-emerald-50/50 p-6 md:p-8 rounded-3xl border border-emerald-100">
                        <p className="text-sm text-slate-600 mb-4">Tap to check off items before you hit the road:</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Cash for Terminal Fees & Snacks",
                                "Jacket or Hoodie (for the Air-Con ferry rooms)",
                                "Valid ID (for ferry ticketing)",
                                "Powerbank (Bus rides drain batteries!)",
                                "Downloaded Movies/Music",
                                "Travel Neck Pillow"
                            ].map((item, i) => (
                                <label key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-colors group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500" />
                                    <span className="font-bold text-slate-700 group-hover:text-emerald-800 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

            </article>
        </main>
    );
}
