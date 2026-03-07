const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDelete() {
    const { data: listings } = await supabase.from('listings').select('id, title').limit(1);
    if (!listings || listings.length === 0) {
        console.log("No listings found!");
        return;
    }
    const targetId = listings[0].id;
    console.log("Found listing to delete:", targetId, listings[0].title);

    const { data, error, count } = await supabase.from('listings').delete().eq('id', targetId).select();

    console.log("Delete response Data:", data);
    console.log("Delete response Error:", error);
    console.log("Delete response Count:", count);
}

testDelete();
