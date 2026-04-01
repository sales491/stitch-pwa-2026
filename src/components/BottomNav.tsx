'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNotifications } from './NotificationProvider';

const navItems = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Market', href: '/marketplace', icon: 'storefront' },
    { label: 'Businesses', href: '/directory', icon: 'business' },
    { label: 'Commute', href: '/commute', icon: 'directions_car' },
    { label: 'Community', href: '/community', icon: 'groups' },
    { label: 'Account', href: '/profile', icon: 'person' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { unreadCount } = useNotifications();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <div className="mx-3 mb-3 bg-white/85 dark:bg-zinc-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 shadow-2xl shadow-black/15 rounded-3xl flex justify-between items-center px-2 py-2 pointer-events-auto ring-1 ring-black/[0.04] dark:ring-white/[0.04]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    const isAccount = item.label === 'Account';

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-200 relative group py-1 rounded-2xl ${
                                isActive
                                    ? 'text-moriones-red'
                                    : 'text-slate-500 dark:text-zinc-400 hover:text-moriones-red'
                            }`}
                        >
                            {/* Active pill background */}
                            {isActive && (
                                <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-2xl" />
                            )}

                            <div className="relative z-10">
                                <span
                                    className={`material-symbols-outlined text-[26px] transition-transform duration-200 ${
                                        isActive ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'
                                    }`}
                                    style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                                >
                                    {item.icon}
                                </span>
                                {isAccount && unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[9px] relative z-10 leading-tight transition-all duration-200 ${
                                isActive ? 'font-black' : 'font-semibold opacity-80 group-hover:opacity-100'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
