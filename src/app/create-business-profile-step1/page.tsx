import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateBusinessProfileStep1 from '@/components/CreateBusinessProfileStep1';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/create-business-profile-step1');
  return <CreateBusinessProfileStep1 />;
}
