'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import FlagButton from './FlagButton';

type ServiceType = 'rides' | 'delivery' | 'both';
type VehicleType = 'motorcycle' | 'tricycle' | 'car-van' | 'jeepney' | 'door-to-door';

interface Operator {
  id: number;
  name: string;
  operator: string;
  vehicleType: VehicleType;
  serviceType: ServiceType;
  towns: string[];
  price: string;
  rating: number;
  schedule?: string[];
  route?: { from: string; to: string };
  charterAvail?: boolean;
  img: string;
  available: boolean;
  fb?: string;
  phone?: string;
}

const VEHICLE_META: Record<VehicleType, { emoji: string; label: string }> = {
  motorcycle: { emoji: '🏍️', label: 'Motorcycle' },
  tricycle: { emoji: '🛺', label: 'Tricycle' },
  'car-van': { emoji: '🚗', label: 'Car / Van' },
  jeepney: { emoji: '🚌', label: 'Jeepney' },
  'door-to-door': { emoji: '🚐', label: 'Door-to-Door Van' },
};

const MOCK_OPERATORS: Operator[] = [
  {
    id: 1,
    name: 'Boac → Manila Door-to-Door',
    operator: 'D&G Transport',
    vehicleType: 'door-to-door',
    serviceType: 'rides',
    route: { from: 'Boac', to: 'Manila (via RoRo)' },
    towns: ['Boac', 'Mogpog'],
    price: '₱1,400 / seat',
    rating: 4.8,
    schedule: ['Daily 8:00 PM', 'Daily 10:00 PM'],
    charterAvail: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY',
    available: true,
    phone: '9171234567',
    fb: 'DGTransportBoac',
  },
  {
    id: 2,
    name: 'Sta. Cruz → Lucena Route',
    operator: 'Kuya Noel',
    vehicleType: 'jeepney',
    serviceType: 'rides',
    route: { from: 'Sta. Cruz', to: 'Lucena City' },
    towns: ['Sta. Cruz', 'Torrijos', 'Buenavista'],
    price: '₱250 / seat',
    rating: 4.5,
    schedule: ['Mon–Sat 5:30 AM', 'Mon–Sat 1:00 PM'],
    charterAvail: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANTk38KamPgDWfR1TmPNXpK_dilcD5IXL9Y9LUVIOpIADgvmRWiPq3bAvB7ZWPhAZQmFQfIlO8NHXLe7PjuiKCNjItkzog-jXs3KD6GTHYb05OEY3QZ1TySvGeF2DJa7qjY2JYmhnsHysY-tu3frRfmKvrQraUjBK8pD_Cp9mKHOa1Vw11eUO1yX-RaI722lPY6Sp_k-D4p0j55k8WQn6pHSu1grx80IKfucxERuUSvhF1xjwrvPG2v90pF_P3NNa-lvjmBq4cXGQ',
    available: true,
    phone: '9089876543',
    fb: 'mangboyuvexpress',
  },
  {
    id: 3,
    name: 'Boac Delivery Rider',
    operator: 'Kuya Tonyo',
    vehicleType: 'motorcycle',
    serviceType: 'delivery',
    towns: ['Boac', 'Mogpog', 'Gasan'],
    price: 'From ₱50',
    rating: 4.9,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzqYFgAIu84Ex93XVkX5INHS9_wFSzpteW0L3IsiCZF6QIjdy5Pj6RoPOvPPjiuk8qjttUF3ePe_Gpz9sWViWEBG6GN2_cMiwmXnPeXXW-m2xV9YyjVmcTBXjuI3w9PSfukBoucsnaV-hUXma1n5ATHIP3wPfrU-IxNEC8axyG1NSFvd8NdCHKeKsLpNe6GvmcNocth_xEXjWE6mqxGagW4Pfgq3TzkUtzV6erfvsIqjfF9oTupDlPSQU5syLYv3byJbkctflU_k',
    available: false,
    phone: '9151231234',
  },
  {
    id: 4,
    name: 'Gasan Tricycle — On-demand',
    operator: 'Mang Bert',
    vehicleType: 'tricycle',
    serviceType: 'both',
    towns: ['Gasan', 'Buenavista'],
    price: 'From ₱30',
    rating: 4.7,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnapaupyvBwBt9JEc2DBtBLkShRvFkQcfy9mZIKnhNwlu_5iuM39JE1kpwMbRlLwRc4oxi4JJ_BE_XDucdP_Yb8lx0JRdTIzmQD9Yl0DKyfCEG9suJ2yCZMzr9PK-LD9-KtJcGRRGjVV06Nu9pOYK9CEY6_H1OGBPfW0VjaEX00EoAoAoFfi_qfGr9yDnuublLwB5JPvptZCJGae8oXxFx_jERN-5PBdnrY3bTBFGMoXkC1nrsXjC-9QQPpbajufnvpAOaZgk_JM',
    available: true,
    phone: '9290009901',
    fb: 'JacLinerOfficial',
  },
  {
    id: 5,
    name: 'Boac Multicab & Delivery',
    operator: 'Ate Grace',
    vehicleType: 'car-van',
    serviceType: 'both',
    towns: ['Boac', 'Mogpog', 'Gasan', 'Buenavista'],
    price: 'From ₱80',
    rating: 4.6,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY',
    available: true,
    phone: '9178889900',
    fb: 'ategracetransport',
  },
];

const SERVICE_LABELS: Record<ServiceType, { label: string; icon: string }> = {
  rides: { label: 'Rides', icon: 'directions_car' },
  delivery: { label: 'Deliveries', icon: 'local_shipping' },
  both: { label: 'Rides & Delivery', icon: 'swap_horiz' },
};

function OperatorCard({ op }: { op: Operator }) {
  const [isAvailable, setIsAvailable] = useState(op.available);
  const vm = VEHICLE_META[op.vehicleType];
  const svc = SERVICE_LABELS[op.serviceType];
  const isScheduled = op.vehicleType === 'jeepney' || op.vehicleType === 'door-to-door';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img src={op.img} alt={op.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Availability toggle badge */}
        <button
          onClick={() => setIsAvailable((v) => !v)}
          title="Tap to toggle your availability"
          className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 transition-all active:scale-95 ${isAvailable
            ? 'bg-green-500 border-green-300 text-white'
            : 'bg-red-500 border-red-300 text-white'
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-200' : 'bg-red-200'} animate-pulse`} />
          {isAvailable ? 'Available' : 'Unavailable'}
        </button>

        {/* Bottom-left meta pills */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 flex-wrap">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2 py-1 rounded-md">
            {vm.emoji} {vm.label}
          </span>
          <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">{svc.icon}</span>
            {svc.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{op.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{op.operator}</p>
          </div>
          <div className="text-right shrink-0 flex items-start gap-3">
            <div>
              <p className="font-bold text-teal-600 dark:text-teal-400 text-sm">{op.price}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-0.5 justify-end">
                <span className="material-symbols-outlined text-[12px] text-teal-500">star</span>
                {op.rating}
              </p>
            </div>
            <FlagButton contentType="commute" contentId={op.id.toString()} />
          </div>
        </div>

        {/* Route (for scheduled types) */}
        {isScheduled && op.route && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span className="material-symbols-outlined text-[14px] text-teal-500">route</span>
            <span>{op.route.from}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
            <span>{op.route.to}</span>
          </div>
        )}

        {/* Departure schedule (scheduled types) */}
        {isScheduled && op.schedule && op.schedule.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {op.schedule.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-md text-[10px] font-semibold"
              >
                <span className="material-symbols-outlined text-[11px]">schedule</span>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Towns (on-demand types) */}
        {!isScheduled && (
          <div className="flex flex-wrap gap-1">
            {op.towns.map((t) => (
              <span key={t} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Charter badge */}
        {op.charterAvail && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-md text-[10px] font-semibold">
            <span className="material-symbols-outlined text-[12px]">groups</span>
            Group &amp; Charter Available
          </div>
        )}

        {/* Contact buttons */}
        <div className="flex gap-2 pt-0.5">
          {op.phone && (
            <a
              href={`tel:+63${op.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Call
            </a>
          )}
          {op.phone && (
            <a
              href={`sms:+63${op.phone}`}
              className="flex items-center justify-center w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">sms</span>
            </a>
          )}
          {op.fb && (
            <a
              href={`https://m.me/${op.fb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs transition-all active:scale-95 shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommuterDeliveryHub() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | 'all'>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
  const [townFilter, setTownFilter] = useState<string>('All Towns');

  const towns = ['All Towns', 'Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];

  const filtered = MOCK_OPERATORS.filter((op) => {
    const vehicleMatch = vehicleFilter === 'all' || op.vehicleType === vehicleFilter;
    const serviceMatch = serviceFilter === 'all' || op.serviceType === serviceFilter || op.serviceType === 'both';
    const townMatch = townFilter === 'All Towns' || op.towns.includes(townFilter) || (op.route && (op.route.from === townFilter || op.route.to === townFilter));
    return vehicleMatch && serviceMatch && townMatch;
  });

  return (
    <>
      <div>
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center p-3 gap-2">
            <Link
              href="/marinduque-connect-home-feed"
              className="flex shrink-0 size-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>

            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white whitespace-nowrap">
              Commute &amp; Delivery
            </h2>

            {/* In-Header Segmented Filter */}
            <div className="flex-1 ml-auto max-w-[210px] min-w-[170px]">
              <div className="relative bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 flex">
                <div
                  className="absolute top-0.5 bottom-0.5 rounded-md bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 ease-in-out"
                  style={{
                    width: 'calc(33.33% - 2px)',
                    left: serviceFilter === 'all' ? '2px' : serviceFilter === 'rides' ? '33.33%' : '66.66%'
                  }}
                />

                {([
                  { key: 'all', label: 'All' },
                  { key: 'rides', label: 'Rides' },
                  { key: 'delivery', label: 'Deliveries' },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setServiceFilter(f.key)}
                    className={`relative z-10 flex-1 flex items-center justify-center h-6 text-[9.5px] font-bold transition-colors ${serviceFilter === f.key
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 dark:text-zinc-500'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Type Filter Grid (2 even rows) */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-3">
            {([
              { key: 'all', emoji: '🗂️', label: 'All' },
              { key: 'motorcycle', emoji: '🏍️', label: 'Motorcycle' },
              { key: 'tricycle', emoji: '🛺', label: 'Tricycle' },
              { key: 'car-van', emoji: '🚗', label: 'Car/Van' },
              { key: 'jeepney', emoji: '🚌', label: 'Jeepney' },
              { key: 'door-to-door', emoji: '🚐', label: 'D2D Van' },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setVehicleFilter(f.key)}
                className={`flex items-center justify-center gap-1.5 h-8 px-1.5 rounded-lg text-[10px] font-bold transition-all border ${vehicleFilter === f.key
                  ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                  }`}
              >
                <span className="text-sm">{f.emoji}</span>
                <span className="truncate">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Town Filter (Horizontal Scroll) */}
          <div className="flex gap-4 px-4 pb-3 pt-1 overflow-x-auto scrollbar-hide border-t border-slate-50 dark:border-zinc-800/50">
            {towns.map((t) => (
              <button
                key={t}
                onClick={() => setTownFilter(t)}
                className={`flex shrink-0 items-center gap-1 text-[11px] font-bold transition-all ${townFilter === t
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-400 dark:text-zinc-600 hover:text-slate-600'
                  }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {t === 'All Towns' ? 'map' : 'location_on'}
                </span>
                {t}
                {townFilter === t && <div className="ml-1 w-1 h-1 rounded-full bg-teal-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        <div className="px-4 pt-3 pb-28 space-y-4">
          <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-2">
            <span>{filtered.length} operator{filtered.length !== 1 ? 's' : ''} found</span>
            {townFilter !== 'All Towns' && (
              <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 px-2 py-0.5 rounded text-[10px]">
                in {townFilter}
              </span>
            )}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-zinc-600">
              <span className="material-symbols-outlined text-[48px] mb-3 block">commute</span>
              <p className="font-semibold">No operators found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map((op) => <OperatorCard key={op.id} op={op} />)
          )}
        </div>

        {/* Post FAB */}
        <Link
          href="/post-commute-or-delivery-listing"
          className="fixed right-4 bottom-20 z-40 bg-teal-100 dark:bg-teal-900/80 hover:bg-teal-200 dark:hover:bg-teal-800 text-teal-700 dark:text-teal-300 rounded-full size-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-teal-200 dark:border-teal-700"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </Link>
      </div>
    </>
  );
}
