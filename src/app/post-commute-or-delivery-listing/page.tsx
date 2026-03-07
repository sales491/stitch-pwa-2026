import { Suspense } from 'react';
import PostCommuteOrDeliveryListing from '@/components/PostCommuteOrDeliveryListing';

export default function Page() {
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
