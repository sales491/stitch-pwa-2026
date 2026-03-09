import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import PortsClientShell from '@/components/PortsClientShell';

export default async function PortsPage() {
    const supabase = await createClient();

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const { data: updates } = await supabase
        .from('port_updates')
        .select('*, profiles(full_name, avatar_url)')
        .gte('created_at', twelveHoursAgo)
        .order('created_at', { ascending: false })
        .limit(20);

    const latestAlert = updates?.[0] ?? null;

    return <PortsClientShell updates={updates ?? []} latestAlert={latestAlert} />;
}
