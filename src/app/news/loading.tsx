export default function NewsLoading() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-12 animate-pulse">
            <div className="mb-8">
                <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                <div className="h-4 w-96 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden h-80">
                        <div className="h-48 w-full bg-slate-200 dark:bg-zinc-800"></div>
                        <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                                <div className="h-6 w-full bg-slate-200 dark:bg-zinc-800 rounded mb-2"></div>
                                <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
                            </div>
                            <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
