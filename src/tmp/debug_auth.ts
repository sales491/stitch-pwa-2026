import { createClient } from './utils/supabase/server';

async function debug() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current User ID:', user?.id);

    if (user) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        console.log('Profile lookup:', { profile, error });
    }
}

debug();
