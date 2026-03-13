import { createClient } from '@/utils/supabase/server';
import { getPalengkePrices } from '@/app/actions/palengke';
import { MUNICIPALITIES, Municipality } from '@/lib/palengke-constants';
import PalengkeDisplay from '@/components/PalengkeDisplay';
import Link from 'next/link';

export const metadata = {
    title: 'Palengke Prices — Marinduque Market Hub',
    description: 'Today\'s fish, produce, and meat prices from palengke markets across all six Marinduque municipalities.',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function PalengkePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const defaultMuni: Municipality = 'Boac';
    const initialPrices = await getPalengkePrices(defaultMuni);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/island-life" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🐟 Palengke Vendors</p>
                    <p className="text-[10px] text-white font-black uppercase tracking-[0.15em] pl-1">Island Life</p>
                </div>
            </header>
            {/* Gradient hero */}
            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🐟</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Palengke</h1>
                        <p className="text-yellow-100 text-xs font-medium">Vendor posted · updated live</p>
                    </div>
                </div>
                <p className="text-white text-[11px] mt-2 leading-relaxed max-w-sm">
                    Vendors post their items, prices, and stall locations every day. Find what&apos;s available before you head to the market.
                </p>
            </div>

            {/* Display */}
            <PalengkeDisplay
                initialMuni={defaultMuni}
                initialPrices={initialPrices}
                currentUserId={user?.id}
                isLoggedIn={!!user}
            />
        </main>
    );
}
