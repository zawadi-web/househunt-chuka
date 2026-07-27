"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  PlusCircle, ShieldCheck, Eye, Calendar, Building2,
  Upload, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
  X, Camera, Home, MapPin, User, LogOut, MessageSquare, Banknote
} from 'lucide-react';

export default function LandlordDashboardPage() {
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifySubmitted, setVerifySubmitted] = useState(false);
  const [listingSubmitted, setListingSubmitted] = useState(false);

  // ID verification file state
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  // Listing photo state
  const [listingPhotos, setListingPhotos] = useState<string[]>([]);
  const listingPhotosRef = useRef<HTMLInputElement>(null);

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

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFrontPreview || !idBackPreview || !selfiePreview) {
      alert("Please upload all 3 documents: National ID Front, Back, and Selfie.");
      return;
    }
    setVerifySubmitted(true);
  };

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setListingSubmitted(true);
    setTimeout(() => {
      setIsAddListingOpen(false);
      setListingSubmitted(false);
      setListingPhotos([]);
    }, 2500);
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
              <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> ID Verification Required
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Complete ID verification to activate your listings and start receiving student inquiries</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-brand-dark font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" /><span>Verify My ID</span>
          </button>
          <Link href="/chat" className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" /><span>Messages</span>
          </Link>
          <Link href="/login" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5">
            <LogOut className="w-4 h-4" /><span>Sign Out</span>
          </Link>
        </div>
      </div>

      {/* ID Verification Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-extrabold text-amber-900 text-sm">Government ID Verification Required to List Properties</h4>
          <p className="text-xs text-amber-800 mt-1">
            Upload your <strong>Kenyan National ID Front, Back &amp; a Live Selfie</strong>. Our Admin team will verify your identity within 24 hours. Verified landlords get the ✅ badge and are trusted by students.
          </p>
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            Upload ID Documents Now →
          </button>
        </div>
      </div>

      {/* Stats — All Zero for New Account */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {[
          { icon: Building2, label: 'Active Listings', value: '0', color: 'brand-primary', bg: 'blue' },
          { icon: Eye,       label: 'Total Views',     value: '0', color: 'purple-600',   bg: 'purple' },
          { icon: Calendar,  label: 'Viewing Requests',value: '0', color: 'emerald-600',  bg: 'emerald' },
          { icon: Banknote,  label: 'Est. Monthly Rev',value: 'KSh 0', color: 'amber-600', bg: 'amber' },
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

      {/* My Listings — Empty State */}
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

        {/* Empty state */}
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <Home className="w-14 h-14 text-slate-200" />
          <p className="font-bold text-slate-600 text-base">No Listings Yet</p>
          <p className="text-xs text-slate-400 max-w-sm">
            Once your ID is verified, add your first house. Every listing is inspected by our field team in Chuka before it appears to students.
          </p>
          <button
            onClick={() => setIsAddListingOpen(true)}
            className="mt-3 bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Post My First House
          </button>
        </div>
      </div>

      {/* Viewing Requests — Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 space-y-6">
        <div>
          <h3 className="font-extrabold text-xl text-slate-900">Student Viewing Requests</h3>
          <p className="text-xs text-slate-500 mt-0.5">Students who have booked a physical viewing of your properties</p>
        </div>
        <div className="flex flex-col items-center py-14 text-center space-y-3">
          <Calendar className="w-14 h-14 text-slate-200" />
          <p className="font-bold text-slate-600">No Viewing Requests Yet</p>
          <p className="text-xs text-slate-400 max-w-sm">Once your listing goes live, students near Chuka University will book physical viewings here. You can confirm, reschedule, or cancel from this dashboard.</p>
        </div>
      </div>

      {/* ─── Add Listing Modal ──────────────────────────────── */}
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
                <h3 className="font-extrabold text-xl text-slate-900">Listing Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-xs">Your house listing has been sent to the Admin moderation queue. Students will see it once approved (usually within 12 hours).</p>
              </div>
            ) : (
              <form onSubmit={handleListingSubmit} className="p-6 space-y-5 text-sm font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">House / Flat Title <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Bright Bedsitter Near Gate B" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Description <span className="text-red-500">*</span></label>
                  <textarea required rows={4} placeholder="Describe the room, amenities, location details..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Campus Zone / Area <span className="text-red-500">*</span></label>
                    <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary outline-none">
                      <option value="">Select Zone</option>
                      <option>Gate A — Main Entrance (Hwy B6)</option>
                      <option>Gate B — KK Mwendwa Reservoir Road</option>
                      <option>Gate F — Mungoni Entrance</option>
                      <option>Ndia Ndoro (Gate C)</option>
                      <option>Lowlands (Near Lowlands Hotel)</option>
                      <option>Slaughterhouse Area (Lowlands)</option>
                      <option>Mungoni Village</option>
                      <option>Juvera's Junction</option>
                      <option>Mutunguruni — Ndagani Market</option>
                      <option>Mariani Ridge</option>
                      <option>Chuka Town Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Room Type <span className="text-red-500">*</span></label>
                    <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary outline-none">
                      <option value="">Select Type</option>
                      <option>Bedsitter</option>
                      <option>Single Room</option>
                      <option>1 Bedroom</option>
                      <option>2 Bedroom</option>
                      <option>Shared Room</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rent / Month (KSh) <span className="text-red-500">*</span></label>
                    <input required type="number" min="1000" max="50000" placeholder="e.g. 6500" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deposit Required (KSh) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" placeholder="e.g. 6500" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance to Nearest Campus Gate (km) <span className="text-red-500">*</span></label>
                  <input required type="number" min="0.1" max="15" step="0.1" placeholder="e.g. 0.4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>

                {/* Amenity Checkboxes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Available Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['WiFi Available', '24/7 Borehole Water', 'Security Guard', 'CCTV Cameras', 'Gated Fence', 'Electricity Inclusive', 'Parking Space', 'Balcony', 'Furnished'].map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer text-xs font-semibold text-slate-700 hover:border-emerald-400">
                        <input type="checkbox" className="accent-emerald-600" />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Room Photos (Min 3) <span className="text-red-500">*</span></label>
                  <input ref={listingPhotosRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleListingPhotos} />
                  <div
                    className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-brand-primary cursor-pointer bg-slate-50"
                    onClick={() => listingPhotosRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                    <div className="font-bold text-slate-800 text-sm">Click to upload room photos</div>
                    <div className="text-[11px] text-slate-400 mt-1">JPG, PNG, WEBP · Max 10MB each · Min 3 photos required</div>
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
                  <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Submit for Admin Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── ID Verification Modal ──────────────────────────── */}
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
              {verifySubmitted ? (
                <div className="flex flex-col items-center py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Documents Submitted!</h3>
                  <p className="text-sm text-slate-600 max-w-xs">Your National ID Front, Back &amp; Selfie have been sent to our verification team. You'll hear back within 24 hours via email.</p>
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
                    Status: PENDING ADMIN REVIEW — Listings activate after verification.
                  </div>
                  <button onClick={() => { setIsVerificationModalOpen(false); setVerifySubmitted(false); }} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-2">
                    Close
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
                    <input required pattern="\d{7,8}" placeholder="e.g. 28475910 (7–8 digits)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>

                  {/* ID Front */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">1. National ID — Front Side <span className="text-red-500">*</span></label>
                    <div onClick={() => idFrontRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${idFrontPreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {idFrontPreview
                        ? <div className="relative"><img src={idFrontPreview} alt="ID Front" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Uploaded</span></div>
                        : <div className="p-6 text-center"><Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1" /><div className="font-bold text-slate-800">Tap to Upload ID Front</div><div className="text-[10px] text-slate-400">JPG, PNG, WEBP · Max 10MB</div></div>
                      }
                    </div>
                  </div>

                  {/* ID Back */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2. National ID — Back Side <span className="text-red-500">*</span></label>
                    <div onClick={() => idBackRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${idBackPreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {idBackPreview
                        ? <div className="relative"><img src={idBackPreview} alt="ID Back" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Uploaded</span></div>
                        : <div className="p-6 text-center"><Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1" /><div className="font-bold text-slate-800">Tap to Upload ID Back</div><div className="text-[10px] text-slate-400">JPG, PNG, WEBP · Max 10MB</div></div>
                      }
                    </div>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">3. Live Selfie — Face Must Match ID <span className="text-red-500">*</span></label>
                    <div onClick={() => selfieRef.current?.click()} className={`border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500 ${selfiePreview ? 'border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                      {selfiePreview
                        ? <div className="relative"><img src={selfiePreview} alt="Selfie" className="w-full h-36 object-cover" /><span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Uploaded</span></div>
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
                    <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Submit for Verification
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
