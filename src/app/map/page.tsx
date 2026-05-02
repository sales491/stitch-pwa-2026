import type { Metadata } from 'next';
import ExplorerMapClient from './ExplorerMapClient';

export const metadata: Metadata = {
    title: 'Explorer Map | Marinduque Hub',
    description: 'Offline-ready interactive tourist and survival map of Marinduque. Find ports, hospitals, beaches, and landmarks without an internet connection.',
    keywords: ['Marinduque offline map', 'Marinduque tourist map', 'Marinduque ports', 'Marinduque beaches map', 'Balanacan port map'],
};

export default function ExplorerMapPage() {
    return (
        <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-zinc-950">
            <ExplorerMapClient />
        </div>
    );
}
