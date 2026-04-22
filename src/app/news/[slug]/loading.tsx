import BackButton from '@/components/BackButton';

export default function ArticleLoading() {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 pb-32 md:pb-12 animate-pulse">
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-200 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <BackButton className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md text-white/50" />
            </div>
            <div className="max-w-3xl mx-auto px-5 md:px-0 -mt-24 relative z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-10 border border-slate-100 dark:border-zinc-800 mb-8 min-h-[500px]">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
                    <div className="h-10 w-full bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
                    <div className="h-10 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded mb-8"></div>
                    <div className="h-px w-full bg-slate-100 dark:bg-zinc-800 mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-4/5 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
