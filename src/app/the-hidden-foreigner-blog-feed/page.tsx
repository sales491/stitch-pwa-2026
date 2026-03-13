import type { Metadata } from 'next';
import TheHiddenForeignerBlogFeed from '@/components/TheHiddenForeignerBlogFeed';
import { createClient } from '@/utils/supabase/server';
import { isAdmin as checkIsAdmin } from '@/utils/roles';

export const metadata: Metadata = {
    title: 'The Hidden Foreigner Blog — Island Life Stories',
    description: 'Read stories and guides from foreigners living in Marinduque, Philippines. Tips on island life, expat advice, cultural experiences, and insider recommendations.',
    keywords: ['foreigner blog Marinduque', 'expat Philippines blog', 'island life stories', 'living in Philippines', 'Marinduque expat guide'],
    openGraph: {
        title: 'The Hidden Foreigner Blog',
        description: 'Island life stories and expat perspectives from Marinduque, Philippines.',
        url: 'https://marinduquemarket.com/the-hidden-foreigner-blog-feed',
    },
    alternates: { canonical: 'https://marinduquemarket.com/the-hidden-foreigner-blog-feed' },
};

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    // 1. Check database profile
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    // 2. Check either database role OR hardcoded email list
    isAdmin = (profile?.role === 'admin') || checkIsAdmin(user.email);
  }

  const { data: posts } = await supabase
    .from('foreigner_blog')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return <TheHiddenForeignerBlogFeed posts={posts || []} isAdmin={isAdmin} />;
}
