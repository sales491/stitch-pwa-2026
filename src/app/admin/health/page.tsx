import Link from 'next/link';
import DbHealthWidget from '@/components/DbHealthWidget';

export const dynamic = 'force-dynamic';

export default function AdminHealthPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 space-y-8 font-display">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Admin Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                        Database Health
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2 max-w-md leading-relaxed">
                        Real-time storage monitoring against your 500MB Supabase free-tier limit.
                        Auto-refreshes every 30 seconds.
                    </p>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live</span>
                </div>
            </div>

            {/* Full widget */}
            <DbHealthWidget variant="full" refreshInterval={3600} />

            {/* Footer note */}
            <p className="text-[11px] text-slate-400 font-medium text-center pb-4">
                Data sourced from{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">pg_stat_user_tables</code>
                {' '}and{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">pg_database_size()</code>.
                Row counts are approximate estimates (live tuples). This page is not publicly linked.
            </p>
        </div>
    );
}
