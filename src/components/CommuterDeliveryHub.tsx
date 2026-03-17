'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FlagButton from './FlagButton';
import AdminActions from './AdminActions';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';
import ShareButton from './ShareButton';

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
    <div className={`relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isOwner ? 'border-moriones-red/30 shadow-xl shadow-moriones-red/5 ring-1 ring-moriones-red/10' : 'border-slate-100 dark:border-zinc-800 shadow-sm'} ${!isAvailable ? 'opacity-60' : ''}`}>
      {!isAvailable && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-500/10 backdrop-blur-[1px] flex items-center justify-center py-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Currently Offline — Contact Info Still Available</span>
        </div>
      )}

      {/* Upper Section */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-moriones-red to-moriones-red/80" />
        <div className="absolute top-3 right-3">
          {isOwner ? (
            <button
              onClick={toggleAvailability}
              disabled={isToggling}
              className={`flex flex-col items-center gap-0 px-2 py-1 rounded-lg border-2 shadow-md transition-all active:scale-95 ${isAvailable
                ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-300/50'
                : 'bg-slate-700 border-slate-600 text-slate-200 shadow-slate-900/30 dark:bg-zinc-700 dark:border-zinc-600'
              } ${isToggling ? 'opacity-60 cursor-wait' : ''}`}
            >
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${isAvailable ? 'animate-pulse' : 'opacity-40'}`} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isAvailable ? 'Active' : 'Offline'}
                </span>
                <span className="material-symbols-outlined text-[12px] opacity-80">swap_vert</span>
              </div>
              <span className="text-[7px] font-bold uppercase tracking-widest opacity-75">Tap to toggle</span>
            </button>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border pointer-events-none ${isAvailable
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isAvailable ? 'Active' : 'Offline'}
            </div>
          )}
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-100 dark:border-zinc-700 overflow-hidden">
              {op.images && op.images.length > 0 ? (
              <Image src={op.images[0]} width={64} height={64} className="w-full h-full object-cover" alt={op.operator} />
              ) : (
                <span className="text-3xl">{vm.emoji}</span>
              )}
            </div>
            {isOwner && (
              <span className="absolute -top-3 -right-3 material-symbols-outlined text-[18px] text-[#E8722A] drop-shadow-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-[72px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white text-base truncate min-w-0">{op.operator}</h3>
              <ShareButton
                title={`${op.operator} on Marinduque Market Hub`}
                text={`Book a ride or delivery with ${op.operator} (${op.vehicleType}) on the Marinduque Market Hub!`}
                url="/commute"
                variant="icon"
                className="scale-75 shrink-0"
              />
            </div>
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
          <div className="flex items-center gap-2">
            {/* Primary Vouch Button */}
            <button
              onClick={toggleVouch}
              disabled={isVouching}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all active:scale-95 border shadow-sm ${hasVouched
                ? 'bg-sky-500 border-sky-500 text-white shadow-sky-300/40'
                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-600'
                } ${isVouching ? 'opacity-50 animate-pulse' : ''}`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: hasVouched ? '"FILL" 1' : '"FILL" 0' }}
                >thumb_up</span>
                {vouchCount > 0 && (
                  <span className={`absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-black flex items-center justify-center leading-none ${hasVouched
                    ? 'bg-white text-sky-600'
                    : 'bg-sky-500 text-white'
                    }`}>
                    {vouchCount}
                  </span>
                )}
              </div>
              {hasVouched ? 'Vouched' : 'Vouch'}
            </button>
            <AdminActions contentType="commute" contentId={op.id} authorId={op.provider_id} variant="icon" className="scale-75 origin-right" />
            <FlagButton contentType="commute" contentId={op.id.toString()} className="ml-auto" />
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
  
  // Route Filters for Scheduled Rides
  const [routeFromFilter, setRouteFromFilter] = useState<string>('');
  const [routeToFilter, setRouteToFilter] = useState<string>('');

  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const supabase = createClient();

  React.useEffect(() => {
    async function fetchOperators() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

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
          .map((d: any) => ({
            id: d.id,
            name: `${d.vehicle_type}: ${d.base_town}`,
            operator: d.driver_name,
            vehicleType: d.vehicle_type,
            serviceType: d.service_type,
            towns: d.towns_covered || [d.base_town],
            price: '0',
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
          // Sort: owner's card first, then available, then by vouchCount
          .sort((a, b) => {
            if (user) {
              if (a.provider_id === user.id) return -1;
              if (b.provider_id === user.id) return 1;
            }
            if (a.available !== b.available) return a.available ? -1 : 1;
            return b.vouchCount - a.vouchCount;
          });

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

    // Route Match for Scheduled Types
    let routeMatch = true;
    if (op.vehicleType === 'Jeepney' || op.vehicleType === 'Van / UV Express') {
      if (routeFromFilter && op.route?.from) {
        routeMatch = routeMatch && op.route.from.toLowerCase().includes(routeFromFilter.toLowerCase());
      }
      if (routeToFilter && op.route?.to) {
        routeMatch = routeMatch && op.route.to.toLowerCase().includes(routeToFilter.toLowerCase());
      }
    }

    return vehicleMatch && serviceMatch && townMatch && routeMatch;
  });

  // Count active (non-default) filters for badge
  const activeFilterCount = [
    vehicleFilter !== 'all',
    serviceFilter !== 'all',
    townFilter !== 'All',
    routeFromFilter !== '',
    routeToFilter !== '',
  ].filter(Boolean).length;

  return (
    <>
      <div className="relative w-full max-w-md mx-auto bg-slate-50 dark:bg-zinc-950 shadow-2xl">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
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
            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase tracking-wider transition-all hover:border-moriones-red/50 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-moriones-red text-white text-[9px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter summary chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-none">
              {vehicleFilter !== 'all' && (
                <span className="shrink-0 flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-full border border-moriones-red/20">
                  {[{ key: 'Motorcycle', emoji: '🏍️' }, { key: 'Tricycle', emoji: '🛺' }, { key: 'Private Car', emoji: '🚗' }, { key: 'Jeepney', emoji: '🚌' }, { key: 'Van / UV Express', emoji: '🚐' }].find(v => v.key === vehicleFilter)?.emoji} {vehicleFilter === 'Van / UV Express' ? 'Van' : vehicleFilter}
                  <button onClick={() => { setVehicleFilter('all'); setRouteFromFilter(''); setRouteToFilter(''); }} className="ml-0.5"><span className="material-symbols-outlined text-[11px]">close</span></button>
                </span>
              )}
              {serviceFilter !== 'all' && (
                <span className="shrink-0 flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-full border border-moriones-red/20">
                  {serviceFilter === 'rides' ? 'Rides' : 'Delivery'}
                  <button onClick={() => setServiceFilter('all')} className="ml-0.5"><span className="material-symbols-outlined text-[11px]">close</span></button>
                </span>
              )}
              {townFilter !== 'All' && (
                <span className="shrink-0 flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-full border border-moriones-red/20">
                  {townFilter}
                  <button onClick={() => setTownFilter('All')} className="ml-0.5"><span className="material-symbols-outlined text-[11px]">close</span></button>
                </span>
              )}
              {routeFromFilter && (
                <span className="shrink-0 flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-full border border-moriones-red/20">
                  From: {routeFromFilter}
                  <button onClick={() => setRouteFromFilter('')} className="ml-0.5"><span className="material-symbols-outlined text-[11px]">close</span></button>
                </span>
              )}
              {routeToFilter && (
                <span className="shrink-0 flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-full border border-moriones-red/20">
                  To: {routeToFilter}
                  <button onClick={() => setRouteToFilter('')} className="ml-0.5"><span className="material-symbols-outlined text-[11px]">close</span></button>
                </span>
              )}
            </div>
          )}

          {/* CTA banner — only shown to users without a listing */}
          {!currentUser || !operators.some(op => op.provider_id === currentUser?.id) ? (
            <Link
              href="/post-commute-or-delivery-listing"
              className="flex items-center gap-3 mx-4 mb-3 px-4 py-2.5 rounded-2xl bg-moriones-red/5 dark:bg-moriones-red/10 border border-moriones-red/20 hover:border-moriones-red/50 transition-all active:scale-[0.98] group"
            >
              <span className="text-xl">🚗</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-slate-800 dark:text-white leading-tight">Are you a transport operator?</p>
                <p className="text-[10px] text-slate-400 font-medium">List your service free — get discovered</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-moriones-red group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </Link>
          ) : null}
        </header>

        {/* Filter Bottom Sheet */}
        {filterOpen && (
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) setFilterOpen(false); }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl z-10 pb-10">
              {/* Drawer handle */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h2 className="text-base font-black text-slate-900 dark:text-white">Filter Operators</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setVehicleFilter('all'); setServiceFilter('all'); setTownFilter('All'); setRouteFromFilter(''); setRouteToFilter(''); }}
                      className="text-[10px] font-black text-moriones-red uppercase tracking-widest"
                    >
                      Clear all
                    </button>
                  )}
                  <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              <div className="px-5 pt-4 space-y-5 overflow-y-auto max-h-[70vh]">
                {/* Vehicle Type */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vehicle Type</p>
                  <div className="grid grid-cols-3 gap-2">
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
                        onClick={() => {
                          setVehicleFilter(f.key);
                          if (f.key !== 'Jeepney' && f.key !== 'Van / UV Express') {
                            setRouteFromFilter('');
                            setRouteToFilter('');
                          }
                        }}
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
                </div>

                {/* Service Type */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Type</p>
                  <div className="flex gap-2">
                    {([
                      { key: 'all', label: 'All' },
                      { key: 'rides', label: 'Rides' },
                      { key: 'delivery', label: 'Delivery' },
                    ] as const).map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setServiceFilter(f.key)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all ${
                          serviceFilter === f.key
                            ? 'border-moriones-red bg-moriones-red/5 text-moriones-red'
                            : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Route (scheduled only) */}
                {(vehicleFilter === 'Jeepney' || vehicleFilter === 'Van / UV Express') && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Route</p>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-moriones-red tracking-widest">From</span>
                        <select value={routeFromFilter} onChange={(e) => setRouteFromFilter(e.target.value)}
                          className="w-full h-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-12 pr-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-moriones-red appearance-none shadow-sm cursor-pointer">
                          <option value="">Any Origin</option>
                          {['Boac','Buyabod Port','Balanacan Port','Gasan','Lucena','Manila','Mogpog','Sta. Cruz','Torrijos','Buenavista'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-moriones-red tracking-widest">To</span>
                        <select value={routeToFilter} onChange={(e) => setRouteToFilter(e.target.value)}
                          className="w-full h-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-8 pr-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-moriones-red appearance-none shadow-sm cursor-pointer">
                          <option value="">Any Destination</option>
                          {['Boac','Buyabod Port','Balanacan Port','Gasan','Lucena','Manila','Mogpog','Sta. Cruz','Torrijos','Buenavista'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Town */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Town</p>
                  <div className="flex flex-wrap gap-2">
                    {towns.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTownFilter(t)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                          townFilter === t
                            ? 'bg-moriones-red border-moriones-red text-white'
                            : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Done button */}
              <div className="px-5 pt-4">
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-moriones-red text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-moriones-red/30 active:scale-[0.98] transition-all"
                >
                  {activeFilterCount > 0 ? `Show Results (${filtered.length})` : 'View All Operators'}
                </button>
              </div>
            </div>
          </div>
        )}

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

      </div>
    </>
  );
}
