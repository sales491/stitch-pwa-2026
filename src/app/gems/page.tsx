import { createClient } from '@/utils/supabase/server';
import GemCard from '@/components/GemCard';
import Link from 'next/link';

export default async function GemsFeed() {
    const supabase = await createClient();

    const { data: gems, error } = await supabase
        .from('gems')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return <div className="p-8 text-moriones-red font-black text-center">Connection Error: Geographic intelligence systems offline.</div>;

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24 mx-auto max-w-md shadow-2xl overflow-x-hidden">

            {/* Premium Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-zinc-700 hover:scale-105 active:scale-95 transition-all">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black tracking-tight text-moriones-red leading-none">Local Gems</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Intelligence Feed</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-5 py-8">
                {/* Intro Section */}
                <section className="mb-8 px-1">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Marinduque's<br /><span className="text-moriones-red">hidden sanctuaries</span></h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Discover historical vistas and secret sanctuaries recorded by the community.</p>
                </section>

                <div className="flex flex-col gap-6">
                    {gems?.map((gem) => (
                        <GemCard
                            key={gem.id}
                            id={gem.id}
                            title={gem.title}
                            town={gem.town}
                            imageUrl={gem.images?.[0] || ''}
                            authorId={gem.author_id}
                        />
                    ))}

                    {gems?.length === 0 && (
                        <div className="py-20 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center px-6">
                            <div className="size-20 bg-moriones-red/5 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-moriones-red/40">landscape</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Geographic Data Empty</h3>
                            <p className="text-slate-500 font-bold max-w-xs text-xs leading-relaxed">The island's hidden treasures await registration. Be the first explorer to record a sanctuary.</p>
                            <Link href="/gems/create" className="mt-8 bg-moriones-red text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-moriones-red/20 active:scale-95 transition-all">
                                Initialize Discovery
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Action FAB */}
            <Link
                href="/gems/create"
                className="fixed bottom-24 right-6 size-14 bg-moriones-red text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-moriones-red/40 hover:scale-110 active:scale-95 transition-all z-50 border-4 border-white dark:border-zinc-950"
            >
                <span className="material-symbols-outlined text-[28px] font-black">add_location</span>
            </Link>
        </div>
    );
}
