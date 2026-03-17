import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Suspense } from 'react';
import PostCommuteOrDeliveryListing from '@/components/PostCommuteOrDeliveryListing';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/post-commute-or-delivery-listing');
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-moriones-red/30 border-t-moriones-red rounded-full animate-spin" />
      </div>
    }>
      <PostCommuteOrDeliveryListing />
    </Suspense>
  );
}
