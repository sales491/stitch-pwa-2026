import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Suspense } from 'react';
import PostBoatListing from '@/components/PostBoatListing';

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'List Your Boat Service | Marinduque Market Hub',
    description: 'Register your island hopping or boat tour service in Marinduque.',
};

export default async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/island-hopping/list');
    return (
        <Suspense fallback={<div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Loading...</div>}>
            <PostBoatListing />
        </Suspense>
    );
}
