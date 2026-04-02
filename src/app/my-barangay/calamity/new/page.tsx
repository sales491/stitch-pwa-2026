'use client';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateCalamityForm from '@/components/CreateCalamityForm';
import BackButton from '@/components/BackButton';

export const metadata = { title: 'Post Calamity Alert — Marinduque Market Hub' };

export default async function NewCalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/my-barangay/calamity/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">Post an Alert</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Calamity Board</p>
                </div>
            </header>
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="flex items-center gap-3">
                    <span className="text-3xl">📢</span>
                    <div>
                        <h1 className="text-xl font-black text-white">Post an Alert</h1>
                        <p className="text-rose-200 text-xs font-medium">Help your community stay safe</p>
                    </div>
                </div>
            </div>
            <CreateCalamityForm />
        </main>
    );
}
