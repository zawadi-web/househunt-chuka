"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_HOUSES, MOCK_REVIEWS } from '@/lib/mock-data';
import BookingModal from '@/components/houses/BookingModal';
import ReportModal from '@/components/houses/ReportModal';
import { 
  ShieldCheck, MapPin, Droplets, Wifi, Lock, Zap, 
  CheckCircle2, Star, Calendar, MessageSquare, AlertTriangle, 
  ChevronRight, Heart, Share2, Phone, UserCheck, ShieldAlert 
} from 'lucide-react';

export default function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const houseId = resolvedParams.id;
  const house = MOCK_HOUSES.find((h) => h.id === houseId) || MOCK_HOUSES[0];

  const [activeImage, setActiveImage] = useState(house.images[0]?.url || '');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const houseReviews = MOCK_REVIEWS.filter(r => r.houseId === house.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/houses" className="hover:text-brand-primary">Chuka Houses</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-bold truncate">{house.title}</span>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {house.landlord.verificationStatus === 'VERIFIED' && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                VERIFIED LANDLORD
              </span>
            )}
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
              Last Verified: {house.lastVerifiedAt}
            </span>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              {house.roomType}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {house.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-600" /> {house.address}, {house.areaName}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {house.averageRating} ({house.reviewCount} student reviews)
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-700 font-bold">{house.availableRooms} of {house.totalRooms} rooms left</span>
          </div>
        </div>

        {/* Pricing & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-500 font-medium">Monthly Rent</div>
            <div className="text-3xl font-extrabold text-brand-dark">KSh {house.rentPerMonth.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Deposit: KSh {house.depositRequired.toLocaleString()}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="flex-1 sm:flex-initial bg-brand-primary hover:bg-brand-blue text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Free Viewing</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-3.5 rounded-2xl border transition-all ${
                saved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Big Photo */}
        <div className="lg:col-span-2 relative aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden shadow-card">
          <img
            src={activeImage}
            alt={house.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl">
            {house.images.length} Verified Photos
          </div>
        </div>

        {/* Thumbnail Stack */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {house.images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.url)}
              className={`relative aspect-[16/9] rounded-2xl overflow-hidden border-2 transition-all ${
                activeImage === img.url ? 'border-brand-primary ring-4 ring-brand-primary/20' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="Room detail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

      </div>

      {/* SAFETY WARNING ALERT BANNER */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-900">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Platform Anti-Scam Guarantee</h4>
            <p className="text-xs text-slate-700 mt-1">
              Do NOT send MPesa viewing fees or deposit payments before visiting the property in person. Report any broker or landlord who requests money in advance.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsReportOpen(true)}
          className="shrink-0 bg-red-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-1.5"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Fake Listing</span>
        </button>
      </div>

      {/* Main Details & Landlord Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Description, Amenities, Map & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview & Description */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h3 className="font-extrabold text-xl text-slate-900">Property Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {house.description}
            </p>
          </div>

          {/* Student Amenities Grid */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <h3 className="font-extrabold text-xl text-slate-900">Student Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center space-x-3">
                <Droplets className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Water Supply</div>
                  <div className="text-[11px] text-blue-700 font-semibold">{house.waterAvailability}</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-3">
                <Wifi className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">High-Speed WiFi</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{house.wifiAvailable ? 'Included Free' : 'Not Included'}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-100/60 rounded-2xl border border-slate-200 flex items-center space-x-3">
                <Lock className="w-6 h-6 text-slate-700 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Security</div>
                  <div className="text-[11px] text-slate-600 font-semibold">{house.securityGuarded ? 'Guard & CCTV' : 'Perimeter Fence'}</div>
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center space-x-3">
                <Zap className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Electricity</div>
                  <div className="text-[11px] text-amber-700 font-semibold">{house.electricityType}</div>
                </div>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Furnished Status</div>
                  <div className="text-[11px] text-purple-700 font-semibold">{house.furnished ? 'Fully Furnished' : 'Unfurnished'}</div>
                </div>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-teal-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Uni Proximity</div>
                  <div className="text-[11px] text-teal-700 font-semibold">{house.distanceFromCampus} km away</div>
                </div>
              </div>

            </div>
          </div>

          {/* Student Reviews & Ratings */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">Student Reviews</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ratings from verified Chuka University tenants</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-slate-900 text-lg">{house.averageRating}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {houseReviews.map((review) => (
                <div key={review.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={review.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                        alt={review.studentName} 
                        className="w-9 h-9 rounded-full object-cover" 
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{review.studentName}</span>
                          {review.verifiedTenant && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-extrabold">Verified Tenant</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{review.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Verified Landlord Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card sticky top-28 space-y-6">
            
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={house.landlord.image}
                  alt={house.landlord.name}
                  className="w-full h-full rounded-full object-cover ring-4 ring-emerald-500/20"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">{house.landlord.name}</h4>
                <p className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1 mt-0.5">
                  <UserCheck className="w-4 h-4" /> Government ID Verified
                </p>
                <p className="text-[11px] text-slate-400">Member since {house.landlord.createdAt}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>National ID Verification:</span>
                <span className="font-bold text-emerald-600">Passed ({house.landlord.nationalIdNumber})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phone OTP Verification:</span>
                <span className="font-bold text-emerald-600">Verified</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Response Rate:</span>
                <span className="font-bold text-slate-900">98% (Under 15 mins)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-brand-primary hover:bg-brand-blue text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free Physical Viewing</span>
              </button>

              <Link
                href={`/chat?landlord=${house.landlord.id}`}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3.5 rounded-2xl transition-colors flex items-center justify-center space-x-2 text-xs"
              >
                <MessageSquare className="w-4 h-4 text-brand-primary" />
                <span>Chat with Landlord</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      <BookingModal 
        house={house} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
      <ReportModal 
        house={house} 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />

    </div>
  );
}
