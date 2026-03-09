import React from 'react';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';

interface ContactSectionProps {
    fbUsername: string;
    setFbUsername: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    /** Optional website/careers/application URL */
    websiteUrl?: string;
    setWebsiteUrl?: (v: string) => void;
    /** Text shown below the heading */
    hint?: string;
    /** Tailwind class for the main icon color, e.g. 'text-primary' or 'text-orange-500' */
    colorClass?: string;
}

/**
 * Reusable contact section for all posting flows.
 * Shows FB Messenger (m.me link) + FB Page (facebook.com link), Phone (call + SMS), Email.
 * At least one field is required before the parent form can submit.
 */
export default function ContactSection({
    fbUsername, setFbUsername,
    phone, setPhone,
    email, setEmail,
    websiteUrl = '', setWebsiteUrl,
    hint = 'At least one contact method is required.',
    colorClass = 'text-primary',
}: ContactSectionProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4">
            <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className={`material-symbols-outlined ${colorClass} text-[22px]`}>contacts</span>
                    Contact Info
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{hint}</p>
            </div>

            {/* Facebook Username — generates both Messenger & Page links */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                    Facebook Username
                    <span className="font-normal text-slate-400">(generates Messenger &amp; Page links)</span>
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 focus-within:border-blue-400 transition-colors">
                    <span className="text-slate-400 text-sm shrink-0 select-none">facebook.com/</span>
                    <input
                        type="text"
                        placeholder="yourusername"
                        value={fbUsername}
                        onChange={(e) => setFbUsername(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
                    />
                </div>
                {fbUsername.trim() && (
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {/* Messenger link */}
                        <a
                            href={`https://m.me/${fbUsername.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-medium"
                        >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                            </svg>
                            Messenger: m.me/{fbUsername.trim()}
                        </a>
                        <span className="text-slate-300 dark:text-zinc-600">·</span>
                        {/* FB Page link */}
                        <a
                            href={`https://facebook.com/${fbUsername.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                        >
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            FB Page
                        </a>
                    </div>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-500">call</span>
                    Phone Number
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 focus-within:border-green-400 transition-colors">
                    <span className="text-slate-400 text-sm shrink-0 select-none">+63</span>
                    <input
                        type="tel"
                        placeholder="912 345 6789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
                    />
                </div>
                {phone.trim() && (
                    <div className="flex items-center gap-3 mt-1">
                        <a
                            href={`tel:${formatPhPhoneForLink(phone)}`}
                            className="inline-flex items-center gap-0.5 text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
                        >
                            <span className="material-symbols-outlined text-[14px]">call</span> Call
                        </a>
                        <span className="text-slate-300 dark:text-zinc-600">·</span>
                        <a
                            href={`sms:${formatPhPhoneForLink(phone)}`}
                            className="inline-flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                            <span className="material-symbols-outlined text-[14px]">sms</span> Text
                        </a>
                    </div>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span className="material-symbols-outlined text-[16px] text-red-400">mail</span>
                    Email Address
                </label>
                <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-red-400 placeholder-slate-400 transition-colors"
                />
                {email.trim() && (
                    <a
                        href={`mailto:${email.trim()}`}
                        className="mt-1 inline-flex items-center gap-0.5 text-xs text-red-500 hover:underline"
                    >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        {email.trim()}
                    </a>
                )}
            </div>

            {/* Website / Careers URL (optional) */}
            {setWebsiteUrl !== undefined && (
                <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        <span className="material-symbols-outlined text-[16px] text-violet-500">language</span>
                        Website / Careers Page
                        <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                        type="url"
                        placeholder="https://yourcompany.com/careers"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 placeholder-slate-400 transition-colors"
                    />
                    {websiteUrl.trim() && (
                        <a
                            href={websiteUrl.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-0.5 text-xs text-violet-600 hover:underline"
                        >
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            {websiteUrl.trim()}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
