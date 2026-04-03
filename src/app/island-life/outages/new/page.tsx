import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CreateOutageForm from '@/components/CreateOutageForm';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Report Outage — Marinduque Market Hub' };

export default async function NewOutagePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/island-life/outages/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <PageHeader title="Report an Outage" subtitle="Outage Reports" emoji="📝" />
            <CreateOutageForm />
        </main>
    );
}
