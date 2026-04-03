'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '@/components/PageHeader';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        const supabase = createClient();
        const { error } = await supabase.from('contact_messages').insert({
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
        });
        if (error) {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
        } else {
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
    };

    const subjects = [
        'Data Privacy / Account Deletion Request',
        'Report a Listing or User',
        'General Inquiry',
        'Technical Issue',
        'Partnership / Advertising',
        'Other',
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0F0F10] pb-24">
            <PageHeader title="Contact Us" subtitle="Get In Touch" />

            <div className="px-4 pt-6">
                {status === 'success' ? (
                    <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 px-6 py-10 text-center">
                        <div className="text-4xl mb-3">✅</div>
                        <h2 className="text-[16px] font-black text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                        <p className="text-[13px] text-slate-500 dark:text-white/40 mb-6">
                            Thank you for reaching out. Our team will review your message shortly.
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-[13px] font-bold hover:bg-emerald-700 transition-colors"
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.06] px-5 py-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">
                                Your Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Juan dela Cruz"
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] text-[14px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C62828]/30 focus:border-[#C62828]/50 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@email.com"
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] text-[14px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C62828]/30 focus:border-[#C62828]/50 transition-all"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">
                                Subject
                            </label>
                            <select
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] text-[14px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C62828]/30 focus:border-[#C62828]/50 transition-all appearance-none"
                            >
                                <option value="">Select a topic…</option>
                                {subjects.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Describe your question or concern…"
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] text-[14px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C62828]/30 focus:border-[#C62828]/50 transition-all resize-none"
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-[13px] text-red-500 font-medium">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3.5 rounded-2xl bg-[#C62828] text-white text-[14px] font-black tracking-wide hover:bg-[#B71C1C] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                        >
                            {status === 'loading' ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
