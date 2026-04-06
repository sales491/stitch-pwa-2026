import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'Schedule a Live Selling Stream | Marinduque Market Hub',
    description: 'Post your upcoming live selling streams on TikTok, Shopee, YouTube, and Facebook so the local community can find your deals.',
};

export default function NewLiveSellingPage() {
    return <ClientPage />;
}
