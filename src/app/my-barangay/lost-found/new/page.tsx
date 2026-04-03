import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateLostFoundForm from '@/components/CreateLostFoundForm';
import PageHeader from '@/components/PageHeader';

export const metadata = {
    title: 'Report Lost or Found — Marinduque Market Hub',
};

export default async function NewLostFoundPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/my-barangay/lost-found/new');
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <PageHeader title="New Report" subtitle="Lost & Found" emoji="📝" />

            <CreateLostFoundForm />
        </main>
    );
}
