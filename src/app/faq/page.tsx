import { createClient } from '@/utils/supabase/server';
import FAQClient from './FAQClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center & FAQ - Marinduque Connect',
  description: 'Frequently asked questions for Marinduque Connect general users, businesses, and operators.',
};

// Define structure
export type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export const revalidate = 3600; // Cache for 1 hour

export default async function FAQPage() {
  const supabase = await createClient();
  
  // Fetch FAQs
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: true });
    
  // If table doesn't exist yet, we drop to empty array rather than breaking
  const safeFaqs: FAQ[] = data || [];

  // Generate Google Rich Snippet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: safeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Help Center</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Find answers to common questions about using Marinduque Connect.
        </p>
      </div>

      <FAQClient initialFaqs={safeFaqs} />
    </div>
  );
}
