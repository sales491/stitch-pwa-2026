import { createClient } from '@/utils/supabase/server';
import UniversalComments from '@/components/UniversalComments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
    const canEdit = user && (viewerProfile?.id === business.owner_id || viewerProfile?.role === 'admin' || viewerProfile?.role === 'moderator');

    const contactInfo = business.contact_info || {};
    const socialMedia = business.social_media || {};
    const phone = contactInfo.phone || '';
    const messenger = socialMedia.messenger || '';

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen">
            {/* 1. Dynamic Header */}
            <div className="bg-moriones-red dark:bg-moriones-red/80 h-48 md:h-64 relative overflow-hidden rounded-b-[3rem] shadow-2xl">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <Link href="/directory" className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white shadow-xl active:scale-95 transition-transform border border-white/10">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>

                        {canEdit && (
                            <Link href={`/directory/${id}/edit`} className="h-10 px-5 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-xl active:scale-95 transition-transform border border-white/10 gap-2 font-black text-[10px] uppercase tracking-widest">
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                Manage Page
                            </Link>
                        )}
                    </div>

                    <div className="flex items-end gap-5">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl flex items-center justify-center border-4 border-white/30 dark:border-zinc-800/30 overflow-hidden relative translate-y-8 md:translate-y-12">
                            {business.gallery_image ? (
                                <Image src={business.gallery_image} alt={business.business_name} fill className="object-cover" />
                            ) : (
                                <span className="text-4xl md:text-5xl font-black text-moriones-red">
                                    {business.business_name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="pb-2 md:pb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">{business.business_name}</h1>
                                {business.is_verified && (
                                    <span className="material-symbols-outlined text-yellow-300 fill-1 text-xl" title="Verified Provider">verified</span>
                                )}
                            </div>
                            <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                {business.business_type} • {business.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-20">
                {/* Primary Action Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <a
                        href={`tel:${formatPhPhoneForLink(phone)}`}
                        className="flex items-center justify-center gap-3 bg-moriones-red hover:bg-moriones-red/90 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-moriones-red/20 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Call Now
                    </a>
                    {phone && (
                        <a
                            href={`sms:${formatPhPhoneForLink(phone)}`}
                            className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm text-moriones-red">sms</span>
                            Send Text
                        </a>
                    )}
                    {messenger && (
                        <a
                            href={`https://m.me/${messenger}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#00B2FF]/10 text-[#00B2FF] border border-[#00B2FF]/20 p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-[#00B2FF] hover:text-white active:scale-95 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                            </svg>
                            Messenger
                        </a>
                    )}
                    {business.website && (
                        <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-200 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">language</span>
                            Website
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
                    {/* Main Content (2/3) */}
                    <div className="md:col-span-2 space-y-10">
                        {/* DescriptionSection */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">About the Business</h3>
                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-zinc-800">
                                <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                    {business.description || "The owner hasn't provided a detailed description yet."}
                                </p>
                            </div>
                        </section>

                        {/* Reviews / Comments Section */}
                        <section>
                            <UniversalComments entityId={business.id} entityType="business" />
                        </section>
                    </div>

                    {/* Sidebar (1/3) */}
                    <div className="space-y-6">
                        {/* Score Card */}
                        <div className="bg-moriones-red rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Community Rating</p>
                            <div className="flex items-center gap-4 mb-1">
                                <span className="text-5xl font-black tracking-tighter">{(business.average_rating || 0).toFixed(1)}</span>
                                <div className="flex flex-col">
                                    <div className="flex text-amber-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-lg font-variation-settings-fill" style={{ fontVariationSettings: i < Math.round(business.average_rating || 0) ? '"FILL" 1' : '"FILL" 0' }}>star</span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mt-1">{business.review_count || 0} Trusted Reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Connectivity Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">info</span> Business Details
                            </h3>

                            {business.operating_hours && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-moriones-red shrink-0">
                                        <span className="material-symbols-outlined text-lg">schedule</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">Operating Hours</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{business.operating_hours}</p>
                                    </div>
                                </div>
                            )}

                            {phone && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-moriones-red shrink-0">
                                        <span className="material-symbols-outlined text-lg">call</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">Contact Line</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{phone}</p>
                                    </div>
                                </div>
                            )}

                            {contactInfo.address && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-moriones-red shrink-0">
                                        <span className="material-symbols-outlined text-lg">location_on</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">Location</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{contactInfo.address}</p>
                                    </div>
                                </div>
                            )}

                            {socialMedia.facebook && (
                                <a href={socialMedia.facebook.startsWith('http') ? socialMedia.facebook : `https://facebook.com/${socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl group transition-all hover:bg-moriones-red hover:text-white">
                                    <span className="material-symbols-outlined text-moriones-red group-hover:text-white">facebook</span>
                                    <span className="text-xs font-black uppercase tracking-widest flex-1">Visit Facebook</span>
                                    <span className="material-symbols-outlined text-sm opacity-30 group-hover:opacity-100">open_in_new</span>
                                </a>
                            )}
                        </div>

                        {/* Verification Widget */}
                        {!business.is_verified && (
                            <div className="bg-slate-900 text-white rounded-[2rem] p-6 relative overflow-hidden border border-slate-800">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full translate-x-4 -translate-y-4"></div>
                                <p className="text-xs font-black mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-400 text-sm">shield</span>
                                    Unverified Profile
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mb-4 tracking-tight leading-relaxed">Claim this page to start responding to reviews, add more photos, and unlock business analytics.</p>
                                <Link href={`/claim-business/${business.id}`} className="block text-center bg-moriones-red hover:bg-moriones-red/90 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-moriones-red/20">
                                    Claim This Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
