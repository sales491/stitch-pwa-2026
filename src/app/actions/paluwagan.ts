'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaluwaganGroup = {
    id: string;
    name: string;
    organizer_id: string;
    amount: number;
    cycle: 'weekly' | 'biweekly' | 'monthly';
    winner_order: 'rotating' | 'organizer';
    status: 'active' | 'completed' | 'cancelled';
    invite_code: string;
    total_cycles: number;
    started_at: string;
    created_at: string;
};

export type PaluwaganMember = {
    id: string;
    group_id: string;
    user_id: string;
    slot_number: number;
    joined_at: string;
    profile?: { full_name: string | null; avatar_url: string | null } | null;
};

export type PaluwaganCycle = {
    id: string;
    group_id: string;
    cycle_number: number;
    winner_member_id: string | null;
    due_date: string;
    completed_at: string | null;
    pot_amount: number;
    payments?: PaluwaganPayment[];
};

export type PaluwaganPayment = {
    id: string;
    cycle_id: string;
    member_id: string;
    paid_at: string;
    confirmed_by: string;
};

export type GroupDetail = PaluwaganGroup & {
    members: PaluwaganMember[];
    cycles: PaluwaganCycle[];
    my_member_id: string | null;
    is_organizer: boolean;
};

export type MyGroupSummary = PaluwaganGroup & {
    is_organizer: boolean;
    member_count: number;
    current_cycle: number | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function nextDueDate(startDate: Date, cycle: string, cycleNumber: number): Date {
    const d = new Date(startDate);
    if (cycle === 'weekly') d.setDate(d.getDate() + 7 * cycleNumber);
    else if (cycle === 'biweekly') d.setDate(d.getDate() + 14 * cycleNumber);
    else d.setMonth(d.getMonth() + cycleNumber); // monthly
    return d;
}

function toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export type CreateGroupData = {
    name: string;
    amount: number;
    cycle: 'weekly' | 'biweekly' | 'monthly';
    winner_order: 'rotating' | 'organizer';
    total_cycles: number;
    started_at: string; // ISO date string
};

export async function createGroup(data: CreateGroupData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Generate unique invite code
    let invite_code = generateInviteCode();
    let attempts = 0;
    while (attempts < 5) {
        const { data: existing } = await supabase
            .from('paluwagan_groups')
            .select('id')
            .eq('invite_code', invite_code)
            .maybeSingle();
        if (!existing) break;
        invite_code = generateInviteCode();
        attempts++;
    }

    const startDate = new Date(data.started_at);
    const potAmount = data.amount * data.total_cycles;

    // Insert group
    const { data: group, error: groupErr } = await supabase
        .from('paluwagan_groups')
        .insert([{
            name: data.name.trim(),
            organizer_id: user.id,
            amount: data.amount,
            cycle: data.cycle,
            winner_order: data.winner_order,
            total_cycles: data.total_cycles,
            invite_code,
            started_at: data.started_at,
            status: 'active',
        }])
        .select()
        .single();

    if (groupErr || !group) {
        console.error('[createGroup]', groupErr?.message);
        return { success: false, error: groupErr?.message ?? 'Failed to create group.' };
    }

    // Add organizer as slot 1 member
    const { data: member, error: memberErr } = await supabase
        .from('paluwagan_members')
        .insert([{ group_id: group.id, user_id: user.id, slot_number: 1 }])
        .select()
        .single();

    if (memberErr || !member) {
        console.error('[createGroup member]', memberErr?.message);
        return { success: false, error: 'Group created but failed to add organizer as member.' };
    }

    // Create all cycle stubs
    const cycleRows = Array.from({ length: data.total_cycles }, (_, i) => ({
        group_id: group.id,
        cycle_number: i + 1,
        due_date: toDateStr(nextDueDate(startDate, data.cycle, i)),
        pot_amount: potAmount,
        // rotating mode: winner auto-assigned to slot i+1 later when members join
        winner_member_id: null,
    }));

    const { error: cyclesErr } = await supabase
        .from('paluwagan_cycles')
        .insert(cycleRows);

    if (cyclesErr) {
        console.error('[createGroup cycles]', cyclesErr?.message);
    }

    revalidatePath('/my-barangay/paluwagan');
    return { success: true, groupId: group.id };
}

export async function joinGroup(inviteCode: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Find group
    const { data: group, error: groupErr } = await supabase
        .from('paluwagan_groups')
        .select('id, total_cycles, status')
        .eq('invite_code', inviteCode.toUpperCase().trim())
        .maybeSingle();

    if (groupErr || !group) return { success: false, error: 'Invalid invite code.' };
    if (group.status !== 'active') return { success: false, error: 'This group is no longer active.' };

    // Check if already a member
    const { data: existing } = await supabase
        .from('paluwagan_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .maybeSingle();
    if (existing) return { success: false, error: 'You are already in this group.' };

    // Get current member count for next slot
    const { data: members } = await supabase
        .from('paluwagan_members')
        .select('slot_number')
        .eq('group_id', group.id)
        .order('slot_number', { ascending: false })
        .limit(1);

    const nextSlot = (members?.[0]?.slot_number ?? 0) + 1;
    if (nextSlot > group.total_cycles) {
        return { success: false, error: 'This group is full.' };
    }

    const { error: joinErr } = await supabase
        .from('paluwagan_members')
        .insert([{ group_id: group.id, user_id: user.id, slot_number: nextSlot }]);

    if (joinErr) return { success: false, error: joinErr.message };

    revalidatePath('/my-barangay/paluwagan');
    return { success: true, groupId: group.id };
}

export async function getMyGroups(): Promise<MyGroupSummary[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Groups where I am a member
    const { data: memberships } = await supabase
        .from('paluwagan_members')
        .select('group_id')
        .eq('user_id', user.id);

    const groupIds = (memberships ?? []).map(m => m.group_id);
    // Also include groups I organize but haven't joined as member (edge case)
    if (groupIds.length === 0) {
        const { data: ownedGroups } = await supabase
            .from('paluwagan_groups')
            .select('*')
            .eq('organizer_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        return (ownedGroups ?? []).map(g => ({
            ...(g as PaluwaganGroup),
            is_organizer: true,
            member_count: 1,
            current_cycle: 1,
        }));
    }

    const { data: groups } = await supabase
        .from('paluwagan_groups')
        .select('*')
        .in('id', groupIds)
        .order('created_at', { ascending: false });

    if (!groups) return [];

    // Get member counts and current cycle numbers for each group
    const { data: memberCounts } = await supabase
        .from('paluwagan_members')
        .select('group_id')
        .in('group_id', groupIds);

    const { data: currentCycles } = await supabase
        .from('paluwagan_cycles')
        .select('group_id, cycle_number, completed_at')
        .in('group_id', groupIds)
        .is('completed_at', null)
        .order('cycle_number', { ascending: true });

    const countMap = new Map<string, number>();
    for (const m of memberCounts ?? []) {
        countMap.set(m.group_id, (countMap.get(m.group_id) ?? 0) + 1);
    }
    const cycleMap = new Map<string, number>();
    for (const c of currentCycles ?? []) {
        if (!cycleMap.has(c.group_id)) cycleMap.set(c.group_id, c.cycle_number);
    }

    return groups.map(g => ({
        ...(g as PaluwaganGroup),
        is_organizer: g.organizer_id === user.id,
        member_count: countMap.get(g.id) ?? 0,
        current_cycle: cycleMap.get(g.id) ?? null,
    }));
}

export async function getGroup(id: string): Promise<GroupDetail | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: group, error } = await supabase
        .from('paluwagan_groups')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !group) return null;

    // Members
    const { data: memberRows } = await supabase
        .from('paluwagan_members')
        .select('*')
        .eq('group_id', id)
        .order('slot_number');

    const members = (memberRows ?? []) as PaluwaganMember[];

    // Fetch profiles for members
    const userIds = [...new Set(members.map(m => m.user_id))];
    if (userIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
        const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));
        for (const m of members) {
            m.profile = profileMap.get(m.user_id) ?? null;
        }
    }

    // Cycles
    const { data: cycleRows } = await supabase
        .from('paluwagan_cycles')
        .select('*')
        .eq('group_id', id)
        .order('cycle_number');

    const cycles = (cycleRows ?? []) as PaluwaganCycle[];

    // Payments for all cycles
    const cycleIds = cycles.map(c => c.id);
    if (cycleIds.length > 0) {
        const { data: payments } = await supabase
            .from('paluwagan_payments')
            .select('*')
            .in('cycle_id', cycleIds);

        const paymentsByCycle = new Map<string, PaluwaganPayment[]>();
        for (const p of payments ?? []) {
            const list = paymentsByCycle.get(p.cycle_id) ?? [];
            list.push(p as PaluwaganPayment);
            paymentsByCycle.set(p.cycle_id, list);
        }
        for (const c of cycles) {
            c.payments = paymentsByCycle.get(c.id) ?? [];
        }
    }

    const myMember = members.find(m => m.user_id === user.id) ?? null;

    return {
        ...(group as PaluwaganGroup),
        members,
        cycles,
        my_member_id: myMember?.id ?? null,
        is_organizer: group.organizer_id === user.id,
    };
}

export async function markPaid(cycleId: string, memberId: string, paid: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Verify organizer
    const { data: cycle } = await supabase
        .from('paluwagan_cycles')
        .select('group_id')
        .eq('id', cycleId)
        .single();
    if (!cycle) return { success: false, error: 'Cycle not found.' };

    const { data: group } = await supabase
        .from('paluwagan_groups')
        .select('organizer_id, invite_code')
        .eq('id', cycle.group_id)
        .single();
    if (!group || group.organizer_id !== user.id) {
        return { success: false, error: 'Only the organizer can mark payments.' };
    }

    if (paid) {
        const { error } = await supabase
            .from('paluwagan_payments')
            .upsert([{ cycle_id: cycleId, member_id: memberId, confirmed_by: user.id, paid_at: new Date().toISOString() }], {
                onConflict: 'cycle_id,member_id',
            });
        if (error) return { success: false, error: error.message };
    } else {
        await supabase
            .from('paluwagan_payments')
            .delete()
            .eq('cycle_id', cycleId)
            .eq('member_id', memberId);
    }

    revalidatePath(`/my-barangay/paluwagan/${cycle.group_id}`);
    return { success: true };
}

export async function assignWinner(cycleId: string, memberId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { data: cycle } = await supabase
        .from('paluwagan_cycles')
        .select('group_id')
        .eq('id', cycleId)
        .single();
    if (!cycle) return { success: false, error: 'Cycle not found.' };

    const { data: group } = await supabase
        .from('paluwagan_groups')
        .select('organizer_id')
        .eq('id', cycle.group_id)
        .single();
    if (!group || group.organizer_id !== user.id) {
        return { success: false, error: 'Only the organizer can assign winners.' };
    }

    const { error } = await supabase
        .from('paluwagan_cycles')
        .update({ winner_member_id: memberId })
        .eq('id', cycleId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/my-barangay/paluwagan/${cycle.group_id}`);
    return { success: true };
}

export async function advanceCycle(groupId: string, cycleId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { data: group } = await supabase
        .from('paluwagan_groups')
        .select('organizer_id, total_cycles')
        .eq('id', groupId)
        .single();
    if (!group || group.organizer_id !== user.id) {
        return { success: false, error: 'Only the organizer can advance cycles.' };
    }

    // Mark current cycle complete
    await supabase
        .from('paluwagan_cycles')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', cycleId);

    // Check if all cycles are done → complete the group
    const { data: remainingCycles } = await supabase
        .from('paluwagan_cycles')
        .select('id')
        .eq('group_id', groupId)
        .is('completed_at', null);

    if (!remainingCycles || remainingCycles.length === 0) {
        await supabase
            .from('paluwagan_groups')
            .update({ status: 'completed' })
            .eq('id', groupId);
    }

    revalidatePath(`/my-barangay/paluwagan/${groupId}`);
    revalidatePath('/my-barangay/paluwagan');
    return { success: true };
}

export async function assignRotatingWinners(groupId: string) {
    // Call after all members have joined to auto-assign cycle winners by slot order
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { data: members } = await supabase
        .from('paluwagan_members')
        .select('id, slot_number')
        .eq('group_id', groupId)
        .order('slot_number');

    const { data: cycles } = await supabase
        .from('paluwagan_cycles')
        .select('id, cycle_number')
        .eq('group_id', groupId)
        .order('cycle_number');

    if (!members || !cycles) return { success: false };

    const updates = cycles
        .map(c => {
            const member = members.find(m => m.slot_number === c.cycle_number);
            return member ? { id: c.id, winner_member_id: member.id } : null;
        })
        .filter(Boolean) as { id: string; winner_member_id: string }[];

    for (const u of updates) {
        await supabase
            .from('paluwagan_cycles')
            .update({ winner_member_id: u.winner_member_id })
            .eq('id', u.id);
    }

    revalidatePath(`/my-barangay/paluwagan/${groupId}`);
    return { success: true };
}

export async function leaveGroup(groupId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { data: group } = await supabase
        .from('paluwagan_groups')
        .select('organizer_id')
        .eq('id', groupId)
        .single();
    if (group?.organizer_id === user.id) {
        return { success: false, error: 'The organizer cannot leave. Cancel the group instead.' };
    }

    await supabase
        .from('paluwagan_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

    revalidatePath('/my-barangay/paluwagan');
    return { success: true };
}

export async function cancelGroup(groupId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated.' };

    const { data: group } = await supabase
        .from('paluwagan_groups')
        .select('organizer_id')
        .eq('id', groupId)
        .single();
    if (!group || group.organizer_id !== user.id) {
        return { success: false, error: 'Only the organizer can cancel this group.' };
    }

    await supabase
        .from('paluwagan_groups')
        .update({ status: 'cancelled' })
        .eq('id', groupId);

    revalidatePath('/my-barangay/paluwagan');
    return { success: true };
}
