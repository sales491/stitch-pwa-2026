'use client';

import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';
import BackButton from '@/components/BackButton';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: job } = await supabase
        .from('jobs')
        .select('title, company_name, description, location, employment_type, created_at, slug')
        .eq('slug', slug)
        .single();

    if (!job) return { title: 'Job Not Found' };

    return {
        title: `${job.title} — ${job.company_name}`,
        description: job.description?.slice(0, 155) ?? `${job.title} at ${job.company_name} in ${job.location}, Marinduque.`,
        openGraph: {
            title: `${job.title} at ${job.company_name}`,
            description: job.description?.slice(0, 155) ?? `Job opportunity in Marinduque.`,
            url: `https://marinduquemarket.com/jobs/${job.slug}`,
            type: 'article',
        },
        alternates: { canonical: `https://marinduquemarket.com/jobs/${job.slug}` },
    };
}


export default async function JobDetail({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: job, error } = await supabase
        .from('jobs')
        .select('*, employer:profiles(id, full_name, avatar_url, email)')
        .eq('slug', slug)
        .single();

    if (error || !job) return notFound();

    const contact = job.contact || {};
    const hasPhone = !!contact.phone;
    const hasEmail = !!contact.email;
    const hasFb = !!contact.fbUsername;
    const hasUrl = !!contact.websiteUrl;

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
            {/* JobPosting JSON-LD for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'JobPosting',
                    title: job.title,
                    description: job.description,
                    datePosted: job.created_at,
                    hiringOrganization: {
                        '@type': 'Organization',
                        name: job.company_name,
                    },
                    jobLocation: {
                        '@type': 'Place',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: job.location,
                            addressRegion: 'MIMAROPA',
                            addressCountry: 'PH',
                        },
                    },
                    employmentType: job.employment_type?.toUpperCase().replace(' ', '_') ?? 'FULL_TIME',
                    ...(job.salary_range && { baseSalary: { '@type': 'MonetaryAmount', currency: 'PHP', value: { '@type': 'QuantitativeValue', description: job.salary_range } } }),
                    applicantLocationRequirements: { '@type': 'Country', name: 'Philippines' },
                }) }}
            />
            {/* High Impact Header */}
            <div className="bg-moriones-red dark:bg-moriones-red/80 h-48 md:h-64 relative overflow-hidden rounded-b-[3rem] shadow-2xl flex items-end">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="p-8 pb-12 w-full max-w-4xl mx-auto flex justify-between items-end gap-6">
                    <div>
                        <BackButton />
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">{job.title}</h1>
                        <p className="text-white/80 text-sm md:text-lg font-black uppercase tracking-widest">{job.company_name}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 -translate-y-6 md:-translate-y-10 max-w-4xl mx-auto pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Content */}
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
                                About this Role
                            </h3>
                            <div className="text-slate-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </section>

                        {/* Q&A Board */}
                        <section>
                            <div className="mb-4">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Job Intelligence Q&A</h2>
                                <p className="text-xs font-bold text-slate-500">Ask about the role or requirements directly below.</p>
                            </div>
                            <UniversalComments entityId={job.id} entityType="job" />
                        </section>
                    </div>

                    {/* Sidebar — Contact card (no Apply button) */}
                    <div className="space-y-6">
                        <div className="sticky top-24">
                            {/* Contact the Employer */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm mb-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact the Employer</p>

                                {!hasPhone && !hasEmail && !hasFb && !hasUrl && (
                                    <p className="text-xs text-slate-400">No contact info provided.</p>
                                )}

                                <div className="space-y-3">
                                    {hasPhone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[16px] text-green-600">call</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                                <div className="flex items-center gap-2">
                                                    <a href={`tel:${formatPhPhoneForLink(contact.phone)}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-green-600 transition-colors">
                                                        {contact.phone}
                                                    </a>
                                                    <a href={`sms:${formatPhPhoneForLink(contact.phone)}`} className="text-[10px] text-blue-500 font-bold hover:underline">SMS</a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {hasEmail && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[16px] text-moriones-red">mail</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                                <a href={`mailto:${contact.email}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-moriones-red transition-colors break-all">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {hasFb && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facebook</p>
                                                <div className="flex items-center gap-2">
                                                    <a href={`https://m.me/${contact.fbUsername}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                                        Messenger
                                                    </a>
                                                    <span className="text-slate-300">·</span>
                                                    <a href={`https://facebook.com/${contact.fbUsername}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                                        Page
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {hasUrl && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[16px] text-violet-600">language</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                                                <a href={contact.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-violet-600 hover:underline flex items-center gap-1">
                                                    Visit Page
                                                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Posted by */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Posted by</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-moriones-red">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{job.employer?.full_name || 'Anonymous'}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employer</p>
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
