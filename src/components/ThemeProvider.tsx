'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // On mount: read localStorage synchronously, fall back to OS preference, then light.
    // No setTimeout — apply theme on the very first effect tick to minimise FOUP.
    useEffect(() => {
        const saved = localStorage.getItem('mmh-theme') as Theme | null;
        if (saved === 'dark' || saved === 'light') {
            setTheme(saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
        setMounted(true);
    }, []);

    // Apply / remove .dark class on <html> whenever theme changes
    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('mmh-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    // Instead of returning null (which unmounts the entire page tree and causes a
    // full-page flicker), we always render children but use an opacity transition
    // to mask the brief unstyled frame before the theme class is applied to <html>.
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div
                style={{
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 0.1s ease-in',
                }}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
