'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: 'Authentication required' };
    }

    // Check if admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized: Admins only' };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const location_tag = formData.get('location_tag') as string;
    const cover_image = formData.get('cover_image') as string || null;
    const isDraft = formData.get('is_draft') === 'true';

    if (!title || !content) {
        return { error: 'Title and content are required' };
    }

    const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');

    const { data, error } = await supabase
        .from('foreigner_blog')
        .insert([
            {
                title,
                content,
                excerpt,
                location_tag,
                cover_image,
                author_id: user.id,
                status: isDraft ? 'draft' : 'published',
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating blog post:', error);
        return { error: 'Failed to create blog post' };
    }

    revalidatePath('/the-hidden-foreigner-blog-feed');
    return { success: true, post: data };
}
