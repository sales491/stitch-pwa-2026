'use client';

import { TideDayData } from '@/app/actions/tides';

function moonEmoji(phase: number | null): string {
    if (phase === null) return '🌑';
    if (phase < 0.06 || phase > 0.94) return '🌑';
    if (phase < 0.19) return '🌒';
    if (phase < 0.31) return '🌓';
    if (phase < 0.44) return '🌔';
    if (phase < 0.56) return '🌕';
    if (phase < 0.69) return '🌖';
    if (phase < 0.81) return '🌗';
    return '🌘';
}

function fmtTime(isoStr: string | null): string {
    if (!isoStr) return '--';
    return new Date(isoStr).toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
}

function fmtDate(dateStr: string): string {
    return new Date(`${dateStr}T12:00:00+08:00`).toLocaleDateString('en-PH', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Manila'
    });
}

function fishingColor(rating: string | null | undefined) {
    if (rating === 'good') return 'text-emerald-600 dark:text-emerald-400';
    if (rating === 'slow') return 'text-rose-500 dark:text-rose-400';
    return 'text-amber-500 dark:text-amber-400';
}

function fishingEmoji(rating: string | null | undefined) {
    if (rating === 'good') return '🟢';
    if (rating === 'slow') return '🔴';
    return '🟡';
}

function fishingLabel(rating: string | null | undefined) {
    if (rating === 'good') return 'Good Fishing Day';
    if (rating === 'slow') return 'Slow Day';
    return 'Fair Fishing';
}

const HIGH_ICON = '🌊';
const LOW_ICON = '🪸';

function getTideDirection(extremes: { time: string; type: string }[]): 'rising' | 'falling' | null {
    if (!extremes.length) return null;
    const now = Date.now();
    const next = extremes.find(e => new Date(e.time).getTime() > now);
    if (!next) return null;
    return next.type?.toLowerCase() === 'high' ? 'rising' : 'falling';
}

type Props = { weekData: TideDayData[] };

export default function TidesDisplay({ weekData }: Props) {
    const today = weekData[0];
    const hasData = today && today.extremes.length > 0;
    const tideDir = hasData ? getTideDirection(today.extremes) : null;
    const astro = today?.astronomy;
    const solunar = today?.solunar;

    return (
        <div className="px-4 pt-4 pb-8 space-y-4">
            {!hasData && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl px-4 py-5 text-center">
                    <p className="text-3xl mb-2">{HIGH_ICON}</p>
                    <p className="font-black text-slate-800 dark:text-white text-sm">Tide data updates daily</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                        Add <code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">STORMGLASS_API_KEY</code> and <code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">CRON_SECRET</code> to your Vercel env vars, then trigger the cron once.
                    </p>
                </div>
            )}

            {hasData && (
                <>
                    <div className={`rounded-2xl px-4 py-4 flex items-center gap-3 ${tideDir === 'rising' ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30' : 'bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'}`}>
                        <span className="text-3xl">{tideDir === 'rising' ? '🔼' : '🔽'}</span>
                        <div>
                            <p className="font-black text-slate-900 dark:text-white text-[14px]">Tide is {tideDir === 'rising' ? 'Rising' : 'Falling'}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Next: {(() => { const next = today.extremes.find(e => new Date(e.time).getTime() > Date.now()); return next ? `${next.type ? next.type.charAt(0).toUpperCase() + next.type.slice(1) : ""} tide at ${fmtTime(next.time)} (${next.height}m)` : 'No more today'; })()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Today&apos;s Tides</p>
                        <div className="grid grid-cols-2 gap-2">
                            {today.extremes.map((e, i) => (
                                <div key={i} className={`rounded-2xl px-3 py-3 text-center border ${e.type?.toLowerCase() === 'high' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' : 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30'}`}>
                                    <span className="text-lg">{e.type?.toLowerCase() === 'high' ? HIGH_ICON : LOW_ICON}</span>
                                    <p className="font-black text-slate-900 dark:text-white text-[12px] mt-1">{e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1) : ''} Tide</p>
                                    <p className={`text-[13px] font-bold ${e.type?.toLowerCase() === 'high' ? 'text-blue-600 dark:text-blue-400' : 'text-cyan-600 dark:text-cyan-400'}`}>{fmtTime(e.time)}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">{e.height}m</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {solunar && (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{'\uD83C\uDFA3'} Fishing Today</p>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{fishingEmoji(solunar.fishing_rating)}</span>
                                <p className={`font-black text-[15px] ${fishingColor(solunar.fishing_rating)}`}>{fishingLabel(solunar.fishing_rating)}</p>
                            </div>
                            {solunar.peak_periods?.length > 0 && (
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Peak Fishing Windows</p>
                                    {solunar.peak_periods.map((p, i) => (
                                        <div key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${p.type === 'major' ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30' : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30'}`}>
                                            <span className="text-sm">{p.type === 'major' ? '⭐' : '✦'}</span>
                                            <div>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${p.type === 'major' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{p.type} period</span>
                                                <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{fmtTime(p.start)} {'–'} {fmtTime(p.end)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {astro && (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Sun &amp; Moon</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2"><span className="text-xl">🌅</span><div><p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Sunrise</p><p className="text-[13px] font-black text-slate-900 dark:text-white">{fmtTime(astro.sunrise)}</p></div></div>
                                <div className="flex items-center gap-2"><span className="text-xl">🌇</span><div><p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Sunset</p><p className="text-[13px] font-black text-slate-900 dark:text-white">{fmtTime(astro.sunset)}</p></div></div>
                                <div className="flex items-center gap-2"><span className="text-xl">{moonEmoji(astro.moon_phase)}</span><div><p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Moon Phase</p><p className="text-[12px] font-black text-slate-900 dark:text-white">{astro.moon_phase_name ?? '—'}</p>{astro.moon_phase !== null && <p className="text-[10px] text-slate-400">{Math.round(astro.moon_phase * 100)}% illuminated</p>}</div></div>
                                {astro.moonrise && <div className="flex items-center gap-2"><span className="text-xl">🌙</span><div><p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Moonrise</p><p className="text-[13px] font-black text-slate-900 dark:text-white">{fmtTime(astro.moonrise)}</p></div></div>}
                            </div>
                        </div>
                    )}
                </>
            )}

            {weekData.some(d => d.extremes.length > 0) && (
                <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">7-Day Tide Forecast</p>
                    <div className="space-y-2">
                        {weekData.slice(1).map((day) => (
                            <div key={day.date} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="font-black text-slate-700 dark:text-white text-[12px]">{fmtDate(day.date)}</p>
                                    {day.solunar && <span className="text-[10px]">{fishingEmoji(day.solunar.fishing_rating)}</span>}
                                </div>
                                {day.extremes.length > 0 ? (
                                    <div className="flex gap-3 flex-wrap">
                                        {day.extremes.map((e, i) => (
                                            <span key={i} className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {e.type?.toLowerCase() === 'high' ? HIGH_ICON : LOW_ICON} <span className="font-bold">{fmtTime(e.time)}</span> <span className="text-slate-400">{e.height}m</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">No data yet</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Legend</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {([
                        [HIGH_ICON, 'High Tide'],
                        [LOW_ICON, 'Low Tide (reef exposed)'],
                        ['🔼', 'Tide Rising'],
                        ['🔽', 'Tide Falling'],
                        ['🟢', 'Good fishing day'],
                        ['🟡', 'Fair fishing day'],
                        ['🔴', 'Slow fishing day'],
                        ['⭐', 'Major fishing window'],
                        ['✦', 'Minor fishing window'],
                        ['🌅', 'Sunrise  🌇 Sunset'],
                        ['🌕', 'Moon phase (varies)'],
                        ['🌙', 'Moonrise time'],
                    ] as [string,string][]).map(([icon, label]) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className="text-sm w-5 text-center">{icon}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-300 dark:text-zinc-600">
                Tide data via Stormglass &middot; Updated daily &middot; Marinduque (13.4&deg;N 122.0&deg;E)
            </p>
        </div>
    );
}