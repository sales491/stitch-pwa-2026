import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { TOWNS } from '@/data/towns';

export const metadata: Metadata = {
    title: 'The Six Towns of Marinduque | Total Histories',
    description: 'Explore the deep dive biographies of Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista. Discover the Soul, Body, and Skeleton of Marinduque.',
};

export default function TownsIndexPage() {
    const townsList = Object.values(TOWNS);

    return (
        <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
            <PageHeader 
                title="The Six Towns" 
                subtitle="Deep Dive Biographies" 
            />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        Explore the Island
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        Dive into the &quot;Total History&quot; of Marinduque. Discover the mythic origins, modern economies, and visionary futures of all six municipalities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {townsList.map((town) => (
                        <Link 
                            key={town.slug} 
                            href={`/towns/${town.slug}`}
                            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-zinc-800 hover:border-moriones-red hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative flex flex-col h-full"
                        >
                            {town.image_url && (
                                <div className="w-full h-48 rounded-[1.5rem] overflow-hidden mb-6 bg-slate-100 dark:bg-zinc-800 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                                    <img 
                                        src={town.image_url} 
                                        alt={town.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                        <span className="material-symbols-outlined text-white text-sm">{town.icon}</span>
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">{town.name}</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex-1 flex flex-col">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-moriones-red transition-colors">
                                    {town.name}
                                </h2>
                                <h3 className="text-sm font-bold text-moriones-red uppercase tracking-widest mb-3">
                                    {town.tagline}
                                </h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                                    {town.description}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                        Read Biography
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-moriones-red group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
