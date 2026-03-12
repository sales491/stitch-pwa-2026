import { createClient } from '@/utils/supabase/server';

export type TideExtreme = {
    time: string;
    height: number;
    type: 'High' | 'Low';
};

export type TideAstronomy = {
    date: string;
    sunrise: string | null;
    sunset: string | null;
    moonrise: string | null;
    moonset: string | null;
    moon_phase: number | null;
    moon_phase_name: string | null;
};

export type TideSolunar = {
    date: string;
    peak_periods: { start: string; end: string; type: 'major' | 'minor' }[];
    fishing_rating: 'good' | 'fair' | 'slow';
};

export type TideDayData = {
    date: string;
    extremes: TideExtreme[];
    astronomy: TideAstronomy | null;
    solunar: TideSolunar | null;
};

function phtToday(): string {
    const pht = new Date(Date.now() + 8 * 60 * 60 * 1000);
    return pht.toISOString().slice(0, 10);
}

function phtDatePlus(days: number): string {
    const pht = new Date(Date.now() + 8 * 60 * 60 * 1000 + days * 86400 * 1000);
    return pht.toISOString().slice(0, 10);
}

export async function getWeekTides(): Promise<TideDayData[]> {
    const supabase = await createClient();
    const today = phtToday();
    const weekEnd = phtDatePlus(6);

    const [extremesRes, astroRes, solunarRes] = await Promise.all([
        supabase.from('tide_extremes').select('*').gte('date', today).lte('date', weekEnd).order('date'),
        supabase.from('tide_astronomy').select('*').gte('date', today).lte('date', weekEnd).order('date'),
        supabase.from('tide_solunar').select('date, peak_periods, fishing_rating').gte('date', today).lte('date', weekEnd).order('date'),
    ]);

    const extremesByDate = Object.fromEntries((extremesRes.data ?? []).map(r => [r.date, r.extremes]));
    const astroByDate = Object.fromEntries((astroRes.data ?? []).map(r => [r.date, r]));
    const solunarByDate = Object.fromEntries((solunarRes.data ?? []).map(r => [r.date, r]));

    // Build 7-day array
    return Array.from({ length: 7 }, (_, i) => {
        const date = phtDatePlus(i);
        return {
            date,
            extremes: extremesByDate[date] ?? [],
            astronomy: astroByDate[date] ?? null,
            solunar: solunarByDate[date] ?? null,
        };
    });
}

export async function getTodayTides(): Promise<TideDayData | null> {
    const week = await getWeekTides();
    return week[0] ?? null;
}
