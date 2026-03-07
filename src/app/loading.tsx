export default function Loading() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-white dark:bg-zinc-900 transition-colors duration-500">
            <div className="relative flex flex-col items-center">
                {/* Premium Pulse Animation */}
                <div className="relative flex h-24 w-24 items-center justify-center">
                    <div className="absolute h-full w-full rounded-full border-4 border-slate-100 dark:border-zinc-800" />
                    <div className="absolute h-full w-full rounded-full border-4 border-primary border-t-transparent animate-spin" />

                    {/* Inner Logo/Icon Placeholder */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 animate-pulse">
                        <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="mt-8 flex flex-col items-center gap-1">
                    <span className="text-sm font-bold tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">
                        Marinduque <span className="text-primary italic">Connect</span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1 w-1 rounded-full bg-primary animate-[bounce_1s_infinite_100ms]" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-[bounce_1s_infinite_200ms]" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-[bounce_1s_infinite_300ms]" />
                    </div>
                </div>
            </div>

            {/* Subtle Bottom Content */}
            <div className="absolute bottom-12 text-[10px] font-medium text-slate-400 dark:text-zinc-600 uppercase tracking-widest animate-pulse">
                Optimizing Experience
            </div>
        </div>
    );
}
