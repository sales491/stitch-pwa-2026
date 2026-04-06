import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Policies',
    description: 'Terms of Service, Privacy Policy, and Community Guidelines for Marinduque Market Hub. Data privacy compliance under the Philippines Data Privacy Act of 2012 (RA 10173).',
    keywords: ['Marinduque Market Hub terms', 'data privacy Philippines', 'community guidelines Marinduque', 'RA 10173 compliance'],
    openGraph: {
        title: 'Policies — Marinduque Market Hub',
        description: 'Terms of Service, Privacy Policy, and Community Guidelines.',
        url: 'https://marinduquemarket.com/policies',
    },
    alternates: hreflangAlternates('/policies'),
};

const sections = [
    {
        id: 'terms',
        icon: '📜',
        title: 'Terms of Service',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-900/10',
        border: 'border-amber-200 dark:border-amber-800/30',
        content: [
            {
                heading: 'Our Role as a Connector',
                body: 'Marinduque Market is a platform that facilitates connections between buyers and sellers within Marinduque (Boac, Gasan, Mogpog, Sta. Cruz, Torrijos, and Buenavista).',
                bullets: [
                    '<strong>Venue Only:</strong> We provide the space for discovery. We are not a party to any actual transactions, payments, or deliveries.',
                    '<strong>No Warranty:</strong> We do not pre-screen every item or service. The quality, safety, and legality of listings are the sole responsibility of the user who posted them.',
                    '<strong>Future Advertising:</strong> We reserve the right to host advertisements from local Marinduque businesses. These third-party ads may lead to external sites not governed by these terms.',
                ],
            },
            {
                heading: 'User Transactions & Disputes',
                bullets: [
                    '<strong>Peer-to-Peer Resolution:</strong> Any disputes regarding items (condition, price, or delivery) must be resolved directly between the buyer and the seller. Marinduque Market does not provide mediation or escrow services.',
                    '<strong>Safety First:</strong> We strongly recommend all users conduct transactions in person at well-lit, public locations (e.g., municipal plazas or busy markets).',
                ],
            },
        ],
    },
    {
        id: 'privacy',
        icon: '🔒',
        title: 'Privacy Policy',
        color: 'from-blue-500 to-indigo-500',
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        border: 'border-blue-200 dark:border-blue-800/30',
        content: [
            {
                heading: 'Information We Collect',
                body: 'We are committed to protecting your personal data in strict compliance with the Philippines Data Privacy Act of 2012 (RA 10173).',
                bullets: [
                    '<strong>Account Data:</strong> We use Google OAuth for secure login. This provides us with your name and email address.',
                    '<strong>Marketplace Data:</strong> We collect location data and listing details you provide to facilitate local trade.',
                    '<strong>Usage Statistics:</strong> We use light versions of Google Analytics to understand site growth. This data is aggregated and does not identify you personally.',
                ],
            },
            {
                heading: 'Data Storage & Security',
                bullets: [
                    '<strong>Supabase Integration:</strong> All user data and listings are stored securely via Supabase. We only save data that is essential for the site\'s functionality and your user experience.',
                    '<strong>No Sale of Data:</strong> We do not sell, rent, or trade your personal data to third parties. Data is used solely to facilitate the services of Marinduque Market.',
                ],
            },
            {
                heading: 'Your Rights',
                body: 'Under the Data Privacy Act, you have the right to access, rectify, or request the erasure of your personal data from our systems at any time.',
            },
        ],
    },
    {
        id: 'community',
        icon: '🤝',
        title: 'Community Guidelines',
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        border: 'border-emerald-200 dark:border-emerald-800/30',
        content: [
            {
                heading: 'The Bayanihan Spirit',
                body: 'To maintain the Bayanihan Spirit of our island, we ask all members to follow these rules:',
                bullets: [
                    '<strong>Be Honorable (May Karangalan):</strong> Only post items you actually have. Avoid "Joy-buying" or "Ghosting" sellers after a deal is reached.',
                    '<strong>Price Transparency:</strong> We encourage clear pricing in listings. "PM for price" is discouraged to keep the market fair for all.',
                    '<strong>Local Focus:</strong> This platform is optimized for the Marinduque region. Ensure your delivery or meetup capabilities reflect this.',
                    '<strong>No Spam:</strong> Repetitive posting or unrelated links will be removed to keep the feed clean and useful for everyone.',
                    '<strong>Prohibited Items:</strong> Listings for illegal goods, regulated substances, or content that violates Philippine law are strictly prohibited and will be removed.',
                ],
            },
        ],
    },
];

export default function PoliciesPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0F0F10] pb-24">
            <PageHeader title="Policies" subtitle="Terms & Guidelines">
                {/* Quick nav pills */}
                <div className="flex gap-2 px-4 pb-3 flex-wrap">
                    {sections.map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-[12px] font-bold text-slate-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <span>{s.icon}</span>
                            {s.title}
                        </a>
                    ))}
                </div>
            </PageHeader>

            {/* Sections */}
            <div className="px-4 pt-6 space-y-6">
                {sections.map((section) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className={`rounded-3xl border ${section.border} ${section.bg} overflow-hidden scroll-mt-6`}
                    >
                        {/* Section header */}
                        <div className={`px-5 py-4 flex items-center gap-3 bg-gradient-to-r ${section.color} bg-opacity-10`}>
                            <span className="text-[22px]">{section.icon}</span>
                            <h2 className="text-[16px] font-black text-white drop-shadow-sm tracking-tight">
                                {section.title}
                            </h2>
                        </div>

                        {/* Section body */}
                        <div className="px-5 py-5 space-y-5">
                            {section.content.map((block, i) => (
                                <div key={i}>
                                    <h3 className="text-[13px] font-black uppercase tracking-wider text-slate-700 dark:text-white/70 mb-2">
                                        {block.heading}
                                    </h3>
                                    {block.body && (
                                        <p className="text-[13px] text-slate-600 dark:text-white/50 leading-relaxed mb-3">
                                            {block.body}
                                        </p>
                                    )}
                                    {block.bullets && (
                                        <ul className="space-y-2">
                                            {block.bullets.map((bullet, j) => (
                                                <li key={j} className="flex gap-2.5 text-[13px] text-slate-600 dark:text-white/50 leading-relaxed">
                                                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/30" />
                                                    <span dangerouslySetInnerHTML={{ __html: bullet }} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Contact card */}
                <div className="rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1A1A1A] px-5 py-5">
                    <h2 className="text-[14px] font-black text-slate-900 dark:text-white mb-1">Contact Us</h2>
                    <p className="text-[13px] text-slate-500 dark:text-white/40 leading-relaxed mb-4">
                        For questions regarding these terms or to exercise your data privacy rights, please send us a message and our team will get back to you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C62828] text-white text-[13px] font-bold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-red-500/20"
                    >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        Send a Message
                    </Link>
                </div>
            </div>
        </main>
    );
}
