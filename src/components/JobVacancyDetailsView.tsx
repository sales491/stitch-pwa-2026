'use client';

import React from 'react';
import AdminActions from './AdminActions';
import { Job } from '@/data/jobs';
import BackButton from '@/components/BackButton';

interface JobVacancyDetailsViewProps {
  job?: Job;
}

export default function JobVacancyDetailsView({ job }: JobVacancyDetailsViewProps) {
  // Use provided job or a default fallback (original data)
  const displayJob = job || {
    title: 'Senior Farm Manager',
    company: 'Marinduque Agriculture Corp.',
    location: 'Boac',
    type: 'Full-time' as const,
    salary: '₱25k - ₱30k',
    postedAgo: '2 days ago',
    description: 'We are looking for an experienced Farm Manager to oversee our copra production in Boac. You will be responsible for daily operations, staff management, and ensuring quality yield. \n\nThe ideal candidate has a deep understanding of local agricultural practices and can lead a team of 15-20 field workers. You will report directly to the Operations Head.',
    requirements: [
      'At least 3 years of experience in farm management or related field.',
      'Must reside within Marinduque or willing to relocate to Boac.',
      'Knowledgeable in sustainable farming techniques and copra processing.',
      'High school diploma required; Degree in Agriculture is a plus.'
    ],
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGX3uQChroCrDF5znsSomw8_ZX8AlCiK3jsbIy8jXKwnRZ4_JLSGO9g_vU1hdoW96T7d47rbu4k0O1IR2dbLX6SXLg2Swhb8VKFyqgE60CTbTwsZkDMfgtNSaCwzecX6WMn2dDx81fMUsVZe0GfFdnq76r4CnNRU2zhQrLI8UoBkmXj_QqFFl03Bs_ZcA0oe3GP1Cl7eePFX3-bVRz3_C4sUF-rjpJ73sULOCRwASQZdKGWwW-96DuzZXMzHXsT00AwB-zugw4jo',
    icon: 'storefront',
    isVerified: true,
    isClosed: false,
    id: 'default-job',
    contact: {
      phone: '+63 945 678 9012',
      email: 'recruitment@marinduqueagri.com',
      fb: 'Marinduque Agriculture Corp'
    }
  };

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-neutral-surface/90 dark:bg-neutral-surface-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark shadow-sm">
          <BackButton />
          <h2 className="text-lg font-bold text-center flex-1 truncate px-2">Job Details</h2>
          <div className="flex items-center gap-2">
            <AdminActions contentType="job" contentId={displayJob.id} variant="button" />
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-text-main-dark">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full max-w-lg mx-auto pb-44"> {/* Increased padding for sticky footer and BottomNav */}
          {/* Hero Section */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Company Logo / Icon */}
              <div className="relative w-24 h-24 rounded-2xl shadow-md overflow-hidden bg-white dark:bg-neutral-surface-dark border border-border-light dark:border-border-dark p-1 flex items-center justify-center">
                {displayJob.logo ? (
                  <img alt={`Logo for ${displayJob.company}`} className="w-full h-full object-cover rounded-xl" src={displayJob.logo} />
                ) : (
                  <div className={`w-full h-full rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400`}>
                    <span className="material-symbols-outlined text-[48px]">{displayJob.icon || 'storefront'}</span>
                  </div>
                )}
              </div>
              {/* Job Title & Company */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark leading-tight">{displayJob.title}</h1>
                <div className="flex items-center justify-center gap-1.5 text-text-sub dark:text-text-sub-dark font-medium text-sm">
                  <span>{displayJob.company}</span>
                  <span className="w-1 h-1 rounded-full bg-text-sub dark:bg-text-sub-dark opacity-50" />
                  <span>{displayJob.location}</span>
                </div>
                {/* Verified Badge */}
                {displayJob.isVerified && (
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800/30">
                    <span className="material-symbols-outlined text-[16px] fill-1" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                    <span>Verified Employer</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-5 py-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Job Type */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-surface dark:bg-neutral-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-2 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[20px]">work</span>
                </div>
                <span className="text-xs text-text-sub dark:text-text-sub-dark font-medium">Type</span>
                <span className="text-[11px] font-bold text-text-main dark:text-text-main-dark mt-0.5 truncate w-full text-center">{displayJob.type}</span>
              </div>
              {/* Salary */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-surface dark:bg-neutral-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-2 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <span className="text-xs text-text-sub dark:text-text-sub-dark font-medium">Salary</span>
                <span className="text-[11px] font-bold text-text-main dark:text-text-main-dark mt-0.5 truncate w-full text-center">{displayJob.salary}</span>
              </div>
              {/* Posted */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-surface dark:bg-neutral-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-2 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <span className="text-xs text-text-sub dark:text-text-sub-dark font-medium">Posted</span>
                <span className="text-[11px] font-bold text-text-main dark:text-text-main-dark mt-0.5 truncate w-full text-center">{displayJob.postedAgo}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-2 bg-background-light dark:bg-background-dark border-t border-b border-border-light dark:border-border-dark my-2" />

          {/* Description Section */}
          <div className="px-5 py-6">
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Job Description
            </h3>
            <div className="text-text-sub dark:text-text-sub-dark leading-relaxed text-sm space-y-4 whitespace-pre-wrap">
              {displayJob.description}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="px-5 pb-6">
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Requirements
            </h3>
            <ul className="space-y-3">
              {displayJob.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-[20px] mt-0.5 shrink-0">check_circle</span>
                  <span className="text-text-sub dark:text-text-sub-dark text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Map Preview */}
          <div className="px-5 pb-8">
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Location
            </h3>
            <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark group cursor-pointer">
              <div className="absolute inset-0 bg-neutral-surface-dark/10 group-hover:bg-neutral-surface-dark/5 transition-colors z-10" />
              {/* Placeholder for Map */}
              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Boac,Marinduque&zoom=13&size=600x300&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:road|element:geometry|color:0xffffff&style=feature:landscape|element:geometry|color:0xf8f8f5')]" data-alt={`Map showing ${displayJob.location} location`} style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* Map Pin overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-10 h-10 bg-orange-500/90 rounded-full flex items-center justify-center shadow-lg text-white animate-bounce">
                    <span className="material-symbols-outlined text-[24px]">location_on</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 z-20 bg-white/90 dark:bg-black/80 px-3 py-1.5 rounded-lg backdrop-blur-sm text-xs font-semibold shadow-sm">
                {displayJob.location}, Marinduque
              </div>
            </div>
          </div>

          {/* Contact Section */}
          {displayJob.contact && (Object.values(displayJob.contact).some(v => !!v)) && (
            <div className="px-5 pb-8">
              <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full" />
                Contact Information
              </h3>
              <div className="space-y-3">
                {displayJob.contact.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 text-orange-700 dark:text-orange-400">
                    <span className="material-symbols-outlined">call</span>
                    <span className="text-sm font-semibold">{displayJob.contact.phone}</span>
                  </div>
                )}
                {displayJob.contact.email && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-blue-700 dark:text-blue-400">
                    <span className="material-symbols-outlined">mail</span>
                    <span className="text-sm font-semibold">{displayJob.contact.email}</span>
                  </div>
                )}
                {displayJob.contact.fb && (
                  <div className="space-y-2">
                    <a
                      href={`https://m.me/${displayJob.contact.fb.replace(/\s+/g, '').replace(/https?:\/\/(www\.)?facebook\.com\//i, '').replace(/https?:\/\/m\.me\//i, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">Messenger</p>
                        <p className="text-sm font-semibold">m.me/{displayJob.contact.fb}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] ml-auto opacity-60">open_in_new</span>
                    </a>
                    <a
                      href={`https://facebook.com/${displayJob.contact.fb.replace(/\s+/g, '').replace(/https?:\/\/(www\.)?facebook\.com\//i, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.525 8H14V6c0-1.03.838-1.608 2-1.608h1.975V1.1c-.341-.047-1.536-.1-2.932-.1C12.024 1 10 2.8 10 5.748V8H7v3h3v9h4v-9h2.525L17.525 8z" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">Facebook Page</p>
                        <p className="text-sm font-semibold">facebook.com/{displayJob.contact.fb}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] ml-auto opacity-60">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Sticky Apply Button - Adjusted for Bottom Navigation */}
        {!displayJob.isClosed && (
          <div className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 z-40 transition-all">
            <button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Apply Now
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
