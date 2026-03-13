'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { getBarangays } from '@/data/marinduque-barangays';

interface BarangayPickerProps {
  value: string;
  onChange: (value: string) => void;
  municipality?: string;
  /** Accent color for focus ring, e.g. 'red', 'yellow', 'teal'. Default: 'indigo' */
  accentColor?: 'red' | 'yellow' | 'teal' | 'indigo';
  /** Extra class names applied to the wrapper div */
  className?: string;
  /** className applied to the input itself (for special embed styles like profile form) */
  inputClassName?: string;
  label?: string;
  optional?: boolean;
  id?: string;
}

const ACCENT_RING: Record<string, string> = {
  red:    'focus:ring-red-400',
  yellow: 'focus:ring-yellow-400',
  teal:   'focus:ring-teal-400',
  indigo: 'focus:ring-indigo-400',
};

export default function BarangayPicker({
  value,
  onChange,
  municipality,
  accentColor = 'indigo',
  className = '',
  inputClassName,
  label,
  optional = true,
  id,
}: BarangayPickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep query in sync with external value changes (e.g. form resets)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const barangays = getBarangays(municipality);

  const filtered = query.trim().length === 0
    ? barangays
    : barangays.filter(b =>
        b.toLowerCase().includes(query.toLowerCase())
      );

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  function select(barangay: string) {
    setQuery(barangay);
    onChange(barangay);
    setOpen(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIdx >= 0 && filtered[activeIdx]) {
          select(filtered[activeIdx]);
        } else if (filtered.length === 1) {
          select(filtered[0]);
        }
        break;
      case 'Escape':
        setOpen(false);
        setActiveIdx(-1);
        break;
    }
  }

  const ringClass = ACCENT_RING[accentColor] ?? ACCENT_RING.indigo;

  // Default input styling (used by Calamity / Outage forms)
  const defaultInputClass = `w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${ringClass} pr-10`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block"
        >
          {label}{' '}
          {optional && (
            <span className="text-slate-300 dark:text-zinc-600 font-normal">(optional)</span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          value={query}
          placeholder={municipality ? `Search barangays in ${municipality}…` : 'Search barangay…'}
          className={inputClassName ?? defaultInputClass}
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value); // keep parent in sync while typing
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${inputId}-list`}
          aria-activedescendant={activeIdx >= 0 ? `${inputId}-opt-${activeIdx}` : undefined}
          role="combobox"
        />
        {/* Chevron / clear icon */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none select-none text-[13px]"
          aria-hidden
        >
          {query ? '' : '▾'}
        </span>
        {query && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => { setQuery(''); onChange(''); setOpen(true); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 text-sm font-bold leading-none"
            aria-label="Clear barangay"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul
          id={`${inputId}-list`}
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-2xl py-1"
        >
          {filtered.map((b, i) => (
            <li
              key={b}
              id={`${inputId}-opt-${i}`}
              role="option"
              aria-selected={b === value}
              onMouseDown={() => select(b)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                i === activeIdx
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : b === value
                  ? 'bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              {highlight(b, query)}
            </li>
          ))}
        </ul>
      )}

      {/* No match hint */}
      {open && query.trim().length > 0 && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl px-4 py-3 text-[12px] text-slate-400 dark:text-zinc-500">
          No barangay matched — value will be saved as typed.
        </div>
      )}
    </div>
  );
}

/** Bold-highlights the matched portion of a barangay name */
function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-black">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}
