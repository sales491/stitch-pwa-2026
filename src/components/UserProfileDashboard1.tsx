'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { isAdmin, isModerator } from '@/utils/roles';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserProfileDashboard1() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isUserAdmin = isAdmin(user?.email);
  const isUserModerator = isModerator(user?.email);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header / Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h2>
        <div className="flex gap-2">
          {user && (
            <button
              onClick={handleSignOut}
              className="text-white bg-red-500 hover:bg-red-400 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
            >
              Sign Out
            </button>
          )}
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-zinc-700 mb-4">person_off</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Not Signed In</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Sign in to manage your listings, post services, set up your business profile, and more.
            </p>
            <Link
              href="/login"
              className="bg-primary hover:bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              Sign In with Google
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-8 pb-6">
            <div className="relative mb-4 group cursor-pointer">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg" />
              ) : (
                <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 shadow-lg flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-slate-400">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-primary text-slate-900 p-1.5 rounded-full border-2 border-white dark:border-zinc-800 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[16px] leading-none">edit</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                {user.user_metadata?.full_name || 'Verified User'}
                <span className="material-symbols-outlined text-teal-500 text-[20px]" title="Verified">verified</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{user.email}</p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">local_activity</span>
                  Local Member
                </span>

                {isUserModerator && !isUserAdmin && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                    <span className="material-symbols-outlined text-[14px]">shield_person</span>
                    Moderator
                  </span>
                )}

                {isUserAdmin && (
                  <span className="inline-flex items-center gap-1 bg-primary/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/30">
                    <span className="material-symbols-outlined text-[14px]">local_police</span>
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm flex gap-3 mt-6">
              <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                Edit Profile
              </button>
              <button className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                Share Profile
              </button>
            </div>

            {/* Admin/Moderator Only Links */}
            {isUserAdmin && (
              <div className="w-full max-w-sm mt-4">
                <Link
                  href="/marinduque-connect-admin-dashboard"
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                  Go To Admin Dashboard
                </Link>
              </div>
            )}

            {/* Stats Grid Placeholder */}
            <div className="w-full mt-8 px-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Listings</span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Saved</span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">--</span>
                    <span className="material-symbols-outlined text-amber-400 text-sm -mt-1" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Rating</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
