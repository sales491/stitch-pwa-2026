import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateNewListing from '@/components/CreateNewListing';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/create-new-listing');
  return <CreateNewListing />;
}
