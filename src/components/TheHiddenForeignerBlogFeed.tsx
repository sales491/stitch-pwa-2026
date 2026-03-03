import React from 'react';
import Link from 'next/link';

export default function TheHiddenForeignerBlogFeed() {
  return (
    <>
      <div>
        {/* Header Section */}
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/marinduque-connect-home-feed" className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-text-main dark:text-slate-100">arrow_back</span>
              </Link>
              <div className="bg-primary/20 p-2 rounded-full text-primary">
                <span className="material-symbols-outlined !text-[28px]">explore</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-text-main dark:text-slate-100 leading-none">The Hidden Foreigner</h1>
                <p className="text-xs text-text-muted dark:text-slate-400 font-medium">Uncovering Marinduque&apos;s Soul</p>
              </div>
            </div>
            <button className="text-text-main dark:text-slate-100 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </header>
        {/* Main Content Feed */}
        <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 pb-24">
          {/* About Tagline / Intro */}
          <div className="text-center mb-2 px-2">
            <h2 className="font-display text-2xl font-bold text-text-main dark:text-slate-100 mb-2">Discovering Marinduque</h2>
            <p className="text-sm text-text-muted dark:text-slate-300 leading-relaxed">
              A travelogue by the community, uncovering hidden gems, local stories, and the vibrant spirit of the island heart of the Philippines.
            </p>
          </div>
          {/* Featured/Pinned Post */}
          <article className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 relative group">
            <div className="absolute top-3 right-3 z-10 bg-accent-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined !text-[12px]">push_pin</span> Featured
            </div>
            <div className="h-64 w-full bg-gray-200 relative overflow-hidden">
              <img alt="Golden sunset over Poctoy White Beach" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Golden sunset over Poctoy White Beach" data-location="Torrijos, Marinduque" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYWKIjB5ahRN26Nm2H39tnd83RmrUolv1adDy45xYf0zPFgO4UEVK-9QOVergynZ8sl0DOBEkKcwalCpSIqMymR0rMzCQpkyFfEYtIvuEY5SQkBQF2fLEYLt0HOk3FoSsybMCzEZN6VeUKBXqyMUa7TDaxIXLjsmB19IGvo2ndTK5e84pUD3j0mZ2j_A5rMlBoit-xof90w_-yIrhIZIkuoCTkiC4ldpc1aiyRb1RRqPHBExD6TTMjFRPSc5e10qFx09gdpgQDw4M" />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/20 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Torrijos</span>
                <span className="text-xs text-text-muted dark:text-slate-400">• Oct 24, 2023</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-text-main dark:text-slate-100 mb-3 leading-tight">Sunset Magic at Poctoy White Beach</h3>
              <p className="text-text-main dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                Experience the golden hour like never before on the pristine sands of Poctoy. The local vibe is unmatched as Mount Malindig watches over the horizon. We met with local fishermen who shared stories of the sea that have been passed down for generations...
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">favorite</span> 124
                  </button>
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">share</span> Share
                  </button>
                </div>
                <button className="text-primary dark:text-primary hover:text-teal-600 dark:hover:text-teal-300 font-bold text-sm flex items-center gap-1">
                  Read Story <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
          {/* Feed Item 2 */}
          <article className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="h-56 w-full bg-gray-200 relative overflow-hidden group">
              <img alt="Traditional Moriones Festival mask close up" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Traditional Moriones Festival mask close up" data-location="Boac, Marinduque" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBff8fLBhe5vUAcwwgIGdpmd2E7edBVjkkVUc09r_72ImEcoQvedF7cbuHF2uKvPwQiPXZM10V1Mq2CNiPpMa-gpl5OPBfY8XQ6KF316fPiTEVdPNKrcIRcUAoNpfFLRk9lJY0eHuIFrQUXjACnWhMzFiVuoNa_9VSDP5R1b7VXRocFLmhw5D727Xg2MwDMrJJdFNUfvuRtUs1unEQZUp2hGEcW477buX-eTFpvh2oR5QHoGlxK81LeIKIiJ-Lv_KUwwX0-r20Gi2o" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/20 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Boac</span>
                <span className="text-xs text-text-muted dark:text-slate-400">• Oct 20, 2023</span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-main dark:text-slate-100 mb-3 leading-tight">Preparing for the Moriones Festival</h3>
              <p className="text-text-main dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                Months before the Holy Week, the artisans of Boac are already hard at work carving the intricate masks that define our island&apos;s most famous tradition. We visited the workshop of Mang Jose to see the process firsthand...
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">favorite</span> 89
                  </button>
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">share</span> Share
                  </button>
                </div>
                <button className="text-primary dark:text-primary hover:text-teal-600 dark:hover:text-teal-300 font-bold text-sm flex items-center gap-1">
                  Read Story <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
          {/* Feed Item 3 */}
          <article className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="h-56 w-full bg-gray-200 relative overflow-hidden group">
              <img alt="Boat view of Maniwaya Island sandbar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Boat view of Maniwaya Island sandbar" data-location="Santa Cruz, Marinduque" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI2Q_YzVSIQPtmKuWc6NL931PrHbX3T3Og7JW9l-ARWAwsopGVWaP9PCJA6yEjLRYx23Kipd4yCOYI1z0xwNq7vzS7PKGZ23G8AOLo6eb9vkpubyNH7oO9kQm3L9MJ41JMbVH8E9jNqZ-1ejq7MDC2Z0Gp05jmlLK6IwMj81vBANaxFLW3aklNwfEr6TZqlxlkaYqvSPJ210kpbSIJnCvp51uKWSrryCZUXkZ9M617m1qIdk2p_b226oQFg9vBxMuPztAQB1x4ysY" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/20 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Santa Cruz</span>
                <span className="text-xs text-text-muted dark:text-slate-400">• Oct 15, 2023</span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-main dark:text-slate-100 mb-3 leading-tight">Island Hopping: Maniwaya &amp; Palad Sandbar</h3>
              <p className="text-text-main dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                Crystal clear waters and powdery white sands await at Maniwaya. Don&apos;t miss the Palad Sandbar which appears only during low tide, offering a surreal experience of standing in the middle of the ocean...
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">favorite</span> 215
                  </button>
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">share</span> Share
                  </button>
                </div>
                <button className="text-primary dark:text-primary hover:text-teal-600 dark:hover:text-teal-300 font-bold text-sm flex items-center gap-1">
                  Read Story <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
          {/* Feed Item 4 */}
          <article className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="h-56 w-full bg-gray-200 relative overflow-hidden group">
              <img alt="Interior of Boac Cathedral old church" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Interior of Boac Cathedral old church" data-location="Boac, Marinduque" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBspWe8zY1eRx_o3dLNkKULXgloloveLTcQoERAAvXXXmZd6j9CncdUZQO3oYFKWE4BULVyw8aLUtGCtQ6aplmbDgicUf-cGektL7_CeonN7pPojYGn9EZast6sdxnEA8nDQe7igHdy-DGTcuV2CGYWoQk41nu_3A7KswYki6geFrygYqSD3i6Lhy9u44TnpaEFmcwrooPZ5x_WPfVZQ-Tx-wGzLXI5e92tE5AISRBxklvbaDOUL1TVjMe6_coHiQr5ovXvtfDCk3Y" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/20 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">History</span>
                <span className="text-xs text-text-muted dark:text-slate-400">• Oct 12, 2023</span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-main dark:text-slate-100 mb-3 leading-tight">Whispers of the Past: The Boac Cathedral</h3>
              <p className="text-text-main dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                Standing atop a hill, the Boac Cathedral is not just a place of worship but a fortress that once protected the town from pirates. Its walls hold centuries of prayers and secrets...
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">favorite</span> 156
                  </button>
                  <button className="flex items-center gap-1 text-text-muted dark:text-slate-400 hover:text-primary transition-colors text-xs font-medium">
                    <span className="material-symbols-outlined !text-[18px]">share</span> Share
                  </button>
                </div>
                <button className="text-primary dark:text-primary hover:text-teal-600 dark:hover:text-teal-300 font-bold text-sm flex items-center gap-1">
                  Read Story <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
        </main>
        {/* Bottom Navigation Bar */}
      </div>

    </>
  );
}
