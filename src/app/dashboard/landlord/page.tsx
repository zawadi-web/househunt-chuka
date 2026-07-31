"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  PlusCircle, ShieldCheck, Eye, Calendar, Building2,
  Upload, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
  X, Camera, Home, MapPin, User, LogOut, MessageSquare, Banknote, Loader2, BadgeCheck
} from 'lucide-react';

export default function LandlordDashboardPage() {
  const { data: session } = useSession();
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifySubmitted, setVerifySubmitted] = useState(false);
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [submittingVerify, setSubmittingVerify] = useState(false);
  const [submittingListing, setSubmittingListing] = useState(false);

  // User State
  const [verificationStatus, setVerificationStatus] = useState<string>('UNVERIFIED');
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // ID verification file state
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  // Listing Form State
  const [listingTitle, setListingTitle] = useState('');
  const [listingDescription, setListingDescription] = useState('');
  const [listingArea, setListingArea] = useState('');
  const [listingRoomType, setListingRoomType] = useState('');
  const [listingRent, setListingRent] = useState('');
  const [listingDeposit, setListingDeposit] = useState('');
  const [listingDistance, setListingDistance] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [listingPhotos, setListingPhotos] = useState<string[]>([]);
  const listingPhotosRef = useRef<HTMLInputElement>(null);

  // Fetch Landlord Houses and Verification Status
  const fetchLandlordData = useCallback(async () => {
    const userObj = session?.user as any;
    if (userObj?.verificationStatus) {
      setVerificationStatus(userObj.verificationStatus);
    }
    setLoadingListings(true);
    try {
      const landlordId = userObj?.id;
      const res = await fetch(`/api/houses?status=ALL${landlordId ? `&landlordId=${landlordId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMyListings(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load landlord listings:', err);
    } finally {
      setLoadingListings(false);
    }
  }, [session]);

  useEffect(() => {
    fetchLandlordData();
  }, [fetchLandlordData]);

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleListingPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setListingPhotos(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFrontPreview || !selfiePreview) {
      alert("Please upload both National ID Front and Selfie.");
      return;
    }
    setSubmittingVerify(true);
    try {
      const userObj = session?.user as any;
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landlordId: userObj?.id,
          email: userObj?.email,
          nationalIdNumber,
          nationalIdUrlFront: idFrontPreview,
          nationalIdUrlBack: idBackPreview,
          selfieUrl: selfiePreview,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifySubmitted(true);
        setVerificationStatus('PENDING');
        fetchLandlordData();
      } else {
        alert(data.message || 'Failed to submit verification documents.');
      }
    } catch (err) {
      alert('Network error submitting verification documents.');
    } finally {
      setSubmittingVerify(false);
    }
  };

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listingPhotos.length === 0) {
      alert("Please upload at least 1 photo of the room.");
      return;
    }
    setSubmittingListing(true);
    try {
      const userObj = session?.user as any;
      const res = await fetch('/api/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landlordId: userObj?.id,
          title: listingTitle,
          description: listingDescription,
          areaName: listingArea,
          roomType: listingRoomType,
          rentPerMonth: Number(listingRent),
          depositRequired: Number(listingDeposit || listingRent),
          distanceFromCampus: Number(listingDistance),
          photos: listingPhotos,
          wifiAvailable: selectedAmenities.includes('WiFi Available'),
          securityGuarded: selectedAmenities.includes('Security Guard'),
          cctv: selectedAmenities.includes('CCTV Cameras'),
          gatedFence: selectedAmenities.includes('Gated Fence'),
          furnished: selectedAmenities.includes('Furnished'),
          parking: selectedAmenities.includes('Parking Space'),
          balcony: selectedAmenities.includes('Balcony'),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setListingSubmitted(true);
        fetchLandlordData();
        setTimeout(() => {
          setIsAddListingOpen(false);
          setListingSubmitted(false);
          setListingPhotos([]);
          setListingTitle('');
          setListingDescription('');
          setListingArea('');
          setListingRoomType('');
          setListingRent('');
          setListingDeposit('');
          setListingDistance('');
          setSelectedAmenities([]);
        }, 2500);
      } else {
        alert(data.message || (data.errors ? data.errors.join(', ') : 'Failed to create house listing.'));
      }
    } catch (err) {
      alert('Network error submitting listing.');
    } finally {
      setSubmittingListing(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Landlord Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-extrabold text-white">Landlord Dashboard</h1>
              {verificationStatus === 'VERIFIED' ? (
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> ID Verified Landlord
                </span>
              ) : verificationStatus === 'PENDING' ? (
                <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> ID Verification Pending Admin Approval
                </span>
              ) : (
                <span className="bg-red-500/20 border border-red-400/40 text-red-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> ID Verification Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Welcome back, {session?.user?.name || 'Landlord'} • Manage your Chuka house listings and student inquiries</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{verificationStatus === 'VERIFIED' ? 'View ID Badge' : 'Verify My ID'}</span>
          </button>
          <Link href="/chat" className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" /><span>Messages</span>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" /><span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ID Verification Alert Banner */}
      {verificationStatus !== 'VERIFIED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-amber-900 text-sm">
              {verificationStatus === 'PENDING' ? 'Identity Documents Submitted — Under Admin Verification' : 'Government ID Verification Required to List Properties'}
            </h4>
            <p className="text-xs text-amber-800 mt-1">
              {verificationStatus === 'PENDING'
                ? 'Your National ID & Selfie have been recorded in the database. Our Admin team is reviewing your details.'
                : 'Upload your Kenyan National ID Front, Back & a Live Selfie. Our Admin team will verify your identity within 24 hours.'}
            </p>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              {verificationStatus === 'PENDING' ? 'Check Verification Status' : 'Upload ID Documents Now →'}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {[
          { icon: Building2, label: 'Active Listings', value: myListings.length.toString(), color: 'brand-primary', bg: 'blue' },
          { icon: Eye,       label: 'Total Views',     value: myListings.reduce((acc, h) => acc + (h.viewCount || 0), 0).toString(), color: 'purple-600',   bg: 'purple' },
          { icon: Calendar,  label: 'Viewing Requests',value: '0', color: 'emerald-600',  bg: 'emerald' },
          { icon: Banknote,  label: 'Est. Monthly Rev',value: `KSh ${myListings.reduce((acc, h) => acc + (h.rentPerMonth || 0), 0).toLocaleString()}`, color: 'amber-600', bg: 'amber' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl bg-${bg}-50 flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${color}`} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{value}</div>
              <div className="text-[11px] text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Listings */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">My Property Listings</h3>
            <p className="text-xs text-slate-500 mt-0.5">All listings go through Admin approval before going live for students</p>
          </div>
          <button
            onClick={() => setIsAddListingOpen(true)}
            className="bg-brand-primary hover:bg-brand-blue text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" /><span>Add New Listing</span>
          </button>
        </div>

        {loadingListings ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((house: any) => (
              <div key={house.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="relative h-40 bg-slate-100">
                  {house.images && house.images[0] ? (
                    <img src={house.images[0].url} alt={house.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${
                    house.status === 'APPROVED' ? 'bg-emerald-600 text-white' :
                    house.status === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {house.status === 'APPROVED' ? 'APPROVED & LIVE' : house.status}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{house.title}</h4>
                  <p className="text-xs text-slate-500">{house.areaName} • {house.roomType}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-emerald-600 text-sm">KSh {house.rentPerMonth?.toLocaleString()} / mo</span>
                    <span className="text-[11px] text-slate-400">{house.distanceFromCampus} km from Uni</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center space-y-3">
            <Home className="w-14 h-14 text-slate-200" />
            <p className="font-bold text-slate-600 text-base">No Listings Yet</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Add your first house listing. Submitted houses go to the Admin moderation queue for verification.
            </p>
            <button
              onClick={() => setIsAddListingOpen(true)}
              className="mt-3 bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Post My First House
            </button>
          </div>
        )}
      </div>

      {/* Viewing Requests */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 space-y-6">
        <div>
          <h3 className="font-extrabold text-xl text-slate-900">Student Viewing Requests</h3>
          <p className="text-xs text-slate-500 mt-0.5">Students who have booked a physical viewing of your properties</p>
        </div>
        <div className="flex flex-col items-center py-14 text-center space-y-3">
          <Calendar className="w-14 h-14 text-slate-200" />
          <p className="font-bold text-slate-600">No Viewing Requests Yet</p>
          <p className="text-xs text-slate-400 max-w-sm">Once your listing goes live, students near Chuka University will book physical viewings here.</p>
        </div>
      </div>

      {/* Add Listing Modal */}
      {isAddListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">Add New House Listing</h3>
                <p className="text-xs text-slate-500">Submitted for Admin review — goes live after approval</p>
              </div>
              <button onClick={() => setIsAddListingOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {listingSubmitted ? (
              <div className="flex flex-col items-center py-16 text-center space-y-4 px-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Listing Saved &amp; Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-xs">Your house listing has been recorded in the database and sent to Admin for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleListingSubmit} className="p-6 space-y-5 text-sm font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">House / Flat Title <span className="text-red-500">*</span></label>
                  <input required value={listingTitle} onChange={e => setListingTitle(e.target.value)} placeholder="e.g. Bright Bedsitter Near Gate B" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Description <span className="text-red-500">*</span></label>
                  <textarea required value={listingDescription} onChange={e => setListingDescription(e.target.value)} rows={4} placeholder="Describe the room, amenities, location details..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Campus Zone / Area <span className="text-red-500">*</span></label>
                    <select required value={listingArea} onChange={e => setListingArea(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary outline-none">
                      <option value="">Select Zone</option>
                      <option value="Gate A">Gate A — Main Entrance (Hwy B6)</option>
                      <option value="Gate B">Gate B — KK Mwendwa Reservoir Road</option>
                      <option value="Gate F">Gate F — Mungoni Entrance</option>
                      <option value="Ndia Ndoro">Ndia Ndoro (Gate C)</option>
                      <option value="Lowlands">Lowlands (Near Lowlands Hotel)</option>
                      <option value="Slaughterhouse Area">Slaughterhouse Area (Lowlands)</option>
                      <option value="Mungoni Village">Mungoni Village</option>
                      <option value="Juvera Junction">Juvera's Junction</option>
                      <option value="Mutunguruni">Mutunguruni — Ndagani Market</option>
                      <option value="Mariani Ridge">Mariani Ridge</option>
                      <option value="Chuka Town Center">Chuka Town Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Room Type <span className="text-red-500">*</span></label>
                    <select required value={listingRoomType} onChange={e => setListingRoomType(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary outline-none">
                      <option value="">Select Type</option>
                      <option value="Bedsitter">Bedsitter</option>
                      <option value="Single Room">Single Room</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 Bedroom">2 Bedroom</option>
                      <option value="Shared Room">Shared Room</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rent / Month (KSh) <span className="text-red-500">*</span></label>
                    <input required type="number" min="1000" max="50000" value={listingRent} onChange={e => setListingRent(e.target.value)} placeholder="e.g. 6500" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deposit Required (KSh) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" value={listingDeposit} onChange={e => setListingDeposit(e.target.value)} placeholder="e.g. 6500" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance to Nearest Campus Gate (km) <span className="text-red-500">*</span></label>
                  <input required type="number" min="0.1" max="15" step="0.1" value={listingDistance} onChange={e => setListingDistance(e.target.value)} placeholder="e.g. 0.4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>

                {/* Amenity Checkboxes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Available Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['WiFi Available', '24/7 Borehole Water', 'Security Guard', 'CCTV Cameras', 'Gated Fence', 'Electricity Inclusive', 'Parking Space', 'Balcony', 'Furnished'].map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer text-xs font-semibold text-slate-700 hover:border-emerald-400">
                        <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="accent-emerald-600" />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Room Photos <span className="text-red-500">*</span></label>
                  <input ref={listingPhotosRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleListingPhotos} />
                  <div
                    className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-brand-primary cursor-pointer bg-slate-50"
                    onClick={() => listingPhotosRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                    <div className="font-bold text-slate-800 text-sm">Click to upload room photos</div>
                    <div className="text-[11px] text-slate-400 mt-1">JPG, PNG, WEBP · Max 10MB each</div>
                  </div>
                  {listingPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {listingPhotos.map((src, i) => (
                        <img key={i} src={src} alt={`Photo ${i + 1}`} className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-400" />
                      ))}
                      <div className="text-[11px] text-emerald-600 font-bold self-end">{listingPhotos.length} photo(s) added</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddListingOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                  <button type="submit" disabled={submittingListing} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60">
                    {submittingListing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{submittingListing ? 'Saving to Database...' : 'Submit for Admin Approval'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ID Verification Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Government ID Verification</h3>
                  <p className="text-xs text-slate-500">Kenyan National ID Front, Back + Live Selfie</p>
                </div>
              </div>
              <button onClick={() => { setIsVerificationModalOpen(false); setVerifySubmitted(false); }} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {verifySubmitted || verificationStatus === 'PENDING' ? (
                <div className="flex flex-col items-center py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Documents Saved &amp; Submitted!</h3>
                  <p className="text-sm text-slate-600 max-w-xs">Your National ID &amp; Live Selfie have been safely saved to the database for Admin verification.</p>
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
                    Status: PENDING ADMIN REVIEW — Check back in Admin Dashboard.
                  </div>
                  <button onClick={() => { setIsVerificationModalOpen(false); setVerifySubmitted(false); }} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-2">
                    Close
                  </button>
                </div>
              ) : verificationStatus === 'VERIFIED' ? (
                <div className="flex flex-col items-center py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Identity Fully Verified!</h3>
                  <p className="text-sm text-slate-600 max-w-xs">You have been granted the Verified Landlord badge by Admin. Your property listings are live for student booking.</p>
                  <button onClick={() => setIsVerificationModalOpen(false)} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl mt-2">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifySubmit} className="space-y-5 text-sm font-medium">
                  {/* Hidden file inputs */}
                  <input ref={idFrontRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => handleFilePreview(e, setIdFrontPreview)} />
                  <input ref={idBackRef}  type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => handleFilePreview(e, setIdBackPreview)} />
                  <input ref={selfieRef}  type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => handleFilePreview(e, setSelfiePreview)} />

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">National ID / Passport Number <span className="text-red-500">*</span></label>
                    <input required pattern="\d{7,8}" value={nationalIdNumber} onChange={e => setNationalIdNumber(e.target.value)} placeholder="e.g. 28475910 (7–8 digits)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>

                  {/* ID Front */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">1. National ID — Front Side <span className="text-red-500">*</span></label>
                    <div onClick={() => idFrontRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${idFrontPreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {idFrontPreview
                        ? <div className="relative"><img src={idFrontPreview} alt="ID Front" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Selected</span></div>
                        : <div className="p-6 text-center"><Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1" /><div className="font-bold text-slate-800">Tap to Upload ID Front</div><div className="text-[10px] text-slate-400">JPG, PNG, WEBP · Max 10MB</div></div>
                      }
                    </div>
                  </div>

                  {/* ID Back */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2. National ID — Back Side (Optional)</label>
                    <div onClick={() => idBackRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${idBackPreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {idBackPreview
                        ? <div className="relative"><img src={idBackPreview} alt="ID Back" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Selected</span></div>
                        : <div className="p-6 text-center"><Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1" /><div className="font-bold text-slate-800">Tap to Upload ID Back</div><div className="text-[10px] text-slate-400">JPG, PNG, WEBP · Max 10MB</div></div>
                      }
                    </div>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">3. Live Selfie — Face Must Match ID <span className="text-red-500">*</span></label>
                    <div onClick={() => selfieRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${selfiePreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {selfiePreview
                        ? <div className="relative"><img src={selfiePreview} alt="Selfie" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Selected</span></div>
                        : <div className="p-6 text-center"><Camera className="w-7 h-7 text-emerald-600 mx-auto mb-1" /><div className="font-bold text-slate-800">Tap to Upload Selfie</div><div className="text-[10px] text-slate-400">Clear face photo matching ID</div></div>
                      }
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                    {[idFrontPreview, idBackPreview, selfiePreview].map((v, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${v ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    ))}
                    <span className="text-[11px] text-slate-500 font-medium ml-1">
                      {[idFrontPreview, idBackPreview, selfiePreview].filter(Boolean).length} / 3 documents uploaded
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsVerificationModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                    <button type="submit" disabled={submittingVerify} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60">
                      {submittingVerify ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>{submittingVerify ? 'Saving to DB...' : 'Submit for Verification'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
