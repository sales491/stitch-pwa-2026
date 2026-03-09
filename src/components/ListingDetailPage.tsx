'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminActions from './AdminActions';
import UniversalComments from './UniversalComments';
import type { Listing } from '@/data/listings';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';

export default function ListingDetailPage({ listing }: { listing: Listing }) {
    const [activeImg, setActiveImg] = useState(0);
    const [messageOpen, setMessageOpen] = useState(false);
    const [message, setMessage] = useState(`Hi! I'm interested in your listing: "${listing.title}". Is it still available?`);

    const conditionColor = {
        'Brand New': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'Like New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'Good': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        'Fair': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        'For Parts': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }[listing.condition];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 pb-4">
            {/* Sticky header */}
            <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-slate-100 dark:border-zinc-800">
                <Link href="/marketplace" className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                    <span className="text-sm font-medium">Classifieds</span>
                </Link>
                <div className="flex items-center gap-2">
                    <AdminActions contentType="listing" contentId={listing.id.toString()} variant="button" />
                    <button className="p-2 rounded-full text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[22px]">share</span>
                    </button>
                    <button className="p-2 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">favorite_border</span>
                    </button>
                </div>
            </header>

            {/* Image Gallery */}
            <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                <Image
                    src={listing.images[activeImg] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop'}
                    alt={listing.alt || listing.title}
                    fill
                    priority
                    className="object-cover"
                />
                {listing.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {listing.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImg(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-primary w-4' : 'bg-white/60'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="px-4 pt-4 flex flex-col gap-4">

                {/* Title + Price */}
                <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h1 className="text-xl font-bold text-text-main leading-tight flex-1">
                            {listing.title}
                        </h1>
                        <p className="text-2xl font-extrabold text-primary shrink-0">{listing.price}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${conditionColor}`}>
                            {listing.condition}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300">
                            {listing.category}
                        </span>
                    </div>
                </div>

                {/* Location + Date */}
                <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>{listing.town}, Marinduque</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Posted {listing.postedAgo}</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <a
                            href={`tel:${formatPhPhoneForLink(listing.seller.phone)}`}
                            className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl transition-all active:scale-95 hover:opacity-90 shadow-sm shadow-moriones-red/30"
                        >
                            <span className="material-symbols-outlined text-[20px]">call</span>
                            Call Seller
                        </a>
                        <a
                            href={`sms:${formatPhPhoneForLink(listing.seller.phone)}`}
                            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl transition-all active:scale-95 hover:opacity-90"
                        >
                            <span className="material-symbols-outlined text-[20px]">sms</span>
                            Text
                        </a>
                    </div>
                    {listing.seller.fb && (
                        <div className="grid grid-cols-2 gap-2">
                            <a
                                href={`https://m.me/${listing.seller.fb}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                                </svg>
                                Messenger
                            </a>
                            <a
                                href={`https://facebook.com/${listing.seller.fb}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.525 8H14V6c0-1.03.838-1.608 2-1.608h1.975V1.1c-.341-.047-1.536-.1-2.932-.1C12.024 1 10 2.8 10 5.748V8H7v3h3v9h4v-9h2.525L17.525 8z" />
                                </svg>
                                FB Page
                            </a>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="bg-background-main rounded-xl p-4">
                    <h2 className="text-sm font-bold text-text-main mb-2">Description</h2>
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                        {listing.description}
                    </p>
                </div>

                {/* Seller Card */}
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Seller</h2>
                    <div className="flex items-center gap-3">
                        <Image
                            src={listing.seller.avatar || 'https://i.pravatar.cc/150?u=seller'}
                            alt={listing.seller.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-primary/20"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-main text-sm">{listing.seller.name}</p>
                            <p className="text-xs text-text-muted">Member since {listing.seller.memberSince}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px] text-green-500">verified</span>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">{listing.seller.responseRate} response rate</span>
                            </div>
                        </div>
                        <Link
                            href="/profile"
                            className="text-xs text-primary font-semibold hover:underline shrink-0"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>

                {/* Safety tip */}
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">security</span>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>Safety tip:</strong> Meet in a public place, inspect the item before paying, and never send money in advance to strangers.
                    </p>
                </div>

                {/* Community Discussions */}
                <UniversalComments entityId={listing.id.toString()} entityType="listing" />

                {/* Structured Data for SEO (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Product',
                            name: listing.title,
                            description: listing.description.slice(0, 200),
                            image: listing.img,
                            offers: {
                                '@type': 'Offer',
                                price: listing.priceValue,
                                priceCurrency: 'PHP',
                                availability: 'https://schema.org/InStock',
                                seller: {
                                    '@type': 'Person',
                                    name: listing.seller.name,
                                },
                                areaServed: {
                                    '@type': 'Place',
                                    name: `${listing.town}, Marinduque, Philippines`,
                                },
                            },
                        }),
                    }}
                />
            </div>

            {/* Message Modal */}
            {messageOpen && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setMessageOpen(false)}>
                    <div
                        className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-t-2xl p-4 pb-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-slate-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                            Message {listing.seller.name.split(' ')[0]}
                        </h3>
                        <textarea
                            className="w-full border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-zinc-800 resize-none focus:outline-none focus:border-primary"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                alert('Message sent successfully!');
                                setMessageOpen(false);
                            }}
                            className="w-full mt-3 bg-primary text-white font-bold py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-moriones-red/20"
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
