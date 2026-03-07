import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // 1. Check if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 2. The Ultimate Security Check: Are they an admin or mod?
    // We check BOTH the database profile role AND our hardcoded emergency list.
    const [{ data: profile }, { isAdmin, isModerator }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        import('@/utils/roles')
    ]);

    const hasAccess = (profile?.role === 'admin' || profile?.role === 'moderator') ||
        (isAdmin(user.email) || isModerator(user.email));

    if (!hasAccess) {
        redirect('/'); // Kick normal users back to the home page silently
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 z-[100] relative font-display">

            {/* Admin Sidebar */}
            <aside className="w-full md:w-72 bg-slate-900 border-b md:border-r border-slate-800 p-6 flex flex-col gap-2 shadow-2xl">
                <div className="mb-10 px-2">
                    <h2 className="text-2xl font-black text-moriones-red tracking-tighter flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl">terminal</span>
                        God Mode
                    </h2>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.3em] mt-2">Executive Control</p>
                </div>

                <p className="px-3 text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-black">Main Intelligence</p>

                <nav className="flex flex-col gap-1">
                    <Link href="/admin" className="group flex items-center gap-3 p-4 hover:bg-slate-800 rounded-2xl font-bold transition-all border border-transparent hover:border-slate-700/50">
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-blue-400 transition-colors">dashboard</span>
                        Activity Hub
                    </Link>
                    <Link href="/admin/users" className="group flex items-center gap-3 p-4 hover:bg-slate-800 rounded-2xl font-bold transition-all border border-transparent hover:border-slate-700/50">
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-green-400 transition-colors">group</span>
                        User Authority
                    </Link>
                    <Link href="/admin/moderation" className="group flex items-center gap-3 p-4 hover:bg-slate-800 rounded-2xl font-bold transition-all border border-transparent hover:border-slate-700/50">
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-amber-400 transition-colors">gavel</span>
                        Content Review
                    </Link>
                </nav>

                <div className="flex-grow"></div>

                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-3xl mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Systems Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-300">Live & Synchronized</span>
                    </div>
                </div>

                <Link href="/" className="flex items-center justify-center gap-2 p-5 bg-moriones-red text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-red-700 active:scale-95 shadow-xl shadow-red-950/20">
                    <span className="material-symbols-outlined text-sm">exit_to_app</span>
                    Exit Control Room
                </Link>
            </aside>

            {/* Admin Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                {children}
            </main>

        </div>
    );
}
