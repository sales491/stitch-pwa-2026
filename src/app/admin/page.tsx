import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch the latest platform activity concurrently for speed
    const [
        { data: newUsers },
        { data: newBusinesses },
        { data: newListings }
    ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url, role, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('business_profiles').select('id, business_name, is_verified, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('listings').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(6)
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            {/* Dashboard Executive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Activity Intelligence</h1>
                    <p className="text-slate-500 font-bold max-w-lg leading-relaxed">Real-time surveillance across the Marinduque Hub ecosystem. Reviewing newest users, local enterprise claims, and marketplace liquidity.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl min-w-[140px] shadow-2xl">
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1">Global Users</span>
                        <span className="text-2xl font-black text-white tracking-tight">Active</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl min-w-[140px] shadow-2xl">
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1">Server Latency</span>
                        <span className="text-2xl font-black text-green-400 tracking-tight">Optimized</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMN 1: User Intelligence */}
                <section className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-400">Identity Registry</h3>
                        <span className="material-symbols-outlined text-slate-700">group_add</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {newUsers?.map(user => (
                            <div key={user.id} className="flex items-center justify-between bg-slate-950/50 border border-slate-800/50 p-4 rounded-2xl transition-all hover:bg-slate-800 group/item cursor-default">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden relative border border-slate-700 shadow-lg">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs font-black text-slate-500">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-slate-200 group-hover/item:text-white transition-colors truncate">{user.full_name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Joined today</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-moriones-red/20 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/users" className="mt-8 block text-center py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                        Manage Full Registry
                    </Link>
                </section>

                {/* COLUMN 2: Enterprise Growth */}
                <section className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-green-400">Enterprise Intake</h3>
                        <span className="material-symbols-outlined text-slate-700">storefront</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {newBusinesses?.map(biz => (
                            <div key={biz.id} className="flex justify-between items-center bg-slate-950/50 border border-slate-800/50 p-4 rounded-2xl transition-all hover:bg-slate-800 group/item">
                                <div className="truncate flex-1">
                                    <Link href={`/directory/${biz.id}`} target="_blank" className="text-sm font-black text-slate-200 group-hover/item:text-green-400 transition-colors block truncate">
                                        {biz.business_name}
                                    </Link>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Application Pending</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {biz.is_verified ? (
                                        <span className="material-symbols-outlined text-green-500 text-lg">verified</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-700 text-lg">hourglass_empty</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/moderation?type=business" className="mt-8 block text-center py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                        Review Business Profiles
                    </Link>
                </section>

                {/* COLUMN 3: Market Liquidity */}
                <section className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-amber-400">Market Surveillance</h3>
                        <span className="material-symbols-outlined text-slate-700">inventory_2</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {newListings?.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-950/50 border border-slate-800/50 p-4 rounded-2xl transition-all hover:bg-slate-800 group/item">
                                <div className="truncate flex-1">
                                    <Link href={`/marketplace/${item.id}`} target="_blank" className="text-sm font-black text-slate-200 group-hover/item:text-amber-400 transition-colors block truncate">
                                        {item.title}
                                    </Link>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live</p>
                                </div>
                                <div className="block">
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-slate-600'} shadow-[0_0_10px_rgba(34,197,94,0.4)]`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/moderation?type=marketplace" className="mt-8 block text-center py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                        Moderate Marketplace
                    </Link>
                </section>

            </div>
        </div>
    );
}
