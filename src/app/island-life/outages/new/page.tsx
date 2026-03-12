import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateOutageForm from '@/components/CreateOutageForm';

export const metadata = { title: 'Report Outage — Marinduque Market Hub' };

export default async function NewOutagePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/island-life/outages/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <Link href="/island-life/outages" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Outage Reports
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">📝</span>
                    <div>
                        <h1 className="text-xl font-black text-white">Report an Outage</h1>
                        <p className="text-yellow-100 text-xs font-medium">Help your community stay informed</p>
                    </div>
                </div>
            </div>
            <CreateOutageForm />
        </main>
    );
}
