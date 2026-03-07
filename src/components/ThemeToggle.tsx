'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
            {/* Animated icon swap */}
            <span
                key={theme}
                className="material-symbols-outlined text-slate-700 dark:text-slate-300"
                style={{
                    animation: 'theme-spin 0.35s ease',
                    display: 'block',
                    fontSize: 22,
                }}
            >
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>

            <style>{`
        @keyframes theme-spin {
          0%   { opacity: 0; transform: rotate(-60deg) scale(0.7); }
          100% { opacity: 1; transform: rotate(0deg) scale(1); }
        }
      `}</style>
        </button>
    );
}
