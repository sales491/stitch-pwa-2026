'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AdminActions from './AdminActions';

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
  requirements?: string[];
  contact?: {
    phone?: string;
    email?: string;
    facebook?: string;
  };
}

function FilterChip({
  icon, label, options, value, onChange,
}: {
  icon: string; label: string; options: string[]; value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isFiltered = value !== options[0];

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
          <span className="truncate">{isFiltered ? value : label}</span>
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
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt
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

export default function MarinduqueJobsListingFeed({ initialJobs }: { initialJobs: Job[] }) {
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      const matchTown = selectedTown === 'All Towns' || job.location.includes(selectedTown);
      const matchType = selectedType === 'All Types' || job.employment_type === selectedType;
      const matchSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTown && matchType && matchSearch;
    });
  }, [selectedTown, selectedType, searchQuery, initialJobs]);

  return (
    <div className="relative flex w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">arrow_back</span>
            </Link>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red pl-1">Marinduque Jobs</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3 pt-1">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-background-light dark:bg-background-dark border border-transparent focus-within:border-moriones-red/50 focus-within:ring-2 focus-within:ring-moriones-red/20 transition-all">
            <div className="grid place-items-center h-full w-12 text-text-muted dark:text-text-muted-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="peer h-full w-full outline-none bg-transparent text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark"
              placeholder="Search careers, companies..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mr-1 p-2 rounded-lg text-text-muted hover:text-moriones-red transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-3 flex gap-2">
          <FilterChip icon="work" label="Type" options={JOB_TYPES} value={selectedType} onChange={setSelectedType} />
          <FilterChip icon="location_on" label="Town" options={TOWNS} value={selectedTown} onChange={setSelectedTown} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-text-main dark:text-text-main-dark">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </h2>
          {(selectedTown !== 'All Towns' || selectedType !== 'All Types' || searchQuery) && (
            <button
              onClick={() => { setSelectedTown('All Towns'); setSelectedType('All Types'); setSearchQuery(''); }}
              className="text-xs font-medium text-moriones-red hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-text-muted/20 mb-4">search_off</span>
            <p className="text-text-main font-black">No jobs found</p>
            <p className="text-xs text-text-muted mt-1">Try a different type or town</p>
          </div>
        )}

        {/* Regular Job Cards */}
        {filteredJobs.map((job) => {
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
      </main>

      {/* FAB */}
      <div className="fixed bottom-10 left-0 right-0 z-50 max-w-md mx-auto px-6 pointer-events-none flex justify-end">
        <Link
          href="/jobs/create"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-moriones-red text-white shadow-lg shadow-moriones-red/40 transition-all hover:scale-110 active:scale-95 group pointer-events-auto"
          title="Post a Job"
        >
          <span className="material-symbols-outlined text-[32px]">add_business</span>
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none shadow-xl">
            Hire Someone
          </span>
        </Link>
      </div>
    </div>
  );
}
