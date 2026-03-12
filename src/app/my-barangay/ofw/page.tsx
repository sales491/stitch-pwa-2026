import Link from 'next/link';
import { getExchangeRates, getRemittanceCenters } from '@/app/actions/ofw';
import OFWDisplay from '@/components/OFWDisplay';

export const metadata = {
    title: 'OFW Corner — Marinduque Market Hub',
    description: 'Philippine peso exchange rates and remittance centers for Marinduque OFWs and their families.',
};

export const dynamic = 'force-dynamic';

export default async function OFWCornerPage() {
    const [rates, centers] = await Promise.all([
        getExchangeRates(),
        getRemittanceCenters(),
    ]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Header */}
            <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 px-4 pt-10 pb-6 relative overflow-hidden">
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <Link href="/my-barangay" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    My Barangay
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">✈️</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">OFW Corner</h1>
                        <p className="text-sky-200 text-xs font-medium">Para sa mga naka-abroad at pamilya nila</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                        { emoji: '💱', label: 'Live rates' },
                        { emoji: '💰', label: 'Calculator' },
                        { emoji: '🏦', label: 'Remittance' },
                    ].map(({ emoji, label }) => (
                        <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-2 py-2 text-center">
                            <p className="text-lg">{emoji}</p>
                            <p className="text-[10px] font-black text-white/80 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <OFWDisplay rates={rates} centers={centers} />
        </main>
    );
}
