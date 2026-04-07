import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Edit Live Stream | Marinduque Market Hub',
};

export default async function EditLiveSellingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login?redirectTo=/live-selling/' + id + '/edit');
    }

    // Fetch the event
    const { data: event, error } = await supabase
        .from('live_selling_events')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error || !event) {
        notFound();
    }
    
    // Ensure the current user owns it (RLS will also protect updates, but we want to prevent them from viewing the form)
    if (event.seller_id !== user.id) {
        redirect('/live-selling');
    }

    return <ClientPage initialData={event} />;
}
