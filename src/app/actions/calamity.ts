'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type CalamityType = 'typhoon' | 'flood' | 'earthquake' | 'fire' | 'road' | 'other';
export type CalamitySeverity = 'low' | 'moderate' | 'high' | 'critical';

export type CalamityAlert = {
    id: string;
    reported_by: string | null;
    type: CalamityType;
    severity: CalamitySeverity;
    municipality: string;
    barangay: string | null;
    title: string;
    description: string | null;
    status: 'active' | 'resolved';
    resolved_at: string | null;
    created_at: string;
};

export type CalamityFilters = {
    type?: CalamityType | 'all';
    municipality?: string;
    severity?: CalamitySeverity | 'all';
    status?: 'active' | 'resolved' | 'all';
    page?: number;
};

const PAGE_SIZE = 20;

export async function getCalamityAlerts(filters: CalamityFilters = {}) {
    const supabase = await createClient();
    const page = filters.page ?? 0;

    let query = supabase
        .from('calamity_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
    if (filters.municipality && filters.municipality !== 'All') query = query.eq('municipality', filters.municipality);
    if (filters.severity && filters.severity !== 'all') query = query.eq('severity', filters.severity);

    const statusFilter = filters.status ?? 'active';
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);

    const { data, error } = await query;
    if (error) { console.error('[getCalamityAlerts]', error); return []; }
    return (data ?? []) as CalamityAlert[];
}

export type CreateCalamityData = {
    type: CalamityType;
    severity: CalamitySeverity;
    municipality: string;
    barangay?: string;
    title: string;
    description?: string;
};

export async function createCalamityAlert(data: CreateCalamityData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'You must be logged in to report.' };

    if (!data.title.trim()) return { success: false, error: 'Title is required.' };

    const { error } = await supabase.from('calamity_alerts').insert([{
        reported_by: user.id,
        type: data.type,
        severity: data.severity,
        municipality: data.municipality,
        barangay: data.barangay?.trim() || null,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        status: 'active',
    }]);

    if (error) { console.error('[createCalamityAlert]', error); return { success: false, error: error.message }; }

    revalidatePath('/my-barangay/calamity');
    return { success: true };
}

export async function resolveCalamityAlert(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Fetch the alert to check ownership
    const { data: alert } = await supabase
        .from('calamity_alerts')
        .select('reported_by')
        .eq('id', id)
        .single();

    // Fetch caller's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isOwner = alert?.reported_by === user.id;
    const isPrivileged = profile?.role === 'admin' || profile?.role === 'moderator';

    if (!isOwner && !isPrivileged) {
        return { success: false, error: 'You can only resolve alerts you reported.' };
    }

    const { error } = await supabase
        .from('calamity_alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/my-barangay/calamity');
    return { success: true };
}

export async function deleteCalamityAlert(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Fetch the alert to check ownership
    const { data: alert } = await supabase
        .from('calamity_alerts')
        .select('reported_by')
        .eq('id', id)
        .single();

    // Fetch caller's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isOwner = alert?.reported_by === user.id;
    const isPrivileged = profile?.role === 'admin' || profile?.role === 'moderator';

    if (!isOwner && !isPrivileged) {
        return { success: false, error: 'You can only delete alerts you reported.' };
    }

    const { error } = await supabase.from('calamity_alerts').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/my-barangay/calamity');
    return { success: true };
}
