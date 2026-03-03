import React from 'react';

export default function ModeratorApprovalQueue() {
  return (
    <>
      <div>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-slate-600 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Moderator Dashboard</h1>
            </div>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
          </div>
        </header>
        <main className="flex-1 pb-24">
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <span className="text-primary text-2xl font-bold">12</span>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Pending</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
              <span className="text-orange-500 text-2xl font-bold">5</span>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Reported</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 border border-red-100 shadow-sm">
              <span className="text-red-500 text-2xl font-bold">2</span>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Flagged</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <h2 className="text-slate-800 text-lg font-bold mb-3">Approval Queue</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button className="flex-shrink-0 px-4 py-2 rounded-full bg-slate-800 text-white text-sm font-semibold shadow-md">
                All
              </button>
              <button className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-gray-300 text-slate-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Jobs
              </button>
              <button className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-gray-300 text-slate-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Classifieds
              </button>
              <button className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-gray-300 text-slate-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Community
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img alt="Profile picture of a man smiling" className="w-10 h-10 rounded-full object-cover border border-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW99WZy8mgdfEtPjRpqyUE11EDmdg2IEL6ndiOMetFSzrCtVAt8dGAB9Bo4BhqqMuxTvYIE3SGdvb5vI7DDxvW-xem-RRa1LmrZmpQn4JjGPtxB-gm_-xXrAkeagPZdE9siPEhfNgD-3a3SxdFlECDxc_s8Lf6iRVnAg8fwEraRZ4BnogOKjfVJAHnvSnyRSlpGKc5Yahb0N959vtuFCu8zyk2MdCHpcmG9wvwQItcNM-K2i3WheyqF0VI9t1fwzJOMle01qExWEI" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">Ramon Magcawas</p>
                    <div className="flex items-center text-slate-500 text-xs gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">Boac, Marinduque</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                      <span>2h ago</span>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100">Job</span>
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">Looking for Experienced Carpenter</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  Need someone for a 2-week project in Barangay Mercado. Must have own tools. Daily rate negotiable based on experience.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <button className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors">
                  View Details
                </button>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img alt="Profile picture of a woman" className="w-10 h-10 rounded-full object-cover border border-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2hjf40j231pDgSv7-8yK6SZEwJUwAG92MdvcreJaPdhDltJA-14frlrBM_bqhJ1HFeWWABl7BLMpr9EkVZsImHypGFR_wKIE8Y1c-W7EYqu9r3kx8n89gruIqt2VjW-49ahVrPjKoLYjpiki9BdcjV6FOC5Wz5-iJ5sSfG5anvKzZ0gfUh27pJcT95HN62-A_5rt4xvh0klzEsATWjck5ELXN0vhsI6U7OXqbY5J5kEqmwXmHqlZyMMrN4wjVVZN73U4iwEhx23g" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">Maria Santos</p>
                    <div className="flex items-center text-slate-500 text-xs gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">Gasan, Marinduque</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                      <span>4h ago</span>
                    </div>
                  </div>
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold border border-green-100">Sell</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-slate-900 font-bold text-base mb-1">Secondhand Motorcycle</h3>
                    <p className="text-emerald-600 font-bold text-sm mb-2">₱ 45,000</p>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                      Good condition, registered until next year. RFS: Upgrading to a car.
                    </p>
                  </div>
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img className="w-full h-full object-cover" data-alt="Red motorcycle parked on a street" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfHIrQwiWc7rGFa9Gb1n1-rOtOUeMX7vL33jHmunh_lptrYE-XZOexymQhpTvnjamYYlVn1pPntWqJ3y6E_69fZ89UWaiAim6y4cvn68mI2spprMopK9gBzEKRATRbXLeRf21C5nUWxxVPbkCh71GpfJP8CNmvN8QjXX08LVZWYRMt8Fw6aKULH-NgBQMdPZrJiQ3ym_4Ika29ZzJ1y2o8bbaIpAlJD88RFVdmGyclOxY8Bn53uHnnhUDGd8e_jCDfR4ZLuqNftXM" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <button className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors">
                  View Details
                </button>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                    <span className="text-purple-600 font-bold text-sm">MC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">Marinduque Cyclists</p>
                    <div className="flex items-center text-slate-500 text-xs gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">Mogpog, Marinduque</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                      <span>6h ago</span>
                    </div>
                  </div>
                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold border border-purple-100">Event</span>
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">Weekend Ride for a Cause</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  Join us this Saturday for a charity ride around the island. Proceeds will go to the local school feeding program.
                </p>
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2 shadow-sm border border-gray-200">
                  <img className="w-full h-full object-cover" data-alt="Group of cyclists riding on a scenic road" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB4OxHXQvXjYYD4t7tvydm7GX1yuqnzutpG_M6KuwpKtRaLjeAjZJqdFBt0edY_VOAbTUGwaKh1V37d8S4tgv-YisGlkI0azI_gjerFgHRaRIeFGcGa1UvgHyGw-cH0FgLEXmGGr70a-Qp6uZstLqAlOEEZaIBPZcBJHeSH3gAofHY41cNPrdJIxYGVdWEasyuBgpkwarA5Svezch-CF01lkTDW1FqN4GGgHFwYCJkuUbsWlhAgGFnnPWZWgTK2Pa4nijKEXvrTNY" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div className="flex items-center gap-1 text-white text-xs font-medium">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Sat, Oct 28 • 5:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <button className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors">
                  View Details
                </button>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-200 shadow-sm transition-all">
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden shadow-sm relative">
              <div className="absolute top-0 right-0 p-2">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Reported</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">Anonymous User</p>
                    <div className="flex items-center text-slate-500 text-xs gap-1">
                      <span className="truncate">Sta. Cruz, Marinduque</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
                  <p className="text-red-700 text-xs font-bold mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Reason for Report:
                  </p>
                  <p className="text-slate-700 text-sm">&quot;Posting multiple spam listings about easy loans.&quot;</p>
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-1">Fast Cash Loans No Collateral</h3>
                <p className="text-slate-500 text-sm italic line-clamp-1">
                  PM me for details. 100% legit.
                </p>
              </div>
              <div className="bg-red-50/30 px-4 py-3 flex items-center justify-between border-t border-red-100">
                <button className="text-slate-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors">
                  Review History
                </button>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors" title="Ban User">
                    <span className="material-symbols-outlined">block</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:bg-slate-50 border border-gray-300 transition-colors" title="Dismiss Report">
                    <span className="material-symbols-outlined">remove_moderator</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  );
}
