import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateCalamityForm from '@/components/CreateCalamityForm';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Post Calamity Alert — Marinduque Market Hub' };

export default async function NewCalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/my-barangay/calamity/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <PageHeader title="Post an Alert" subtitle="Calamity Board" emoji="📢" />
            <CreateCalamityForm />
        </main>
    );
}
