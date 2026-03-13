import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import NewPaluwaganForm from '@/components/NewPaluwaganForm';

export const metadata = { title: 'Create Paluwagan Group — Marinduque Market Hub' };

export default async function NewPaluwaganPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/my-barangay/paluwagan/new');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10]">
            <NewPaluwaganForm />
        </main>
    );
}
