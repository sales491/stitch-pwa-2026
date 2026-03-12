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
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 px-4 pt-10 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <Link href="/my-barangay/lost-found" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Lost &amp; Found
                </Link>
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
