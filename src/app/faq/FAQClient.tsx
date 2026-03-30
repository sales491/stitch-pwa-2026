'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FAQ } from './page';

export default function FAQClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL tab syncing
  const activeTabParam = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(activeTabParam);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Sync tab state with URL without hard navigation
  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/faq?tab=${tab}`, { scroll: false });
  };

  // Filter based on active tab AND search query
  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesTab = faq.category === activeTab;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
    // If they are searching, ignore the tab constraint so they search everything
    // Or keep tab constraint and only search within it. (Searching within tab is cleaner)
    return matchesTab && matchesSearch;
  });

  const categories = [
    { id: 'general', label: 'General Users' },
    { id: 'business', label: 'Local Business' },
    { id: 'operator', label: 'Transport & Ops' },
    { id: 'palengke', label: 'Palengke Sellers' },
  ];

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTabChange(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              activeTab === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <h2 className="text-base">{faq.question}</h2>
                <span className="shrink-0 rounded-full bg-white dark:bg-slate-700 p-1.5 text-gray-900 sm:p-3 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                {faq.answer}
              </div>
            </details>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            {searchQuery ? 'No FAQs found for your search.' : 'There are no questions in this category yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
