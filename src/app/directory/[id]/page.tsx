import { createClient } from '@/utils/supabase/server';
import BusinessReviews from '@/components/BusinessReviews';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAdmin, isModerator } from '@/utils/roles';
import BusinessImageGallery from '@/components/BusinessImageGallery';

import { formatPhPhoneForLink } from '@/utils/phoneUtils';

export default async function BusinessProfileDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the business profile and the owner's profile data
    const { data: business, error } = await supabase
        .from('business_profiles')
        .select(`
      *,
      owner:profiles(id, full_name, avatar_url, role)
    `)
        .eq('id', id)
        .single();

    if (error || !business) return notFound();

    // Fetch viewer permissions
    const { data: { user } } = await supabase.auth.getUser();
    const { data: viewerProfile } = user ? await supabase.from('profiles').select('id, role').eq('id', user.id).single() : { data: null };
    const canEdit = user && (
        viewerProfile?.id === business.owner_id || 
        viewerProfile?.role === 'admin' || 
        viewerProfile?.role === 'moderator' ||
        isAdmin(user.email) ||
        isModerator(user.email)
    );

    // Restrict public access to unverified, user-created businesses
    if (!business.is_verified && business.owner_id && !canEdit) {
        return notFound();
    }

    const contactInfo = business.contact_info || {};
    const socialMedia = business.social_media || {};
    const phone = contactInfo.phone || '';
    const messenger = socialMedia.messenger || '';

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
            {/* Top Navigation */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-center max-w-lg mx-auto w-full">
                <Link href="/directory" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full text-slate-900 dark:text-white shadow-sm active:scale-95 transition-transform border border-slate-200 dark:border-zinc-800">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </Link>
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Link href={`/onboarding/business?edit_id=${id}`} className="h-10 px-5 flex items-center justify-center bg-moriones-red rounded-full text-white shadow-md active:scale-95 transition-all hover:bg-red-600 gap-2 font-black text-[10px] uppercase tracking-widest border border-red-700">
                            <span className="material-symbols-outlined text-sm">edit_note</span>
                            Manage
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Content Container (Max Width for layout feel) */}
            <div className="max-w-lg mx-auto px-6 pb-24 w-full">
                {/* Image Gallery */}
                <BusinessImageGallery 
                    businessId={business.id}
                    businessName={business.business_name}
                    images={business.gallery_images && business.gallery_images.length > 0 ? business.gallery_images : (business.gallery_image ? [business.gallery_image] : [])}
                    isVerified={business.is_verified}
                />

                {/* Title & Rating */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{business.business_name}</h1>
                        {business.is_verified && (
                            <span className="material-symbols-outlined text-teal-500 fill-1 text-2xl -mt-1" title="Verified Provider">verified</span>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest mb-4">
                        {business.business_type} • {business.location}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{(business.average_rating || 0).toFixed(1)}</span>
                        <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-[18px] font-variation-settings-fill" style={{ fontVariationSettings: i < Math.round(business.average_rating || 0) ? '"FILL" 1' : '"FILL" 0' }}>star</span>
                            ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 ml-1">({business.review_count || 0} reviews)</span>
                    </div>
                </div>

                {/* Quick Action Buttons (Circular row) */}
                <div className="flex justify-center gap-6 mb-12">
                    {/* Call */}
                    <a href={`tel:${formatPhPhoneForLink(phone)}`} className="flex flex-col items-center gap-2.5 group">
                        <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-moriones-red shadow-sm group-hover:bg-moriones-red group-hover:text-white group-hover:border-moriones-red group-hover:shadow-md transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wide">Call</span>
                    </a>

                    {/* Text */}
                    {phone && (
                        <a href={`sms:${formatPhPhoneForLink(phone)}`} className="flex flex-col items-center gap-2.5 group">
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-moriones-red shadow-sm group-hover:bg-moriones-red group-hover:text-white group-hover:border-moriones-red group-hover:shadow-md transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">sms</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Text</span>
                        </a>
                    )}

                    {/* Email */}
                    {contactInfo.email && (
                        <a href={`mailto:${contactInfo.email}`} className="flex flex-col items-center gap-2.5 group">
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-moriones-red shadow-sm group-hover:bg-moriones-red group-hover:text-white group-hover:border-moriones-red group-hover:shadow-md transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Email</span>
                        </a>
                    )}

                    {/* Messenger or Map */}
                    {messenger ? (
                        <a href={`https://m.me/${messenger}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 group">
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-[#00B2FF] shadow-sm group-hover:bg-[#00B2FF] group-hover:text-white group-hover:border-[#00B2FF] group-hover:shadow-md transition-all active:scale-95">
                                <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.36 2 1.8 6.13 1.8 11.24c0 2.91 1.48 5.51 3.79 7.17.18.13.29.35.29.58v1.89c0 .41.46.65.81.43l2.45-1.5c.16-.1.35-.14.54-.12 1.15.11 2.33.17 3.53.17 5.64 0 10.2-4.13 10.2-9.24S17.64 2 12 2zm1.09 13.06-2.58-2.75c-.2-.21-.53-.21-.73 0l-4.75 5.09c-.31.34-.84-.04-.62-.42l4.81-8.31c.2-.34.69-.36.92-.04l2.58 2.75c.2.21.53.21.73 0l4.75-5.09c.31-.34.84.04.62.42l-4.81 8.31c-.2.34-.69.36-.92.04z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Messenger</span>
                        </a>
                    ) : (
                        <a href={`https://maps.google.com/?q=${contactInfo.address || business.location}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 group">
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-moriones-red shadow-sm group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 group-hover:shadow-md transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">directions</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Map</span>
                        </a>
                    )}
                </div>

                {/* List Items (Details) */}
                <div className="space-y-4 mb-12">
                    {/* Operating Hours */}
                    {business.operating_hours && (
                        <div className="bg-white dark:bg-zinc-900/80 rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-slate-100 dark:border-zinc-800/80">
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-zinc-800 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 truncate">Operating Hours</h3>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">{business.operating_hours}</p>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {contactInfo.address && (
                        <div className="bg-white dark:bg-zinc-900/80 rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-slate-100 dark:border-zinc-800/80">
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-zinc-800 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 truncate">Address</h3>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">{contactInfo.address}</p>
                            </div>
                        </div>
                    )}

                    {/* Website */}
                    {business.website && (
                        <div className="bg-white dark:bg-zinc-900/80 rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-slate-100 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer relative group">
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-zinc-800 shrink-0 group-hover:text-teal-600 group-hover:border-teal-100 dark:group-hover:border-teal-900/30 transition-all">
                                <span className="material-symbols-outlined text-[18px]">language</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 truncate">Website</h3>
                                <p className="text-sm font-bold text-teal-700 dark:text-teal-400 leading-snug break-words truncate">{business.website.replace(/^https?:\/\//, '')}</p>
                            </div>
                        </div>
                    )}

                    {/* Social - Facebook */}
                    {socialMedia.facebook && (
                        <div className="bg-white dark:bg-zinc-900/80 rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-slate-100 dark:border-zinc-800/80 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all cursor-pointer relative group">
                            <a href={socialMedia.facebook.startsWith('http') ? socialMedia.facebook : `https://facebook.com/${socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>
                            <div className="w-10 h-10 rounded-full bg-[#1877F2]/5 flex items-center justify-center text-[#1877F2] shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[10px] font-black uppercase text-[#1877F2]/70 tracking-widest mb-1 truncate">Facebook Page</h3>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words truncate">Visit profile</p>
                            </div>
                            <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-[#1877F2] group-hover:-translate-x-1 relative z-0 transition-all">arrow_forward_ios</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-10 mb-12">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-slate-400">info</span>
                        About
                    </h2>
                    <div className="bg-transparent">
                        <p className="text-slate-600 dark:text-zinc-400 text-[15px] leading-[1.8] font-medium whitespace-pre-wrap">
                            {business.description || "No description provided yet."}
                        </p>
                    </div>
                </div>

                {/* Verify / Pending Banner (if not verified) */}
                {!business.is_verified && (
                    <div className="mb-10 p-6 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                        
                        {business.owner_id && canEdit ? (
                            <>
                                <p className="text-sm font-black mb-1 flex items-center gap-2 text-yellow-500">
                                    <span className="material-symbols-outlined text-base">hourglass_empty</span>
                                    Pending Verification
                                </p>
                                <p className="text-xs font-medium text-slate-400 tracking-tight leading-relaxed max-w-[90%]">
                                    Your business profile has been submitted and is currently under review by our community moderators. It will appear publicly once verified.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-black mb-1 flex items-center gap-2 text-teal-400">
                                    <span className="material-symbols-outlined text-base">verified_user</span>
                                    Unverified Profile
                                </p>
                                <p className="text-xs font-medium text-slate-400 mb-6 tracking-tight leading-relaxed max-w-[90%]">Claim this page to unlock analytics and start responding to reviews.</p>
                                <Link href={`/claim-business/${business.id}`} className="inline-block bg-white text-slate-900 hover:bg-slate-100 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md">
                                    Claim This Business
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Comments / Reviews */}
                <div className="pt-10">
                    <BusinessReviews businessId={business.id} />
                </div>
            </div>
        </div>
    );
}
