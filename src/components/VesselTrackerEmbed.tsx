'use client';

// VesselFinder free embed shows the geographic map correctly.
// Class B AIS (RoRo ferries) requires their paid plan — tapping "See Ships"
// opens the full VesselFinder site where all vessels are visible.
//
// Route: Lucena City (13.93, 121.62) ↔ Balanacan/Mogpog (13.54, 121.94)

const VESSEL_FINDER_URL =
    'https://www.vesselfinder.com/aismap' +
    '?zoom=9' +
    '&lat=13.71' +
    '&lon=121.74' +
    '&width=800' +
    '&height=400' +
    '&names=true' +
    '&show_track=false';

const VESSEL_FINDER_FULLSCREEN =
    'https://www.vesselfinder.com/?zoom=9&lat=13.71&lon=121.74';

export default function VesselTrackerEmbed() {
    return (
        <div
            className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark bg-slate-100 dark:bg-zinc-800"
            style={{ height: '360px' }}
        >
            <iframe
                src={VESSEL_FINDER_URL}
                title="Live ship tracker — Lucena to Balanacan crossing"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allowFullScreen
            />

            {/* Route label */}
            <div className="absolute bottom-2 left-2 pointer-events-none z-10">
                <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/80 px-2 py-1 rounded-lg uppercase tracking-widest">
                    Lucena ↔ Balanacan · AIS Map
                </span>
            </div>

            {/* CTA — opens full VesselFinder where ferries ARE visible */}
            <a
                href={VESSEL_FINDER_FULLSCREEN}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-moriones-red text-white text-xs font-black px-5 py-3 rounded-xl shadow-2xl shadow-moriones-red/50 hover:bg-red-700 hover:scale-105 transition-all active:scale-95 border border-white/20"
            >
                <span className="material-symbols-outlined text-[18px]">directions_boat</span>
                See Live Ships
            </a>
        </div>
    );
}
