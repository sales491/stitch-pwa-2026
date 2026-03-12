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
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <Link href="/island-life" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Island Life
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🐟</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Palengke</h1>
                        <p className="text-yellow-100 text-xs font-medium">Vendor posted · updated live</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
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
