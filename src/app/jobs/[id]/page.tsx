import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import Link from 'next/link';
import { use } from 'react';

export default async function JobDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: job, error } = await supabase
        .from('jobs')
        .select('*, employer:profiles(id, full_name, avatar_url, email)')
        .eq('id', id)
        .single();

    if (error || !job) return notFound();

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen">
            {/* 1. High Impact Header */}
            <div className="bg-moriones-red dark:bg-moriones-red/80 h-48 md:h-64 relative overflow-hidden rounded-b-[3rem] shadow-2xl flex items-end">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="p-8 pb-12 w-full max-w-4xl mx-auto flex justify-between items-end gap-6">
                    <div>
                        <Link href="/jobs" className="inline-flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest mb-4 hover:text-white transition-opacity">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Jobs
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">{job.title}</h1>
                        <p className="text-white/80 text-sm md:text-lg font-black uppercase tracking-widest">{job.company_name}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 -translate-y-6 md:-translate-y-10 max-w-4xl mx-auto pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-10">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">📍 {job.location}</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">⏱️ {job.employment_type}</p>
                            </div>
                            {job.salary_range && (
                                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm col-span-2 md:col-span-1">
                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Salary Range</p>
                                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">💰 {job.salary_range}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">description</span>
                                Professional Requirements
                            </h3>
                            <div className="text-slate-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </section>

                        {/* Q&A Board */}
                        <section>
                            <div className="mb-4">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Job Intelligence Q&A</h2>
                                <p className="text-xs font-bold text-slate-500">Inquire about the role or requirements directly below.</p>
                            </div>
                            <UniversalComments entityId={job.id} entityType="job" />
                        </section>
                    </div>

                    {/* Sidebar / CTA Area */}
                    <div className="space-y-6">
                        <div className="sticky top-24">
                            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden mb-6">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full translate-x-4 -translate-y-4"></div>

                                <h4 className="text-lg font-black tracking-tight mb-2">Ready to Apply?</h4>
                                <p className="text-xs text-slate-400 font-bold mb-8 leading-relaxed">Ensure your CV is updated before initiating contact with {job.company_name}.</p>

                                <a
                                    href={`mailto:${job.employer.email}?subject=Job Application: ${job.title}`}
                                    className="block w-full text-center bg-moriones-red text-white font-black py-5 rounded-2xl shadow-xl shadow-moriones-red/20 hover:bg-moriones-red/90 active:scale-95 transition-all text-xs uppercase tracking-widest"
                                >
                                    Apply for this Role
                                </a>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Employer Registry</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-moriones-red">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{job.employer.full_name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Authority</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
