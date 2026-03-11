'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveBoatService(id: string) {
    const supabase = await createClient();
    await supabase.from('boat_services').update({ is_approved: true }).eq('id', id);
    revalidatePath('/admin');
}

export async function rejectBoatService(id: string) {
    const supabase = await createClient();
    await supabase.from('boat_services').update({ is_approved: false }).eq('id', id);
    revalidatePath('/admin');
}
