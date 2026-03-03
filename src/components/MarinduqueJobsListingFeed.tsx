import React from 'react';
import Link from 'next/link';
import AdminActions from './AdminActions';
import { JOBS } from '@/data/jobs';

export default function MarinduqueJobsListingFeed() {
  const featuredJob = JOBS.find(j => j.isFeatured);
  const otherJobs = JOBS.filter(j => !j.isFeatured);

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-surface dark:bg-neutral-surface-dark px-4 pt-12 pb-2 shadow-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/marinduque-connect-home-feed" className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-slate-800 dark:text-slate-200">arrow_back</span>
              </Link>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Marinduque Jobs</h1>
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" />
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </div>
            <input className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 dark:text-white dark:placeholder-gray-400 shadow-sm" placeholder="Search jobs (e.g. Sales, Driver, IT)..." type="text" />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="material-symbols-outlined text-gray-400">tune</span>
            </button>
          </div>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-1.5 text-xs font-medium text-white dark:text-slate-900 shadow-sm">
              All Jobs
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
              Boac
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
              Gasan
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
              Full-time
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
              Part-time
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
              Remote
            </button>
          </div>
        </header>

        {/* Main Feed */}
        <main className="flex-1 px-4 py-4 space-y-4 pb-24">
          {/* Featured Card */}
          {featuredJob && (
            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-accent-teal/10 p-0.5 shadow-sm">
              <div className="rounded-2xl bg-neutral-surface dark:bg-neutral-surface-dark p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                        Featured
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{featuredJob.postedAgo}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <Link href={`/job/${featuredJob.slug}`} className="hover:underline">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{featuredJob.title}</h3>
                      </Link>
                      <AdminActions contentType="job" contentId={featuredJob.id} className="-mt-1" />
                    </div>
                    <p className="text-sm font-medium text-accent-teal dark:text-teal-400 mb-2">{featuredJob.company}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                        {featuredJob.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {featuredJob.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {featuredJob.type}
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {featuredJob.logo ? (
                      <img src={featuredJob.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">{featuredJob.icon || 'storefront'}</span>
                    )}
                  </div>
                </div>
                <Link href={`/job/${featuredJob.slug}`} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                  Apply Now
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </Link>
              </div>
            </div>
          )}

          {/* Job Cards */}
          {otherJobs.map((job) => (
            <div key={job.id} className={`rounded-2xl bg-neutral-surface dark:bg-neutral-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800 ${job.isClosed ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between gap-4 text-left">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {job.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[10px]">verified</span> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                        New
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">{job.postedAgo}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <Link href={`/job/${job.slug}`} className="hover:underline">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-1">{job.title}</h3>
                    </Link>
                    <AdminActions contentType="job" contentId={job.id} className="-mt-1" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{job.company} • {job.location}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      {job.type}
                    </span>
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${job.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                  job.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                    job.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                      'bg-gray-50 dark:bg-gray-800 text-gray-400'
                  }`}>
                  <span className="material-symbols-outlined">{job.icon || 'work'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {job.isClosed ? (
                  <button className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed" disabled>
                    Application Closed
                  </button>
                ) : (
                  <>
                    <Link href={`/job/${job.slug}`} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center">
                      Details
                    </Link>
                    <button className="flex-1 rounded-lg bg-slate-900 dark:bg-white py-2 text-xs font-medium text-white dark:text-slate-900 hover:opacity-90 transition-colors">
                      Quick Apply
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </main>
        {/* Post Job FAB */}
        <Link href="/create-new-job-post-screen" className="fixed right-4 bottom-20 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full size-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </Link>
        {/* Safe area spacing for mobile */}
        <div className="h-6 w-full bg-neutral-surface dark:bg-neutral-surface-dark" />
      </div>

    </>
  );
}
