'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteLiveEvent(eventId: string) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('live_selling_events')
        .delete()
        .eq('id', eventId)
        .eq('seller_id', user.id); 
        
    if (error) {
        console.error("Error deleting event:", error);
        throw new Error("Failed to delete event.");
    }
    
    revalidatePath('/live-selling');
    return { success: true };
}

export async function updateLiveEvent(eventId: string, data: any) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('live_selling_events')
        .update({
            platform: data.platform,
            title: data.title,
            stream_link: data.stream_link,
            scheduled_start: data.scheduled_start,
            estimated_duration: data.estimated_duration
        })
        .eq('id', eventId)
        .eq('seller_id', user.id);
        
    if (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event.");
    }
    
    revalidatePath('/live-selling');
    return { success: true };
}
