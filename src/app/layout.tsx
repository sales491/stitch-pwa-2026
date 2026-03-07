import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import BottomNav from '@/components/BottomNav';
import MobileTopHeader from '@/components/MobileTopHeader';
import ThemeProvider from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import { AuthProvider } from "@/components/AuthProvider"; // Touch to trigger recompile
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marinduque Market Hub",
  description: "Your local digital hub for Marinduque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f2d00d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MarketHub" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${plusJakartaSans.variable} font-display antialiased bg-gray-100 text-gray-900 overflow-hidden`} suppressHydrationWarning>
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
                <main className="flex-1 max-w-xl w-full h-full bg-white dark:bg-[#0F0F10] flex flex-col relative overflow-y-auto">
                  {/* Top header for mobile users (Logo, Search) */}
                  <div className="md:hidden sticky top-0 z-[60] bg-white dark:bg-[#0F0F10] border-b dark:border-white/[0.03]">
                    <MobileTopHeader />
                  </div>

                  {/* Your actual page content (Marketplace, Jobs, etc.) goes here */}
                  <div className="pb-20 md:pb-0 min-h-screen">
                    {children}
                  </div>
                </main>

                {/* RIGHT SIDEBAR: Hidden on mobile and tablet, shows only on large desktops */}
                <div className="hidden lg:flex w-80 flex-col h-full border-l bg-gray-50">
                  <RightSidebar />
                </div>

              </div>

              {/* MOBILE BOTTOM NAV: Hidden on desktop, shows only on mobile */}
              <BottomNav />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
