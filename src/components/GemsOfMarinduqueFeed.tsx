import React from 'react';
import Link from 'next/link';

export default function GemsOfMarinduqueFeed() {
  return (
    <>
      <div>
        {/* Header & Search */}
        <header className="sticky top-0 z-20 bg-card-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-background-light dark:border-background-dark/10 shadow-sm transition-colors duration-300">
          <div className="px-4 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/marinduque-connect-home-feed" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-text-main dark:text-gray-100">arrow_back</span>
              </Link>
              <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
              <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-gray-100">Gems of Marinduque</h1>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-text-main dark:text-gray-100" style={{ fontSize: 24 }}>notifications</span>
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-secondary" style={{ fontSize: 20 }}>search</span>
              </div>
              <input className="block w-full pl-10 pr-12 py-3 rounded-xl border-none bg-background-light dark:bg-white/5 text-text-main dark:text-gray-100 placeholder-text-secondary focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/20 transition-all shadow-sm" placeholder="Share a Gem or find a place..." type="text" />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button className="p-1.5 rounded-lg bg-primary text-text-main hover:bg-primary-dark transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
                </button>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar w-full">
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-primary text-text-main font-semibold text-sm shadow-sm">
              All Gems
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/50 text-text-secondary dark:text-gray-300 font-medium text-sm transition-all whitespace-nowrap">
              <span className="mr-1 material-symbols-outlined align-middle" style={{ fontSize: 16 }}>beach_access</span>
              Beaches
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/50 text-text-secondary dark:text-gray-300 font-medium text-sm transition-all whitespace-nowrap">
              <span className="mr-1 material-symbols-outlined align-middle" style={{ fontSize: 16 }}>church</span>
              Heritage
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/50 text-text-secondary dark:text-gray-300 font-medium text-sm transition-all whitespace-nowrap">
              <span className="mr-1 material-symbols-outlined align-middle" style={{ fontSize: 16 }}>restaurant</span>
              Food
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/50 text-text-secondary dark:text-gray-300 font-medium text-sm transition-all whitespace-nowrap">
              <span className="mr-1 material-symbols-outlined align-middle" style={{ fontSize: 16 }}>hiking</span>
              Nature
            </button>
          </div>
        </header>
        {/* Main Feed (Masonry) */}
        <main className="flex-1 px-4 py-4 w-full max-w-2xl mx-auto">
          <div className="masonry-grid">
            {/* Card 1 */}
            <div className="masonry-item relative group rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <img alt="Tropical white sand beach with clear blue water and coconut trees" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Poctoy White Beach sunny day" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtrXOqDVgL69LjOxVWAA9nO_SXy0z31K588lI3K9hsFvDzKDZv71X6oygWgA4pTC0aY3LFAEPIxtKuipbf6b-zp8QgZIWVuUuKz89TOdp0YJtgd7_r3VyzI5FJdVC9GuSDRxlcYRZkZwpKDB8DR5HW7JGBjhtHfOq7NM5ItoetwkCLXS5Q9tmK-6i1MfZx5kULnmoVt9k_gTNuIVFDsruwsz9aqm-PnWuQkEW-c61AYlOy43tk89AWx9RuiqXfLMbXLCHvlzRgvQA" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined block" style={{ fontSize: 20 }}>favorite</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-main dark:text-gray-100 text-lg leading-tight mb-1">Poctoy White Beach</h3>
                <div className="flex items-center gap-1 mb-2 text-primary dark:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Torrijos, Marinduque</span>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-2 mb-3">
                  The sunset here is absolutely magical. Best place to unwind after a long week.
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <img alt="Portrait of a smiling woman" className="w-6 h-6 rounded-full object-cover border border-background-light" data-alt="User avatar smiling woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABXvAeMEFZMabjghkJKLLdVzGGGvet5UdQO_aiJiS0iZ4ycXJbZQ2u-VeJSWV8NVRL7dEWxPh0Thy6yjiGZHTo8_ajYUWa0Wrumi-Rv6F1N4s75xRLnSNf82r46Gsgsa1hnrrczxbDCFlv4hestHmzpZADF0xEYu8ZeOfLtmueY73y_qZ9fPMsjtOaKn-KryTpm8QhMIKXzMzz4-x1O1DtkH52qLEWy_As_ewDLVJk_lzz6hpZUmfZA-fwFJdYsWqZX2Fh9sWw4Vc" />
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Maria S.</span>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="masonry-item relative group rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full aspect-[3/2] overflow-hidden">
                <img alt="Historic stone church facade with spanish architecture" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Boac Cathedral historic stone facade" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdh2E4CRyeLhFyTnxILtr9kYrUifKwS5GFCMEGYpA99jHHWHuDMgD7Qo8EbwZkkycVWT8JGPX494ePtVd7BBl7iZDyG1M5OL7o1g-w_D5ii7d2Aucj_KeTcRLJdgVx61tMqFFhjS4OLcEwthK7RYL7Y3b86nCGIXI_oHZCGhh0PpbdK4i8-cswnG6NWMOmWt6eQgPVQdA4HDvp6pRFyRs98z75P7Cv4648_AFxNJ2e7mEEeL7q811Qez-Sx8luAReJK4TRoP-uKpU" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined block" style={{ fontSize: 20 }}>favorite</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-main dark:text-gray-100 text-lg leading-tight mb-1">Boac Cathedral</h3>
                <div className="flex items-center gap-1 mb-2 text-primary dark:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Boac, Marinduque</span>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-2 mb-3">
                  Lighting a candle for peace. The architecture is breathtakingly preserved.
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <img alt="Portrait of a man with glasses" className="w-6 h-6 rounded-full object-cover border border-background-light" data-alt="User avatar man glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIBWiJNJKtlvp0PuXny1DiTxWvQw8DwagNMhR4hMCvEQ0M2Z1VLczgm1aagQQLDb-VGN3b-OI3VOPyR1lAN5vTqjvjPOCkC3pRe4lV2Rm95WMQqK5PFxGYbuXNnNEU-ds1zWfm0a-nP1Z-DXFwzSNwid2Np2-0ttBUPNRzAs6_t6DbeRQ8gyRjAYv8Fgwo_9j0oyMZ6gAqtHDeFKMAqDze4IWaovg-Vgz041ix1jlRzS1DrEu1blV3LIAQ2SZN3FeXVU7oKywPkow" />
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Juan D.</span>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="masonry-item relative group rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img alt="Pristine white sandbar in the middle of turquoise ocean" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Maniwaya Island sandbar aerial view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3J5M-t1zd8gypDITj3bW_Gcg39Z5TVmJITHWa1pBdpDEVU3gUvCXYmPxkiHBTI3XcmpWqimWAqIr-jCudeB1ZXmF4Y2VWb52dknkPkVGtrHGQp5NLTBbeIfnmYHTLTELEhVzAMSrI3znm35zMEcQXNUII-m5mZFgS4-u_U-E3MBKnmI7vYLZzHg_VBHFQy-cv8LGyt85ivMgojAB3TvLnDog0N0EF7G5KK4XvEOo-u4cqeV4MH0mCLEtsFt2vQBpjK6seZtAUyuc" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-primary text-text-main shadow-lg transform scale-100 transition-transform">
                  <span className="material-symbols-outlined block fill-current" style={{ fontSize: 20, fontVariationSettings: '"FILL" 1' }}>favorite</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-main dark:text-gray-100 text-lg leading-tight mb-1">Maniwaya Island</h3>
                <div className="flex items-center gap-1 mb-2 text-primary dark:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Santa Cruz</span>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-2 mb-3">
                  Paradise found! The sandbar appeared right at low tide.
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <img alt="Portrait of a smiling man" className="w-6 h-6 rounded-full object-cover border border-background-light" data-alt="User avatar smiling man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW6h3n7nSCp1up5tTLlzQj70rDnKKMyw1oUN8v3Phs0jKNssTGzJtDOaOLLSBfYvijuwbtsAUpmlLTNuDOs2HVk6RrgzY5Mh0FX4xGIGjSW9rlumCYYa4FD1l97rfj1Z3bfwCGpYYd50NcqxgPZdW00pjTcN26A4fUfXj5yxcRugzwVEDhqT01cGDs-nRkUAybQ0VkxFtXrz-Ly4FdsruCkbRM5OPmnqDZEHDoPzxYGVaarcIpaNhIaOEPh_ZvU_1EcyGj8HcqGkc" />
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Lito M.</span>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="masonry-item relative group rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img alt="Close up of traditional moriones festival mask" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Moriones Festival mask colorful" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6g8TTI4Gef9_JTO7kB3Nl8FwrnMbmGzqkyr5GMXpfhnHMyYn8ivXNZKcIGtklswBBpsXZOR8WTHkS59M7uXE0zwcUXPX8LxxATrB3VsWe5dOHXTICaxEhGSgIpuwm2Y4Fwz5Lbh-x4EzFuE2AvSh2RLZcJ5BYMbQgePEvmeGbGZsqYbXtd7YOrChwuljxNHr03JTVfGVvgzacOFun1ZJ7jtx2sdFhOEQxMlUWvRNhGULzOrOnC5dXNFW8nCKFaQfwTJ4W4Xx_f48" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined block" style={{ fontSize: 20 }}>favorite</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-main dark:text-gray-100 text-lg leading-tight mb-1">Moriones Festival</h3>
                <div className="flex items-center gap-1 mb-2 text-primary dark:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Boac Town Plaza</span>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-2 mb-3">
                  Getting ready for Holy Week. The masks are intricate this year!
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold border border-background-light">
                    JS
                  </div>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Jenny S.</span>
                </div>
              </div>
            </div>
            {/* Card 5 */}
            <div className="masonry-item relative group rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img alt="Mystical cave interior with stalactites" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Bathala Caves interior rock formations" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBySILFeyYFsX8dw_QmUgD0Qbn3cbLFbVEO5sWFYg-5AazVzDJcAzocnqjxpBpIqNGbIm7GDjPY1ZSOo9gCn3bZ5XBwGszJQTrReg77KwwxIgZE1DZe4YKGkNeh2yIQsA6oiUjAZNhnNdtt2q_ob1RSbBnUIQdkKEmA9ilbpDpIZhar-_eDAZfzx6FPwApfVpkNuki1ZSyD6ay-oyzDlbDaIr7CSYPRU10Kk1CMUJ1csJZ5s2rpZPnY6cFNL8VNu4nC1-eBi7TO7Xo" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined block" style={{ fontSize: 20 }}>favorite</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-main dark:text-gray-100 text-lg leading-tight mb-1">Bathala Caves</h3>
                <div className="flex items-center gap-1 mb-2 text-primary dark:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Santa Cruz</span>
                </div>
                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-2 mb-3">
                  Spooky yet serene. The light filtering through is divine.
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <img alt="Portrait of a young woman" className="w-6 h-6 rounded-full object-cover border border-background-light" data-alt="User avatar young woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIfQ_CWJ0iuRclWehwN_YPgBMjWLTd7kH-o9mX4pTAmrJuVGDUhxuCtZJnMdVadMahxT2496BOySSiYIWAG4qfhL7smn1tR2zrQjuZpqwQUlOjLmNHeWNrXEhrZ9kxlgn_xMxwNtHqZAYUabzZ5MvmEJrfBQUpYYD-9hF3QNrghGd-2RKIEMecW3Y_S5Cfl7-sOyzX4BFjbY4vJSWtz6Yj_M3QKAJx_CYpnyAxirCy12137D3nlqEWUhDedi2EKgmWI55RfiryozI" />
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Ana R.</span>
                </div>
              </div>
            </div>
          </div>
          {/* Loading State Indicator */}
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </main>
        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 z-30 w-full bg-card-light dark:bg-card-dark border-t border-background-light dark:border-white/5 pb-safe">
          <div className="flex items-center justify-around px-2 pt-2 pb-4">
            <a className="flex flex-col items-center justify-center gap-1 w-16 group" href="/user-profile-dashboard1">
              <div className="relative p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-main dark:text-primary fill-current" style={{ fontSize: 24, fontVariationSettings: '"FILL" 1' }}>home</span>
              </div>
              <span className="text-[10px] font-semibold text-text-main dark:text-primary">Feed</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 w-16 group" href="/marinduque-connect-home-feed">
              <div className="relative p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200" style={{ fontSize: 24 }}>map</span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200">Map</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 w-16 group" href="/community-board-commuter-hub">
              <div className="relative p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200" style={{ fontSize: 24 }}>groups</span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200">Community</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 w-16 group" href="/marinduque-connect-home-feed">
              <div className="relative p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200" style={{ fontSize: 24 }}>favorite</span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200">Saved</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 w-16 group" href="/marinduque-connect-home-feed">
              <div className="relative p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200" style={{ fontSize: 24 }}>person</span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200">Profile</span>
            </a>
          </div>
        </nav>
      </div>

    </>
  );
}
