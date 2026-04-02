import type { Metadata } from 'next';
import { getExchangeRates, getRemittanceCenters } from '@/app/actions/ofw';
import OFWDisplay from '@/components/OFWDisplay';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
    title: 'OFW Corner — Remittance & Exchange Rates',
    description: 'Live Philippine peso exchange rates for USD, SAR, AED, SGD, and more. Find remittance centers across Marinduque. Essential tools for OFWs and their families.',
    keywords: ['OFW Marinduque', 'peso exchange rate Philippines', 'remittance Marinduque', 'Western Union Boac', 'dollar rate today Philippines'],
    openGraph: {
        title: 'OFW Corner — Marinduque',
        description: 'Live exchange rates and remittance centers for Marinduque OFWs and families.',
    },
    alternates: { canonical: 'https://marinduquemarket.com/my-barangay/ofw' },
};

export const dynamic = 'force-dynamic';

export default async function OFWCornerPage() {
    const [rates, centers] = await Promise.all([
        getExchangeRates(),
        getRemittanceCenters(),
    ]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">✈️ OFW Corner</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">My Barangay</p>
                </div>
            </header>
            {/* Gradient hero */}
            <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 px-4 pt-5 pb-6 relative overflow-hidden">
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
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
