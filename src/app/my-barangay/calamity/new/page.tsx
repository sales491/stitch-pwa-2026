import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateCalamityForm from '@/components/CreateCalamityForm';

export const metadata = { title: 'Post Calamity Alert — Marinduque Market Hub' };

export default async function NewCalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/my-barangay/calamity/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <Link href="/my-barangay/calamity" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Calamity Board
                </Link>
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
