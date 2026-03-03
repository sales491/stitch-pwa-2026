'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const supabase = createClient();

        // redirect back to the app after auth
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Error logging in:', error);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 font-display">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                <Link href="/marinduque-connect-home-feed" className="text-slate-800 dark:text-slate-200">
                    <span className="material-symbols-outlined">close</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Sign In</h1>
                <div className="w-8" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Welcome Back!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                    Sign in with your Google account to post listings, create a business profile, apply for jobs, and more.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex justify-center items-center gap-3 w-full max-w-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3.5 rounded-xl font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 active:scale-95 disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24px"
                        height="24px"
                        className="shrink-0"
                    >
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    {loading ? 'Connecting to Google...' : 'Continue with Google'}
                </button>

                <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
                    By proceeding, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
