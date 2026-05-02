'use client';

import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Line } from 'react-simple-maps';
import PageHeader from '@/components/PageHeader';

// Local Map Data
import mapData from '@/data/marinduque-topo.json';
import roadsData from '@/data/marinduque-roads.json';

type PinType = 'port' | 'health' | 'landmark' | 'transport';

interface Pin {
    id: string;
    name: string;
    type: PinType;
    coordinates: [number, number]; // [Longitude, Latitude]
    description: string;
    labelOffset?: { dx: number, dy: number };
    labelAnchor?: 'start' | 'middle' | 'end';
}

const PINS: Pin[] = [
    // Ports
    { id: 'balanacan', name: 'Balanacan Port', type: 'port', coordinates: [121.8719, 13.5284], description: 'Main RORO entry point in Mogpog. Ferries to/from Dalahican (Lucena).' },
    { id: 'buyabod', name: 'Buyabod Port', type: 'port', coordinates: [122.0463, 13.4862], description: 'Port in Santa Cruz. Ferries to Lucena and boats to Maniwaya Island.' },
    { id: 'cawit', name: 'Cawit Port', type: 'port', coordinates: [121.8105, 13.3853], description: 'Secondary RORO port in Boac.', labelOffset: { dx: -15, dy: 5 }, labelAnchor: 'end' },
    { id: 'airport', name: 'Marinduque Airport', type: 'port', coordinates: [121.8329, 13.3592], description: 'Located in Gasan. Currently limited commercial flights.', labelOffset: { dx: -15, dy: 5 }, labelAnchor: 'end' },
    
    // Health / Emergency
    { id: 'mph', name: 'Provincial Hospital', type: 'health', coordinates: [121.8415, 13.4449], description: 'Main public hospital located in Boac. 24/7 Emergency.', labelOffset: { dx: -15, dy: 5 }, labelAnchor: 'end' },
    
    // Landmarks
    { id: 'poctoy', name: 'Poctoy White Beach', type: 'landmark', coordinates: [122.0834, 13.3039], description: 'Famous public white sand beach in Torrijos.' },
    { id: 'luzon-datum', name: 'Luzon Datum of 1911', type: 'landmark', coordinates: [121.9056, 13.4913], description: 'The geodetic center of the Philippines, located in Mogpog.' },
    { id: 'maniwaya', name: 'Maniwaya Island', type: 'landmark', coordinates: [122.1158, 13.5244], description: 'Popular island hopping destination in Santa Cruz.' },
    { id: 'tres-reyes', name: 'Tres Reyes Islands', type: 'landmark', coordinates: [121.8102, 13.2505], description: 'Three islands off the coast of Gasan (Melchor, Gaspar, Baltazar).' },
    { id: 'malindig', name: 'Mount Malindig', type: 'landmark', coordinates: [121.9961, 13.2436], description: 'Highest peak in Marinduque, located in Buenavista. Popular hiking spot.' },
    { id: 'boac-cath', name: 'Boac Cathedral', type: 'landmark', coordinates: [121.8428, 13.4475], description: 'Historic 18th-century church fortress in Boac.', labelOffset: { dx: 0, dy: -35 }, labelAnchor: 'middle' },

    // Transport
    { id: 'boac-term', name: 'Boac Jeepney Terminal', type: 'transport', coordinates: [121.8440, 13.4455], description: 'Main terminal for jeepneys heading to Gasan, Buenavista, Mogpog, and Sta Cruz.', labelOffset: { dx: 15, dy: 5 }, labelAnchor: 'start' },
];

const TOWN_LABELS: { name: string; coordinates: [number, number] }[] = [
    { name: 'Boac', coordinates: [121.91, 13.39] },
    { name: 'Gasan', coordinates: [121.86, 13.29] },
    { name: 'Mogpog', coordinates: [121.95, 13.48] },
    { name: 'Santa Cruz', coordinates: [122.05, 13.48] },
    { name: 'Torrijos', coordinates: [122.05, 13.33] },
    { name: 'Buenavista', coordinates: [121.95, 13.25] },
];

const getTownColor = (name: string) => {
    switch (name) {
        case 'Boac': return 'fill-[#FFEBEE] dark:fill-[#B71C1C]/20'; // Soft red instead of blue
        case 'Gasan': return 'fill-[#F3E5F5] dark:fill-[#4A148C]/20';
        case 'Mogpog': return 'fill-[#E8F5E9] dark:fill-[#1B5E20]/20';
        case 'Santa Cruz': return 'fill-[#FFF3E0] dark:fill-[#E65100]/20';
        case 'Torrijos': return 'fill-[#FFFDE7] dark:fill-[#F57F17]/20';
        case 'Buenavista': return 'fill-[#B2DFDB] dark:fill-[#006064]/40'; // Deepened teal for better contrast
        default: return 'fill-[#F8FAFC] dark:fill-zinc-800';
    }
};

const TYPE_CONFIG = {
    port: { icon: 'directions_boat', color: 'text-blue-500', bg: 'bg-blue-500' },
    health: { icon: 'local_hospital', color: 'text-red-500', bg: 'bg-red-500' },
    landmark: { icon: 'star', color: 'text-amber-500', bg: 'bg-amber-500' },
    transport: { icon: 'directions_bus', color: 'text-teal-500', bg: 'bg-teal-500' },
};

export default function ExplorerMapClient() {
    const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
    const [activeFilter, setActiveFilter] = useState<PinType | 'all'>('all');
    
    // Auto-close sheet when panning/zooming
    const handleMoveEnd = () => {
        // Optional: uncomment if you want panning to close the pin
        // setSelectedPin(null);
    };

    const filteredPins = useMemo(() => {
        if (activeFilter === 'all') return PINS;
        return PINS.filter(p => p.type === activeFilter);
    }, [activeFilter]);

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            <PageHeader title="Explorer Map" subtitle="Offline Survival Guide" />

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800 shrink-0 scrollbar-hide">
                <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-zinc-400'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveFilter('port')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-1 ${activeFilter === 'port' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">directions_boat</span> Ports
                </button>
                <button 
                    onClick={() => setActiveFilter('health')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-1 ${activeFilter === 'health' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">local_hospital</span> Health
                </button>
                <button 
                    onClick={() => setActiveFilter('landmark')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-1 ${activeFilter === 'landmark' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">star</span> Landmarks
                </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full bg-[#E3F2FD] dark:bg-[#001828] relative">
                {/* Connection Status Indicator */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300">Offline Ready</span>
                </div>

                <ComposableMap 
                    projection="geoMercator" 
                    projectionConfig={{
                        scale: 110000,
                        center: [121.95, 13.39] // Centered precisely on Marinduque
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <ZoomableGroup 
                        zoom={1} 
                        minZoom={1} 
                        maxZoom={8} 
                        onMoveEnd={handleMoveEnd}
                    >
                        {/* Render the Island SVG */}
                        <Geographies geography={mapData}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        stroke="#CBD5E1"
                                        strokeWidth={0.5}
                                        className={`${getTownColor(geo.properties.NAME_2)} dark:stroke-zinc-700/50 transition-colors duration-300 outline-none hover:opacity-80 cursor-grab active:cursor-grabbing`}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { outline: "none" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {/* Render Circumferential & Main Roads */}
                        {(roadsData as [number, number][][]).map((line, i) => (
                            <Line
                                key={`road-${i}`}
                                coordinates={line}
                                stroke="#FBBF24" // Amber-400
                                strokeWidth={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="dark:stroke-[#D97706] opacity-80" // Amber-600 in dark mode
                            />
                        ))}

                        {/* Town Name Labels */}
                        {TOWN_LABELS.map((town) => (
                            <Marker key={town.name} coordinates={town.coordinates}>
                                <text
                                    textAnchor="middle"
                                    y={0}
                                    className="font-display font-black text-[14px] fill-slate-500/60 dark:fill-zinc-400/50 uppercase tracking-[0.3em] pointer-events-none select-none"
                                    stroke="white"
                                    strokeWidth="3"
                                    paintOrder="stroke"
                                    strokeLinejoin="round"
                                >
                                    {town.name}
                                </text>
                            </Marker>
                        ))}

                        {/* Render the Pins */}
                        {filteredPins.map((pin) => (
                            <Marker 
                                key={pin.id} 
                                coordinates={pin.coordinates}
                                onClick={() => setSelectedPin(pin)}
                                className="cursor-pointer group"
                            >
                                <g transform="translate(-12, -24)">
                                    {/* Drop Shadow */}
                                    <circle cx="12" cy="24" r="6" fill="rgba(0,0,0,0.1)" className="blur-[2px]" />
                                    {/* Pin SVG */}
                                    <path 
                                        d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z" 
                                        className={`fill-white dark:fill-zinc-900 transition-transform duration-200 ${selectedPin?.id === pin.id ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                    {/* Inner Color Circle */}
                                    <circle 
                                        cx="12" 
                                        cy="8" 
                                        r="5" 
                                        className={`fill-current ${TYPE_CONFIG[pin.type].color} transition-transform duration-200 ${selectedPin?.id === pin.id ? 'scale-110' : 'group-hover:scale-110'}`} 
                                    />
                                </g>
                                {/* Pin Name Label */}
                                <text
                                    textAnchor={pin.labelAnchor || "middle"}
                                    x={pin.labelOffset?.dx || 0}
                                    y={(pin.labelOffset?.dy || 0) + 12}
                                    className={`text-[8px] font-black tracking-wide pointer-events-none transition-opacity ${selectedPin?.id === pin.id ? 'fill-slate-900 dark:fill-white opacity-100' : 'fill-slate-700 dark:fill-zinc-300 opacity-90'}`}
                                    stroke="white"
                                    strokeWidth="2.5"
                                    paintOrder="stroke"
                                    strokeLinejoin="round"
                                >
                                    {pin.name}
                                </text>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Bottom Sheet for Pin Details */}
            <div 
                className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-100 dark:border-zinc-800 transition-transform duration-300 ease-out z-20 ${selectedPin ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {selectedPin && (
                    <div className="p-6 pb-safe">
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-6"></div>
                        
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${TYPE_CONFIG[selectedPin.type].bg}`}>
                                <span className="material-symbols-outlined text-[24px]">{TYPE_CONFIG[selectedPin.type].icon}</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{selectedPin.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{selectedPin.type}</p>
                                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    {selectedPin.description}
                                </p>
                            </div>
                        </div>

                        {/* Close button inside the sheet */}
                        <button 
                            onClick={() => setSelectedPin(null)}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
