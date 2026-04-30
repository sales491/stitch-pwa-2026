"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '@/components/PageHeader';

export default function ContactForm() {
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
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

            <div className="max-w-xl mx-auto px-4">
                {status === 'success' ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                        <p className="text-green-700 dark:text-green-300 font-semibold">Message sent successfully!</p>
                        <p className="text-green-600 dark:text-green-400 text-sm mt-1">We'll get back to you as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/50"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/50"
                        />
                        <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/50"
                        >
                            <option value="">Select a subject</option>
                            {subjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/50 resize-none"
                        />
                        {status === 'error' && (
                            <p className="text-red-500 text-sm">{errorMsg}</p>
                        )}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
