/**
 * SeoTextBlock — Server-rendered text block for AI Answer Engine Optimization.
 * 
 * This component renders natural-language content that AI crawlers (Gemini, 
 * ChatGPT, Perplexity) can extract and present as answers. The text is 
 * visually styled as a subtle info section at the bottom of the page,
 * but is fully crawlable and indexable.
 * 
 * Usage:
 *   <SeoTextBlock heading="About Marinduque Ferry Schedules">
 *     <p>Marinduque has three major ports...</p>
 *   </SeoTextBlock>
 */

export default function SeoTextBlock({
    heading,
    children,
}: {
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <article className="max-w-2xl mx-auto px-6 py-8 mb-8">
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-zinc-600 mb-4">
                    {heading}
                </h2>
                <div className="text-sm text-slate-400 dark:text-zinc-500 leading-relaxed space-y-3 font-medium">
                    {children}
                </div>
            </div>
        </article>
    );
}
