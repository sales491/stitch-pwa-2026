import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // 1. Check if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 2. The Ultimate Security Check: Are they an admin or mod?
    // We check BOTH the database profile role AND our hardcoded emergency list.
    const [{ data: profile }, { isAdmin, isModerator }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        import('@/utils/roles')
    ]);

    const hasAccess = (profile?.role === 'admin' || profile?.role === 'moderator') ||
        (isAdmin(user.email) || isModerator(user.email));

    if (!hasAccess) {
        redirect('/'); // Kick normal users back to the home page silently
    }

    return (
        <>
            {children}
        </>
    );
}
