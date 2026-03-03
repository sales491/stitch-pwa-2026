'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import AdminActions from './AdminActions';

interface QueuedItem {
  id: string;
  content_type: string;
  content_id: string;
  status: string;
  flag_count: number;
  queued_at: string;
  // Metadata fields for display
  title?: string;
  description?: string;
  location?: string;
  reasons?: string;
}

export default function MarinduqueConnectAdminDashboard() {
  const [items, setItems] = useState<QueuedItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'moderation' | 'users'>('moderation');
  const supabase = createClient();

  useEffect(() => {
    fetchQueue();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching users:', error);
    else setUsers(data || []);
  };

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('moderation_queue')
      .select('*')
      .order('queued_at', { ascending: false });

    if (error) {
      console.error('Error fetching queue:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (contentId: string, contentType: string, newStatus: string) => {
    const { error } = await supabase
      .from('moderation_queue')
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(`Content ${newStatus} successfully.`);
      fetchQueue();
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) alert(`Error: ${error.message}`);
    else {
      alert(`User role updated to ${newRole}`);
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("CRITICAL: This will permanently delete this user's login account and all their data from Supabase. Continue?")) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          adminEmail: session?.user?.email
        }),
      });

      const result = await response.json();

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert('User has been completely removed from the project.');
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to connect to the deletion server.');
    } finally {
      setLoading(false);
    }
  };

  const flaggedItems = items.filter(i => i.status === 'pending' && i.flag_count >= 3);
  const pendingInitialItems = items.filter(i => i.status === 'pending' && i.flag_count < 3);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl border-x border-stone-200 dark:border-stone-800">
      <header className="sticky top-0 z-20 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md px-4 py-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/marinduque-connect-home-feed" className="p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-text-primary-light dark:text-text-primary-dark flex items-center justify-center">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-100 dark:border-green-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-300">System OK</span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Tab Switcher */}
        <div className="px-4 mt-6">
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'moderation' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-slate-500'}`}
            >
              Moderation
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'users' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-slate-500'}`}
            >
              User Management
            </button>
          </div>
        </div>

        {activeTab === 'moderation' ? (
          <div className="space-y-6">
            <div className="px-4 mt-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Moderation Queue</h2>
              <button onClick={fetchQueue} className="p-2 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>

            {/* Section 1: Flagged Content */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <span className="material-symbols-outlined shrink-0 text-xl font-bold">report</span>
                  <div>
                    <h3 className="font-bold text-sm">Flagged Content (Hidden)</h3>
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Requires Immediate Action</p>
                  </div>
                </div>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{flaggedItems.length} Items</span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-10 text-slate-400 text-sm italic">Loading...</div>
                ) : flaggedItems.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700">
                    <p className="text-slate-400 text-xs">No flagged items to review.</p>
                  </div>
                ) : flaggedItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      {item.flag_count} Flags
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400 text-2xl">
                          {item.content_type === 'listing' ? 'sell' : item.content_type === 'job' ? 'work' : 'article'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">{item.content_type}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">ID: {item.content_id}</h4>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <AdminActions
                        contentType={item.content_type as any}
                        contentId={item.content_id}
                        variant="button"
                        className="w-full"
                        onDelete={fetchQueue}
                      />
                      <button
                        onClick={() => handleStatusUpdate(item.content_id, item.content_type, 'approved')}
                        className="flex-1 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4">
              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800" />
            </div>

            {/* Section 2: Pending Initial Review */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined shrink-0 text-xl font-bold">pending_actions</span>
                  <h3 className="font-bold text-sm">Pending Approval</h3>
                </div>
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingInitialItems.length}</span>
              </div>

              <div className="space-y-3">
                {pendingInitialItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full shrink-0 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-xl">
                          {item.content_type === 'business' ? 'storefront' : 'commute'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{item.content_type}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">ID: {item.content_id}</h4>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(item.content_id, item.content_type, 'approved')}
                        className="flex-1 py-1.5 bg-primary/20 text-slate-800 dark:text-primary font-bold text-xs rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.content_id, item.content_type, 'rejected')}
                        className="flex-1 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg"
                      >
                        Reject
                      </button>
                      <AdminActions contentType={item.content_type as any} contentId={item.content_id} variant="icon" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 px-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Users ({users.length})</h2>
              <button onClick={fetchUsers} className="p-2 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{user.full_name || 'Anonymous'}</h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.role === 'user' ? (
                      <button
                        onClick={() => updateUserRole(user.id, 'moderator')}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg hover:bg-blue-100"
                      >
                        Make Moderator
                      </button>
                    ) : user.role === 'moderator' ? (
                      <button
                        onClick={() => updateUserRole(user.id, 'user')}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg"
                      >
                        Demote to User
                      </button>
                    ) : null}

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg ml-auto"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
