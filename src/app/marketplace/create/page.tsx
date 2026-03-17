import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ClientPage from './ClientPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/marketplace/create');
  return <ClientPage />;
}
