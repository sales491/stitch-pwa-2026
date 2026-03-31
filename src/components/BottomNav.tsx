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
        <nav className="fixed md:absolute bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-full z-50 pb-6 pointer-events-none">
            <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-black/10 flex justify-between items-center px-1.5 pt-2.5 pb-2.5 pointer-events-auto ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    const isAccount = item.label === 'Account';

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${isActive ? 'text-primary' : 'text-slate-600 dark:text-white/65 hover:text-moriones-red'
                                }`}
                        >
                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="absolute -top-1 w-1 h-1 rounded-full bg-primary" />
                            )}

                            <div className="relative">
                                <span
                                    className={`material-symbols-outlined text-[30px] transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-active:scale-95'
                                        }`}
                                    style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                                >
                                    {item.icon}
                                </span>
                                {isAccount && unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight leading-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
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
