import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import BottomNav from '@/components/BottomNav';
import MobileTopHeader from '@/components/MobileTopHeader';
import ThemeProvider from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const isDev = process.env.NODE_ENV === 'development';
const DevInspector = isDev
  ? require('@/components/DevInspector').default
  : null;

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// Self-hosted via next/font — eliminates the render-blocking Playfair external link
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = 'https://marinduquemarket.com';
const SITE_NAME = 'Marinduque Market Hub';
const SITE_DESCRIPTION =
  'The digital hub for Marinduque — buy & sell locally, find jobs, discover island hopping tours, track RoRo ferry schedules, explore businesses, and stay connected with your community.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Marinduque', 'Marinduque market', 'buy and sell Marinduque',
    'jobs Marinduque', 'island hopping Marinduque', 'RoRo ferry schedule',
    'Boac', 'Mogpog', 'Gasan', 'Santa Cruz', 'Torrijos', 'Buenavista',
    'Marinduque community', 'Marinduque classifieds', 'Marinduque businesses',
    'Philippines island community', 'OFW Marinduque', 'palengke prices',
  ],
  authors: [{ name: 'Marinduque Market Hub', url: SITE_URL }],
  creator: 'Marinduque Market Hub',
  publisher: 'Marinduque Market Hub',
  category: 'Community & Marketplace',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Marinduque Market Hub — Community platform for Marinduque island, Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@marinduquemarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PH" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN for Material Symbols (icon font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to ui-avatars.com — used for user avatar fallbacks */}
        <link rel="preconnect" href="https://ui-avatars.com" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f2d00d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MarketHub" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Local SEO geo tags */}
        <meta name="geo.region" content="PH-MAR" />
        <meta name="geo.placename" content="Marinduque, Philippines" />
        <meta name="geo.position" content="13.3767;122.0252" />
        <meta name="ICBM" content="13.3767, 122.0252" />
        {/* Organization + WebSite JSON-LD for AEO (Google AI, ChatGPT, Perplexity) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Marinduque Market Hub',
                url: 'https://marinduquemarket.com',
                logo: 'https://marinduquemarket.com/icons/icon-192.png',
                description: 'The digital community hub for the people of Marinduque island, Philippines. Buy & sell locally, find jobs, discover island hopping tours, and stay connected.',
                areaServed: {
                  '@type': 'AdministrativeArea',
                  name: 'Marinduque',
                  containedInPlace: { '@type': 'Country', name: 'Philippines' },
                },
                sameAs: [
                  'https://facebook.com/marinduquemarket',
                ],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  url: 'https://marinduquemarket.com/contact',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Marinduque Market Hub',
                url: 'https://marinduquemarket.com',
                description: 'Community platform for Marinduque island — marketplace, jobs, events, island hopping, RoRo ferry schedules, and barangay tools.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://marinduquemarket.com/marketplace?query={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Marinduque Market Hub',
                },
              },
            ]),
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} font-display antialiased bg-gray-100 text-gray-900 overflow-hidden`} suppressHydrationWarning>
        <ThemeProvider>
          <ServiceWorkerRegistration />
          <AuthProvider>
            <NotificationProvider>
              {/* overflow-hidden on the body prevents the whole page from scrolling. 
                We only want the middle feed to scroll!
              */}
              <div className="flex h-screen w-full justify-center">

                {/* LEFT SIDEBAR: Hidden on mobile, shows on medium screens and up */}
                <div className="hidden md:flex w-64 lg:w-72 flex-col h-full border-r bg-white">
                  <LeftSidebar />
                </div>

                {/* CENTER CORE: This is the mobile-width feed. It scrolls independently. */}
                <div className="flex-1 max-w-xl w-full h-full relative">
                  <main className="w-full h-full bg-white dark:bg-[#0F0F10] flex flex-col overflow-y-auto">
                    {/* Top header (Logo, Search) */}
                    <div className="sticky top-0 z-[60] bg-white dark:bg-[#0F0F10] border-b dark:border-white/[0.03]">
                      <MobileTopHeader />
                    </div>

                    {/* Your actual page content (Marketplace, Jobs, etc.) goes here */}
                    <div className="pb-24 md:pb-24 min-h-screen">
                      {children}
                    </div>
                  </main>

                  {/* PWA install prompt — shows once to new users */}
                  <PWAInstallPrompt />

                  {/* BOTTOM NAV */}
                  <BottomNav />
                </div>

                {/* RIGHT SIDEBAR: Hidden on mobile and tablet, shows only on large desktops */}
                <div className="hidden lg:flex w-80 flex-col h-full border-l bg-gray-50">
                  <RightSidebar />
                </div>

              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
        {isDev && DevInspector && <DevInspector />}
      </body>
    </html>
  );
}
