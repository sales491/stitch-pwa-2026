'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { OUTAGE_EXPIRY_HOURS, expiresAt } from '@/lib/alert-expiry';

export type OutageReport = {
    id: string;
    reported_by: string | null;
    type: 'power' | 'water';
    barangay: string | null;
    municipality: string;
    description: string | null;
    status: 'active' | 'resolved';
    expires_at: string | null;
    created_at: string;
    resolved_at: string | null;
};

export type OutageFilters = {
    type?: 'power' | 'water' | 'all';
    municipality?: string;
    status?: 'active' | 'resolved' | 'all';
    page?: number;
};

const PAGE_SIZE = 20;

export async function getOutageReports(filters: OutageFilters = {}) {
    const supabase = await createClient();
    const page = filters.page ?? 0;

    let query = supabase
        .from('outage_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
    if (filters.municipality && filters.municipality !== 'All') query = query.eq('municipality', filters.municipality);

    // Default: show active only
    const statusFilter = filters.status ?? 'active';
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);

    const { data, error } = await query;
    if (error) { console.error('[getOutageReports]', error); return []; }
    return (data ?? []) as OutageReport[];
}

export type CreateOutageData = {
    type: 'power' | 'water';
    municipality: string;
    barangay?: string;
    description?: string;
};

export async function createOutageReport(data: CreateOutageData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'You must be logged in to report.' };

    const { error } = await supabase.from('outage_reports').insert([{
        reported_by: user.id,
        type: data.type,
        municipality: data.municipality,
        barangay: data.barangay?.trim() || null,
        description: data.description?.trim() || null,
        status: 'active',
        expires_at: expiresAt(OUTAGE_EXPIRY_HOURS[data.type] ?? 12),
    }]);

    if (error) { console.error('[createOutageReport]', error); return { success: false, error: error.message }; }

    revalidatePath('/island-life/outages');
    return { success: true };
}

export async function resolveOutageReport(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Check ownership or admin role
    const { data: report } = await supabase
        .from('outage_reports').select('reported_by').eq('id', id).single();
    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single();
    const isOwner = report?.reported_by === user.id;
    const isPrivileged = profile?.role === 'admin' || profile?.role === 'moderator';
    if (!isOwner && !isPrivileged) return { success: false, error: 'You can only resolve reports you submitted.' };

    const { error } = await supabase
        .from('outage_reports')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/island-life/outages');
    revalidatePath('/');
    return { success: true };
}

export async function deleteOutageReport(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { error } = await supabase.from('outage_reports').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/island-life/outages');
    revalidatePath('/');
    return { success: true };
}
