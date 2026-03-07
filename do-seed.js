const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rhrkxuoybkdfdrknckjd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocmt4dW95YmtkZmRya25ja2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUxMDE5MiwiZXhwIjoyMDg3MDg2MTkyfQ.i2c7VW9uXoaEu9tZyD0k9OESiluK1OEkaGQxX7Z8qaU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    const entry = {
        title: "Test Dummy Listing from Admin",
        price: "1500",
        category: "Electronics",
        town: "Boac",
        description: "This is a dummy listing generated to test the deletion feature. It has enough characters to be over twenty.",
        condition: "Good",
        user_id: "df6f87cb-f65e-4baf-8afd-cada5a00a63cd",
        slug: "dummy-listing-admin-" + Date.now(),
        img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop"
    };

    console.log("Inserting:", entry);
    const { data, error } = await supabase.from('listings').insert(entry).select();

    if (error) {
        console.error("Error inserting:", error);
    } else {
        console.log("Success! Inserted:", data);
    }
}

seed();
