import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateLostFoundForm from '@/components/CreateLostFoundForm';

export const metadata = {
    title: 'Report Lost or Found — Marinduque Market Hub',
};

export default async function NewLostFoundPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/my-barangay/lost-found/new');
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/my-barangay/lost-found" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">New Report</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Lost & Found</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 px-4 pt-5 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="flex items-center gap-3">
                    <span className="text-3xl">📝</span>
                    <div>
                        <h1 className="text-xl font-black text-white">New Report</h1>
                        <p className="text-rose-200 text-xs font-medium">Fill in the details below</p>
                    </div>
                </div>
            </div>

            <CreateLostFoundForm />
        </main>
    );
}
