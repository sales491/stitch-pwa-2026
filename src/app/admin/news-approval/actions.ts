'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function approveNews(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id');

    if (!id) return;

    await supabase.from('news').update({ status: 'published' }).eq('id', id);
    
    revalidatePath('/admin');
    revalidatePath('/admin/news-approval');
    revalidatePath('/island-life');
    redirect('/admin/news-approval');
}

export async function rejectNews(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id');

    if (!id) return;

    await supabase.from('news').delete().eq('id', id);

    revalidatePath('/admin');
    revalidatePath('/admin/news-approval');
    redirect('/admin/news-approval');
}
