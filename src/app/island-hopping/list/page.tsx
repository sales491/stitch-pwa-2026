export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import PostBoatListing from '@/components/PostBoatListing';

export const metadata = {
    title: 'List Your Boat Service | Marinduque Market Hub',
    description: 'Register your island hopping or boat tour service in Marinduque.',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Loading...</div>}>
            <PostBoatListing />
        </Suspense>
    );
}
