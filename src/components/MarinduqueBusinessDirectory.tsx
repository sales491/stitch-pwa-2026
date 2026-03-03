import React from 'react';
import Link from 'next/link';
import AdminActions from './AdminActions';

export default function MarinduqueBusinessDirectory() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 font-display">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <Link href="/marinduque-connect-home-feed" className="text-teal-700 dark:text-teal-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold text-teal-700 dark:text-teal-400">Marinduque Directory</h1>
                <button className="text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>

            <div className="px-4 pb-24">
                {/* Categories */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                    <button className="flex items-center gap-1 bg-teal-700 text-white px-4 py-2 rounded-full whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">grid_view</span> All
                    </button>
                    <button className="flex items-center gap-1 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">restaurant</span> Dine
                    </button>
                    <button className="flex items-center gap-1 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">bed</span> Stay
                    </button>
                    <button className="flex items-center gap-1 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">shopping_bag</span> Shop
                    </button>
                </div>

                {/* Popular in Boac */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular in Boac</h2>
                    <button className="text-teal-700 dark:text-teal-400 text-sm font-semibold">See all</button>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {/* Card 1 */}
                    <Link href="/business/casa-de-don-emilio" className="block border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative hover:shadow-md transition-shadow">
                        <div className="absolute top-3 left-3 bg-teal-700 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10">
                            <span className="material-symbols-outlined text-[14px]">verified</span> VERIFIED
                        </div>
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                            <div className="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                <span className="text-amber-400 material-symbols-outlined text-[14px] font-variation-settings-fill">star</span> 4.8
                            </div>
                            <AdminActions contentType="business" contentId="casa-de-don-emilio" />
                        </div>
                        <div className="h-40 bg-slate-200 relative">
                            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop" alt="Casa de Don Emilio" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-800 relative">
                            <button className="absolute -top-5 right-4 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center text-teal-700 dark:text-teal-400">
                                <span className="material-symbols-outlined font-variation-settings-fill">favorite</span>
                            </button>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Casa de Don Emilio</h3>
                            <p className="text-slate-500 text-sm flex items-center gap-1 mb-3">
                                <span className="material-symbols-outlined text-[16px]">location_on</span> Boac, Marinduque
                            </p>
                            <div className="flex gap-2">
                                <span className="bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Filipino</span>
                                <span className="bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Cafe</span>
                                <span className="bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">$$</span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/business/balar-hotel-and-spa" className="block p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl flex gap-4 shadow-sm relative bg-white dark:bg-zinc-800 hover:shadow-md transition-shadow">
                        <button className="absolute top-4 right-4 text-slate-300 dark:text-slate-600">
                            <span className="material-symbols-outlined font-variation-settings-fill">favorite</span>
                        </button>
                        <div className="w-24 h-24 bg-slate-200 flex-shrink-0 rounded-xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop" alt="Balar Hotel and Spa" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 text-[10px] font-bold mb-1 uppercase">
                                <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-bold text-slate-900 dark:text-white">Balar Hotel and Spa</h3>
                                <AdminActions contentType="business" contentId="balar-hotel-and-spa" />
                            </div>
                            <p className="text-slate-500 text-xs mb-2">Boac • Hotel & Resort</p>
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                                <span className="text-amber-400 material-symbols-outlined text-[16px] font-variation-settings-fill">star</span> 4.9
                                <span className="text-slate-400 font-normal text-xs ml-1">(128 reviews)</span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3 */}
                    <Link href="/business/rejanos-bakery" className="block p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl flex gap-4 shadow-sm relative bg-white dark:bg-zinc-800 hover:shadow-md transition-shadow">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <button className="text-slate-300 dark:text-slate-600">
                                <span className="material-symbols-outlined font-variation-settings-fill">favorite</span>
                            </button>
                            <AdminActions contentType="business" contentId="rejanos-bakery" />
                        </div>
                        <div className="w-24 h-24 bg-slate-200 flex-shrink-0 rounded-xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=200&h=200&fit=crop" alt="Rejano&apos;s Bakery" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Rejano&apos;s Bakery</h3>
                            <p className="text-slate-500 text-xs mb-2">Sta. Cruz • Paslubong</p>
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-amber-400 material-symbols-outlined text-[16px] font-variation-settings-fill">star</span> 4.7
                                <span className="text-slate-400 font-normal text-xs ml-1">(85 reviews)</span>
                            </div>
                            <div>
                                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[10px] px-2 py-0.5 rounded">Open Now</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Add Business FAB */}
            <Link href="/create-business-profile-step1" className="fixed right-4 bottom-20 z-40 bg-teal-700 hover:bg-teal-600 text-white rounded-full size-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[28px]">add</span>
            </Link>
        </div>
    );
}

