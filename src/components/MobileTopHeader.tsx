'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useNotifications } from './NotificationProvider';
import ThemeToggle from './ThemeToggle';

const CATEGORIES = [
    { label: 'Best of Boac', icon: '🏆', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400', href: '/best-of-boac-monthly-spotlight' },
    { label: 'Delivery & Commuting Services', icon: '🛵', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', href: '/commuter-delivery-hub' },
    { label: 'Events', icon: '📅', color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400', href: '/marinduque-events-calendar' },
    { label: 'Foreigner', icon: '🌏', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', href: '/the-hidden-foreigner-blog-feed' },
    { label: 'Jobs', icon: '💼', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400', href: '/marinduque-jobs-listing-feed' },
    { label: 'Marinduque Gems', icon: '💎', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', href: '/gems-of-marinduque-feed' },
    { label: 'Marketplace', icon: '🛒', color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400', href: '/marinduque-classifieds-marketplace' },
    { label: 'RoRo and Port', icon: '🚢', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', href: '/roro-port-information-hub' },
];

export default function MobileTopHeader() {
    const { profile } = useAuth();
    const { unreadCount } = useNotifications();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'PH')}&background=f2d00d&color=000`;
    const avatarUrl = profile?.avatar_url || fallbackUrl;

    return (
        <>
            <header className="flex flex-col bg-white dark:bg-[#0F0F10] transition-colors duration-300 z-50 overflow-hidden">
                {/* Top Section: Logo & Actions */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    {/* Left: Custom SVG Logo & Stacked Text */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="text-moriones-red flex items-center justify-center">
                            {/* High-resolution transparent image logo */}
                            <img
                                src="/markethub-logo.png"
                                alt="Marinduque Market Hub"
                                className="w-10 h-10 object-contain drop-shadow-sm brightness-110 saturate-125 transition-all"
                            />
                        </div>
                        <div className="flex flex-col leading-none ml-1">
                            <span className="font-black text-[19px] text-[#C62828] dark:text-[#F44336] tracking-tighter mb-0.5">Marinduque</span>
                            <span className="font-black text-[19px] text-[#C62828] dark:text-[#F44336] tracking-tighter">Market Hub</span>
                        </div>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center text-slate-800 dark:text-white/90">
                            <span className="material-symbols-outlined text-[24px]" style={{ fontWeight: 300 }}>search</span>
                        </button>

                        <div className="flex items-center justify-center -ml-1">
                            <ThemeToggle />
                        </div>

                        <Link href="/user-profile-dashboard1" className="ml-1 relative flex items-center justify-center">
                            {/* Profile image with matching colored border from mockup */}
                            <div className="h-8 w-8 rounded-full overflow-hidden border-[1.5px] border-slate-200 dark:border-white/20 shadow-sm">
                                <img
                                    alt="User Profile"
                                    className="h-full w-full object-cover"
                                    src={avatarUrl}
                                />
                            </div>
                            {/* Red dot placed precisely on the top right, half outside the profile */}
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4F4F] border-[2px] border-white dark:border-[#0F0F10] rounded-full animate-pulse shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                            )}
                        </Link>
                    </div>
                </div>

                {/* Bottom Section: Sub-navigation */}
                <div className="flex items-center gap-8 px-5 pb-3 pt-1 border-b border-gray-100 dark:border-white/[0.03]">
                    <Link href="/" className="text-[15px] font-bold text-slate-900 dark:text-white pb-1 border-b-2 border-transparent hover:border-slate-900 dark:hover:border-white transition-all">
                        Home
                    </Link>
                    <Link href="/marinduque-classifieds-marketplace" className="text-[15px] font-medium text-slate-400 dark:text-white/40 pb-1 hover:text-slate-600 dark:hover:text-white/80 transition-colors">
                        Buy/Sell
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="text-[15px] font-medium text-slate-400 dark:text-white/40 pb-1 hover:text-slate-600 dark:hover:text-white/80 transition-colors"
                    >
                        Categories
                    </button>
                </div>
            </header>

            {/* Categories Slide-Over Menu overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    <div
                        className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="absolute right-4 top-14 w-[240px] max-w-[85vw] bg-white dark:bg-[#1A1A1A] shadow-2xl flex flex-col rounded-[2rem] border border-gray-100/50 dark:border-white/[0.05] animate-slide-in-right overflow-hidden ring-1 ring-black/[0.05] dark:ring-white/[0.05] h-fit">
                        <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-100 dark:border-white/[0.05] bg-white/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md z-10">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white">Categories</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>

                        <div className="p-1 space-y-0 no-scrollbar bg-white dark:bg-[#1A1A1A]">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group active:scale-[0.98]"
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[15px] ${cat.color} group-hover:scale-110 transition-transform shadow-sm flex-shrink-0`}>
                                        {cat.icon}
                                    </div>
                                    <span className="font-bold text-[11px] text-slate-800 dark:text-white/90 group-hover:text-moriones-red transition-colors flex-1 truncate uppercase tracking-tighter">
                                        {cat.label}
                                    </span>
                                    <span className="material-symbols-outlined text-[15px] text-slate-300 dark:text-white/20 group-hover:text-moriones-red transition-colors">
                                        chevron_right
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
