import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkTable() {
    const { data, error } = await supabase.from('posts').select('*').limit(1);
    console.log('Posts query result:', { data, error });
}

checkTable();
