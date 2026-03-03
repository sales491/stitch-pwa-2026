'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Home', href: '/marinduque-connect-home-feed', icon: 'home' },
    { label: 'Market', href: '/marinduque-classifieds-marketplace', icon: 'storefront' },
    { label: 'Community', href: '/community-board-commuter-hub', icon: 'groups' },
    { label: 'Commute', href: '/commuter-delivery-hub', icon: 'directions_car' },
    { label: 'Profile', href: '/user-profile-dashboard1', icon: 'person' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)] max-w-md mx-auto">
            <div className="flex justify-between items-center px-4 pt-2 pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/marinduque-connect-home-feed' && pathname === '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-moriones-red hover:opacity-80'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-[24px]"
                                style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                            >
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
