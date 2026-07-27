"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Heart, Calendar, MessageSquare, ShieldCheck, Search,
  Upload, User, LogOut, Home, Bell, AlertTriangle, X, CheckCircle2
} from 'lucide-react';

// Simulates a newly registered user — no fake data, all state is empty
const EMPTY_USER = {
  name: "",           // Will come from auth session
  course: "",
  campus: "Chuka University Main Campus",
  avatar: null,
  verificationStatus: "UNVERIFIED" as "UNVERIFIED" | "PENDING" | "VERIFIED",
  savedHouses: [],
  viewingBookings: [],
  scamAlerts: 0,
};

export default function StudentDashboardPage() {
  const [user, setUser] = useState(EMPTY_USER);
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempCourse, setTempCourse] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    setUser(prev => ({ ...prev, name: tempName, course: tempCourse }));
    setEditMode(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const displayName = user.name || "New Student";
  const displayCourse = user.course || "Update your course in profile";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-dark rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 rounded-full ring-4 ring-white/20 overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer"
              onClick={() => avatarRef.current?.click()}
              title="Click to change photo"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/60" />
              )}
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <Upload className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-extrabold text-white">{displayName}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                user.verificationStatus === "VERIFIED"
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                  : "bg-amber-500/20 border-amber-400/40 text-amber-300"
              }`}>
                <ShieldCheck className="w-3 h-3" />
                {user.verificationStatus === "VERIFIED" ? "Student Verified" : user.verificationStatus === "PENDING" ? "Verification Pending" : "Complete Profile"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{displayCourse} • {user.campus}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => { setTempName(user.name); setTempCourse(user.course); setEditMode(true); }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
          <Link href="/chat" className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Messages</span>
          </Link>
          <Link href="/login" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>

      {/* New Account Onboarding Banner */}
      {!user.name && (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Welcome to HouseHunt Chuka! 🎉</h3>
            <p className="text-sm text-slate-600">
              Your account is ready. Complete your profile, then browse <strong>10+ verified student houses</strong> around Chuka University — zero deposit scams guaranteed.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => { setTempName(""); setTempCourse(""); setEditMode(true); }}
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all"
              >
                Complete My Profile
              </button>
              <Link href="/houses" className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5">
                <Search className="w-4 h-4 text-brand-primary" />
                Browse Houses Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{user.savedHouses.length}</div>
            <div className="text-xs text-slate-500 font-medium">Saved Favourites</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{user.viewingBookings.length}</div>
            <div className="text-xs text-slate-500 font-medium">Viewing Bookings</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{user.scamAlerts}</div>
            <div className="text-xs text-slate-500 font-medium">Flagged Scam Alerts</div>
          </div>
        </div>
      </div>

      {/* Viewing Appointments Section — Empty State */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div>
          <h3 className="font-extrabold text-xl text-slate-900">Your House Viewing Appointments</h3>
          <p className="text-xs text-slate-500 mt-0.5">Physical room inspections scheduled with verified landlords</p>
        </div>

        {user.viewingBookings.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center space-y-3 text-slate-400">
            <Calendar className="w-12 h-12 text-slate-200" />
            <p className="font-bold text-slate-600">No Viewing Appointments Yet</p>
            <p className="text-xs max-w-sm">Browse houses and click <strong>Book a Viewing</strong> on any verified listing to schedule a physical room inspection for free.</p>
            <Link href="/houses" className="mt-2 bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all flex items-center gap-2">
              <Home className="w-4 h-4" /> Browse Verified Houses
            </Link>
          </div>
        ) : null}
      </div>

      {/* Saved Favourites — Empty State */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-slate-900">Your Favourites</h3>
          <Link href="/houses" className="text-xs font-bold text-brand-primary hover:underline">
            Search Houses
          </Link>
        </div>

        {user.savedHouses.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center py-14 text-center space-y-3 text-slate-400">
            <Heart className="w-12 h-12 text-slate-200" />
            <p className="font-bold text-slate-600">No Saved Houses Yet</p>
            <p className="text-xs max-w-sm">Tap the ❤️ heart icon on any house listing to save it here for easy comparison later.</p>
            <Link href="/houses" className="mt-2 bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Houses Near Chuka Uni
            </Link>
          </div>
        ) : null}
      </div>

      {/* Report Scam CTA */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-red-800 text-sm">Spotted a Suspicious Listing?</h4>
          <p className="text-xs text-red-700 mt-1">If a landlord requests deposit payment before you inspect the room physically, or refuses to show their verified ID — report them immediately.</p>
          <Link href="/report" className="inline-block mt-3 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-700 transition-all">
            Report a Scam Landlord
          </Link>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button onClick={() => setEditMode(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">Complete Your Profile</h3>
                <p className="text-xs text-slate-500">This helps landlords know who you are</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="e.g. Jane Mwende Karimi"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course / Programme</label>
                <input
                  type="text"
                  value={tempCourse}
                  onChange={e => setTempCourse(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo</label>
                <div
                  className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 hover:border-brand-primary cursor-pointer"
                  onClick={() => avatarRef.current?.click()}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} className="w-16 h-16 rounded-full mx-auto object-cover" alt="preview" />
                    : <><Upload className="w-6 h-6 text-brand-primary mx-auto mb-1" /><div className="text-xs font-bold text-slate-700">Upload Student Photo</div></>
                  }
                  <div className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP (Max 5MB)</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditMode(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={!tempName.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
