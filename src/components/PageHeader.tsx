'use client';

import BackButton from './BackButton';

/**
 * Standardized page sub-header used on every sub-page.
 * Renders a compact sticky bar with BackButton + title + optional right-side controls.
 *
 * Simple usage:
 *   <PageHeader title="About Us" subtitle="Marinduque Market Hub" />
 *   <PageHeader title="Full Calendar" rightAction={<MonthNav />} />
 *
 * Complex usage (search / filters / tabs below title row):
 *   <PageHeader title="Marinduque Jobs" subtitle="Find Careers">
 *     <SearchBar />
 *     <FilterChips />
 *   </PageHeader>
 */
export default function PageHeader({
    title,
    subtitle,
    emoji,
    rightAction,
    children,
}: {
    title: string;
    subtitle?: string;
    emoji?: string;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <header className="sticky top-0 z-30 flex flex-col bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03]">
            <div className="flex items-center gap-3 px-4 py-2.5">
                <BackButton />
                <div className="flex-1 min-w-0">
                    <h1 className="text-base font-black leading-tight tracking-tight text-moriones-red truncate">
                        {emoji && <span className="mr-1">{emoji}</span>}
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
                {rightAction && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {rightAction}
                    </div>
                )}
            </div>
            {children}
        </header>
    );
}
