import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 60; // Revalidate every minute

export async function GET() {
    const supabase = await createClient();
    
    // Fetch latest published news
    const { data: articles, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(15);

    if (error || !articles) {
        return new NextResponse('Failed to fetch news feed', { status: 500 });
    }

    let markdown = `# Latest News — Marinduque Market Hub\n\n`;
    markdown += `> Real-time local news and updates from Marinduque Island. For human-readable versions, visit https://marinduquemarket.com/news\n\n`;
    markdown += `---\n\n`;

    articles.forEach(a => {
        const dateStr = new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        markdown += `## ${a.title}\n`;
        markdown += `**Published:** ${dateStr}\n`;
        markdown += `**URL:** https://marinduquemarket.com/news/${a.slug}\n\n`;
        
        if (a.key_takeaways && a.key_takeaways.length > 0) {
            markdown += `### Key Takeaways:\n`;
            a.key_takeaways.forEach((point: string) => {
                markdown += `- ${point}\n`;
            });
            markdown += `\n`;
        }

        markdown += `### Summary:\n`;
        markdown += `${a.summary}\n\n`;

        markdown += `### Content:\n`;
        // Basic HTML stripping since AI can read raw text perfectly fine, avoiding noisy DOM elements
        let cleanContent = a.content
            .replace(/<h2>/g, "\n#### ")
            .replace(/<\/h2>/g, "\n\n")
            .replace(/<p>/g, "")
            .replace(/<\/p>/g, "\n\n")
            .replace(/<ul>/g, "\n")
            .replace(/<\/ul>/g, "\n")
            .replace(/<li>/g, "- ")
            .replace(/<\/li>/g, "\n")
            .replace(/<\/?[^>]+(>|$)/g, ""); // Catch-all for bold/links/images
        
        markdown += `${cleanContent.trim()}\n\n`;
        markdown += `---\n\n`;
    });

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
