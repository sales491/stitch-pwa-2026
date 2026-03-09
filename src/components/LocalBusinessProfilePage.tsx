'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import AdminActions from './AdminActions';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';
/* ─── Types ─────────────────────────────────────────── */
export interface BusinessProfile {
  id: string;
  owner_id: string | null;
  business_name: string;
  business_type: string | null;
  description: string | null;
  location: string | null;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
  } | null;
  operating_hours: string | null;
  social_media: {
    logo?: string;
    facebook?: string;
    messenger?: string;
  } | null;
  website: string | null;
  categories: string[] | null;
  stats: {
    total_sales?: number;
    customer_count?: number;
    products_listed?: number;
  } | null;
  created_at: string | null;
  updated_at: string | null;
  gallery_image: string | null;
  gallery_images: string[] | null;
  is_verified: boolean | null;
  average_rating: number | null;
  review_count: number | null;
}

interface Review {
  id: number;
  author_id: string | null;
  initials: string;
  name: string;
  color: string;
  rating: number;
  date: string;
  text: string;
}

/* ─── Helpers ────────────────────────────────────────── */
const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-pink-100 text-pink-700',
  'bg-amber-100 text-amber-700',
];

function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarRow({ rating, max = 5, size = 'text-[18px]' }: { rating: number; max?: number; size?: string }) {
  return (
    <div className="flex">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${size} text-amber-400`}
          style={{ fontVariationSettings: i < rating ? '"FILL" 1' : '"FILL" 0' }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-125 active:scale-110"
        >
          <span
            className="material-symbols-outlined text-[36px] text-amber-400 transition-all"
            style={{ fontVariationSettings: (hover || value) >= star ? '"FILL" 1' : '"FILL" 0' }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}

function RatingSummary({ reviews, businessRating }: { reviews: Review[], businessRating: number }) {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : businessRating;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return (
    <div className="flex gap-5 items-center bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6">
      {/* Big number */}
      <div className="text-center shrink-0">
        <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">{avg.toFixed(1)}</p>
        <StarRow rating={Math.round(avg)} size="text-[16px]" />
        <p className="text-xs text-slate-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
      </div>
      {/* Bar breakdown */}
      <div className="flex-1 space-y-1.5">
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 w-2 shrink-0">{star}</span>
              <span className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-4 text-right shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function LocalBusinessProfilePage({ business }: { business: BusinessProfile }) {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draftRating, setDraftRating] = useState(0);
  const [draftName, setDraftName] = useState('');
  const [draftText, setDraftText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // --- Inline Editing State ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState(business);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        if (session.user.email === 'mspeninv1@gmail.com') {
          setIsAdminUser(true);
        }
      }
    }
    checkUser();

    // Fetch existing reviews
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('business_reviews')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mappedReviews: Review[] = data.map((r: any) => ({
          id: r.id,
          author_id: r.author_id,
          initials: getInitials(r.author_name),
          name: r.author_name,
          color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
          rating: r.rating,
          date: new Date(r.created_at).toLocaleDateString(),
          text: r.comment,
        }));
        setReviews(mappedReviews);
      }
    }
    fetchReviews();
  }, [supabase, business.id]);


  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : (business.average_rating || 4.5);

  async function submitReview() {
    if (!draftRating || !draftName.trim() || !draftText.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const newReviewData = {
        business_id: business.id,
        author_id: session?.user?.id || null,
        author_name: draftName.trim(),
        rating: draftRating,
        comment: draftText.trim(),
      };

      const { data, error } = await supabase
        .from('business_reviews')
        .insert([newReviewData])
        .select()
        .single();

      if (error) throw error;

      const newReview: Review = {
        id: data.id,
        author_id: data.author_id,
        initials: getInitials(data.author_name),
        name: data.author_name,
        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        rating: data.rating,
        date: 'Just now',
        text: data.comment,
      };

      setReviews((prev) => {
        const updated = [newReview, ...prev];
        return updated;
      });
      setDraftRating(0);
      setDraftName('');
      setDraftText('');
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          business_name: editedBusiness.business_name,
          business_type: editedBusiness.business_type,
          location: editedBusiness.location,
          description: editedBusiness.description,
          contact_info: editedBusiness.contact_info,
          website: editedBusiness.website,
          operating_hours: editedBusiness.operating_hours,
          categories: editedBusiness.categories
        })
        .eq('id', business.id);

      if (error) throw error;

      alert('Changes saved successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save error:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleVerify() {
    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({ is_verified: true })
        .eq('id', business.id);
      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to verify: ${error.message}`);
    }
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col mx-auto max-w-md bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">

        {/* Admin Badge */}
        {isAdminUser && (
          <div className="absolute top-0 left-0 w-full z-[60] py-1 px-4 bg-teal-600 text-white text-[10px] font-bold text-center uppercase tracking-widest shadow-md">
            Admin Access Active • {isEditing ? 'Currently Editing' : 'Viewing with Admin Tools'}
          </div>
        )}

        {/* Header / Cover Photo */}
        <div className="relative w-full h-72">
          <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-4 pt-10 bg-gradient-to-b from-black/60 to-transparent">
            <Link href="/directory" className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors">
              <span className="material-symbols-outlined block">arrow_back</span>
            </Link>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined block">favorite</span>
              </button>
              <button className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined block">share</span>
              </button>
            </div>
          </div>
          {editedBusiness.gallery_image ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url("${editedBusiness.gallery_image}")` }}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 flex flex-col items-center justify-center p-6 text-center">
              <span className="material-symbols-outlined text-5xl text-teal-600/30 mb-4 animate-pulse">add_a_photo</span>
              <p className="text-teal-700 dark:text-teal-400 font-bold text-lg">Update your business</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Add photos to attract customers</p>
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <button className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Change Cover
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="relative -mt-6 bg-white dark:bg-zinc-900 rounded-t-3xl px-5 pt-6 pb-24 flex-1">

          {/* Business Name + Rating */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedBusiness.business_name}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, business_name: e.target.value })}
                      className="text-2xl font-bold bg-slate-50 dark:bg-zinc-800 border-2 border-primary rounded-lg px-2 py-1 flex-1 outline-none"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{business.business_name}</h1>
                  )}
                  {/* Verified badge – only when admin-verified */}
                  {!isEditing && business.is_verified && (
                    <span className="inline-flex items-center gap-1 bg-teal-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                      VERIFIED
                    </span>
                  )}
                  {!isEditing && !business.is_verified && isAdminUser && (
                    <button onClick={handleVerify} className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 transition-colors text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md active:scale-95">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      VERIFY BUSINESS
                    </button>
                  )}
                  {!isEditing && (
                    <AdminActions
                      contentType="business"
                      contentId={business.id}
                      authorId={business.owner_id || undefined}
                      variant="button"
                      onEdit={() => setIsEditing(true)}
                      onDelete={() => {
                        window.location.href = '/directory';
                      }}
                    />
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={editedBusiness.business_type || ''}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, business_type: e.target.value })}
                      className="text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 outline-none"
                      placeholder="Category"
                    />
                    <input
                      type="text"
                      value={editedBusiness.location || ''}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, location: e.target.value })}
                      className="text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 outline-none"
                      placeholder="Town"
                    />
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span>
                    {editedBusiness.business_type} • {editedBusiness.location}
                  </p>
                )}
              </div>
              {!isEditing && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="font-bold text-green-700 dark:text-green-400 text-sm">{avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">({reviews.length || business.review_count || 0} reviews)</span>
                </div>
              )}
            </div>

            {/* Admin Edit Controls */}
            {isEditing && (
              <div className="flex gap-2 mt-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-teal-700 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedBusiness(business);
                  }}
                  className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-zinc-700"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Status */}
            {!isEditing && (
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Open Now</span>
                {editedBusiness.operating_hours && (
                  <>
                    <span className="text-slate-400 text-sm">•</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{editedBusiness.operating_hours}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons — Phone, Messenger, FB Page, SMS, Web, Email */}
          <div className="grid grid-cols-6 gap-2 mb-8">
            {isEditing ? (
              <div className="col-span-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl py-3 px-4 font-semibold flex flex-col items-center justify-center gap-1 border-2 border-green-500 shadow-sm">
                <span className="text-[10px] uppercase font-bold opacity-75">Phone</span>
                <input
                  type="text"
                  value={editedBusiness.contact_info?.phone || ''}
                  onChange={(e) => setEditedBusiness({
                    ...editedBusiness,
                    contact_info: { ...(editedBusiness.contact_info || {}), phone: e.target.value }
                  })}
                  className="bg-transparent border-none outline-none w-full text-center text-sm font-black text-slate-900 dark:text-white"
                  placeholder="09xx..."
                />
              </div>
            ) : (
              <a href={`tel:${formatPhPhoneForLink(editedBusiness.contact_info?.phone || '')}`} className="col-span-2 bg-green-500 hover:bg-green-400 text-white rounded-xl py-3 px-2 font-semibold flex flex-col items-center justify-center gap-1 transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-lg">call</span>
                <span className="text-[10px] font-medium leading-none">Call Now</span>
              </a>
            )}

            {isEditing ? (
              <div className="col-span-3 bg-slate-100 dark:bg-zinc-800 rounded-xl py-3 px-4 flex flex-col items-center justify-center gap-1 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Web</span>
                <input
                  type="text"
                  value={editedBusiness.website || ''}
                  onChange={(e) => setEditedBusiness({ ...editedBusiness, website: e.target.value })}
                  className="bg-transparent border-none outline-none w-full text-center text-xs font-medium text-slate-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            ) : (
              <>
                {/* SMS */}
                <a href={`sms:${formatPhPhoneForLink(editedBusiness.contact_info?.phone || '')}`} className="col-span-1 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-blue-500">sms</span>
                  <span className="text-[10px] font-medium">Text</span>
                </a>
                {/* FB Messenger */}
                {editedBusiness.social_media?.messenger ? (
                  <a
                    href={`https://m.me/${editedBusiness.social_media.messenger}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                    <span className="text-[10px] font-medium">Chat</span>
                  </a>
                ) : (
                  <div className="col-span-1 bg-slate-50 dark:bg-zinc-900 text-slate-300 dark:text-zinc-600 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                    <span className="text-[10px] font-medium">Chat</span>
                  </div>
                )}
                {/* Web */}
                {editedBusiness.website && (editedBusiness.website.startsWith('http') || editedBusiness.website.startsWith('www')) ? (
                  <a href={editedBusiness.website} target="_blank" rel="noreferrer" className="col-span-1 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-teal-600">language</span>
                    <span className="text-[10px] font-medium leading-none">Web</span>
                  </a>
                ) : (
                  <div className="col-span-1 bg-slate-50 dark:bg-zinc-900 text-slate-300 dark:text-zinc-600 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                    <span className="material-symbols-outlined">language</span>
                    <span className="text-[10px] font-medium leading-none">Web</span>
                  </div>
                )}
                {/* Email */}
                {editedBusiness.contact_info?.email ? (
                  <a href={`mailto:${editedBusiness.contact_info.email}`} className="col-span-1 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-amber-500">mail</span>
                    <span className="text-[10px] font-medium leading-none">Email</span>
                  </a>
                ) : (
                  <div className="col-span-1 bg-slate-50 dark:bg-zinc-900 text-slate-300 dark:text-zinc-600 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                    <span className="material-symbols-outlined">mail</span>
                    <span className="text-[10px] font-medium leading-none">Email</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* FB Page link row (when available) */}
          {!isEditing && editedBusiness.social_media?.facebook && (
            <a
              href={`https://facebook.com/${editedBusiness.social_media.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.525 8H14V6c0-1.03.838-1.608 2-1.608h1.975V1.1c-.341-.047-1.536-.1-2.932-.1C12.024 1 10 2.8 10 5.748V8H7v3h3v9h4v-9h2.525L17.525 8z" />
              </svg>
              Visit Facebook Page
              <span className="material-symbols-outlined text-[16px] ml-auto">open_in_new</span>
            </a>
          )}


          {/* Claim This Business Banner – only when not verified */}
          {!business.is_verified && !isEditing && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-xl">storefront</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Is this your business?</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Claim it to get a Verified badge</p>
              </div>
              <a
                href={`/claim-business/${business.id}`}
                className="shrink-0 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95"
              >
                Claim
              </a>
            </div>
          )}

          <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full mb-6" />

          {/* About */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About</h2>
            {isEditing ? (
              <textarea
                value={editedBusiness.description || ''}
                onChange={(e) => setEditedBusiness({ ...editedBusiness, description: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-primary rounded-xl p-4 text-sm outline-none resize-none h-32"
              />
            ) : (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {editedBusiness.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {editedBusiness.categories?.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-full text-xs border border-slate-100 dark:border-zinc-700">
                  {tag}
                </span>
              ))}
              {isEditing && (
                <button className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold">
                  + Add Tag
                </button>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Photos</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar snap-x snap-mandatory">
              {[...(editedBusiness.gallery_images || []), editedBusiness.gallery_image]
                .filter(Boolean)
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((src, i) => (
                  <div key={i} className="shrink-0 w-56 h-56 rounded-xl overflow-hidden snap-center shadow-md border border-slate-100 dark:border-zinc-800">
                    <img alt={`Photo ${i + 1}`} className="w-full h-full object-cover" src={src as string} />
                  </div>
                ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Location</h2>
            <div className="w-full h-40 rounded-xl overflow-hidden relative bg-slate-200 dark:bg-zinc-800">
              <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNRlryB6cTttXFHoDJ4wThaJJ_wPJs5MS4be1q7vDyM-UOfVnGPIX8t3XSxnL-kU1EF7g4RaUmDiAQpGNPsjbrjIM6etCV0xrRkgm14b8A8-ypdr8CtOaoeMRP3WQG6pJCnriXYRMmzbFOyhReBmPsabrb_MudbDzWIsG5dwbxUfgAf-JYxenuif4hUUmQ7KUlb-2G3M1jSGFzIACmwkWsFHcutY14qsmnPJ3oM8iOJuinB3Nwb7ssE9X3pfQifiesO6ik9MzQdWU")' }} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <button className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                  <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-lg">directions</span>
                  Get Directions
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedBusiness.contact_info?.address || ''}
                  onChange={(e) => setEditedBusiness({
                    ...editedBusiness,
                    contact_info: { ...(editedBusiness.contact_info || {}), address: e.target.value }
                  })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border-b-2 border-primary outline-none py-1 focus:bg-white transition-colors"
                  placeholder="Street Address"
                />
              ) : (
                business.contact_info?.address
              )}
            </p>
            {isEditing && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-zinc-800 rounded-xl space-y-4 border border-slate-100 dark:border-zinc-800 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-teal-600 mb-1">Hours</label>
                    <input
                      type="text"
                      value={editedBusiness.operating_hours || ''}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, operating_hours: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-teal-500"
                      placeholder="e.g. 8AM - 5PM"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-teal-600 mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={editedBusiness.categories?.join(', ') || ''}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-teal-500"
                      placeholder="Tag1, Tag2..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Reviews ── */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reviews</h2>
              {isLoggedIn ? (
                <button
                  onClick={() => setShowForm((v) => !v)}
                  className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  {showForm ? 'Cancel' : 'Write a Review'}
                </button>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-400 font-semibold text-sm px-4 py-2 rounded-full transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Sign in to Review
                </a>
              )}
            </div>

            {/* Success toast */}
            {submitted && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium animate-pulse">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Your review was posted. Thank you!
              </div>
            )}

            {/* Rating summary */}
            <RatingSummary reviews={reviews} businessRating={business.average_rating || 4.5} />

            {/* Write-a-review form */}
            {showForm && (
              <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 mb-6 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Your Review</h3>

                {/* Star picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Rating</label>
                  <StarPicker value={draftRating} onChange={setDraftRating} />
                  {draftRating > 0 && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][draftRating]}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Juan dela Cruz"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-700 placeholder-slate-400"
                  />
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Your Review
                    <span className="font-normal ml-1 text-slate-400">({draftText.length}/500)</span>
                  </label>
                  <textarea
                    placeholder="Share your experience — what did you enjoy? Anything to improve?"
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value.slice(0, 500))}
                    rows={4}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-700 placeholder-slate-400 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={submitReview}
                  disabled={!draftRating || !draftName.trim() || !draftText.trim()}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${draftRating && draftName.trim() && draftText.trim()
                    ? 'bg-teal-700 hover:bg-teal-600 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-zinc-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                >
                  Post Review
                </button>
              </div>
            )}

            {/* Review list */}
            <div className="space-y-5">
              {reviews.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${r.color}`}>
                    {r.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">{r.date}</span>
                        {/* Only show admin actions for real DB records (UUIDs), not seed/mock data */}
                        {String(r.id).length > 10 && (
                          <AdminActions contentType="comment" contentId={String(r.id)} authorId={r.author_id || undefined} />
                        )}
                      </div>
                    </div>
                    <StarRow rating={r.rating} size="text-[14px]" />
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
