const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rhrkxuoybkdfdrknckjd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocmt4dW95YmtkZmRya25ja2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUxMDE5MiwiZXhwIjoyMDg3MDg2MTkyfQ.i2c7VW9uXoaEu9tZyD0k9OESiluK1OEkaGQxX7Z8qaU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        const { data: profiles, error: pErr } = await supabase.from('profiles').select('id').limit(1);
        if (pErr) throw pErr;
        if (!profiles || profiles.length === 0) {
            console.error('No profiles found');
            return;
        }
        const userId = profiles[0].id;

        const entry = {
            title: "Dummy Listing to Test Delete",
            price: "1500",
            category: "Electronics",
            town: "Boac",
            description: "This is a dummy listing generated to test the deletion feature. It has enough characters.",
            condition: "Good",
            user_id: userId,
            status: "published",
            slug: "dummy-listing-" + Date.now()
        };

        const { data, error } = await supabase.from('listings').insert(entry).select();
        if (error) throw error;
        console.log("Successfully inserted Dummy Listing:");
        console.log(data);
    } catch (e) {
        console.error(e);
    }
}

run();
