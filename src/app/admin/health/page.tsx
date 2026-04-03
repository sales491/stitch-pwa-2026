import DbHealthWidget from '@/components/DbHealthWidget';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default function AdminHealthPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 space-y-8 font-display">

            <PageHeader title="System Health" subtitle="Server & Database" rightAction={
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live</span>
                </div>
            } />

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
