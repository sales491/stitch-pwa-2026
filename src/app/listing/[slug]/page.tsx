import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

// Redirect /listing/[slug] → /marketplace/[id] (the canonical detail page)
export default async function Page({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: row } = await supabase
        .from('listings')
        .select('id')
        .eq('slug', slug)
        .single();

    if (!row) notFound();

    redirect(`/marketplace/${row.id}`);
}

