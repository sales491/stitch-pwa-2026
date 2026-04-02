'use client';
import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import AdminActions from './AdminActions';
import BackButton from '@/components/BackButton';

const TOWNS = ['All Towns', 'Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];
const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Casual'];

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  salary_range: string;
  description: string;
  slug: string;
  created_at: string;
  expires_at?: string;
  requirements?: string[];
  contact?: {
    phone?: string;
    email?: string;
    facebook?: string;
  };
}

interface Props {
  initialJobs: Job[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: { type: string; town: string; query: string };
}

function FilterChip({
  icon, label, options, value, onChange,
}: {
  icon: string; label: string; options: string[]; value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isFiltered = value !== '' && value !== options[0];
  const displayValue = isFiltered ? value : label;

  React.useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${isFiltered
          ? 'bg-moriones-red/10 border-moriones-red text-moriones-red'
          : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-main dark:text-text-main-dark hover:border-moriones-red/50'
          }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="material-symbols-outlined text-[16px] shrink-0">{icon}</span>
          <span className="truncate">{displayValue}</span>
        </div>
        <span className={`material-symbols-outlined text-[16px] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-border-light dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt || (opt === options[0] && !value)
                  ? 'bg-moriones-red/10 text-moriones-red font-semibold'
                  : 'text-text-main dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-zinc-800'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarinduqueJobsListingFeed({ initialJobs, totalCount, currentPage, pageSize, filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(filters.query);

  const totalPages = Math.ceil(totalCount / pageSize);
  const isFiltered = filters.type || filters.town || filters.query;

  function buildUrl(overrides: { page?: number; type?: string; town?: string; query?: string }) {
    const p = new URLSearchParams();
    const page = overrides.page ?? currentPage;
    const type = overrides.type !== undefined ? overrides.type : filters.type;
    const town = overrides.town !== undefined ? overrides.town : filters.town;
    const query = overrides.query !== undefined ? overrides.query : filters.query;
    if (page > 1) p.set('page', String(page));
    if (type) p.set('type', type);
    if (town) p.set('town', town);
    if (query) p.set('query', query);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ''}`;
  }

  function navigate(overrides: Parameters<typeof buildUrl>[0]) {
    startTransition(() => router.push(buildUrl(overrides)));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ query: searchInput, page: 1 });
  }

  function handleTypeChange(v: string) {
    navigate({ type: v === 'All Types' ? '' : v, page: 1 });
  }

  function handleTownChange(v: string) {
    navigate({ town: v === 'All Towns' ? '' : v, page: 1 });
  }

  function clearFilters() {
    setSearchInput('');
    navigate({ type: '', town: '', query: '', page: 1 });
  }

  return (
    <div className="relative flex w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red pl-1">Marinduque Jobs</h1>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="px-4 pb-3 pt-1">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-background-light dark:bg-background-dark border border-transparent focus-within:border-moriones-red/50 focus-within:ring-2 focus-within:ring-moriones-red/20 transition-all">
            <div className="grid place-items-center h-full w-12 text-text-muted dark:text-text-muted-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="peer h-full w-full outline-none bg-transparent text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark"
              placeholder="Search careers, companies..."
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); navigate({ query: '', page: 1 }); }} className="mr-1 p-2 rounded-lg text-text-muted hover:text-moriones-red transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
            <button type="submit" className="sr-only">Search</button>
          </div>
        </form>

        {/* Filter Chips */}
        <div className="px-4 pb-3 flex gap-2">
          <FilterChip icon="work" label="Type" options={JOB_TYPES} value={filters.type || 'All Types'} onChange={handleTypeChange} />
          <FilterChip icon="location_on" label="Town" options={TOWNS} value={filters.town || 'All Towns'} onChange={handleTownChange} />
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-4 space-y-4 pb-24 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-text-main dark:text-text-main-dark">
            {totalCount} job{totalCount !== 1 ? 's' : ''} found
          </h2>
          {isFiltered && (
            <button onClick={clearFilters} className="text-xs font-medium text-moriones-red hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {initialJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-text-muted/20 mb-4">search_off</span>
            <p className="text-text-main font-black">No jobs found</p>
            <p className="text-xs text-text-muted mt-1">Try a different type or town</p>
          </div>
        )}

        {initialJobs.map((job) => {
          const postedDate = new Date(job.created_at);
          const diffTime = Math.abs(new Date().getTime() - postedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const postedAgo = diffDays === 1 ? 'Today' : `${diffDays}d ago`;

          return (
            <div key={job.id} className="relative rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-4 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-moriones-red uppercase tracking-tight">{postedAgo}</span>
                  </div>
                  <Link href={`/jobs/${job.slug}`} className="group-hover:underline">
                    <h3 className="text-base font-bold text-text-main leading-snug">{job.title}</h3>
                  </Link>
                  <p className="text-xs font-bold text-text-muted mt-1">{job.company_name} • {job.location}</p>
                  <div className="flex gap-3 mt-3">
                    <span className="px-2 py-1 bg-background-light dark:bg-background-dark rounded-lg text-[10px] font-black text-text-main dark:text-text-main-dark border border-border-light dark:border-border-dark whitespace-nowrap">
                      {job.salary_range}
                    </span>
                    <span className="px-2 py-1 bg-background-light dark:bg-background-dark rounded-lg text-[10px] font-black text-text-main dark:text-text-main-dark border border-border-light dark:border-border-dark whitespace-nowrap">
                      {job.employment_type}
                    </span>
                  </div>
                </div>
                <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-800 dark:border-zinc-700">
                  <span className="material-symbols-outlined text-[20px]">work</span>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <AdminActions contentType="job" contentId={job.id} />
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
            <button
              onClick={() => navigate({ page: currentPage - 1 })}
              disabled={currentPage <= 1 || isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-text-main-dark disabled:opacity-30 disabled:cursor-not-allowed hover:border-moriones-red/50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>
              Prev
            </button>
            <span className="text-xs font-bold text-text-muted dark:text-text-muted-dark">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => navigate({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages || isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-text-main-dark disabled:opacity-30 disabled:cursor-not-allowed hover:border-moriones-red/50 transition-colors"
            >
              Next
              <span className="material-symbols-outlined text-[16px]">arrow_forward_ios</span>
            </button>
          </div>
        )}
      </main>

      {/* Post Job Bar — above bottom nav, right-aligned */}
      <div className="fixed bottom-24 left-0 right-0 z-50 max-w-md mx-auto px-4 pointer-events-none flex justify-end">
        <Link
          href="/jobs/create"
          className="pointer-events-auto flex items-center gap-1.5 bg-moriones-red text-white px-3.5 py-2 rounded-xl shadow-lg shadow-moriones-red/40 active:scale-95 transition-all hover:bg-moriones-red/90"
        >
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: '"FILL" 1' }}>work</span>
          <span className="text-[9px] font-black uppercase tracking-[0.12em] whitespace-nowrap">Post a Job Opening</span>
        </Link>
      </div>
    </div>
  );
}
