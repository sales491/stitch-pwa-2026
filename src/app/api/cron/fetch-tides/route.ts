import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// Marinduque Island center coordinates
const LAT = 13.4;
const LNG = 122.0;
const BASE = 'https://api.stormglass.io/v2';

// Helper: format date as ISO date string (YYYY-MM-DD) in PHT
function phtDateStr(date: Date): string {
    const pht = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return pht.toISOString().slice(0, 10);
}

// Unix timestamps for start/end of window
function windowStart(dateStr: string): number {
    return Math.floor(new Date(`${dateStr}T00:00:00+08:00`).getTime() / 1000);
}
function windowEnd(dateStr: string): number {
    return Math.floor(new Date(`${dateStr}T23:59:59+08:00`).getTime() / 1000);
}

// Moon phase name from 0–1 moonFraction
function moonPhaseName(fraction: number): string {
    if (fraction < 0.03 || fraction > 0.97) return 'New Moon';
    if (fraction < 0.22) return 'Waxing Crescent';
    if (fraction < 0.28) return 'First Quarter';
    if (fraction < 0.47) return 'Waxing Gibbous';
    if (fraction < 0.53) return 'Full Moon';
    if (fraction < 0.72) return 'Waning Gibbous';
    if (fraction < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
}

// Derive fishing rating from moon phase + tide extremes
// Full/new moon = stronger tides = better fishing
function deriveFishingRating(moonFraction: number | null, extremeCount: number): string {
    const phase = moonFraction ?? 0.5;
    // Near full (0.45–0.55) or new moon (0-0.05 / 0.95-1) = strong tides = good
    const nearFullOrNew = phase < 0.08 || phase > 0.92 || (phase > 0.45 && phase < 0.55);
    const nearQuarter = (phase > 0.22 && phase < 0.30) || (phase > 0.70 && phase < 0.78);

    if (nearFullOrNew) return 'good';
    if (nearQuarter) return 'slow';
    return 'fair';
}

interface TideExtreme {
    time: string;
    height: number;
    type: string;
}

// Compute rough fishing windows: 1.5 hours around each tide extreme
// (incoming tide approaching high = prime time; outgoing approaching low = secondary)
function computePeakPeriods(extremes: TideExtreme[]): { start: string; end: string; type: 'major' | 'minor' }[] {
    return extremes.map(e => {
        const t = new Date(e.time).getTime();
        const windowMs = e.type === 'High' ? 90 * 60 * 1000 : 60 * 60 * 1000;
        return {
            start: new Date(t - windowMs).toISOString(),
            end: new Date(t + windowMs).toISOString(),
            type: e.type === 'High' ? 'major' as const : 'minor' as const,
        };
    });
}

export async function GET(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;
    if (secret && authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.STORMGLASS_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'STORMGLASS_API_KEY not set' }, { status: 500 });
    }

    const supabase = await createAdminClient();
    const today = phtDateStr(new Date());
    const startTs = windowStart(today);

    // 7 days end
    const endDate = new Date(new Date(`${today}T00:00:00+08:00`).getTime() + 7 * 24 * 60 * 60 * 1000);
    const endTs = windowEnd(phtDateStr(endDate));

    const errors: string[] = [];
    // Store astronomy by date for cross-referencing
    const astroByDate: Record<string, { moonFraction: number | null; extremes: TideExtreme[] }> = {};

    // ── CALL 1: Tide extremes (7 days) ──────────────────────────────────────
    try {
        const tidesRes = await fetch(
            `${BASE}/tide/extremes/point?lat=${LAT}&lng=${LNG}&start=${startTs}&end=${endTs}`,
            { headers: { Authorization: apiKey } }
        );
        const tidesJson = await tidesRes.json();
        const extremesByDay: Record<string, TideExtreme[]> = {};

        for (const extreme of tidesJson.data ?? []) {
            const d = phtDateStr(new Date(extreme.time));
            if (!extremesByDay[d]) extremesByDay[d] = [];
            extremesByDay[d].push({
                time: extreme.time,
                height: Math.round(extreme.height * 100) / 100,
                type: extreme.type,
            });
        }

        for (const [date, extremes] of Object.entries(extremesByDay)) {
            await supabase.from('tide_extremes').upsert({ date, extremes, fetched_at: new Date().toISOString() }, { onConflict: 'date' });
            astroByDate[date] = { moonFraction: null, extremes };
        }
    } catch (e) {
        errors.push(`tides: ${(e as Error).message}`);
    }

    // ── CALL 2: Astronomy (7 days) — includes moonFraction ──────────────────
    try {
        const astroRes = await fetch(
            `${BASE}/astronomy/point?lat=${LAT}&lng=${LNG}&start=${startTs}&end=${endTs}`,
            { headers: { Authorization: apiKey } }
        );
        const astroJson = await astroRes.json();

        for (const day of astroJson.data ?? []) {
            const date = phtDateStr(new Date(day.time));
            // Stormglass uses 'moonFraction' (0-1) for illumination
            const moonFraction: number | null = day.moonFraction ?? null;
            const phaseName = moonFraction !== null ? moonPhaseName(moonFraction) : null;

            await supabase.from('tide_astronomy').upsert({
                date,
                sunrise: day.sunrise ?? null,
                sunset: day.sunset ?? null,
                moonrise: day.moonrise ?? null,
                moonset: day.moonset ?? null,
                moon_phase: moonFraction,
                moon_phase_name: phaseName,
                fetched_at: new Date().toISOString(),
            }, { onConflict: 'date' });

            if (astroByDate[date]) astroByDate[date].moonFraction = moonFraction;
        }
    } catch (e) {
        errors.push(`astronomy: ${(e as Error).message}`);
    }

    // ── DERIVED: Fishing windows (no extra API call) ─────────────────────────
    // Compute from tide extremes + moon phase — free, no credit used
    try {
        for (const [date, { moonFraction, extremes }] of Object.entries(astroByDate)) {
            const peak_periods = computePeakPeriods(extremes);
            const fishing_rating = deriveFishingRating(moonFraction, extremes.length);
            await supabase.from('tide_solunar').upsert({
                date,
                hourly: null,
                peak_periods,
                fishing_rating,
                fetched_at: new Date().toISOString(),
            }, { onConflict: 'date' });
        }
    } catch (e) {
        errors.push(`solunar-derived: ${(e as Error).message}`);
    }

    return NextResponse.json({
        ok: errors.length === 0,
        fetched_for: today,
        days: Object.keys(astroByDate).length,
        errors: errors.length ? errors : undefined,
    });
}
