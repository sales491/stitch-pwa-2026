import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function GemDetailsPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: gem, error } = await supabase
        .from('gems')
        .select(`
            *,
            author:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

    if (error || !gem) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <header className="bg-white dark:bg-slate-900 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Link href="/gems" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-900 dark:text-slate-100 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight text-moriones-red dark:text-moriones-red">Gem Details</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="pb-24">
                <div className="w-full relative aspect-square md:aspect-video bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                    <img
                        src={gem.images?.[0] || ''}
                        alt={gem.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="px-4 py-6">
                    <div className="mb-4">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2 flex items-center gap-2">
                            {gem.title}
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>verified</span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                            <span className="text-sm font-bold">{gem.town}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                        {gem.author?.avatar_url ? (
                            <img alt={`Avatar of ${gem.author.full_name}`} className="w-12 h-12 rounded-full object-cover border-2 border-primary" src={gem.author.avatar_url} />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border-2 border-primary">
                                {gem.author?.full_name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Shared By</p>
                            <p className="font-bold text-slate-900 dark:text-white">{gem.author?.full_name || 'Contributor'}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">diamond</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 relative z-10">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            About this Gem
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative z-10">
                            {gem.description}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
