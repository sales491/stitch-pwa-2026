import { createClient } from '@/utils/supabase/server';
import LocalBusinessProfilePage from '@/components/LocalBusinessProfilePage';
import { notFound } from 'next/navigation';

export default async function BusinessProfileDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the business profile
    const { data: business, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !business) {
        console.error("Error fetching business:", error);
        return notFound();
    }

    return <LocalBusinessProfilePage business={business} />;
}
