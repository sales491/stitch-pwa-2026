'use client';

// VesselFinder's aismap.js uses document.write() which browsers block
// when injected asynchronously from React. The correct approach is a
// direct iframe with properly formed URL parameters (NO %-encoding in the src).
//
// Route: Lucena City port (13.93, 121.62) ↔ Balanacan/Mogpog (13.54, 121.94)
// Center midpoint at zoom 7 shows the full ferry crossing in one view.

const VESSEL_FINDER_URL =
    'https://www.vesselfinder.com/aismap' +
    '?zoom=9' +
    '&lat=13.72' +
    '&lon=121.77' +
    '&width=800' +
    '&height=400' +
    '&names=true' +
    '&mmsi=' +
    '&show_track=false' +
    '&select=false' +
    '&clicktoact=false';

const VESSEL_FINDER_FULLSCREEN =
    'https://www.vesselfinder.com/?zoom=9&lat=13.72&lon=121.77';

export default function VesselTrackerEmbed() {
    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark bg-slate-100 dark:bg-zinc-800" style={{ height: '360px' }}>

            <iframe
                src={VESSEL_FINDER_URL}
                title="Live ship tracker — Lucena to Balanacan crossing"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allowFullScreen
            />

            {/* Route label bottom-left */}
            <div className="absolute bottom-2 left-2 pointer-events-none z-10">
                <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/80 px-2 py-1 rounded-lg uppercase tracking-widest">
                    Lucena ↔ Balanacan · Live AIS
                </span>
            </div>

            {/* Full-screen shortcut top-right */}
            <a
                href={VESSEL_FINDER_FULLSCREEN}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-[9px] font-black text-slate-700 dark:text-slate-300 px-2 py-1.5 rounded-lg border border-white/20 hover:bg-white transition-all active:scale-95"
            >
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                Full screen
            </a>
        </div>
    );
}
