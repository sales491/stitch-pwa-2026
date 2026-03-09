'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

type Profile = {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    role: 'user' | 'business' | 'moderator' | 'admin';
    is_verified: boolean;
};

export default function UserManagement() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all users on load
    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('role', { ascending: false }) // Admins/Mods first
                .order('created_at', { ascending: false });

            if (data) setUsers(data);
            setIsLoading(false);
        }
        fetchUsers();
    }, [supabase]);

    // Handle changing a user's role
    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        setUpdatingId(userId);

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) {
            // Update local state so the UI reflects the change instantly
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        } else {
            alert('Failed to update user role.');
            console.error(error);
        }

        setUpdatingId(null);
    };

    // Filter users based on search bar
    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24 font-display">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-blue-500">account_tree</span>
                        User Management
                    </h1>
                    <p className="text-slate-500 font-bold max-w-lg leading-relaxed">
                        Authority overrides and role assignments. Search the global registry to promote moderators or verify business accounts.
                    </p>
                </div>

                {/* Search Bar Container */}
                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Search identity or email..."
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600 font-bold text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">search</span>
                </div>
            </div>

            {/* The Central User Repository Table */}
            <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-950/80 border-b border-slate-800 font-black">
                            <tr>
                                <th className="px-8 py-5">Verified Identity</th>
                                <th className="px-8 py-5">Communication</th>
                                <th className="px-8 py-5">Access Tier</th>
                                <th className="px-8 py-5 text-right">Modify Permission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Syncing Registry...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center flex flex-col items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-700 text-5xl mb-4">person_search</span>
                                        <p className="text-slate-500 font-black tracking-tight uppercase text-xs">No matching identities found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-all group/row">

                                        {/* User Avatar & Name */}
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-slate-800 overflow-hidden relative flex-shrink-0 border-2 border-slate-700 shadow-xl group-hover/row:border-blue-500/50 transition-colors">
                                                    {user.avatar_url ? (
                                                        <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full bg-slate-800 text-slate-500">
                                                            <span className="material-symbols-outlined">person</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="font-black text-white text-base tracking-tight flex items-center gap-2">
                                                        {user.full_name || 'Anonymous User'}
                                                        {user.is_verified && <span className="material-symbols-outlined text-blue-400 text-lg" title="Verified Provider">verified</span>}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">UID: {user.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-8 py-5">
                                            <div className="bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-800/50 inline-block font-bold text-slate-400">
                                                {user.email || 'No email associated'}
                                            </div>
                                        </td>

                                        {/* Role Badge */}
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg
                        ${user.role === 'admin' ? 'bg-moriones-red/20 text-red-500 border-red-500/30 shadow-red-500/10' :
                                                    user.role === 'moderator' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/10' :
                                                        user.role === 'business' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                            'bg-slate-800 text-slate-400 border-slate-700'}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Actions (Role Dropdown) */}
                                        <td className="px-8 py-5 text-right">
                                            <div className="relative inline-block">
                                                <select
                                                    disabled={updatingId === user.id}
                                                    className={`appearance-none bg-slate-950 border border-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl p-4 pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer ${updatingId === user.id ? 'opacity-50 animate-pulse' : 'hover:border-slate-500'}`}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <option value="user">Standard User</option>
                                                    <option value="business">Business Partner</option>
                                                    <option value="moderator">Trust Moderator</option>
                                                    <option value="admin">Platform Admin</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base">expand_more</span>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Information Footer */}
            <div className="flex items-center gap-4 p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-500/10 max-w-3xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined">gavel</span>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Moderator Responsibility</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Account promotions grant significant authority. Ensure identity verification is completed before assigning Moderator or Admin tiers.</p>
                </div>
            </div>
        </div>
    );
}
