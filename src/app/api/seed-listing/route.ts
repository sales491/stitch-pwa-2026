import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// 🔒 Debug route — blocked in production
export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }


    try {
        const supabase = await createAdminClient();

        // 1. Get a user
        const { data: profiles, error: pErr } = await supabase.from('profiles').select('id').limit(1);
        if (pErr) throw pErr;
        if (!profiles || profiles.length === 0) {
            return NextResponse.json({ error: 'No user profile found' }, { status: 400 });
        }

        const userId = profiles[0].id;

        // 2. Insert dummy listing
        const entry = {
            title: "Dummy Listing 123",
            price: "500",
            price_value: 500,
            category: "Electronics",
            town: "Boac",
            description: "A dummy listing added for testing purposes and verifies the img column fix.",
            condition: "Good",
            user_id: userId,
            status: "published",
            slug: "dummy-listing-123-" + Date.now(),
            img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop",
            images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop"],
            posted_ago: "Just now"
        };

        const { data, error } = await supabase.from('listings').insert(entry).select();

        if (error) {
            console.error('Seeding error details:', error);
            return NextResponse.json({ error: error.message, details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, listing: data[0] });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
