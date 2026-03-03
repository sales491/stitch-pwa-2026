'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';

const TOWNS = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];

type OperatorType = 'motorcycle' | 'tricycle' | 'car-van' | 'jeepney' | 'door-to-door';
type ServiceType = 'rides' | 'delivery' | 'both';

const OPERATOR_TYPES: {
    id: OperatorType;
    icon: string;
    label: string;
    sub: string;
    mode: 'on-demand' | 'scheduled';
}[] = [
        {
            id: 'motorcycle',
            icon: '🏍️',
            label: 'Motorcycle (Habal-habal)',
            sub: 'On-demand rides & small deliveries',
            mode: 'on-demand',
        },
        {
            id: 'tricycle',
            icon: '🛺',
            label: 'Tricycle',
            sub: 'Local on-demand transport within or between towns',
            mode: 'on-demand',
        },
        {
            id: 'car-van',
            icon: '🚗',
            label: 'Car / Van (Small)',
            sub: 'Flexible — on-demand or semi-scheduled',
            mode: 'on-demand',
        },
        {
            id: 'jeepney',
            icon: '🚌',
            label: 'Jeepney',
            sub: 'Fixed route with regular schedule; charters available',
            mode: 'scheduled',
        },
        {
            id: 'door-to-door',
            icon: '🚐',
            label: 'Door-to-Door Van (RoRo)',
            sub: 'Manila / Lucena routes via RoRo ferry; group bookings',
            mode: 'scheduled',
        },
    ];

const DEPARTURE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ScheduleRow({
    day,
    time,
    onRemove,
}: {
    day: string;
    time: string;
    onRemove: () => void;
}) {
    return (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 rounded-xl px-3 py-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-8">{day}</span>
            <span className="text-slate-500 dark:text-slate-400 flex-1">{time}</span>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
}

export default function PostCommuteOrDeliveryListing() {
    const [operatorType, setOperatorType] = useState<OperatorType | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType>('rides');
    const [selectedTowns, setSelectedTowns] = useState<string[]>([]);

    // Scheduled-specific state
    const [routeFrom, setRouteFrom] = useState('');
    const [routeTo, setRouteTo] = useState('');
    const [scheduleDay, setScheduleDay] = useState('Mon');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleList, setScheduleList] = useState<{ day: string; time: string }[]>([]);
    const [seats, setSeats] = useState(10);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [charterAvail, setCharterAvail] = useState(false);
    const [charterMinPax, setCharterMinPax] = useState(10);
    const [charterRate, setCharterRate] = useState('');
    const [charterNotes, setCharterNotes] = useState('');
    const [filterError, setFilterError] = useState<string | null>(null);

    // On-demand-specific state
    const [baseRate, setBaseRate] = useState('');
    const [availHours, setAvailHours] = useState('');

    // Contact
    const [fbUsername, setFbUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const hasContact = fbUsername.trim() || phone.trim() || email.trim();
    const selected = OPERATOR_TYPES.find((o) => o.id === operatorType);
    const isScheduled = selected?.mode === 'scheduled';

    const toggleTown = (t: string) =>
        setSelectedTowns((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );

    const addSchedule = () => {
        if (!scheduleTime.trim()) return;
        setScheduleList((prev) => [...prev, { day: scheduleDay, time: scheduleTime }]);
        setScheduleTime('');
    };

    const handlePost = (e: React.MouseEvent) => {
        setFilterError(null);
        const result = filterAllFields({ routeFrom, routeTo, charterNotes });
        if (!result.passed) {
            e.preventDefault();
            setFilterError(result.reason ?? 'Content contains prohibited material.');
            return;
        }
        if (!hasContact) {
            e.preventDefault();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10">
                <Link href="/commuter-delivery-hub" className="text-slate-800 dark:text-slate-200">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">List Your Service</h1>
                <div className="w-8" />
            </div>

            <div className="p-4 space-y-6 pb-32 flex-1 overflow-y-auto w-full max-w-md mx-auto">

                {/* Pending Review Notice */}
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-400 mb-2 mt-2">
                    <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">how_to_reg</span>
                    <span>To ensure safety and quality, all Commute & Delivery profiles must be <strong>approved by a moderator</strong> before appearing publicly.</span>
                </div>

                {/* Filter error */}
                {filterError && (
                    <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
                        <span><strong>Listing blocked:</strong> {filterError}</span>
                    </div>
                )}

                {/* Step 1 — Operator Type */}
                <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-teal-500">commute</span>
                        What type of operator are you?
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        This determines which details you&apos;ll fill in below.
                    </p>
                    <div className="flex flex-col gap-2">
                        {OPERATOR_TYPES.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setOperatorType(opt.id)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${operatorType === opt.id
                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                                    : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                                    }`}
                            >
                                <span className="text-2xl shrink-0">{opt.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${operatorType === opt.id ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                                        {opt.label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.sub}</p>
                                </div>
                                {operatorType === opt.id && (
                                    <span className="material-symbols-outlined text-teal-500 shrink-0">check_circle</span>
                                )}
                                {opt.mode === 'scheduled' && (
                                    <span className="shrink-0 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                        Scheduled
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- ON-DEMAND FIELDS --- */}
                {operatorType && !isScheduled && (
                    <>
                        {/* Service Type */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-teal-500">swap_horiz</span>
                                What do you offer?
                            </h2>
                            <div className="flex gap-2">
                                {([
                                    { id: 'rides', icon: 'directions_car', label: 'Rides' },
                                    { id: 'delivery', icon: 'local_shipping', label: 'Deliveries' },
                                    { id: 'both', icon: 'swap_horiz', label: 'Both' },
                                ] as const).map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setServiceType(opt.id)}
                                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${serviceType === opt.id
                                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                                            : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Towns Covered */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-teal-500">location_on</span>
                                Towns You Cover
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {TOWNS.map((town) => (
                                    <button
                                        key={town}
                                        onClick={() => toggleTown(town)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${selectedTowns.includes(town)
                                            ? 'bg-teal-500 border-teal-500 text-white'
                                            : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {town}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Base Rate & Hours */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-teal-600 dark:text-teal-500 mb-1">Base Rate (₱)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={baseRate}
                                    onChange={(e) => setBaseRate(e.target.value)}
                                    className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-teal-400 placeholder-slate-400"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-teal-600 dark:text-teal-500 mb-1">Available Hours</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 6AM–8PM"
                                    value={availHours}
                                    onChange={(e) => setAvailHours(e.target.value)}
                                    className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-teal-400 placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* --- SCHEDULED FIELDS (Jeepney + Door-to-Door) --- */}
                {operatorType && isScheduled && (
                    <>
                        {/* Route */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-500">route</span>
                                Route
                            </h2>

                            <div className="relative border-l-2 border-slate-200 dark:border-zinc-700 ml-3 pl-6 space-y-4 py-2">
                                <div className="absolute w-3 h-3 rounded-full bg-teal-400 -left-[7px] top-4 border-2 border-white dark:border-zinc-900" />
                                <div className="absolute w-3 h-3 rounded-full bg-slate-500 -left-[7px] bottom-4 border-2 border-white dark:border-zinc-900" />

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">From (Origin)</label>
                                    <input
                                        type="text"
                                        placeholder={operatorType === 'door-to-door' ? 'e.g. Boac, Marinduque' : 'e.g. Boac'}
                                        value={routeFrom}
                                        onChange={(e) => setRouteFrom(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-400 placeholder-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">To (Destination)</label>
                                    <input
                                        type="text"
                                        placeholder={operatorType === 'door-to-door' ? 'e.g. Manila (via RoRo)' : 'e.g. Sta. Cruz'}
                                        value={routeTo}
                                        onChange={(e) => setRouteTo(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-400 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Towns covered along route */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                    Stops / Towns Along Route
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {TOWNS.map((town) => (
                                        <button
                                            key={town}
                                            onClick={() => toggleTown(town)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${selectedTowns.includes(town)
                                                ? 'bg-teal-500 border-teal-500 text-white'
                                                : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {town}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-500">schedule</span>
                                Departure Schedule
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Add each departure day + time.</p>

                            {scheduleList.length > 0 && (
                                <div className="space-y-2">
                                    {scheduleList.map((s, i) => (
                                        <ScheduleRow
                                            key={i}
                                            day={s.day}
                                            time={s.time}
                                            onRemove={() =>
                                                setScheduleList((prev) => prev.filter((_, idx) => idx !== i))
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 items-end">
                                <div className="w-24">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Day</label>
                                    <select
                                        value={scheduleDay}
                                        onChange={(e) => setScheduleDay(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-400 appearance-none"
                                    >
                                        {DEPARTURE_DAYS.map((d) => (
                                            <option key={d}>{d}</option>
                                        ))}
                                        <option value="Daily">Daily</option>
                                        <option value="Mon–Fri">Mon–Fri</option>
                                        <option value="Weekends">Weekends</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Departure Time</label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-400"
                                    />
                                </div>
                                <button
                                    onClick={addSchedule}
                                    className="flex items-center justify-center w-10 h-10 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors shrink-0"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Seats & Price */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-teal-600 dark:text-teal-500 mb-1">
                                    {operatorType === 'door-to-door' ? 'Seats Available' : 'Passenger Capacity'}
                                </label>
                                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-1 h-12">
                                    <button
                                        onClick={() => setSeats((s) => Math.max(1, s - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-teal-400"
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-slate-900 dark:text-white text-lg font-bold">{seats}</span>
                                    <button
                                        onClick={() => setSeats((s) => s + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-teal-400"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-teal-600 dark:text-teal-500 mb-1">Price / Seat (₱)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={pricePerSeat}
                                    onChange={(e) => setPricePerSeat(e.target.value)}
                                    className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 outline-none text-slate-900 dark:text-white focus:border-teal-400 placeholder-slate-400 text-lg"
                                />
                            </div>
                        </div>

                        {/* Group / Charter */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">groups</span>
                                        Accept Group / Charter Bookings?
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        e.g. churches, offices, schools, events
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCharterAvail((v) => !v)}
                                    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${charterAvail ? 'bg-teal-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${charterAvail ? 'translate-x-6' : ''}`}
                                    />
                                </button>
                            </div>

                            {charterAvail && (
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Min. Group Size</label>
                                            <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-1 h-10">
                                                <button onClick={() => setCharterMinPax((p) => Math.max(2, p - 1))} className="w-8 h-8 flex items-center justify-center text-teal-400">
                                                    <span className="material-symbols-outlined text-[20px]">remove</span>
                                                </button>
                                                <span className="text-slate-900 dark:text-white font-bold">{charterMinPax}</span>
                                                <button onClick={() => setCharterMinPax((p) => p + 1)} className="w-8 h-8 flex items-center justify-center text-teal-400">
                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Charter Rate (₱)</label>
                                            <input
                                                type="number"
                                                placeholder="Full trip rate"
                                                value={charterRate}
                                                onChange={(e) => setCharterRate(e.target.value)}
                                                className="w-full h-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 outline-none text-slate-900 dark:text-white focus:border-teal-400 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                            Charter Notes <span className="font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            placeholder="e.g. Available for church trips, company outings, school tours. Call 3 days in advance."
                                            value={charterNotes}
                                            onChange={(e) => setCharterNotes(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 outline-none text-slate-900 dark:text-white focus:border-teal-400 placeholder-slate-400 h-20 resize-none text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Contact Info — always shown once operator type is chosen */}
                {operatorType && (
                    <ContactSection
                        fbUsername={fbUsername} setFbUsername={setFbUsername}
                        phone={phone} setPhone={setPhone}
                        email={email} setEmail={setEmail}
                        hint="At least one contact method required — passengers will reach you here."
                    />
                )}

                {/* Post Button */}
                {operatorType && (
                    <Link
                        href={hasContact ? '/commuter-delivery-hub' : '#'}
                        onClick={handlePost}
                        className={`w-full block text-center font-bold text-lg py-4 rounded-xl shadow-md mt-2 transition-all ${hasContact
                            ? 'bg-teal-500 hover:bg-teal-400 text-white shadow-teal-200 dark:shadow-teal-900'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none'
                            }`}
                    >
                        {hasContact ? '✓ Post Listing' : 'Add contact info to post'}
                    </Link>
                )}

                {!operatorType && (
                    <div className="text-center text-slate-400 dark:text-slate-600 text-sm py-4">
                        ↑ Select your operator type above to continue
                    </div>
                )}
            </div>
        </div>
    );
}
