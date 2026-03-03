import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className={`${plusJakartaSans.variable} font-display bg-white dark:bg-black min-h-screen text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start`}>
          <div className="w-full h-full min-h-screen max-w-md mx-auto bg-white dark:bg-zinc-900 border-none relative flex flex-col overflow-x-hidden pb-20">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
