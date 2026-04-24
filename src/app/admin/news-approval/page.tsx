import { createAdminClient } from '@/utils/supabase/admin';
import PageHeader from '@/components/PageHeader';
import { approveNews, rejectNews } from './actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewsApprovalPage() {
    const supabase = await createAdminClient();

    const { data: pendingNews } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'pending')
        .order('published_at', { ascending: false });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 pb-24 font-display">
            <div className="flex items-center justify-between">
                <PageHeader title="News Approval" subtitle="Fact-Check AI Drafts" />
                <Link href="/admin" className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200">
                    &larr; Back to Admin
                </Link>
            </div>

            {(!pendingNews || pendingNews.length === 0) ? (
                <div className="bg-white border border-emerald-200 rounded-3xl p-12 text-center shadow-sm">
                    <span className="material-symbols-outlined text-emerald-500 text-5xl mb-4">task_alt</span>
                    <h2 className="text-xl font-black text-slate-800 mb-2">You're all caught up!</h2>
                    <p className="text-slate-500">There are no pending news articles to review.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {pendingNews.map((news) => (
                        <div key={news.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col xl:flex-row h-auto xl:h-[800px]">
                            
                            {/* LEFT SIDE: AI GENERATED DRAFT */}
                            <div className="w-full xl:w-1/2 flex flex-col border-b xl:border-b-0 xl:border-r border-slate-200 h-full">
                                <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-500 mb-1">AI Generated Draft</h3>
                                        <p className="text-xs text-slate-400">Created: {new Date(news.published_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {news.source_url && (
                                            <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="xl:hidden px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                                Source
                                            </a>
                                        )}
                                        <form action={rejectNews}>
                                            <input type="hidden" name="id" value={news.id} />
                                            <button type="submit" className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50 hover:border-red-300 transition-colors">
                                                Reject & Delete
                                            </button>
                                        </form>
                                        <form action={approveNews}>
                                            <input type="hidden" name="id" value={news.id} />
                                            <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition-colors shadow-sm">
                                                Approve & Publish
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1">
                                    <h1 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{news.title}</h1>
                                    <p className="text-slate-600 font-bold mb-6 text-lg leading-relaxed">{news.summary}</p>
                                    
                                    {news.image_url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={news.image_url} alt="Banner" className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm border border-slate-100" />
                                    )}

                                    <div className="prose prose-slate prose-sm max-w-none mb-8" dangerouslySetInnerHTML={{ __html: news.content }} />

                                    {news.key_takeaways && news.key_takeaways.length > 0 && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
                                            <h4 className="font-black text-xs uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">bolt</span>
                                                Key Takeaways
                                            </h4>
                                            <ul className="space-y-2">
                                                {news.key_takeaways.map((takeaway: string, i: number) => (
                                                    <li key={i} className="text-amber-900 text-sm flex gap-3">
                                                        <span className="text-amber-400 mt-0.5">•</span>
                                                        <span>{takeaway}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {news.faq_json && news.faq_json.length > 0 && (
                                        <div>
                                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-4">Frequently Asked Questions</h4>
                                            <div className="space-y-4">
                                                {news.faq_json.map((faq: any, i: number) => (
                                                    <div key={i} className="bg-slate-50 rounded-xl p-4">
                                                        <p className="font-bold text-slate-800 text-sm mb-1">Q: {faq.question}</p>
                                                        <p className="text-slate-600 text-sm">A: {faq.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT SIDE: SOURCE URL FRAME (Hidden on mobile) */}
                            <div className="hidden xl:flex w-1/2 flex-col h-full bg-slate-50 border-l border-slate-200">
                                <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-100">
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">fact_check</span>
                                            Original Source
                                        </h3>
                                        <a href={news.source_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-sm block">
                                            {news.source_url || 'No Source Provided'}
                                        </a>
                                    </div>
                                    <a href={news.source_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                    </a>
                                </div>
                                {news.source_url ? (
                                    <iframe src={news.source_url} className="w-full flex-1 bg-white" title="Source Article" />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">link_off</span>
                                        <p className="text-sm font-bold">No Source URL Provided</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
