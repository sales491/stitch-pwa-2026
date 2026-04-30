import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import FAQClient from './FAQClient';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Help Center & FAQ - Marinduque Connect',
  description: 'Frequently asked questions for Marinduque Connect general users, businesses, and operators. Find answers about the marketplace, jobs, directory, and community features.',
  keywords: ['Marinduque FAQ', 'Marinduque help center', 'how to use Marinduque Market', 'Marinduque marketplace guide', 'Marinduque community help', 'Marinduque business FAQ'],
  openGraph: {
    title: 'Help Center & FAQ — Marinduque Connect',
    description: 'Find answers to frequently asked questions about using Marinduque Market Hub — for general users, businesses, and operators.',
    url: 'https://marinduquemarket.com/faq',
  },
  alternates: hreflangAlternates('/faq'),
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

      <PageHeader title="Help & FAQ" subtitle="Common Questions" />

      <FAQClient initialFaqs={safeFaqs} />

      {/* Contact card */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1A1A1A] px-5 py-5 mt-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Still have questions?{' '}
          <Link href="/contact" className="text-[#C62828] font-semibold hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
