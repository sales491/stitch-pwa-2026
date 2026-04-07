'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface Notification {
    id: string;
    title: string;
    message: string;
    payload?: any;
    is_read: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    hasPendingApprovals: boolean;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    const fetchNotifications = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const [hasPendingApprovals, setHasPendingApprovals] = useState(false);

    const fetchPendingCount = useCallback(async (userId: string) => {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
        if (profile?.role === 'admin' || profile?.role === 'moderator') {
            const { count: bizCount } = await supabase.from('business_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', false);
            const { count: listCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
            setHasPendingApprovals((bizCount || 0) + (listCount || 0) > 0);
        } else {
            setHasPendingApprovals(false);
        }
    }, [supabase]);



    // Effect 1: Handle Auth State
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchNotifications(session.user.id);
                fetchPendingCount(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchNotifications(session.user.id);
                fetchPendingCount(session.user.id);
            } else {
                setNotifications([]);
                setHasPendingApprovals(false);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, fetchNotifications, fetchPendingCount]);

    // Effect 2: Handle Realtime Subscriptions ONLY if user is logged in
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`public:notifications:${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications'
            }, (payload) => {
                if ((payload.new as any).user_id === user.id) {
                    fetchNotifications(user.id);
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'business_profiles' }, () => {
                fetchPendingCount(user.id);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
                fetchPendingCount(user.id);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, fetchNotifications, fetchPendingCount, user?.id]);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            hasPendingApprovals,
            loading,
            markAsRead,
            markAllAsRead,
            refresh: () => user ? Promise.all([fetchNotifications(user.id), fetchPendingCount(user.id)]).then(() => { }) : Promise.resolve()
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
