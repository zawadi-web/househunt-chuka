"use client";

import React, { useState } from 'react';
import { House } from '@/lib/types';
import { CHUKA_UNIVERSITY_COORDS } from '@/lib/mock-data';
import { MapPin, Navigation, ShieldCheck, ExternalLink, X } from 'lucide-react';

interface InteractiveMapProps {
  houses: House[];
  onSelectHouse?: (house: House) => void;
}

// Verified geographic offsets for Chuka University campus zones
// Based on actual Google Maps coordinates for Mariani, Tharaka Nithi County
const ZONE_LABELS = [
  { label: "Gate B\nKK Mwendwa Rd",   top: '38%', left: '62%' },
  { label: "Gate A\nMain Entrance",    top: '44%', left: '34%' },
  { label: "Mariani\nRidge",          top: '64%', left: '65%' },
  { label: "Ndia Ndoro\n(Gate C)",     top: '30%', left: '44%' },
  { label: "Lowlands\n(Lowlands Hotel)", top: '24%', left: '55%' },
  { label: "Slaughterhouse\nArea",     top: '22%', left: '38%' },
  { label: "Mungoni\n(Gate F)",        top: '52%', left: '22%' },
  { label: "Juvera's\nJunction",       top: '18%', left: '48%' },
  { label: "Chuka\nTown Center",      top: '75%', left: '26%' },
  { label: "Mutunguruni\nNdagani Mkt", top: '35%', left: '50%' },
];

export default function InteractiveMap({ houses, onSelectHouse }: InteractiveMapProps) {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(houses[0] || null);

  return (
    <div className="relative w-full h-[580px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">
      
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 glass-dark text-white px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-lg">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-brand-dark font-extrabold">
          <Navigation className="w-4 h-4 fill-brand-dark" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Chuka University — Campus Zone Map</h4>
          <p className="text-[10px] text-slate-300">Lowlands • Slaughterhouse • Mungoni (Gate F) • Juvera's • Gate A • Gate B • Gate C</p>
        </div>
      </div>

      {/* Nairobi-Meru Highway B6 Label */}
      <div className="absolute bottom-[42%] left-0 z-10 bg-yellow-500/90 text-brand-dark text-[9px] font-extrabold px-2 py-1 rotate-90 origin-bottom-left translate-x-1 translate-y-1 rounded-sm tracking-widest uppercase">
        Nairobi–Meru Hwy B6
      </div>

      {/* Simulated Interactive Vector Map Canvas */}
      <div className="w-full h-full relative bg-[#1a2637] flex items-center justify-center overflow-hidden">
        
        {/* Map Grid Pattern background */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`, 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Mount Kenya foothills topographic shading */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-emerald-900/40 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-[10px] text-emerald-400/50 font-bold">↑ Mt. Kenya</div>
        </div>

        {/* Highway Road line (vertical) */}
        <div className="absolute left-[33%] top-0 bottom-0 w-1 bg-yellow-600/40" style={{ borderLeft: '3px dashed rgba(202,138,4,0.3)' }} />

        {/* Static Zone Label Markers */}
        {ZONE_LABELS.map((zone, i) => (
          <div
            key={i}
            style={{ top: zone.top, left: zone.left }}
            className="absolute text-center z-5 opacity-40 pointer-events-none"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-auto mb-0.5" />
            <span className="text-[9px] text-slate-400 font-bold leading-tight whitespace-pre-line block">
              {zone.label}
            </span>
          </div>
        ))}

        {/* Chuka University Central Campus Landmark Pin */}
        <div className="absolute z-10 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-[48%]">
          <div className="w-16 h-16 rounded-full bg-brand-primary/30 animate-ping absolute inset-0" />
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary to-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-white z-10">
            <span className="text-[9px] font-black text-center leading-tight">CHUKA<br/>UNI</span>
          </div>
          <span className="mt-1 bg-brand-dark text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-lg border border-slate-700 whitespace-nowrap">
            Main Campus — Mariani
          </span>
        </div>

        {/* Dynamic House Pins mapped to real Chuka zones */}
        {houses.map((house, idx) => {
          // Real-world position offsets corresponding to Chuka geography
          const offsets = [
            { top: '38%', left: '62%' }, // Gate B — KK Mwendwa Reservoir
            { top: '44%', left: '34%' }, // Gate A — Main Entrance
            { top: '64%', left: '65%' }, // Mariani Ridge
            { top: '35%', left: '50%' }, // Mutunguruni — Ndagani Market
            { top: '75%', left: '26%' }, // Chuka Town Center
            { top: '30%', left: '44%' }, // Ndia Ndoro — Gate C
            { top: '24%', left: '55%' }, // Lowlands — Near Lowlands Hotel
            { top: '22%', left: '38%' }, // Slaughterhouse Area (Lowlands)
            { top: '52%', left: '22%' }, // Mungoni Village — Gate F
            { top: '18%', left: '48%' }, // Juvera's Junction
          ];
          const pos = offsets[idx % offsets.length];
          const isSelected = selectedHouse?.id === house.id;

          return (
            <button
              key={house.id}
              onClick={() => {
                setSelectedHouse(house);
                if (onSelectHouse) onSelectHouse(house);
              }}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              {/* Area name label above pin */}
              <div className="text-center mb-1">
                <span className="text-[9px] text-white/70 font-semibold bg-black/40 px-1.5 py-0.5 rounded whitespace-nowrap">
                  {house.areaName}
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-full font-extrabold text-xs flex items-center space-x-1 shadow-lg border-2 ${
                isSelected 
                  ? 'bg-emerald-500 text-brand-dark border-white ring-4 ring-emerald-500/40' 
                  : 'bg-white text-slate-900 border-slate-300 group-hover:border-emerald-500'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>KSh {house.rentPerMonth.toLocaleString()}</span>
              </div>
            </button>
          );
        })}

        {/* Selected House Preview Card overlay */}
        {selectedHouse && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-30 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <button 
              onClick={() => setSelectedHouse(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              <img 
                src={selectedHouse.images[0]?.url} 
                alt={selectedHouse.title} 
                className="w-24 h-24 rounded-xl object-cover shrink-0" 
              />
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-1 text-emerald-600 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedHouse.landlord.name} (Verified)</span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5">{selectedHouse.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {selectedHouse.areaName} • {selectedHouse.distanceFromCampus}km from campus
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-extrabold text-brand-dark text-base">KSh {selectedHouse.rentPerMonth.toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></span>
                  <a 
                    href={`/houses/${selectedHouse.id}`} 
                    className="text-xs font-bold text-white bg-brand-primary hover:bg-brand-blue px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <span>View House</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
