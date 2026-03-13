import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { isAdmin as checkIsAdmin } from '@/utils/roles';
import { BUSINESSES } from '@/data/businesses';
import ShoutoutsSection, { type ShoutoutItem } from '@/components/ShoutoutsSection';
import WinnerSection from '@/components/WinnerSection';
import MonthPill from '@/components/MonthPill';

export const metadata: Metadata = {
    title: 'Best of Boac — Monthly Business Spotlight',
    description: 'Monthly spotlight celebrating the best local businesses in Boac, Marinduque. Top-rated restaurants, shops, and services voted by the community.',
    keywords: ['best businesses Boac', 'top restaurants Marinduque', 'Boac local businesses', 'monthly spotlight Marinduque'],
    openGraph: {
        title: 'Best of Boac — Monthly Business Spotlight',
        description: 'Community-voted best businesses in Boac, Marinduque.',
        url: 'https://marinduquemarket.com/best-of-boac-monthly-spotlight',
    },
    alternates: { canonical: 'https://marinduquemarket.com/best-of-boac-monthly-spotlight' },
};

export const revalidate = 0;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BestOfBoacPage() {
  const supabase = await createClient();

  // ── Auth / Admin check ────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin' || checkIsAdmin(user.email);
  }

  // ── Current month key ─────────────────────────────────────────
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // ── Fetch monthly spotlight record ────────────────────────────
  const { data: spotlight } = await supabase
    .from('boac_spotlights')
    .select('*')
    .eq('month_year', monthYear)
    .maybeSingle();

  // ── Fetch the two spotlit businesses ─────────────────────────
  const spotlightIds = [spotlight?.business_id_1, spotlight?.business_id_2].filter(Boolean) as string[];
  let shoutoutBizzes: Record<string, unknown>[] = [];

  if (spotlightIds.length > 0) {
    const { data } = await supabase
      .from('business_profiles')
      .select('id, business_name, business_type, location, operating_hours, average_rating, review_count, gallery_image, gallery_images, categories, description')
      .in('id', spotlightIds);
    shoutoutBizzes = spotlightIds
      .map(id => data?.find(b => b.id === id))
      .filter(Boolean) as Record<string, unknown>[];
  } else if (!spotlight) {
    const { data: topBiz } = await supabase
      .from('business_profiles')
      .select('id, business_name, business_type, location, operating_hours, average_rating, review_count, gallery_image, gallery_images, categories, description')
      .ilike('location', '%boac%')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(2);
    shoutoutBizzes = (topBiz ?? []) as Record<string, unknown>[];
  }

  // ── Mock fallback (pad with mocks to guarantee 2 shoutouts) ─
  const neededMocks = Math.max(0, 2 - shoutoutBizzes.length);
  const mockBoac = [];
  if (neededMocks > 0) {
    let pushed = 0;
    for (const b of BUSINESSES) {
      if (pushed >= neededMocks) break;
      if (!b.location.toLowerCase().includes('boac')) continue;
      if (b.name.includes('Test')) continue;
      if (shoutoutBizzes.find(sb => sb.business_name === b.name)) continue;
      mockBoac.push(b);
      pushed++;
    }
  }

  const shoutouts: ShoutoutItem[] = [
    ...shoutoutBizzes.map(r => ({
      id: r.id as string,
      name: r.business_name as string,
      type: (r.business_type as string) || ((r.categories as string[])?.[0]) || 'Local Business',
      image: (r.gallery_image as string) || ((r.gallery_images as string[])?.[0]) || '',
      rating: Number((r.average_rating as number) ?? 0),
      reviewCount: (r.review_count as number) ?? 0,
      href: `/business/${r.id}`,
      isMock: false,
    })),
    ...mockBoac.map(b => ({
      id: b.id,
      name: b.name,
      type: b.type,
      image: b.image,
      rating: b.rating,
      reviewCount: b.reviewsCount,
      href: `/directory/${b.id}`,
      isMock: true,
    })),
  ];

  // ── Fetch winner ──────────────────────────────────────────────
  let winner = null;
  if (spotlight?.winner_business_id) {
    const { data: winnerData } = await supabase
      .from('business_profiles')
      .select('id, business_name, business_type, description, location, operating_hours, average_rating, review_count, gallery_image, gallery_images, categories, contact_info')
      .eq('id', spotlight.winner_business_id)
      .single();
    winner = winnerData ?? null;
  }
  if (!winner) {
    const { data: topBiz } = await supabase
      .from('business_profiles')
      .select('id, business_name, business_type, description, location, operating_hours, average_rating, review_count, gallery_image, gallery_images, categories, contact_info')
      .ilike('location', '%boac%')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(1);
    winner = topBiz?.[0] ?? null;
  }
  const winnerImage = winner?.gallery_image || winner?.gallery_images?.[0] || null;

  // ── All businesses for admin pickers ──────────────────────────
  let allPickerBusinesses: { id: string; business_name: string; business_type: string | null; gallery_image: string | null }[] = [];
  if (isAdmin) {
    const { data } = await supabase
      .from('business_profiles')
      .select('id, business_name, business_type, gallery_image')
      .order('business_name');
    allPickerBusinesses = (data ?? []) as typeof allPickerBusinesses;
  }

  // ── Writeup texts ──────────────────────────────────────────────
  const writeup1 = spotlight?.writeup_1 ?? '';
  const writeup2 = spotlight?.writeup_2 ?? '';
  const winnerWriteup1 = spotlight?.winner_writeup_1 ?? '';
  const winnerWriteup2 = spotlight?.winner_writeup_2 ?? '';
  const displayLabel = (spotlight?.display_label as string | null) ?? monthLabel;

  return (
    <div className="relative flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-20 shadow-sm">

        {/* Centered title — absolutely positioned so it's always truly centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="flex flex-col items-center leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[20px] font-black leading-none tracking-tight">
              <span className="text-moriones-red">Best of </span>
              <span style={{ color: '#C9A84C' }}>Boac</span>
            </span>
            <span className="h-[2px] mt-1 w-full rounded-full" style={{ background: 'linear-gradient(to right, #C01818, #C9A84C)' }} />
          </h1>
        </div>

        {/* Invisible height spacer — mirrors title to keep header height consistent */}
        <div aria-hidden className="invisible flex flex-col leading-none">
          <span className="text-[20px] font-black leading-none">Best of Boac</span>
          <span className="h-[2px] mt-1" />
        </div>

        {/* Right — admin button */}
        {isAdmin && (
          <Link
            href="/admin/best-of-boac"
            className="bg-moriones-red text-white px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm shadow-moriones-red/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
            Admin
          </Link>
        )}
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      {/* Outer wrapper has no overflow-hidden so the MonthPill can straddle the top edge */}
      <div className="relative w-full">
        <div className="relative w-full h-72 bg-slate-900 overflow-hidden">
          <Image
            src="/best-of-boac-hero.png"
            alt="Best of Boac — Monthly Spotlight"
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-moriones-red px-3 py-1 rounded-full mb-2">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              <span className="text-xs font-black uppercase tracking-[0.25em]">Featured Spotlight</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight line-clamp-2 drop-shadow-lg">
              {winner?.business_name ?? 'Top Spots This Month'}
            </h2>
          </div>
        </div>

        {/* Month pill — straddles header/hero boundary */}
        <MonthPill
          label={displayLabel}
          monthYear={monthYear}
          isAdmin={isAdmin}
        />
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {!winner && (
        <div className="mx-4 mt-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-3xl bg-surface-light dark:bg-surface-dark p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-moriones-red/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl text-moriones-red" style={{ fontVariationSettings: '"FILL" 1' }}>storefront</span>
          </div>
          <h3 className="text-lg font-black text-text-main dark:text-text-main-dark mb-2">No Verified Businesses Yet</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark max-w-xs leading-relaxed mb-6">
            Verified Boac businesses will appear here once approved by the admin team.
          </p>
          <Link href="/directory" className="bg-moriones-red text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-moriones-red/20 active:scale-95 transition-all">
            Browse Directory
          </Link>
        </div>
      )}

      {/* ── Monthly Top Spot — unified interactive section ──────── */}
      {winner && (
        <WinnerSection
          winner={winner}
          writeup1={winnerWriteup1}
          writeup2={winnerWriteup2}
          monthYear={monthYear}
          isAdmin={isAdmin}
          allBusinesses={allPickerBusinesses}
        />
      )}

      {/* ── Shoutouts — unified interactive section ──────────────── */}
      {shoutouts.length > 0 && (
        <ShoutoutsSection
          shoutouts={shoutouts}
          writeup1={writeup1}
          writeup2={writeup2}
          monthYear={monthYear}
          isAdmin={isAdmin}
          allBusinesses={allPickerBusinesses}
        />
      )}

      {/* ── Explore CTA ─────────────────────────────────────────── */}
      <div className="mx-4 mt-8 bg-moriones-red rounded-3xl p-6 flex flex-col items-center text-center shadow-lg shadow-moriones-red/20">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>explore</span>
        </div>
        <h3 className="text-lg font-black text-white mb-1">Explore Boac Businesses</h3>
        <p className="text-white/70 text-xs mb-4 leading-relaxed max-w-xs">
          Discover all the amazing local spots in Boac, Marinduque.
        </p>
        <Link href="/directory" className="bg-white text-moriones-red px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow active:scale-95 transition-all">
          View Full Directory
        </Link>
      </div>

    </div>
  );
}
