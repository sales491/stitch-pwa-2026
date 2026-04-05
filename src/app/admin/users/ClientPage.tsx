'use client';

import { useState, useEffect, useTransition } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import {
    adminBanUser,
    adminUnbanUser,
    adminDeleteUser,
    adminUpdateRole
} from '@/app/actions/admin';

type Profile = {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    role: 'user' | 'business' | 'moderator' | 'admin' | 'banned';
    is_verified: boolean;
    created_at: string;
};

const ROLE_STYLES: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-500 border-red-500/30',
    moderator: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    business: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    banned: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    user: 'bg-slate-800 text-slate-400 border-slate-700',
};

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-4 block">warning</span>
                <p className="text-white font-black text-lg mb-2">Are you sure?</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 font-black text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
}

function UserRow({ user, onUpdate }: { user: Profile; onUpdate: (id: string, updates: Partial<Profile>) => void }) {
    const [isPending, startTransition] = useTransition();
    const [expanded, setExpanded] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ action: 'ban' | 'unban' | 'delete' } | null>(null);

    const handleRoleChange = async (newRole: string) => {
        startTransition(async () => {
            const res = await adminUpdateRole(user.id, newRole);
            if (res.success) {
                onUpdate(user.id, { role: newRole as Profile['role'] });
                alert(`Role successfully updated to ${newRole.toUpperCase()}.`);
            } else {
                alert(res.error || 'Failed to update role.');
            }
        });
    };

    const handleBan = () => {
        setConfirmModal(null);
        startTransition(async () => {
            const res = await adminBanUser(user.id);
            if (res.success) onUpdate(user.id, { role: 'banned' });
            else alert(res.error || 'Failed to ban user.');
        });
    };

    const handleUnban = () => {
        setConfirmModal(null);
        startTransition(async () => {
            const res = await adminUnbanUser(user.id);
            if (res.success) onUpdate(user.id, { role: 'user' });
            else alert(res.error || 'Failed to unban user.');
        });
    };

    const handleDelete = () => {
        setConfirmModal(null);
        startTransition(async () => {
            const res = await adminDeleteUser(user.id);
            if (res.success) onUpdate(user.id, { role: '__deleted__' as any });
            else alert(res.error || 'Failed to delete user.');
        });
    };

    const isBanned = user.role === 'banned';

    return (
        <>
            {confirmModal && (
                <ConfirmModal
                    message={
                        confirmModal.action === 'delete'
                            ? `Permanently delete ${user.full_name || 'this user'}? This cannot be undone and will remove all their content.`
                            : confirmModal.action === 'ban'
                            ? `Ban ${user.full_name || 'this user'}? They will lose access to the platform immediately.`
                            : `Unban ${user.full_name || 'this user'} and restore their access?`
                    }
                    onConfirm={confirmModal.action === 'delete' ? handleDelete : confirmModal.action === 'ban' ? handleBan : handleUnban}
                    onCancel={() => setConfirmModal(null)}
                />
            )}
            <tr className={`border-b border-slate-800/50 transition-all group/row ${isPending ? 'opacity-40 pointer-events-none' : ''} ${isBanned ? 'bg-orange-950/20' : 'hover:bg-slate-800/40'}`}>
                {/* Avatar + Name */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-[1.25rem] bg-slate-800 overflow-hidden relative flex-shrink-0 border-2 border-slate-700">
                            {user.avatar_url ? (
                                <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-black text-white text-sm">{user.full_name || 'Anonymous'}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">UID: {user.id.slice(0, 10)}…</p>
                        </div>
                    </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-slate-400 text-xs font-bold">{user.email || '—'}</span>
                </td>

                {/* Role Badge */}
                <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}>
                        {user.role}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Manage user"
                    >
                        <span className="material-symbols-outlined text-base">{expanded ? 'expand_less' : 'more_horiz'}</span>
                    </button>
                </td>
            </tr>

            {/* Expanded actions row */}
            {expanded && (
                <tr className={`border-b border-slate-800/30 ${isBanned ? 'bg-orange-950/10' : 'bg-slate-900/60'}`}>
                    <td colSpan={4} className="px-6 pb-4 pt-2">
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Role selector — only for non-banned */}
                            {!isBanned && (
                                <select
                                    className="bg-slate-950 border border-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                >
                                    <option value="user">Standard User</option>
                                    <option value="business">Business Partner</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            )}

                            {/* Ban / Unban */}
                            {isBanned ? (
                                <button
                                    onClick={() => setConfirmModal({ action: 'unban' })}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600/20 border border-teal-600/30 text-teal-400 text-xs font-black uppercase tracking-widest hover:bg-teal-600/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">lock_open</span> Unban
                                </button>
                            ) : (
                                <button
                                    onClick={() => setConfirmModal({ action: 'ban' })}
                                    disabled={user.role === 'admin'}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest hover:bg-orange-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-sm">block</span> Ban
                                </button>
                            )}

                            {/* Delete */}
                            <button
                                onClick={() => setConfirmModal({ action: 'delete' })}
                                disabled={user.role === 'admin'}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">delete_forever</span> Delete Account
                            </button>

                            {user.role === 'admin' && (
                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Admin accounts are protected</span>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function UserManagement() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<string>('all');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchUsers() {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('role', { ascending: false })
                .order('created_at', { ascending: false });
            if (data) setUsers(data);
            setIsLoading(false);
        }
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdate = (id: string, updates: Partial<Profile>) => {
        if ((updates as any).role === '__deleted__') {
            setUsers(prev => prev.filter(u => u.id !== id));
        } else {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        }
    };

    const filtered = users.filter(u => {
        const matchesSearch = (u.full_name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
            (u.email?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24 font-display">
            <PageHeader title="User Management" subtitle="Accounts & Roles" />

            {/* Filter controls */}
            <div className="flex gap-3 flex-wrap">
                <select
                    className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="business">Business</option>
                    <option value="user">User</option>
                    <option value="banned">Banned</option>
                </select>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search name or email…"
                        className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600 font-bold text-sm w-64"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-base">search</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {(['admin', 'moderator', 'business', 'user', 'banned'] as const).map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(prev => prev === role ? 'all' : role)}
                        className={`p-3 rounded-2xl border text-center transition-all ${roleFilter === role ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                    >
                        <p className="text-lg font-black text-white">{users.filter(u => u.role === role).length}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${ROLE_STYLES[role]?.split(' ')[1] || 'text-slate-400'}`}>{role}</p>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-950/80 border-b border-slate-800 font-black">
                            <tr>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4 hidden md:table-cell">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="py-16 text-center">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="py-16 text-center text-slate-600 font-black uppercase tracking-widest text-xs">No users found</td></tr>
                            ) : (
                                filtered.map(user => (
                                    <UserRow key={user.id} user={user} onUpdate={handleUpdate} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-blue-600/5 rounded-[2rem] border border-blue-500/10">
                <span className="material-symbols-outlined text-blue-500 text-2xl">gavel</span>
                <p className="text-xs text-slate-500 font-bold">Admin accounts cannot be banned or deleted from this panel. Banning blocks platform access immediately via the role check in middleware.</p>
            </div>
        </div>
    );
}
