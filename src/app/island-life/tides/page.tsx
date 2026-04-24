import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE } from '@/utils/seo';
import { getWeekTides } from '@/app/actions/tides';
import TidesDisplay from '@/components/TidesDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Tides & Fishing Conditions — Marinduque',
    description: 'Daily tide times, moon phase, sunrise and sunset, and peak fishing windows for Marinduque Island waters. Plan your fishing trip with accurate solunar data.',
    keywords: [
        'tide times Marinduque', 'fishing conditions Philippines', 'solunar fishing Marinduque', 
        'moon phase fishing', 'high tide Boac', 'Mogpog tides', 'Gasan fishing', 
        'Buenavista coast', 'Torrijos white beach tide', 'Santa Cruz Maniwaya tides',
        ...TAGALOG_KEYWORDS_ISLAND_LIFE
    ],
    openGraph: {
        title: 'Tides & Fishing Conditions — Marinduque',
        description: 'Daily tide predictions and peak fishing windows for Marinduque island.',
        url: 'https://marinduquemarket.com/island-life/tides',
    },
    alternates: hreflangAlternates('/island-life/tides'),
};

export const dynamic = 'force-dynamic';

const TOWNS = [
    {
        name: 'Boac',
        tagline: 'Capital Coast & Cawit Port',
        description: 'The western coastline of Boac experiences generally calm waters, perfect for early morning mangisda. High tide at Laylay and Cawit provides optimal conditions for local bangka launches.',
        icon: '⚓',
        color: 'text-blue-500'
    },
    {
        name: 'Mogpog',
        tagline: 'Balanacan Gateway',
        description: 'Facing the Sibuyan Sea, Mogpog’s Balanacan Port is deeply affected by tidal shifts. Malakas ang alon during Amihan, making low tide the safest window for coastal gleaning and small catches.',
        icon: '📍',
        color: 'text-indigo-500'
    },
    {
        name: 'Gasan',
        tagline: 'Tres Reyes & Sunset Shores',
        description: 'Gasan’s shoreline faces the setting sun. The tides dictate the best times to island-hop to the Tres Reyes Islands. Magandang pumalaot here when the tide is rising, offering clear visibility.',
        icon: '🌅',
        color: 'text-orange-500'
    },
    {
        name: 'Buenavista',
        tagline: 'Mt. Malindig Backdrop',
        description: 'Nestled at the southern tip, Buenavista’s coastal waters are rich with marine life. Peak major fishing windows here often yield the best catch, especially around Elephant Island.',
        icon: '🐟',
        color: 'text-emerald-500'
    },
    {
        name: 'Torrijos',
        tagline: 'Poctoy White Beach',
        description: 'On the eastern flank, Torrijos faces the open sea. High tide at Poctoy White Beach brings the waves closer to the sand, while low tide exposes the reef—perfect for exploring tide pools.',
        icon: '🌊',
        color: 'text-rose-500'
    },
    {
        name: 'Santa Cruz',
        tagline: 'Maniwaya & Palad Sandbar',
        description: 'Tides are critical in Santa Cruz, especially for visiting the Palad Sandbar which only appears during low tide (hubsan). Plan your Buyabod port departures around the tide schedule.',
        icon: '🚤',
        color: 'text-cyan-500'
    }
];

export default async function TidesPage() {
    const weekData = await getWeekTides();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Tides & Fishing" subtitle="Island Life" emoji="🌊" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <TidesDisplay weekData={weekData} />

                {/* Town Breakdown Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Coastal Conditions by Town</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        While the general tide times (provincial average) apply island-wide, local coastal geography affects water behavior across the anim na bayan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TOWNS.map((town) => (
                            <div key={town.name} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-900/50 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-xl bg-slate-50 dark:bg-zinc-800 ${town.color} text-xl flex items-center justify-center w-10 h-10`}>
                                        {town.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{town.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{town.tagline}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {town.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Marinduque is small enough that the core tide data shown above is accurate across all six municipalities within a margin of 10-15 minutes.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
