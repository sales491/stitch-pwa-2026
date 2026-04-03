import type { Metadata } from 'next';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';

export const metadata: Metadata = {
    title: 'Search — Find Anything in Marinduque',
    description: 'Search listings, jobs, events, businesses, and community posts across all of Marinduque island.',
};

export default function Page() {
  return <AdvancedSearchFilters />;
}
