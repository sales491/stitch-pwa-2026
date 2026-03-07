import { createClient } from '@/utils/supabase/server';
import PortUpdateCard from '@/components/PortUpdateCard';
import Link from 'next/link';

export default async function PortsFeed() {
    const supabase = await createClient();

    // THE 24-HOUR RULE: Extract only intel from the last solar cycle
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch only recent updates from the intelligence registry
    const { data: updates, error } = await supabase
        .from('port_updates')
        .select(`
      *,
      author:profiles(full_name)
    `)
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });

    if (error) return <div className="p-8 text-moriones-red font-black text-center uppercase tracking-widest text-sm">Protocol Failure: Port Surveillance Systems Offline</div>;

    return (
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">

            {/* Flight Board Inspired Header */}
            <div className="bg-slate-900 dark:bg-zinc-900 border-b-4 border-slate-950 p-8 rounded-b-[3rem] shadow-2xl mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>

                <div className="max-w-xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <h1 className="text-2xl font-black text-white tracking-[0.2em] uppercase leading-none">
                                Port Surveillance
                            </h1>
                        </div>
                        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
                            24H REAL-TIME COMMUTER INTELLIGENCE
                        </p>
                    </div>

                    <Link
                        href="/ports/create"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">campaign</span>
                        Broadcast Update
                    </Link>
                </div>
            </div>

            {/* The Live Intel Feed */}
            <div className="max-w-xl mx-auto flex flex-col gap-10">

                {/* Sea Conditions Surveillance */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-4">
                        <span className="material-symbols-outlined text-blue-500">tsunami</span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Sea Conditions</h3>
                    </div>
                    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 bg-slate-900">
                        <iframe
                            src="https://embed.windy.com/embed2.html?lat=13.476&lon=121.917&detailLat=13.476&detailLon=121.917&width=650&height=400&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
                            title="Windy Sea Conditions - Tablas Strait"
                            className="w-full h-full border-0 opacity-80"
                            loading="lazy"
                            allowFullScreen
                        />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/50 px-2 py-1 rounded-lg uppercase tracking-widest">Live Windy Data</span>
                        </div>
                    </div>
                </section>

                {/* Vessel Tracker Surveillance */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-4">
                        <span className="material-symbols-outlined text-emerald-500">directions_boat</span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Vessel Tracker</h3>
                    </div>
                    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 bg-slate-900">
                        <iframe
                            src="https://www.vesselfinder.com/aismap?zoom=9&lat=13.7&lon=121.8&width=100%25&height=300&names=true&mmsi=&show_track=false&select=&clicktoact=false&ra=false&hd=false"
                            title="VesselFinder - Live Vessel Tracking Tablas Strait"
                            className="w-full h-full border-0 opacity-80"
                            loading="lazy"
                            allowFullScreen
                        />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/50 px-2 py-1 rounded-lg uppercase tracking-widest">Live AIS Feed</span>
                        </div>
                    </div>
                </section>

                {/* Crowdsourced Transmissions */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-4">
                        <span className="material-symbols-outlined text-blue-500">campaign</span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Commuter Transmissions</h3>
                    </div>

                    <div className="space-y-4">
                        {updates?.map((update) => (
                            <PortUpdateCard
                                key={update.id}
                                id={update.id}
                                port={update.port_name}
                                status={update.status}
                                message={update.message}
                                createdAt={update.created_at}
                                authorId={update.author_id}
                                authorName={update.author?.full_name}
                            />
                        ))}

                        {updates?.length === 0 && (
                            <div className="py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                    <span className="material-symbols-outlined text-5xl">wifi_off</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Silence in the Hub</h3>
                                <p className="text-slate-500 font-bold max-w-xs text-[11px] leading-relaxed uppercase tracking-wider">No transmissions recorded in the last 24-hour cycle.</p>
                                <Link href="/ports/create" className="mt-8 text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                                    Initialize Transmission <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Transit Advisory Footer */}
            <div className="max-w-xl mx-auto mt-12 px-8 flex items-center gap-3 py-4 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800">
                <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-normal">
                    Advisory: Intel is crowdsourced and should be cross-referenced with official shipping line manifests.
                </p>
            </div>
        </div>
    );
}
