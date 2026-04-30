import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us — Marinduque Market Hub',
    description: 'Get in touch with the Marinduque Market Hub team. Send us a message, report a listing, request data deletion, or inquire about partnerships and advertising.',
    keywords: ['contact Marinduque Market Hub', 'Marinduque support', 'report listing Marinduque', 'data deletion request Philippines', 'Marinduque advertising'],
    openGraph: {
        title: 'Contact Us — Marinduque Market Hub',
        description: 'Reach out to the Marinduque Market Hub team for support, inquiries, and partnership opportunities.',
        url: 'https://marinduquemarket.com/contact',
    },
    alternates: hreflangAlternates('/contact'),
};

export default function ContactPage() {
    return <ContactForm />;
}
