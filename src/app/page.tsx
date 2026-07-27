"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_HOUSES } from '@/lib/mock-data';
import HouseCard from '@/components/houses/HouseCard';
import { 
  Search, ShieldCheck, MapPin, CheckCircle2, 
  ArrowRight, Sparkles, Building2, UserCheck, 
  FileCheck2, ShieldAlert, Heart, Star, PhoneCall, Home, PlusCircle
} from 'lucide-react';

export default function LandingPage() {
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedRoomType, setSelectedRoomType] = useState('ALL');

  const featuredHouses = MOCK_HOUSES;

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-brand-dark via-brand-blue to-slate-900 text-white overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Fake Listings • 100% ID Verified Landlords</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Find Verified Student Housing Around <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Chuka University</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Safe, affordable bedsitters, single rooms, and 1-bedrooms along <strong className="text-white">Nairobi-Meru Highway (B6)</strong> — near <strong className="text-white">Gate A, Gate B, Gate C, Gate F, Lowlands, Slaughterhouse &amp; Mariani Ridge</strong>. Never fall for rental deposit scams again.
            </p>

            {/* Quick Search Card */}
            <div className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl max-w-2xl mx-auto text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* Area Dropdown */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Campus Zone</label>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                    <select 
                      value={selectedArea} 
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Chuka Zones</option>
                      <option value="Gate A (Main Gate)">Gate A — Main Entrance (Hwy B6)</option>
                      <option value="Gate B (Ndagani)">Gate B — KK Mwendwa Reservoir Rd</option>
                      <option value="Ndia Ndoro (Gate C)">Ndia Ndoro — Gate C Pathway</option>
                      <option value="Lowlands (Near Lowlands Hotel)">Lowlands — Near Lowlands Hotel</option>
                      <option value="Slaughterhouse Area (Lowlands)">Slaughterhouse Area (Lowlands)</option>
                      <option value="Mungoni (Gate F)">Mungoni Village — Gate F</option>
                      <option value="Juvera's Junction">Juvera's Junction</option>
                      <option value="Mutunguruni (Ndagani)">Mutunguruni — Ndagani Market</option>
                      <option value="Mariani Ridge">Mariani Ridge</option>
                      <option value="Chuka Town Center">Chuka Town Center (2.3 km)</option>
                    </select>
                  </div>
                </div>

                {/* Room Type */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Room Type</label>
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-brand-primary shrink-0" />
                    <select 
                      value={selectedRoomType} 
                      onChange={(e) => setSelectedRoomType(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Room Types</option>
                      <option value="Bedsitter">Bedsitter</option>
                      <option value="Single">Single Room</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 Bedroom">2 Bedroom</option>
                      <option value="Shared">Shared Room</option>
                    </select>
                  </div>
                </div>

                {/* Search CTA */}
                <Link 
                  href={`/houses?area=${encodeURIComponent(selectedArea)}&roomType=${encodeURIComponent(selectedRoomType)}`}
                  className="bg-emerald-500 hover:bg-emerald-600 text-brand-dark font-extrabold text-xs rounded-2xl flex items-center justify-center space-x-2 py-3 px-4 transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Houses</span>
                </Link>

              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-center border-t border-white/10">
              <div>
                <div className="text-2xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400">Scam Free Policy</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400">ID Verified Landlords</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">24/7</div>
                <div className="text-xs text-slate-400">Borehole &amp; WiFi Filter</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-400">KSh 0</div>
                <div className="text-xs text-slate-400">Viewing Booking Fee</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED HOUSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Verified Listings</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Student Housing Around Chuka Uni
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Every listing is inspected in person and backed by National ID landlord verification.
            </p>
          </div>
          <Link 
            href="/houses" 
            className="inline-flex items-center space-x-2 font-bold text-brand-primary hover:text-brand-blue text-sm"
          >
            <span>Explore All Zones</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHouses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        ) : (
          /* Clean Empty State when 0 houses in DB */
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Home className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Be the First Landlord to Post in Chuka!</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              We have officially reset the platform for live deployment. Are you a landlord or agent with rooms near Gate A, Gate B, Lowlands, Mungoni, or Ndagani?
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link 
                href="/dashboard/landlord" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your House Listing</span>
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl transition-all"
              >
                Register as Landlord
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* CHUKA UNIVERSITY CAMPUS BUILDINGS & INFRASTRUCTURE GALLERY */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Mariani Main Campus Infrastructure</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Chuka University Buildings &amp; Landmarks
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Explore the official campus buildings, gates, and academic complexes around which student houses are located.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Building Card 1: Gate A Main Entrance */}
            <div className="bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/60 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80"
                  alt="Chuka University Main Gate A Entrance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  MAIN ENTRANCE
                </div>
              </div>
              <div className="p-5 space-y-2 flex-1">
                <h4 className="font-extrabold text-white text-base">Campus Gate A Entrance</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Located directly along the Nairobi-Meru Highway B6. Main security entry point for students coming from Ndagani market &amp; Chuka town.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Direct access off Hwy B6
                </div>
              </div>
            </div>

            {/* Building Card 2: Business Complex */}
            <div className="bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/60 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
                  alt="Chuka University School of Business Complex"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  ACADEMIC COMPLEX
                </div>
              </div>
              <div className="p-5 space-y-2 flex-1">
                <h4 className="font-extrabold text-white text-base">School of Business Complex</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Multi-storey lecture hall complex housing the Faculty of Business, Law, Computer Science, and Administration offices.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Near Gate B &amp; Gate C
                </div>
              </div>
            </div>

            {/* Building Card 3: Science Complex & Library */}
            <div className="bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/60 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
                  alt="Chuka University Science Complex and Library"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  LIBRARY &amp; LABS
                </div>
              </div>
              <div className="p-5 space-y-2 flex-1">
                <h4 className="font-extrabold text-white text-base">Science Complex &amp; Library</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Houses the central university library, high-speed computer labs, science research facilities, and main auditorium.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Walking distance to library
                </div>
              </div>
            </div>

            {/* Building Card 4: Student Recreation Center */}
            <div className="bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/60 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80"
                  alt="Chuka University Student Recreation Center"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  STUDENT CENTER
                </div>
              </div>
              <div className="p-5 space-y-2 flex-1">
                <h4 className="font-extrabold text-white text-base">Student Center &amp; Dining</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Student union hub, indoor sports hall, food court, and social center located at the heart of the campus.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Next to On-Campus Hostels
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ANTI-SCAM TRUST & SECURITY SECTION */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Anti-Scam Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Why Chuka Students Trust Us
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We built HouseHunt Chuka specifically to end rental fraud targeting students in Ndagani &amp; Mariani.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Trust Pillar 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Government ID Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every landlord must upload their Kenyan National ID card (Front &amp; Back) and complete a live selfie check before posting a listing.
              </p>
            </div>

            {/* Trust Pillar 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Physical House Inspection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our local Chuka University field agents inspect room amenities, water supply pressure, and exact distance to campus gates.
              </p>
            </div>

            {/* Trust Pillar 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Zero Deposit Before Viewing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Platform policy strictly forbids asking for viewing money. You inspect the room first, meet the verified landlord, then pay.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How HouseHunt Works
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            3 simple steps to secure your dream room around Chuka University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              1
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Search &amp; Filter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by budget, room type (Bedsitter/Single), 24/7 water availability, and exact distance from Chuka Uni Gate A or B.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              2
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Book Free Viewing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Schedule a free physical inspection date with the verified landlord using our automated viewing booking tool.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-dark text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              3
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Move In Securely</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect your room, sign agreement with verified landlord, and leave an authentic student review for your peers.
            </p>
          </div>

        </div>
      </section>

      {/* STUDENT REVIEWS COMMITMENT CARD */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Authentic Student Feedback</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              Only verified students who have inspected a room can submit reviews. Zero fake ratings guaranteed.
            </p>
            <div className="pt-2">
              <Link 
                href="/reviews"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <span>View Student Reviews Page</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LANDLORD CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-dark via-brand-blue to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>For Property Owners</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Own a Hostel or Apartment in Chuka?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              List your rooms directly to thousands of Chuka University students. Enjoy automated viewing bookings, tenant chat, and direct inquiries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <Link 
              href="/dashboard/landlord" 
              className="bg-emerald-500 hover:bg-emerald-600 text-brand-dark font-extrabold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/30 text-center"
            >
              List Your Property
            </Link>
            <Link 
              href="/contact" 
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all border border-white/20 text-center"
            >
              Quick Contact
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
