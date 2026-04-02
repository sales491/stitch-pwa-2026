'use client';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

export default function HelpCommunityGuidelines() {
  const router = useRouter();

  // Section refs for scroll-to navigation
  const rulesRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReport = () => {
    // Navigate to the community page where the flag system lives
    router.push('/community');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@marinduquehub.ph?subject=Support%20Request';
  };

  return (
    <>
      <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-surface-light dark:bg-surface-dark px-4 py-3 shadow-sm">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white">Help &amp; Support</h1>
          <div className="w-10" /> {/* Spacer to center title */}
        </header>

        {/* Search Section */}
        <div className="px-4 pt-6 pb-2">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">How can we help you?</h2>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              className="block w-full rounded-xl border-none bg-white dark:bg-surface-dark py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:text-white dark:focus:ring-primary/60"
              placeholder="Search for topics or questions..."
              type="text"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-4 pb-24 pt-4 no-scrollbar">

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => scrollTo(rulesRef)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-text-main-dark">Rules</span>
            </button>

            <button
              onClick={() => scrollTo(safetyRef)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
                <span className="material-symbols-outlined">security</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-text-main-dark">Safety</span>
            </button>

            <button
              onClick={handleReport}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-text-main-dark">Report</span>
            </button>

            <button
              onClick={() => scrollTo(faqRef)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
                <span className="material-symbols-outlined">help_center</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-text-main-dark">FAQ</span>
            </button>
          </div>

          {/* Accordion Section: How it Works — anchored for Rules */}
          <div ref={rulesRef} className="mb-4 overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm scroll-mt-20">
            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-dark dark:text-primary">info</span>
                How it Works
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Creating a listing</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Tap the &apos;Post&apos; button in the navigation bar. Upload clear photos of your item, add a detailed description, set a fair price, and choose the correct location in Marinduque.
                </p>
              </details>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Meeting up safely</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  We recommend meeting in public places like town plazas, near barangay halls, or busy markets. Avoid secluded areas and always bring a companion if possible.
                </p>
              </details>
            </div>
          </div>

          {/* Accordion Section: Community Guidelines */}
          <div className="mb-4 overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm scroll-mt-20">
            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-dark dark:text-primary">groups</span>
                Community Guidelines
              </h3>
            </div>
            <div className="px-4 py-3">
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">We are building a safe and respectful marketplace for all Marinduqueños. Please review our core values.</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <details className="group p-4" open>
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Respect &amp; Kindness</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Treat everyone with the warmth of Marinduque hospitality. Harassment, hate speech, or rude behavior will not be tolerated. Be patient with inquiries.
                </p>
              </details>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Honest Representations</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Do not post misleading photos or descriptions. State any defects clearly. Authenticity builds trust in our small community.
                </p>
              </details>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Local Focus</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  This platform is for Marinduque residents. Please ensure items are located within the province or are available for local meetup/delivery.
                </p>
              </details>
            </div>
          </div>

          {/* Accordion Section: Safety Tips — anchored for Safety */}
          <div ref={safetyRef} className="mb-6 overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm scroll-mt-20">
            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-dark dark:text-primary">shield</span>
                Safety Tips for Buyers &amp; Sellers
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-start gap-3 p-4">
                <span className="material-symbols-outlined mt-0.5 text-amber-500">warning</span>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Avoid payment in advance</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Do not send money via GCash or bank transfer before inspecting the item in person.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4">
                <span className="material-symbols-outlined mt-0.5 text-blue-500">verified_user</span>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Check Profiles</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Look for verified badges and user reviews. New profiles with no history should be approached with caution.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4">
                <span className="material-symbols-outlined mt-0.5 text-green-500">people</span>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Meet in Public</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Always meet at the town plaza, barangay hall, or a busy market. Bring a friend or family member when possible.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={faqRef} className="mb-6 overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm scroll-mt-20">
            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-dark dark:text-primary">help_center</span>
                Frequently Asked Questions
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>How do I flag suspicious content?</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Every post, listing, and comment has a 🚩 Flag icon. Tap it and select a reason. After 3 flags from different users, content is automatically hidden and sent to our moderation team.
                </p>
              </details>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>How do I get a verified badge?</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  For business accounts and transport operators, submit your credentials through your profile. Our admin team will review and approve within 2-3 business days.
                </p>
              </details>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                  <span>Is the app free to use?</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Yes! Marinduque Market Hub is free for all residents. We are a community project built with ❤️ in Marinduque.
                </p>
              </details>
            </div>
          </div>

          {/* Contact Support Button */}
          <div className="px-2 pb-6">
            <button
              onClick={handleContactSupport}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-slate-900 transition hover:bg-primary-dark hover:text-white active:scale-95"
            >
              <span className="material-symbols-outlined">support_agent</span>
              Contact Support Team
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">
              Version 1.0.2 • Made with <span className="text-red-400">♥</span> in Marinduque
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
