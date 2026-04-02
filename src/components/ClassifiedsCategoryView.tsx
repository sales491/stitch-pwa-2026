'use client';

import React from 'react';
import BackButton from '@/components/BackButton';

export default function ClassifiedsCategoryView() {
  return (
    <>
      <div>
  {/* Header */}
  <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
    <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main-light dark:text-text-main-dark transition-colors">
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
    <h1 className="text-lg font-bold flex-1 text-center pr-2">Electronics</h1>
    <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary transition-colors">
      <span className="material-symbols-outlined">filter_list</span>
    </button>
    <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main-light dark:text-text-main-dark transition-colors ml-1">
      <span className="material-symbols-outlined">search</span>
    </button>
  </header>
  {/* Town Filters */}
  <div className="bg-surface-light dark:bg-surface-dark py-3 px-4 border-b border-gray-100 dark:border-gray-800 sticky top-[60px] z-40">
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md">
        All Marinduque
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Boac
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Mogpog
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Gasan
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Buenavista
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Torrijos
      </button>
      <button className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
        Santa Cruz
      </button>
    </div>
  </div>
  {/* Main Content: Listings */}
  <main className="flex-1 px-4 py-4 space-y-6">
    {/* Featured Listing (Promoted) */}
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider">Featured in Boac</h2>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Promoted</span>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
          <img alt="Latest iPhone model on table" className="w-full h-full object-cover" data-alt="iPhone on wooden table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu60Yadg8cWLs9cvoMYHX_72ARtDqwejtxATrZ3okQueEGJyjfogavlBQPLCmmtwnp1_sZ1_xVGFjCsOc9NJV7X8bKeFTOb-Uj-_I4j_touBGxyJQT4fZVErl6Cmsi8JDzorZ5XGUgEz3wNBRLpBI-0ya1x4D6tiXlugTomnbDlwTYCEItv9Ha8Kn0mt6TLdifprZ_HXbHFoPTlxwJzKv3ynigyX6PKkH76vnPwcBRHnAXg7ZsT7spqnsMRIai86EtPpP8zw5jwTg" />
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            4 photos
          </div>
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark line-clamp-1">iPhone 13 Pro - 256GB Gold</h3>
            <p className="text-primary font-bold text-lg whitespace-nowrap">₱38,000</p>
          </div>
          <div className="flex items-center text-text-sub-light dark:text-text-sub-dark text-sm mb-3">
            <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
            <span>Boac, Marinduque</span>
            <span className="mx-2">•</span>
            <span className="text-xs">2 hrs ago</span>
          </div>
          <div className="flex items-center gap-2">
            <img alt="User avatar" className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700" data-alt="User avatar male smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe8knDQHxuGzPVAJkfe_I91F6aeEDp2vcJ3yGjAyHhU84ulmDR_70PKP20kMVHqkGPIQPn1771UAwMLSZ8FKDsHhLuyPzahaoCQ1tr2MbMicht2-eeE4P8rIwydF_5UhDPnyDwSCxKKz6jygL1T2BActmwKzT8omDlonJFbGMmFJCEkZRuaFD61rMf01G8o_NZpvnwr9EBMYFc-4GfDBf4C9BasL1jgPAeI_J8VsQ-eH3-rgq4isL7PEwBoHn19QNkDRaa_a02d5U" />
            <p className="text-sm text-text-main-light dark:text-text-main-dark font-medium">Juan Dela Cruz</p>
          </div>
        </div>
      </div>
    </div>
    {/* Listing Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
      {/* Card 1 */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 group">
        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700">
          <img alt="Playstation 5 console with controller" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Playstation 5 console with controller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS7-aeVTs4pNUpWiOVEy_ZpdBepshiQ5cO4twsBuhQ4raLdPXrdQLfVjoC93eEYNm_RGZtW3MBRI_YWF7lCW7lMFS5m30KpETKOItEuwj7jCAG6A8sMq86ilmepPl3M-AFajU8jiGkXqLbpNEr_KygUtjSXijtKo2IrSWAnH4qVM9VhR7glxKv6XPI6UQd_auTM5PgDktiS7S0Fk5fnoDXDwUDSr3F7zUFLkRpa6P4ZHJqWe4LRxOXyYbCm12qIthFSiXfXfqlqPI" />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite_border</span>
          </button>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-3 left-3 text-white font-bold text-xs bg-primary px-2 py-0.5 rounded-sm">Used - Like New</span>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark truncate pr-2">Sony PlayStation 5</h3>
            <p className="text-primary font-bold text-base whitespace-nowrap">₱28,500</p>
          </div>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark line-clamp-2 mb-2">Comes with 2 controllers and 3 games. Rarely used since purchase.</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-xs text-text-sub-light dark:text-text-sub-dark">
              <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
              Gasan
            </div>
            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">1 day ago</span>
          </div>
        </div>
      </div>
      {/* Card 2 */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 group">
        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700">
          <img alt="Laptop on desk workspace" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Laptop computer on workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeGIAF0tBT4mAbzQbHiYc148gsdBgT7o6EbrKPPJPmAlmzKJGh2uV4wT5Y9A9bHSCLITDwaENgh8Efpdn8MxfSb5KOw7FjQU98hz9IbuACd_S_FAKxtZUUc0EBt7n45ANPiNcxJszhhlv0AKIuJ_pxlz96b3oP47pvhn_Ay28AilokjGBxl6zLl2ukufOYPuAYsUcGnuhCSbMEyCJthlilHfsYGSZyUFnf87y5D0jciZrukNHq_ov4sx-8kNPW_d5kHSaewgKUHQg" />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite_border</span>
          </button>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark truncate pr-2">MacBook Air M1</h3>
            <p className="text-primary font-bold text-base whitespace-nowrap">₱45,000</p>
          </div>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark line-clamp-2 mb-2">Space Grey, 256GB SSD, 8GB RAM. Battery health 95%.</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-xs text-text-sub-light dark:text-text-sub-dark">
              <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
              Mogpog
            </div>
            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">3 days ago</span>
          </div>
        </div>
      </div>
      {/* Card 3 */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 group">
        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700">
          <img alt="Mechanical Keyboard close up" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Custom mechanical keyboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2y0_cFMhE25-ZCf5bBJiXuAp-HwcfJS2nrEwbpo0W_BcTEqTRG9daabbJ7vxUvfDhv40CgVzvWZEH1Jq8nz5sBLCRc39ZQEcjt_BlAcAwM4Pao41ffApdBBDRv9d0502XeFNsy8k3zZme66PfhKCJi9A5sDnU46hwtBfIUBnghpXIzwIRCJG9_zv81V8hPhADDBJt7X-NIWgfHo5e2aNUoOxnM37OhHsLEf_vGlOg7xYKW1SX6CasndtWKE3J9ZwPPPfc9grdj8w" />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite_border</span>
          </button>
          <span className="absolute bottom-3 left-3 text-white font-bold text-xs bg-blue-600 px-2 py-0.5 rounded-sm">New</span>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark truncate pr-2">Keychron K2 V2</h3>
            <p className="text-primary font-bold text-base whitespace-nowrap">₱3,500</p>
          </div>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark line-clamp-2 mb-2">RGB Backlight, Brown Switches. Brand new in box.</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-xs text-text-sub-light dark:text-text-sub-dark">
              <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
              Santa Cruz
            </div>
            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">5 hrs ago</span>
          </div>
        </div>
      </div>
      {/* Card 4 */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 group">
        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700">
          <img alt="Headphones on stand" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Black noise cancelling headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcdlg8iQqtbTdn13s9a9KNwJB5RfCyn29ce2O-jvK_RX9meo5MrhcOABf6NBu02C9ErZQUqafKmNrPHp297p_z7GKzv1VGj-M7aLMM2ru7F8ijOUF379xw3FugHO2oQxt3mNluyDA8DYcExT_vGF7X-KuWJqTbu8xgh5rSKG9c0nPfE2ee9eWgW3yVHyD_7xg8msgDfyeF1VQJ1u6hW-TkB0OwD5f8wL9r8tSK0IvLbRuGAUVKrUvhC41b7UbJsMtQ-ONxW-2a7bU" />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite_border</span>
          </button>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark truncate pr-2">Sony WH-1000XM4</h3>
            <p className="text-primary font-bold text-base whitespace-nowrap">₱12,000</p>
          </div>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark line-clamp-2 mb-2">Active Noise Cancelling. Excellent condition.</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-xs text-text-sub-light dark:text-text-sub-dark">
              <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
              Boac
            </div>
            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center py-4">
      <button className="flex items-center gap-2 text-primary font-semibold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
        <span>View More Items</span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>
    </div>
  </main>
  {/* Bottom Navigation */}
  {/* Safe area spacing for mobile */}
  <div className="h-20" />
</div>

    </>
  );
}
