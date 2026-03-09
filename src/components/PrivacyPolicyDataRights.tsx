import React from 'react';

export default function PrivacyPolicyDataRights() {
  return (
    <>
      <div>
  {/* Top Navigation Bar */}
  <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 border-b border-neutral-light dark:border-neutral-dark">
    <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark text-text-main dark:text-white transition-colors">
      <span className="material-symbols-outlined text-[24px]">arrow_back</span>
    </button>
    <h2 className="ml-2 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8 text-text-main dark:text-white">Privacy Policy</h2>
  </div>
  {/* Main Content */}
  <main className="flex-1 w-full max-w-md mx-auto pb-8">
    {/* Header Section */}
    <div className="px-5 pt-6 pb-2">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-main dark:text-white mb-3">
        Data Privacy &amp; Rights
      </h1>
      <p className="text-text-sub dark:text-slate-400 text-sm font-normal leading-relaxed">
        Last updated: October 26, 2023. We are committed to protecting your personal data in compliance with the Philippines Data Privacy Act of 2012 (RA 10173).
      </p>
    </div>
    {/* Accordion List */}
    <div className="flex flex-col px-4 pt-4 gap-3">
      {/* Item 1 */}
      <details className="group flex flex-col rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark/30 px-4 transition-all duration-200 open:pb-4" open>
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 list-none outline-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">info</span>
            </div>
            <p className="text-text-main dark:text-white text-sm font-semibold leading-normal">Information We Collect</p>
          </div>
          <span className="material-symbols-outlined text-text-sub dark:text-slate-400 group-open:rotate-180 transition-transform duration-200">expand_more</span>
        </summary>
        <div className="pl-11 pr-2">
          <p className="text-text-sub dark:text-slate-300 text-sm font-normal leading-relaxed">
            We collect basic profile information (name, email) via Google OAuth, location data for marketplace listings, and usage statistics to improve the Marinduque community experience.
          </p>
        </div>
      </details>
      {/* Item 2 */}
      <details className="group flex flex-col rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark/30 px-4 transition-all duration-200 open:pb-4">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 list-none outline-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">data_usage</span>
            </div>
            <p className="text-text-main dark:text-white text-sm font-semibold leading-normal">How We Use Your Data</p>
          </div>
          <span className="material-symbols-outlined text-text-sub dark:text-slate-400 group-open:rotate-180 transition-transform duration-200">expand_more</span>
        </summary>
        <div className="pl-11 pr-2">
          <p className="text-text-sub dark:text-slate-300 text-sm font-normal leading-relaxed">
            Your data is used to facilitate secure transactions, verify user authenticity within the Marinduque network, and provide relevant local recommendations. We do not sell your personal data to third parties.
          </p>
        </div>
      </details>
      {/* Item 3 */}
      <details className="group flex flex-col rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark/30 px-4 transition-all duration-200 open:pb-4">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 list-none outline-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </div>
            <p className="text-text-main dark:text-white text-sm font-semibold leading-normal">Data Sharing &amp; Disclosure</p>
          </div>
          <span className="material-symbols-outlined text-text-sub dark:text-slate-400 group-open:rotate-180 transition-transform duration-200">expand_more</span>
        </summary>
        <div className="pl-11 pr-2">
          <p className="text-text-sub dark:text-slate-300 text-sm font-normal leading-relaxed">
            We may share aggregated, non-personally identifiable information publicly and with our partners. Personal data is only disclosed when required by law or to protect our rights.
          </p>
        </div>
      </details>
      {/* Item 4 */}
      <details className="group flex flex-col rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark/30 px-4 transition-all duration-200 open:pb-4">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 list-none outline-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
            </div>
            <p className="text-text-main dark:text-white text-sm font-semibold leading-normal">Your Rights as a Data Subject</p>
          </div>
          <span className="material-symbols-outlined text-text-sub dark:text-slate-400 group-open:rotate-180 transition-transform duration-200">expand_more</span>
        </summary>
        <div className="pl-11 pr-2">
          <p className="text-text-sub dark:text-slate-300 text-sm font-normal leading-relaxed">
            Under the Data Privacy Act, you have the right to be informed, to object, to access, to rectify, to erase or block, to damages, to data portability, and to file a complaint.
          </p>
        </div>
      </details>
    </div>
    {/* Contact Section */}
    <div className="mt-8 px-5">
      <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Contact Our Data Officer</h3>
      <div className="bg-white dark:bg-neutral-dark/30 rounded-xl p-4 border border-neutral-light dark:border-neutral-dark flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-[24px]">shield_person</span>
        </div>
        <div>
          <p className="text-sm font-bold text-text-main dark:text-white mb-1">Data Protection Officer</p>
          <p className="text-xs text-text-sub dark:text-slate-400 mb-3">For any concerns regarding your privacy rights, please reach out to our dedicated team.</p>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            Contact Support <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
    {/* Extra links */}
    <div className="mt-6 px-5 pb-8 flex justify-center gap-4">
      <a className="text-xs text-text-sub dark:text-slate-500 hover:text-primary" href="/">Terms of Service</a>
      <span className="text-xs text-neutral-light dark:text-neutral-dark">•</span>
      <a className="text-xs text-text-sub dark:text-slate-500 hover:text-primary" href="/">Community Guidelines</a>
    </div>
  </main>
</div>

    </>
  );
}
