'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { isAdmin, isModerator } from '@/utils/roles';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminActions from './AdminActions';

import { useNotifications } from './NotificationProvider';

interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    is_verified: boolean;
}

interface TransportListing { id: string; vehicle_type: string; driver_name: string; base_town: string; images?: string[]; }
interface ClassListing { id: string; title: string; price: number; images?: string[]; created_at: string; }
interface JobPosting { id: string; title: string; company_name: string; created_at: string; }
interface BusinessListing { id: string; business_name: string; business_type: string; is_verified: boolean; gallery_images?: string[]; created_at: string; }

export default function UserProfileDashboard1() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [transportListings, setTransportListings] = useState<TransportListing[]>([]);
  const [classListings, setClassListings] = useState<ClassListing[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [businessListings, setBusinessListings] = useState<BusinessListing[]>([]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchUserContent(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error) {
        setProfile(data);
      }
    };

    // Fetch all user content
    const fetchUserContent = async (userId: string) => {
      // Transport — multiple listings per operator are allowed
      const { data: transport } = await supabase
        .from('transport_services')
        .select('*')
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });
      setTransportListings(transport || []);

      // Classifieds
      const { data: classifieds } = await supabase
        .from('listings')
        .select('id, title, price, images, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setClassListings(classifieds || []);

      // Jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, company_name, created_at')
        .eq('employer_id', userId)
        .order('created_at', { ascending: false });
      setJobPostings(jobs || []);

      // Businesses
      const { data: businesses } = await supabase
        .from('business_profiles')
        .select('id, business_name, business_type, is_verified, gallery_images, created_at')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      setBusinessListings(businesses || []);

      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchUserContent(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Handle refresh via custom event
    const handleAdminAction = () => {
      if (user) fetchUserContent(user.id);
    };
    window.addEventListener('adminActionRefresh', handleAdminAction);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('adminActionRefresh', handleAdminAction);
    };
  }, [supabase, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isUserAdmin = profile?.role === 'admin' || isAdmin(user?.email);
  const isUserModerator = profile?.role === 'moderator' || isModerator(user?.email);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 overflow-x-hidden">
      {/* Header / Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-3 border-b border-border-main">
        <h2 className="text-xl font-bold tracking-tight text-text-main text-neutral-900 dark:text-white">Profile</h2>
        <div className="flex gap-2">
          {user && (
            <button
              onClick={handleSignOut}
              className="text-white bg-red-500 hover:bg-red-400 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
            >
              Sign Out
            </button>
          )}
          <Link href="/profile/edit" className="p-2 rounded-full hover:bg-background-main text-text-main transition-colors text-neutral-900 dark:text-white" aria-label="Edit Profile">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-moriones-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-text-muted/20 mb-4 text-neutral-400">person_off</span>
            <h3 className="text-xl font-bold text-text-main mb-2 text-neutral-900 dark:text-white">Not Signed In</h3>
            <p className="text-text-muted mb-6 max-w-xs mx-auto text-neutral-500">
              Sign in to manage your listings, post services, set up your business profile, and more.
            </p>
            <Link
              href="/login"
              className="bg-moriones-red text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              Sign In with Google
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-8 pb-6">
            <Link href="/profile/edit" className="relative mb-4 group cursor-pointer">
              {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                <Image src={profile?.avatar_url || user.user_metadata.avatar_url} alt="Avatar" width={112} height={112} referrerPolicy="no-referrer" className="h-28 w-28 rounded-full object-cover border-4 border-background-main shadow-lg border-white dark:border-neutral-800" />
              ) : (
                <div className="h-28 w-28 rounded-full bg-background-main border-4 border-border-main shadow-lg flex items-center justify-center text-3xl font-bold text-text-muted bg-neutral-100 dark:bg-neutral-800 border-white dark:border-neutral-800">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-moriones-red text-white p-1.5 rounded-full border-2 border-background-main flex items-center justify-center shadow-sm border-white dark:border-neutral-800">
                <span className="material-symbols-outlined text-[16px] leading-none">edit</span>
              </div>
            </Link>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-text-main flex items-center justify-center gap-2 text-neutral-900 dark:text-white">
                {profile?.full_name || user.user_metadata?.full_name || 'Verified User'}
                {profile?.is_verified && (
                  <span className="material-symbols-outlined text-teal-500 text-[20px]" title="Verified">verified</span>
                )}
              </h1>
              <p className="text-text-muted font-medium text-sm text-neutral-500">{user.email}</p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 bg-background-main border border-border-main text-text-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
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
                  <span className="inline-flex items-center gap-1 bg-moriones-red/10 text-moriones-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-moriones-red/20">
                    <span className="material-symbols-outlined text-[14px]">local_police</span>
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm flex gap-3 mt-6">
              <Link
                href="/profile/edit"
                className="flex-1 bg-text-main text-background-main py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity text-center"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  const url = window.location.origin + '/profile';
                  if (navigator.share) {
                    navigator.share({ title: profile?.full_name || 'My Profile', url });
                  } else {
                    navigator.clipboard.writeText(url).then(() => alert('Profile link copied!'));
                  }
                }}
                className="flex-1 bg-background-main border border-border-main text-text-main py-2.5 rounded-lg font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                Share Profile
              </button>
            </div>

            {/* Admin Dashboard Link */}
            {isUserAdmin && (
              <div className="w-full max-w-sm mt-4">
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full bg-background-main border border-border-main text-text-main py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-moriones-red text-[20px]">admin_panel_settings</span>
                  Enter Admin Panel
                </Link>
              </div>
            )}

            {/* Active Listing Management */}
            <div className="w-full max-w-sm mt-8 space-y-4">
              {(transportListings.length > 0 || classListings.length > 0 || jobPostings.length > 0 || businessListings.length > 0) && (
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">My Active Posts</h3>
                </div>
              )}

              {/* Transport Listings — all of them */}
              {transportListings.map(t => (
                <div key={t.id} className="bg-background-main border border-border-main rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex items-start justify-between relative">
                    <div className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-moriones-red/10 flex items-center justify-center text-moriones-red shrink-0">
                        {t.images?.[0] ? (
                          <Image src={t.images[0]} fill className="object-cover" alt={`${t.vehicle_type} vehicle preview`} />
                        ) : (
                          <span className="material-symbols-outlined text-[28px]">
                            {t.vehicle_type === 'Tricycle' ? 'pedal_bike' :
                              t.vehicle_type === 'Motorcycle' ? 'moped' : 'local_shipping'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-text-main truncate">{t.vehicle_type} Operator</h4>
                        <p className="text-xs text-text-muted mt-0.5">{t.driver_name}</p>
                        {t.base_town && <p className="text-[10px] text-moriones-red font-bold mt-0.5 truncate">{t.base_town}</p>}
                      </div>
                    </div>
                    <AdminActions
                      contentType="commute"
                      contentId={t.id}
                      authorId={user.id}
                      onDelete={() => window.dispatchEvent(new Event('adminActionRefresh'))}
                    />
                  </div>
                </div>
              ))}

              {/* Classifieds Listings */}
              {classListings.map(listing => (
                <div key={listing.id} className="bg-background-main border border-border-main rounded-2xl p-3 shadow-sm flex items-center gap-3 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background-dark shrink-0">
                    {listing.images?.[0] ? (
                      <Image src={listing.images[0]} fill className="object-cover" alt={listing.title || 'Marketplace item'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-text-main truncate">{listing.title}</h4>
                    <p className="text-xs text-moriones-red font-black mt-0.5">₱{listing.price.toLocaleString()}</p>
                  </div>
                  <AdminActions
                    contentType="listing"
                    contentId={listing.id}
                    authorId={user.id}
                    onDelete={() => window.dispatchEvent(new Event('adminActionRefresh'))}
                  />
                </div>
              ))}

              {/* Job Postings */}
              {jobPostings.map(job => (
                <div key={job.id} className="bg-background-main border border-border-main rounded-2xl p-4 shadow-sm flex items-center justify-between group">
                  <div>
                    <h4 className="font-bold text-sm text-text-main">{job.title}</h4>
                    <p className="text-xs text-text-muted mt-1">{job.company_name}</p>
                  </div>
                  <AdminActions
                    contentType="job"
                    contentId={job.id}
                    authorId={user.id}
                    onDelete={() => window.dispatchEvent(new Event('adminActionRefresh'))}
                  />
                </div>
              ))}

              {/* Business Listings */}
              {businessListings.map(biz => (
                <div key={biz.id} className="bg-background-main border border-border-main rounded-2xl p-3 shadow-sm flex items-center gap-3 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background-dark shrink-0">
                    {biz.gallery_images?.[0] ? (
                      <Image src={biz.gallery_images[0]} fill className="object-cover" alt={biz.business_name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                        <span className="material-symbols-outlined text-4xl">storefront</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-text-main truncate flex items-center gap-1">
                      {biz.business_name}
                      {biz.is_verified ? (
                         <span className="material-symbols-outlined text-teal-500 text-[14px]" title="Community verified">verified</span>
                      ) : (
                         <span className="bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Pending</span>
                      )}
                    </h4>
                    <p className="text-xs text-moriones-red font-bold mt-0.5 truncate">{biz.business_type}</p>
                  </div>
                  <AdminActions
                    contentType="business"
                    contentId={biz.id}
                    authorId={user.id}
                    onDelete={() => window.dispatchEvent(new Event('adminActionRefresh'))}
                  />
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="w-full mt-8 px-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background-main p-4 rounded-xl border border-border-main flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-text-main">
                    {classListings.length + jobPostings.length + businessListings.length + transportListings.length}
                  </span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider mt-1">Posts</span>
                </div>
                <div className="bg-background-main p-4 rounded-xl border border-border-main flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-text-main">0</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider mt-1">Saved</span>
                </div>
                <div className="bg-background-main p-4 rounded-xl border border-border-main flex flex-col items-center justify-center shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-text-main">--</span>
                    <span className="material-symbols-outlined text-amber-400 text-sm -mt-1" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider mt-1">Rating</span>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="w-full mt-10 px-2 pb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-text-main flex items-center gap-2 tracking-tight">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-moriones-red text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-background-main">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-moriones-red text-[11px] font-black uppercase tracking-wider hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="bg-background-main/50 rounded-2xl p-10 border border-dashed border-border-main flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-text-muted/20 text-5xl mb-3">notifications_off</span>
                    <p className="text-text-muted text-xs font-bold">No updates for now.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className={`relative flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${notif.is_read
                        ? 'bg-background-main/40 border-border-main opacity-60'
                        : 'bg-background-main border-moriones-red/20 shadow-sm'
                        }`}
                    >
                      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-background-main' : 'bg-moriones-red/10'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${notif.is_read ? 'text-text-muted/40' : 'text-moriones-red'}`}>
                          {notif.payload?.type === 'alert' ? 'emergency' :
                            notif.payload?.type === 'message' ? 'chat' :
                              notif.payload?.type === 'announcement' ? 'campaign' :
                                'notifications'}
                        </span>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold truncate ${notif.is_read ? 'text-text-muted' : 'text-text-main'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[9px] text-text-muted shrink-0 font-black uppercase tracking-widest">
                            {formatDate(notif.created_at)}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${notif.is_read ? 'text-text-muted/70' : 'text-text-muted'}`}>
                          {notif.message}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="mt-2 size-2 rounded-full bg-moriones-red shadow-sm animate-pulse" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
