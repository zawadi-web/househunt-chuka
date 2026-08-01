"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { House } from '@/lib/types';
import { ShieldCheck, Heart, MapPin, Wifi, Droplets, Lock, Star, ChevronRight, Check } from 'lucide-react';

interface HouseCardProps {
  house: House;
  onSaveToggle?: (houseId: string) => void;
  isSaved?: boolean;
}

export default function HouseCard({ house, onSaveToggle, isSaved = false }: HouseCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(!saved);
    if (onSaveToggle) onSaveToggle(house.id);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col h-full">
      
      {/* Image Header Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={house.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
          alt={house.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Verification & Trust Badge */}
        {house.landlord?.verificationStatus === 'VERIFIED' && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED LANDLORD</span>
          </div>
        )}

        {/* Featured Tag */}
        {house.isFeatured && (
          <div className="absolute top-3 left-36 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
            FEATURED
          </div>
        )}

        {/* Favourite Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass-effect flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors shadow-md"
          title="Save to Favourites"
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Distance Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{house.distanceFromCampus} km from Chuka Uni</span>
        </div>

        {/* Room Type Pill */}
        <div className="absolute bottom-3 right-3 bg-brand-dark text-white text-xs font-semibold px-2 py-1 rounded-md">
          {house.roomType}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Location Area & Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {house.areaName}, Chuka
            </span>
            <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{house.averageRating ?? 5.0}</span>
              <span className="text-slate-400 font-normal">({house.reviewCount ?? 0})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/houses/${house.id}`} className="block group-hover:text-brand-primary transition-colors">
            <h3 className="font-bold text-slate-900 text-base line-clamp-1 leading-snug">
              {house.title}
            </h3>
          </Link>

          {/* Amenities Quick Row */}
          <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
            {house.waterAvailability?.includes('24/7') && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" /> 24/7 Water
              </span>
            )}
            {house.wifiAvailable && (
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-500" /> Free WiFi
              </span>
            )}
            {house.securityGuarded && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> Guard & CCTV
              </span>
            )}
            {house.furnished && (
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Check className="w-3 h-3 text-purple-500" /> Furnished
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xs text-slate-500 font-medium">KSh</span>
              <span className="font-extrabold text-xl text-brand-dark">{house.rentPerMonth.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-medium">/mo</span>
            </div>
            <p className="text-[10px] text-slate-400">Deposit: KSh {house.depositRequired.toLocaleString()}</p>
          </div>

          <Link
            href={`/houses/${house.id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold bg-brand-primary hover:bg-brand-blue text-white px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>View House</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
