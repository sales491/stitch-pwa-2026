import type { Metadata } from 'next';
import TheHiddenForeignerBlogFeed from '@/components/TheHiddenForeignerBlogFeed';
import { createClient } from '@/utils/supabase/server';
import { isAdmin as checkIsAdmin } from '@/utils/roles';

export const metadata: Metadata = {
    title: 'The Hidden Foreigner Blog',
    description: 'Stories, guides, and perspectives on life in Marinduque written by foreigners living on the island. Tips for expats, OFW families, and visitors exploring island life.',
    keywords: ['expat Marinduque', 'foreign blog Philippines', 'island life Marinduque', 'living in Marinduque', 'OFW Marinduque blog'],
    openGraph: {
        title: 'The Hidden Foreigner Blog',
        description: 'Expat perspectives and island life stories from Marinduque, Philippines.',
        url: 'https://marinduquemarket.com/blog',
    },
    alternates: { canonical: 'https://marinduquemarket.com/blog' },
};

export default async function BlogPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        isAdmin = (profile?.role === 'admin') || checkIsAdmin(user.email);
    }

    const { data: posts } = await supabase
        .from('foreigner_blog')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    return <TheHiddenForeignerBlogFeed posts={posts || []} isAdmin={isAdmin} />;
}
