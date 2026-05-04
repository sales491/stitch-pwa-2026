'use client';

import { useState } from 'react';
import { OFW_CURRENCIES } from '@/lib/ofw-constants';
import { ExchangeRates, RemittanceCenter } from '@/app/actions/ofw';

const NETWORK_COLOR: Record<string, string> = {
    'LBC':                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    'M Lhuillier':        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'Palawan Pawnshop':   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Western Union':      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'Cebuana Lhuillier':  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
};

const MUNICIPALITIES = ['All', 'Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

type Props = {
    rates: ExchangeRates;
    centers: RemittanceCenter[];
};

export default function OFWDisplay({ rates, centers }: Props) {
    const [calcAmount, setCalcAmount] = useState('');
    const [calcCurrency, setCalcCurrency] = useState('USD');
    const [muni, setMuni] = useState('All');
    const [activeTab, setActiveTab] = useState<'rates' | 'directory'>('rates');

    const hasRates = Object.keys(rates.rates).length > 0;
    const phpResult = calcAmount && rates.rates[calcCurrency]
        ? (parseFloat(calcAmount) * rates.rates[calcCurrency]).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : null;

    const filteredCenters = muni === 'All' ? centers : centers.filter(c => c.municipality === muni);

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-2 px-4 pt-4 pb-1">
                {(['rates', 'directory'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${
                            activeTab === tab
                                ? 'bg-sky-500 text-white shadow'
                                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        {tab === 'rates' ? '💱 Exchange Rates' : '🏦 Send Money'}
                    </button>
                ))}
            </div>

            {/* ─── EXCHANGE RATES TAB ─── */}
            {activeTab === 'rates' && (
                <div className="px-4 pt-3 pb-6 space-y-4">
                    {/* Freshness indicator */}
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                            {hasRates
                                ? `Updated ${rates.fetched_at ? timeAgo(rates.fetched_at) : 'recently'} · Rates in PHP`
                                : 'Rates not yet fetched — check back tomorrow'}
                        </p>
                        {hasRates && (
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Live</span>
                        )}
                    </div>

                    {/* Rate cards grid */}
                    {hasRates ? (
                        <div className="grid grid-cols-2 gap-2">
                            {OFW_CURRENCIES.map(({ code, flag, country }) => {
                                const phpPer1 = rates.rates[code];
                                if (!phpPer1) return null;
                                return (
                                    <button
                                        key={code}
                                        onClick={() => { setCalcCurrency(code); setActiveTab('rates'); }}
                                        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-3.5 py-3.5 text-left shadow-sm hover:shadow-md active:scale-[0.97] transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">{flag}</span>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 dark:text-white">{code}</p>
                                                <p className="text-[9px] text-slate-400 dark:text-zinc-500">{country}</p>
                                            </div>
                                        </div>
                                        <p className="text-[15px] font-black text-slate-900 dark:text-white mt-1">
                                            ₱{phpPer1.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-[9px] text-slate-400 dark:text-zinc-500">per 1 {code}</p>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-3xl mb-3">⏳</p>
                            <p className="font-black text-slate-700 dark:text-white text-sm">Rates not yet loaded</p>
                            <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">The daily fetch runs at midnight PHT. Please check back later.</p>
                        </div>
                    )}

                    {/* Calculator */}
                    {hasRates && (
                        <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-2xl px-4 py-4">
                            <p className="text-[11px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-3">💰 Quick Calculator</p>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="number"
                                    value={calcAmount}
                                    onChange={e => setCalcAmount(e.target.value)}
                                    placeholder="0"
                                    className="flex-1 bg-white dark:bg-zinc-900 border border-sky-200 dark:border-sky-800/60 rounded-xl px-3 py-2.5 text-[14px] font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                <select
                                    value={calcCurrency}
                                    onChange={e => setCalcCurrency(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border border-sky-200 dark:border-sky-800/60 rounded-xl px-3 py-2.5 text-[12px] font-black text-slate-900 dark:text-white focus:outline-none appearance-none"
                                >
                                    {OFW_CURRENCIES.map(({ code, flag }) => (
                                        <option key={code} value={code}>{flag} {code}</option>
                                    ))}
                                </select>
                            </div>
                            {phpResult ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-center">
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-0.5">{calcAmount} {calcCurrency} ≈</p>
                                    <p className="text-[22px] font-black text-emerald-600 dark:text-emerald-400">₱{phpResult}</p>
                                </div>
                            ) : (
                                <p className="text-center text-[11px] text-sky-500 dark:text-sky-400">Enter an amount above to calculate</p>
                            )}
                        </div>
                    )}

                    <p className="text-[10px] text-center text-slate-300 dark:text-zinc-600 mt-2">
                        Rates for reference only · Actual remittance rates may vary by provider
                    </p>
                </div>
            )}

            {/* ─── REMITTANCE DIRECTORY TAB ─── */}
            {activeTab === 'directory' && (
                <div className="px-4 pt-3 pb-6 space-y-3">
                    {/* Municipality filter */}
                    <select
                        value={muni}
                        onChange={e => setMuni(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none"
                    >
                        {MUNICIPALITIES.map(m => <option key={m}>{m}</option>)}
                    </select>

                    {filteredCenters.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-3xl mb-3">🏦</p>
                            <p className="font-black text-slate-700 dark:text-white text-sm">No centers listed</p>
                        </div>
                    )}

                    {filteredCenters.map(center => (
                        <div key={center.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="font-black text-slate-900 dark:text-white text-[13px] leading-tight">{center.name}</p>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${NETWORK_COLOR[center.network] ?? 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
                                    {center.network}
                                </span>
                            </div>
                            {center.address && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1">
                                    <span className="flex-shrink-0">📍</span> {center.address}
                                </p>
                            )}
                            {center.hours && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                    <span>🕐</span> {center.hours}
                                </p>
                            )}
                            {center.phone && (
                                <a href={`tel:${center.phone}`} className="text-[11px] text-sky-600 dark:text-sky-400 flex items-center gap-1 mt-0.5">
                                    <span>📞</span> {center.phone}
                                </a>
                            )}
                        </div>
                    ))}

                    <div className="mt-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        ℹ️ Remittance center info is community-maintained. Call ahead to verify hours, especially on holidays.
                    </div>
                </div>
            )}
        </div>
    );
}
