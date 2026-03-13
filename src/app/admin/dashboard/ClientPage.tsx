'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { adminVerifyBusiness, adminRevokeBusinessVerification, adminDeleteBusiness } from '@/app/actions/admin';

interface ProfileInfo {
    id: string;
}

interface PendingBusiness {
    id: string;
    business_name: string;
    business_type: string;
    gallery_image: string | null;
    location: string;
}

export default function AppAdminDashboard() {
    const supabase = createClient();
    const [totalVerified, setTotalVerified] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');
    const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([]);
    const [verifiedBusinesses, setVerifiedBusinesses] = useState<PendingBusiness[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);

        // Fetch Stats
        const { count: verifiedCount } = await supabase.from('business_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true);
        const { count: pendingCount } = await supabase.from('business_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', false);
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        setTotalVerified(verifiedCount || 0);
        setTotalPending(pendingCount || 0);
        setTotalUsers(userCount || 0);

        // Fetch Pending List
        const { data: pendingList, error: pendingError } = await supabase
            .from('business_profiles')
            .select('id, business_name, business_type, gallery_image, location')
            .eq('is_verified', false)
            .order('created_at', { ascending: false });

        if (!pendingError) {
            setPendingBusinesses(pendingList || []);
        }

        // Fetch Verified List
        const { data: verifiedList, error: verifiedError } = await supabase
            .from('business_profiles')
            .select('id, business_name, business_type, gallery_image, location')
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (!verifiedError) {
            setVerifiedBusinesses(verifiedList || []);
        }

        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (id: string, name: string) => {
        try {
            await adminVerifyBusiness(id);
            const approvedBusiness = pendingBusinesses.find(b => b.id === id);
            setPendingBusinesses(prev => prev.filter(b => b.id !== id));
            if (approvedBusiness) setVerifiedBusinesses(prev => [approvedBusiness, ...prev]);
            setTotalPending(prev => Math.max(0, prev - 1));
            setTotalVerified(prev => prev + 1);
            showToast(`✅ Verified! ${name} is now approved.`);
        } catch (error) {
            console.error(error);
            alert('Error verifying business');
        }
    };

    const handleRevoke = async (id: string, name: string) => {
        if (!window.confirm(`Revoke verification for "${name}"? They will be moved back to pending.`)) return;
        try {
            await adminRevokeBusinessVerification(id);
            const biz = verifiedBusinesses.find(b => b.id === id);
            setVerifiedBusinesses(prev => prev.filter(b => b.id !== id));
            if (biz) setPendingBusinesses(prev => [biz, ...prev]);
            setTotalVerified(prev => Math.max(0, prev - 1));
            setTotalPending(prev => prev + 1);
            showToast(`⚠️ Verification revoked for ${name}.`);
        } catch (error) {
            alert('Error revoking verification');
        }
    };

    const handleDelete = async (id: string, name: string, isVerified: boolean) => {
        if (!window.confirm(`Permanently DELETE "${name}" business profile? This cannot be undone.`)) return;
        try {
            await adminDeleteBusiness(id);
            if (isVerified) {
                setVerifiedBusinesses(prev => prev.filter(b => b.id !== id));
                setTotalVerified(prev => Math.max(0, prev - 1));
            } else {
                setPendingBusinesses(prev => prev.filter(b => b.id !== id));
                setTotalPending(prev => Math.max(0, prev - 1));
            }
            showToast(`🗑️ Deleted "${name}" business profile.`);
        } catch (error) {
            alert('Error deleting business');
        }
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 font-display">

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <span className="material-symbols-outlined text-white">check_circle</span>
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">Admin Panel</h1>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest hidden sm:block">Marinduque Connect</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Stats Bar Integrated in Header Space for Desktop, inline for mobile */}
                    <div className="hidden md:flex gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="material-symbols-outlined text-teal-600 text-lg">verified</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none">Verified</span>
                                <span className="text-sm font-black text-slate-800 leading-tight">{totalVerified}</span>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-lg">pending_actions</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none">Pending</span>
                                <span className="text-sm font-black text-amber-600 leading-tight">{totalPending}</span>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-500 text-lg">group</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none">Users</span>
                                <span className="text-sm font-black text-slate-800 leading-tight">{totalUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

                {/* Stats Bar Mobile */}
                <div className="grid grid-cols-3 gap-3 md:hidden mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-teal-600 mb-1">verified</span>
                        <span className="text-xl font-black text-slate-800">{totalVerified}</span>
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-0.5">Verified</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        {totalPending > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-bl-lg"></div>}
                        <span className="material-symbols-outlined text-amber-500 mb-1">pending_actions</span>
                        <span className="text-xl font-black text-amber-600">{totalPending}</span>
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-0.5">Pending</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500 mb-1">group</span>
                        <span className="text-xl font-black text-slate-800">{totalUsers}</span>
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-0.5">Users</span>
                    </div>
                </div>

                {/* Header & Tab Switcher */}
                <div className="flex border-b border-slate-200 mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-4 border-b-2 font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'pending' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Pending Approval ({totalPending})
                    </button>
                    <button
                        onClick={() => setActiveTab('verified')}
                        className={`px-6 py-4 border-b-2 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'verified' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Verified Directory ({totalVerified})
                    </button>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="animate-pulse flex flex-col gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl w-full"></div>
                            ))}
                        </div>
                    ) : (activeTab === 'pending' ? pendingBusinesses : verifiedBusinesses).length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto mt-12">
                            <div className="w-20 h-20 bg-teal-50 text-teal-600 mx-auto rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl">{activeTab === 'pending' ? 'task_alt' : 'storefront'}</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                                {activeTab === 'pending' ? 'Zero Pending Businesses!' : 'No Verified Businesses'}
                            </h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                {activeTab === 'pending'
                                    ? 'All business listings have been reviewed and verified. Outstanding job keeping the directory clean.'
                                    : 'There are no verified businesses in the directory yet.'}
                            </p>
                        </div>
                    ) : (
                        (activeTab === 'pending' ? pendingBusinesses : verifiedBusinesses).map((biz) => (
                            <div key={biz.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 sm:items-center justify-between group hover:shadow-md transition-all">

                                <div className="flex items-start sm:items-center gap-4 min-w-0">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                                        {biz.gallery_image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={biz.gallery_image} alt={biz.business_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-300 text-4xl">storefront</span>
                                        )}
                                    </div>

                                    <div className="min-w-0 pt-1 sm:pt-0">
                                        <h4 className="font-black text-slate-900 text-lg sm:text-lg truncate pr-4 leading-tight mb-1" title={biz.business_name}>{biz.business_name}</h4>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md border border-slate-200">
                                                {biz.business_type || 'Uncategorized'}
                                            </span>
                                            {biz.location && (
                                                <span className="text-xs font-bold text-slate-500 truncate flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                    {biz.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 sm:self-center mt-4 sm:mt-0 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-100 sm:border-0 flex-wrap">
                                    <Link
                                        href={`/directory/${biz.id}`}
                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                        View
                                    </Link>
                                    {activeTab === 'pending' ? (
                                        <button
                                            onClick={() => handleApprove(biz.id, biz.business_name)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">verified</span>
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRevoke(biz.id, biz.business_name)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                                            Revoke
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(biz.id, biz.business_name, activeTab === 'verified')}
                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
