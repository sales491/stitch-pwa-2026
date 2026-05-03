'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface ClaimBusinessFormProps {
    businessId: string;
    businessName: string;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ClaimBusinessForm({ businessId, businessName }: ClaimBusinessFormProps) {
    const [state, setState] = useState<FormState>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [form, setForm] = useState({
        requester_name: '',
        requester_email: '',
        requester_phone: '',
        fb_username: '',
        message: '',
    });

    const supabase = createClient();

    // Pre-fill email from Google session
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.email) {
                setUserEmail(user.email);
                setForm((prev) => ({ ...prev, requester_email: user.email! }));
            }
        });
    }, [supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.requester_name.trim() || !form.requester_email.trim() || !form.requester_phone.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setErrorMsg('You must be signed in to submit a claim.');
            setState('error');
            return;
        }

        setState('submitting');
        
        // Encode the actual authenticated user_id inside the message column to bypass the email mismatch issue
        const payloadMessage = JSON.stringify({
            original_message: form.message.trim() || '',
            submitter_user_id: user.id
        });

        const { error } = await supabase.from('business_claim_requests').insert({
            business_id: businessId,
            requester_name: form.requester_name.trim(),
            requester_email: form.requester_email.trim(),
            requester_phone: form.requester_phone.trim(),
            message: payloadMessage,
            status: 'pending',
        });

        if (error) {
            setErrorMsg(error.message);
            setState('error');
        } else {
            // Notify the admin about the new verification request
            await supabase.from('notifications').insert({
                user_id: '7da9eb71-7757-4335-97c3-34eb40e4f34a', // Admin ID
                title: 'New Verification Request',
                message: `${form.requester_name.trim()} requested to verify: ${businessName}.`,
                payload: { type: 'business_verification', business_id: businessId },
            });
            setState('success');
        }
    };

    if (state === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-5xl text-teal-600" style={{ fontVariationSettings: '"FILL" 1' }}>
                        check_circle
                    </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Submitted!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                    Your claim for <span className="font-semibold text-slate-700 dark:text-slate-300">{businessName}</span> has been received.
                    Our team will review it and get back to you via email.
                </p>
                <Link
                    href="/directory"
                    className="mt-8 bg-teal-700 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95"
                >
                    Back to Directory
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sign-in notice */}
            <div className="flex items-start gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 text-xs text-teal-700 dark:text-teal-400">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">verified_user</span>
                <span>Your identity is verified via Google Sign-In. Your email has been pre-filled below.</span>
            </div>

            {/* Required: Name */}
            <div>
                <label htmlFor="requester_name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="requester_name"
                    name="requester_name"
                    type="text"
                    required
                    value={form.requester_name}
                    onChange={handleChange}
                    placeholder="e.g. Juan dela Cruz"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all placeholder-slate-400"
                />
            </div>

            {/* Required: Email (pre-filled from Google) */}
            <div>
                <label htmlFor="requester_email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    id="requester_email"
                    name="requester_email"
                    type="email"
                    required
                    value={form.requester_email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all placeholder-slate-400"
                />
            </div>

            {/* Required: Phone */}
            <div>
                <label htmlFor="requester_phone" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-0 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition-all">
                    <span className="px-3 text-slate-400 text-sm shrink-0 select-none border-r border-slate-200 dark:border-zinc-700 py-3">+63</span>
                    <input
                        id="requester_phone"
                        name="requester_phone"
                        type="tel"
                        required
                        value={form.requester_phone}
                        onChange={handleChange}
                        placeholder="912 345 6789"
                        className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
                    />
                </div>
                <p className="mt-1 text-xs text-slate-400">We may call to verify your ownership of this business.</p>
            </div>

            {/* Optional: Facebook Username */}
            <div>
                <label htmlFor="fb_username" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Facebook Username <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-0 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
                    <span className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 dark:border-zinc-700 shrink-0">
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                        </svg>
                        <span className="text-slate-400 text-xs select-none">facebook.com/</span>
                    </span>
                    <input
                        id="fb_username"
                        name="fb_username"
                        type="text"
                        value={form.fb_username}
                        onChange={handleChange}
                        placeholder="yourusername"
                        className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
                    />
                </div>
                {form.fb_username.trim() && (
                    <div className="flex items-center gap-3 mt-1.5">
                        <a
                            href={`https://m.me/${form.fb_username.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                            <span className="material-symbols-outlined text-[13px]">chat</span>
                            Message: m.me/{form.fb_username.trim()}
                        </a>
                        <span className="text-slate-300 dark:text-zinc-600">·</span>
                        <a
                            href={`https://facebook.com/${form.fb_username.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            Page
                        </a>
                    </div>
                )}
            </div>

            {/* Optional: Message */}
            <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Why are you claiming this business? <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="e.g. I am the owner of this business and want to manage its listing..."
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all placeholder-slate-400 resize-none"
                />
            </div>

            {state === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                    <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                    {errorMsg || 'Something went wrong. Please try again.'}
                </div>
            )}

            <button
                type="submit"
                disabled={state === 'submitting' || !form.requester_name.trim() || !form.requester_email.trim() || !form.requester_phone.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] bg-teal-700 hover:bg-teal-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {state === 'submitting' ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Submit Claim Request
                    </>
                )}
            </button>

            <p className="text-xs text-slate-400 text-center">
                By submitting, you confirm that you are the authorized owner or representative of this business.
            </p>
        </form>
    );
}
