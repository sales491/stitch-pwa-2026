'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useNotifications } from './NotificationProvider';
import { isAdmin, isModerator } from '@/utils/roles';

const mainNav = [
    // Core & Daily Utility
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Marketplace', href: '/marketplace', icon: 'storefront' },
    { label: 'Marinduque News', href: '/news', icon: 'newspaper' },
    { label: 'Community Board', href: '/community', icon: 'groups' },
    { label: 'Events', href: '/events', icon: 'event' },

    // Discover & Travel
    { label: 'Explorer Map', href: '/map', icon: 'map' },
    { label: 'Travel Guides', href: '/guides/manila-to-marinduque', icon: 'explore' },
    { label: 'Island Hopping', href: '/island-hopping', icon: 'sailing' },
    { label: 'Marinduque Gems', href: '/gems', icon: 'diamond' },
    { label: 'Best of Boac', href: '/best-of-boac-monthly-spotlight', icon: 'emoji_events' },

    // Local Services & Tools
    { label: 'Business Directory', href: '/directory', icon: 'business' },
    { label: 'Jobs', href: '/jobs', icon: 'work' },
    { label: 'Delivery & Commuting', href: '/commute', icon: 'directions_car' },
    { label: 'Gas Prices', href: '/island-life/gas-prices', icon: 'local_gas_station' },

    // Support
    { label: 'Policies', href: '/policies', icon: 'gavel' },
    { label: 'Help & FAQ', href: '/faq', icon: 'help' },
];

export default function LeftSidebar() {
    const pathname = usePathname();
    const { profile, user } = useAuth();
    const { unreadCount } = useNotifications();

    const isUserAdmin = profile?.role === 'admin' || isAdmin(user?.email);
    const isUserMod = profile?.role === 'moderator' || isModerator(user?.email);

    return (
        <nav className="p-4 h-full flex flex-col gap-1 overflow-y-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 px-3 py-3 mb-2">
                <div className="w-8 h-8 bg-moriones-red rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>location_city</span>
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">Marinduque</p>
                    <p className="text-[10px] font-bold text-moriones-red uppercase tracking-widest">Market Hub</p>
                </div>
            </Link>

            {/* Nav Items */}
            {mainNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-moriones-red/10 text-moriones-red'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                        >
                            {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                    </Link>
                );
            })}

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Admin / Mod Quick Links — only visible to admins and moderators */}
            {isUserMod && (
                <div className="mb-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 mb-1">Admin</p>
                    {isUserAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                            Admin Dashboard
                        </Link>
                    )}
                    <Link href="/admin/moderation" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                        <span className="material-symbols-outlined text-[18px]">shield_person</span>
                        Moderation
                    </Link>
                    <Link href="/admin/news-approval" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                        <span className="material-symbols-outlined text-[18px]">fact_check</span>
                        News Fact-Checker
                    </Link>
                </div>
            )}

            {/* User Profile */}
            <Link
                href="/profile"
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all"
            >
                {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt={profile.full_name} width={32} height={32} className="rounded-full object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-moriones-red flex items-center justify-center text-white text-xs font-black">
                        {profile?.full_name?.[0] || '?'}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {profile?.full_name || 'Guest User'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {profile ? 'View Profile' : 'Sign in'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-pulse" />
                )}
            </Link>
        </nav>
    );
}
