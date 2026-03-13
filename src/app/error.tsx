'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[Global Error]', error);
    }, [error]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--color-bg, #0f172a)',
            color: 'var(--color-text, #f1f5f9)',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '400px' }}>
                An unexpected error occurred. Please try again, or return to the home page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={reset}
                    style={{
                        padding: '0.6rem 1.4rem',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    Try again
                </button>
                <Link
                    href="/"
                    style={{
                        padding: '0.6rem 1.4rem',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#f1f5f9',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    Go home
                </Link>
            </div>
            {error.digest && (
                <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    );
}
