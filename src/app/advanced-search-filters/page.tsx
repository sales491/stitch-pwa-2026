import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';

export const metadata: Metadata = {
  title: 'Advanced Search — Marinduque Market Hub',
  description: 'Search across Marinduque Market Hub — find businesses, marketplace listings, jobs, events, news, and community posts with advanced filters.',
  keywords: ['search Marinduque', 'Marinduque advanced search', 'find businesses Marinduque', 'search marketplace Marinduque', 'Marinduque directory search', 'Marinduque jobs search'],
  openGraph: {
    title: 'Advanced Search — Marinduque Market Hub',
    description: 'Search across all Marinduque Market Hub sections with advanced filters.',
    url: 'https://marinduquemarket.com/advanced-search-filters',
  },
  alternates: hreflangAlternates('/advanced-search-filters'),
};

export default function AdvancedSearchPage() {
  return <AdvancedSearchFilters />;
}
