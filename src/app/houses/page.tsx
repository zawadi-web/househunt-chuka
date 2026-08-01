"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FilterState, House } from '@/lib/types';
import HouseCard from '@/components/houses/HouseCard';
import FilterBar from '@/components/houses/FilterBar';
import InteractiveMap from '@/components/houses/InteractiveMap';
import { Map, LayoutGrid, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

export default function BrowseHousesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    areaName: 'ALL',
    roomType: 'ALL',
    minPrice: 0,
    maxPrice: 50000,
    maxDistance: 10.0,
    water247: false,
    wifiOnly: false,
    securityGuarded: false,
    furnishedOnly: false,
    verifiedOnly: false,
  });

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/houses?status=ALL');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setHouses(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch houses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      areaName: 'ALL',
      roomType: 'ALL',
      minPrice: 0,
      maxPrice: 50000,
      maxDistance: 10.0,
      water247: false,
      wifiOnly: false,
      securityGuarded: false,
      furnishedOnly: false,
      verifiedOnly: false,
    });
  };

  // Filter calculation logic
  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = house.title.toLowerCase().includes(query);
        const matchesArea = house.areaName.toLowerCase().includes(query);
        const matchesLandlord = house.landlord?.name?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesArea && !matchesLandlord) return false;
      }

      // Room Type
      if (filters.roomType !== 'ALL' && house.roomType !== filters.roomType) {
        return false;
      }

      // Price Range
      if (house.rentPerMonth > filters.maxPrice) {
        return false;
      }

      // Distance from University
      if (house.distanceFromCampus > filters.maxDistance) {
        return false;
      }

      // Amenities
      if (filters.water247 && !house.waterAvailability?.includes('24/7')) return false;
      if (filters.wifiOnly && !house.wifiAvailable) return false;
      if (filters.securityGuarded && !house.securityGuarded) return false;
      if (filters.verifiedOnly && house.landlord?.verificationStatus !== 'VERIFIED') return false;

      return true;
    });
  }, [houses, filters]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Student Houses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Browse Houses Around Chuka Uni
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{filteredHouses.length}</strong> available verified listings
          </p>
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid' 
                ? 'bg-brand-primary text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map' 
                ? 'bg-brand-primary text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter Bar */}
        <div className="lg:col-span-1">
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            onReset={resetFilters} 
          />
        </div>

        {/* Right Main Grid / Map Display */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            filteredHouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHouses.map((house) => (
                  <HouseCard key={house.id} house={house} />
                ))}
              </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">No Verified Houses Listed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    The platform has been freshly deployed and connected to the live database. Are you a landlord in Chuka? Be the first to post your property!
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href="/dashboard/landlord"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-md"
                    >
                      Post Property as Landlord
                    </a>
                    <button
                      onClick={resetFilters}
                      className="bg-slate-100 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset Search</span>
                    </button>
                  </div>
                </div>
            )
          ) : (
            <div className="space-y-4">
              <InteractiveMap houses={filteredHouses} />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
