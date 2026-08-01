"use client";

import React from 'react';
import { FilterState } from '@/lib/types';
import { Search, Filter, ShieldCheck, Wifi, Droplets, Lock, RefreshCw, MapPin } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export default function FilterBar({ filters, setFilters, onReset }: FilterBarProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
      
      {/* Search Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-base">
          <Filter className="w-5 h-5 text-brand-primary" />
          <span>Filter Houses</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-primary flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Search Location or Name</label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="e.g. Ndagani, Gate B, Greenwood..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Room Type */}
      {/* Campus Zone Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Campus Zone / Area</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select
            value={filters.areaName}
            onChange={(e) => setFilters(prev => ({ ...prev, areaName: e.target.value }))}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="ALL">All Chuka Zones</option>
            <option value="Gate A (Main Gate)">Gate A — Main Entrance (Highway B6)</option>
            <option value="Gate B (Ndagani)">Gate B — KK Mwendwa Reservoir Road</option>
            <option value="Ndia Ndoro (Gate C)">Ndia Ndoro — Gate C Pathway</option>
            <option value="Lowlands (Near Lowlands Hotel)">Lowlands — Near Lowlands Hotel & Spa</option>
            <option value="Slaughterhouse Area (Lowlands)">Slaughterhouse Area (Lowlands)</option>
            <option value="Mungoni (Gate F)">Mungoni Village — Gate F Entrance</option>
            <option value="Juvera's Junction">Juvera's Junction Landmark</option>
            <option value="Mutunguruni (Ndagani)">Mutunguruni — Ndagani Market</option>
            <option value="Mariani Ridge">Mariani Ridge</option>
            <option value="Chuka Town Center">Chuka Town Center (2.3 km)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Room Type</label>
        <select
          value={filters.roomType}
          onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="ALL">All Room Types</option>
          <option value="Bedsitter">Bedsitter</option>
          <option value="Single">Single Room</option>
          <option value="1 Bedroom">1 Bedroom</option>
          <option value="2 Bedroom">2 Bedroom</option>
          <option value="Shared">Shared Room</option>
        </select>
      </div>

      {/* Monthly / Semester Budget Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
          <span className="uppercase tracking-wider">Max Budget</span>
          <span className="text-brand-primary font-extrabold text-sm">KSh {filters.maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={60000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-brand-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>KSh 1,000/mo</span>
          <span>KSh 60,000/mo</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Applies to both monthly rent &amp; per-semester hostel prices</p>
      </div>

      {/* University Distance Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
          <span className="uppercase tracking-wider">Distance from Chuka Uni</span>
          <span className="text-emerald-600 font-extrabold text-sm">Within {filters.maxDistance} km</span>
        </div>
        <input
          type="range"
          min={0.2}
          max={10.0}
          step={0.1}
          value={filters.maxDistance}
          onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>0.2 km (Gate B)</span>
          <span>10.0 km</span>
        </div>
      </div>

      {/* Checkboxes for Student Essentials */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Student Amenities</label>
        
        <label className="flex items-center space-x-3 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.water247}
            onChange={(e) => setFilters(prev => ({ ...prev, water247: e.target.checked }))}
            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary accent-brand-primary"
          />
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>24/7 Borehole Water</span>
        </label>

        <label className="flex items-center space-x-3 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.wifiOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, wifiOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
          />
          <Wifi className="w-4 h-4 text-emerald-500" />
          <span>Free Fiber WiFi</span>
        </label>

        <label className="flex items-center space-x-3 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.securityGuarded}
            onChange={(e) => setFilters(prev => ({ ...prev, securityGuarded: e.target.checked }))}
            className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark accent-brand-dark"
          />
          <Lock className="w-4 h-4 text-slate-600" />
          <span>Guarded & CCTV</span>
        </label>

        <label className="flex items-center space-x-3 text-xs font-semibold text-slate-700 cursor-pointer pt-2 border-t border-slate-100">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 accent-emerald-600"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 font-bold">Only Show Verified Landlords</span>
        </label>
      </div>

    </div>
  );
}
