'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import FlagButton from './FlagButton';
import AdminActions from './AdminActions';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';

export type ServiceType = 'Passenger' | 'Delivery' | 'Both';
export type VehicleType = 'Tricycle' | 'Motorcycle' | 'Jeepney' | 'Van / UV Express' | 'Private Car' | 'Truck';

export interface Operator {
  id: string;
  name: string;
  operator: string;
  vehicleType: VehicleType;
  serviceType: ServiceType;
  towns: string[];
  price: string;
  rating: number;
  vouchCount?: number;
  hasVouched?: boolean;
  available: boolean;
  phone?: string;
  fb?: string;
  email?: string;
  img: string;
  images?: string[];
  provider_id?: string;
  route?: { from: string; to: string };
  schedule?: { day: string; time: string }[];
  charterAvail?: boolean;
}

const VEHICLE_META: Record<string, { emoji: string; label: string }> = {
  'Motorcycle': { emoji: '🏍️', label: 'Motorcycle' },
  'Tricycle': { emoji: '🛺', label: 'Tricycle' },
  'Private Car': { emoji: '🚗', label: 'Private Car' },
  'Jeepney': { emoji: '🚌', label: 'Jeepney' },
  'Van / UV Express': { emoji: '🚐', label: 'Van / UV Express' },
  'Truck': { emoji: '🚚', label: 'Truck' },
};

const SERVICE_LABELS: Record<string, { label: string; icon: string }> = {
  'Passenger': { label: 'Rides', icon: 'directions_car' },
  'Delivery': { label: 'Deliveries', icon: 'local_shipping' },
  'Both': { label: 'Rides & Delivery', icon: 'swap_horiz' },
};

function OperatorCard({ op }: { op: Operator }) {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(op.available);
  const [vouchCount, setVouchCount] = useState(op.vouchCount || 0);
  const [hasVouched, setHasVouched] = useState(op.hasVouched || false);
  const [isToggling, setIsToggling] = useState(false);
  const [isVouching, setIsVouching] = useState(false);

  const vm = VEHICLE_META[op.vehicleType] || { emoji: '🚗', label: op.vehicleType };
  const svc = SERVICE_LABELS[op.serviceType] || { label: op.serviceType, icon: 'commute' };
  const isScheduled = op.vehicleType === 'Jeepney' || op.vehicleType === 'Van / UV Express';

  const toggleAvailability = async () => {
    setIsToggling(true);
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== op.provider_id) {
        alert("You can only toggle availability for your own listing.");
        return;
      }

      const nextStatus = !isAvailable;
      const { error } = await supabase
        .from('transport_services')
        .update({ is_available: nextStatus })
        .eq('id', op.id);

      if (error) throw error;
      setIsAvailable(nextStatus);
    } catch (err: any) {
      console.error("Toggle error:", err);
      alert(err.message || "Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const toggleVouch = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Sign in to recommend this operator.");
      return;
    }

    setIsVouching(true);
    try {
      if (hasVouched) {
        // Remove vouch
        const { error } = await supabase
          .from('transport_vouches')
          .delete()
          .eq('user_id', user.id)
          .eq('service_id', op.id);

        if (error) throw error;
        setVouchCount(prev => Math.max(0, prev - 1));
        setHasVouched(false);
      } else {
        // Add vouch
        const { error } = await supabase
          .from('transport_vouches')
          .insert({ user_id: user.id, service_id: op.id });

        if (error) throw error;
        setVouchCount(prev => prev + 1);
        setHasVouched(true);
      }
    } catch (err: any) {
      if (err.code !== '23505') { // Ignore unique constraint errors
        console.error("Vouch error:", err);
        alert("Failed to update recommendation.");
      }
    } finally {
      setIsVouching(false);
    }
  };

  const isOwner = user?.id === op.provider_id;

  return (
    <div className={`relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isOwner ? 'border-moriones-red/30 shadow-xl shadow-moriones-red/5 ring-1 ring-moriones-red/10' : 'border-slate-100 dark:border-zinc-800 shadow-sm'}`}>
      {isOwner && (
        <div className="absolute top-4 left-4 z-40 bg-moriones-red text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[12px]">person</span>
          Your Listing
        </div>
      )}
      {/* Upper Section */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-moriones-red to-moriones-red/80" />
        <div className="absolute top-3 right-3">
          <button
            onClick={toggleAvailability}
            disabled={isToggling}
            title="Tap to toggle availability"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border transition-all active:scale-95 ${isAvailable
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400'
              } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'} ${isAvailable ? 'animate-pulse' : ''}`} />
            {isAvailable ? 'Active' : 'Offline'}
          </button>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-zinc-700 overflow-hidden">
            {op.images && op.images.length > 0 ? (
              <img src={op.images[0]} className="w-full h-full object-cover" alt={op.operator} />
            ) : (
              <span className="text-3xl">{vm.emoji}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-base truncate pr-20">{op.operator}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-moriones-red/10 text-moriones-red font-bold px-1.5 py-0.5 rounded uppercase tracking-tight">
                {vm.label}
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">{svc.icon}</span>
                {svc.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 pb-4 space-y-3">
        {/* Price + Community Trust row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-moriones-red font-black text-lg">₱{op.price}</span>
              <span className="text-[11px] text-slate-400 font-medium"> / {isScheduled ? 'seat' : 'base'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Primary Vouch Button */}
            <button
              onClick={toggleVouch}
              disabled={isVouching}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 border shadow-sm ${hasVouched
                ? 'bg-sky-500 border-sky-500 text-white shadow-sky-300/40'
                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-600'
                } ${isVouching ? 'opacity-50 animate-pulse' : ''}`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: hasVouched ? '"FILL" 1' : '"FILL" 0' }}
                >thumb_up</span>
                {vouchCount > 0 && (
                  <span className={`absolute -top-2 -right-2 min-w-[16px] h-4 px-0.5 rounded-full text-[9px] font-black flex items-center justify-center leading-none ${hasVouched
                    ? 'bg-white text-sky-600'
                    : 'bg-sky-500 text-white'
                    }`}>
                    {vouchCount}
                  </span>
                )}
              </div>
              {hasVouched ? 'Vouched' : 'Vouch'}
            </button>
            <div className={`flex items-center gap-1 p-1 rounded-2xl transition-all ${isOwner ? 'bg-moriones-red/5 ring-1 ring-moriones-red/20 pr-2' : ''}`}>
              <AdminActions contentType="commute" contentId={op.id} authorId={op.provider_id} variant="icon" className={`${isOwner ? 'scale-90' : 'scale-75'} origin-right`} />
              {isOwner && <span className="text-[10px] font-black text-moriones-red uppercase tracking-tight -ml-1">Manage</span>}
            </div>
            <FlagButton contentType="commute" contentId={op.id.toString()} />
          </div>
        </div>

        {/* Route (for scheduled types) */}
        {isScheduled && op.route && (
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-zinc-800/50">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-moriones-red" />
              <div className="w-0.5 h-4 bg-slate-200 dark:bg-zinc-700" />
              <div className="w-2 h-2 rounded-full border-2 border-slate-400" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[11px] font-bold text-text-main leading-none">{op.route.from}</p>
              <p className="text-[11px] font-bold text-text-muted leading-none">{op.route.to}</p>
            </div>
          </div>
        )}

        {/* Schedule */}
        {isScheduled && op.schedule && op.schedule.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {op.schedule.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-border-main rounded-lg text-[10px] font-bold text-text-main">
                {s.day} @ {s.time}
              </span>
            ))}
          </div>
        )}

        {/* Towns (on-demand types) */}
        {!isScheduled && (
          <div className="flex flex-wrap gap-1.5">
            {op.towns.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-[10px] font-bold text-text-muted bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-md border border-border-main">
                <span className="material-symbols-outlined text-[12px] text-moriones-red">location_on</span>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Charter badge */}
        {op.charterAvail && (
          <div className="flex items-center gap-2 py-2 px-3 bg-moriones-red/5 dark:bg-moriones-red/10 rounded-xl border border-moriones-red/10">
            <span className="material-symbols-outlined text-[18px] text-moriones-red">groups</span>
            <span className="text-[11px] font-bold text-moriones-red uppercase tracking-wide">Charter / Group Bookings Available</span>
          </div>
        )}

        {/* Contact buttons */}
        <div className="flex gap-2 pt-2">
          {op.phone && (
            <a
              href={`tel:${formatPhPhoneForLink(op.phone)}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-moriones-red hover:bg-moriones-red/90 text-white font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95 shadow-md shadow-moriones-red/20"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Call
            </a>
          )}
          {op.phone && (
            <a
              href={`sms:${formatPhPhoneForLink(op.phone)}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95 border border-slate-200 dark:border-zinc-700"
            >
              <span className="material-symbols-outlined text-[16px]">sms</span>
              Text
            </a>
          )}
          {(op.fb) && (
            <a
              href={op.fb.includes('facebook.com') ? op.fb : `https://m.me/${op.fb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#0084FF] hover:bg-[#0074E0] text-white font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95"
              title="Message on Messenger"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
              </svg>
              Messenger
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommuterDeliveryHub() {
  const [vehicleFilter, setVehicleFilter] = useState<string | 'all'>('all');
  const [serviceFilter, setServiceFilter] = useState<string | 'all'>('all');
  const [townFilter, setTownFilter] = useState<string>('All');
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  React.useEffect(() => {
    async function fetchOperators() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      // Fetch services with provider trust scores, verification and phone via join
      const { data: services, error: serviceError } = await supabase
        .from('transport_services')
        .select(`
          *,
          provider:profiles!transport_services_provider_id_fkey(trust_score, is_verified, phone)
        `);

      if (services) {
        // Fetch vouch counts and user vouches in parallel
        const { data: vouchesCount } = await supabase
          .from('transport_vouches')
          .select('service_id');

        const countsByService: Record<string, number> = {};
        vouchesCount?.forEach(v => {
          countsByService[v.service_id] = (countsByService[v.service_id] || 0) + 1;
        });

        let userVouches = new Set<string>();
        if (user) {
          const { data: userVouchData } = await supabase
            .from('transport_vouches')
            .select('service_id')
            .eq('user_id', user.id);

          userVouchData?.forEach(v => userVouches.add(v.service_id));
        }

        const mapped: Operator[] = services
          // Only show operators whose profile is admin-verified
          .filter((d: any) => d.provider?.is_verified === true)
          .map((d: any) => ({
            id: d.id,
            name: `${d.vehicle_type}: ${d.base_town}`,
            operator: d.driver_name,
            vehicleType: d.vehicle_type,
            serviceType: d.service_type,
            towns: d.towns_covered || [d.base_town],
            price: d.price_per_seat?.toString() || '0',
            // Live trust_score from profiles — highest-rated drivers sort first
            rating: d.provider?.trust_score ?? 0,
            vouchCount: countsByService[d.id] || 0,
            hasVouched: userVouches.has(d.id),
            available: d.is_available,
            // Prefer service contact_number, fall back to profile phone
            phone: d.contact_number || d.provider?.phone || '',
            img: d.images?.[0] || '',
            images: d.images,
            provider_id: d.provider_id,
            route: d.route,
            schedule: d.schedule,
            charterAvail: d.charter_avail,
            fb: d.contact_details?.fb_username,
            email: d.contact_details?.email
          }))
          // Sort by trust_score descending — highest-rated first
          .sort((a, b) => b.rating - a.rating);

        setOperators(mapped);
      }
      setLoading(false);
    }
    fetchOperators();
  }, [supabase]);

  const towns = ['All', 'Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos'];

  const filtered = operators.filter((op) => {
    const vehicleMatch = vehicleFilter === 'all' || op.vehicleType === vehicleFilter;
    const serviceMatch = serviceFilter === 'all' ||
      (serviceFilter === 'rides' && (op.serviceType === 'Passenger' || op.serviceType === 'Both')) ||
      (serviceFilter === 'delivery' && (op.serviceType === 'Delivery' || op.serviceType === 'Both'));
    const townMatch = townFilter === 'All' || op.towns.includes(townFilter);
    return vehicleMatch && serviceMatch && townMatch;
  });

  return (
    <>
      <div className="relative w-full max-w-md mx-auto bg-slate-50 dark:bg-zinc-950 shadow-2xl">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-slate-800 dark:text-slate-200 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </Link>
              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red pl-1">Commute &amp; Delivery</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest pl-1">Find Rides &amp; Cargo Services</p>
              </div>
            </div>
            {/* Service Filter Pills */}
            <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-0.5 shadow-inner">
              {([
                { key: 'all', label: 'All' },
                { key: 'rides', label: 'Rides' },
                { key: 'delivery', label: 'Delivery' },
              ] as const).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setServiceFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${serviceFilter === f.key
                    ? 'bg-white dark:bg-zinc-700 text-moriones-red shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type Filter Grid */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-2">
            {([
              { key: 'all', emoji: '🗂️', label: 'All' },
              { key: 'Motorcycle', emoji: '🏍️', label: 'Motorcycle' },
              { key: 'Tricycle', emoji: '🛺', label: 'Tricycle' },
              { key: 'Private Car', emoji: '🚗', label: 'Car' },
              { key: 'Jeepney', emoji: '🚌', label: 'Jeepney' },
              { key: 'Van / UV Express', emoji: '🚐', label: 'Van' },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setVehicleFilter(f.key)}
                className={`flex items-center justify-center gap-2 h-11 px-2 rounded-xl text-xs font-bold transition-all border ${vehicleFilter === f.key
                  ? 'bg-moriones-red border-moriones-red text-white shadow-lg shadow-moriones-red/20'
                  : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                <span className="text-xl">{f.emoji}</span>
                <span className="truncate">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Town Filter (Evenly Spaced) */}
          <div className="flex justify-between items-center w-full px-4 pb-3 pt-2 border-t border-slate-50 dark:border-zinc-800/50">
            {towns.map((t) => (
              <button
                key={t}
                onClick={() => setTownFilter(t)}
                className={`flex shrink-0 items-center gap-1 text-[11px] font-bold transition-all relative py-1 ${townFilter === t
                  ? 'text-moriones-red'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
              >
                {t}
                {townFilter === t && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-moriones-red rounded-full shadow-[0_0_8px_rgba(185,28,28,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Listings */}
        <div className="bg-slate-50/50 dark:bg-zinc-950/50 px-4 pt-3 pb-32 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
              <span>{filtered.length} operator{filtered.length !== 1 ? 's' : ''} available</span>
              {townFilter !== 'All' && (
                <span className="bg-moriones-red/10 text-moriones-red px-2 py-0.5 rounded text-[9px]">
                  IN {townFilter}
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-slate-600">commute</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">No operators found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters or towns</p>
            </div>
          ) : (
            filtered.map((op) => <OperatorCard key={op.id} op={op} />)
          )}
        </div>

        {/* Post FAB - Fixed to screen but constrained to max-w-md */}
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-[60] flex justify-end px-4">
          <Link
            href="/post-commute-or-delivery-listing"
            className="flex items-center gap-1 bg-moriones-red text-white font-black px-3.5 py-2.5 rounded-full shadow-2xl shadow-moriones-red/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap border-[1.5px] border-white/20 pointer-events-auto"
          >
            <span className="material-symbols-outlined font-black text-lg">add_circle</span>
            <span className="text-[9px] tracking-widest uppercase text-white/90">List Service</span>
          </Link>
        </div>
      </div>
    </>
  );
}
