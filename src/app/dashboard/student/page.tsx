"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, Calendar, MessageSquare, ShieldCheck, Search,
  Upload, User, LogOut, Home, Bell, AlertTriangle, X, 
  CheckCircle2, Save, Loader2, Phone
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  // Load saved profile from localStorage as a cache layer
  useEffect(() => {
    const saved = localStorage.getItem('househunt_profile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        if (profile.name) setName(profile.name);
        if (profile.course) setCourse(profile.course);
        if (profile.phone) setPhone(profile.phone);
        if (profile.avatarPreview) setAvatarPreview(profile.avatarPreview);
      } catch (_) {}
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setAvatarPreview(b64);
      setAvatarBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          image: avatarBase64 || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.error || 'Failed to save profile.');
      } else {
        // Persist to localStorage so refreshes don't lose the data
        localStorage.setItem('househunt_profile', JSON.stringify({
          name: data.user?.name || name,
          phone: data.user?.phone || phone,
          course,
          avatarPreview,
        }));
        setSaveSuccess(true);
        setEditMode(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setSaveError('Network error. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = name || 'New Student';
  const displayCourse = course || 'Update your course in profile';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-dark rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 rounded-full ring-4 ring-white/20 overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer hover:ring-emerald-400/60 transition-all"
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
              <span className="text-[10px] bg-amber-400 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Complete Profile
              </span>
            </div>
            <p className="text-white/70 text-sm mt-0.5">{displayCourse} • Chuka University Main Campus</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setEditMode(true); setSaveError(''); setSaveSuccess(false); }}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
          >
            <User className="w-4 h-4" /> Edit Profile
          </button>
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all">
            <MessageSquare className="w-4 h-4" /> Messages
          </button>
          <Link href="/api/auth/signout" className="bg-red-500/20 hover:bg-red-500/30 border border-red-300/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Profile saved successfully! Your details are stored in the database.
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xl text-slate-900">Update Your Profile</h3>
              <button onClick={() => setEditMode(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Upload in Modal */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer ring-2 ring-slate-200 hover:ring-brand-primary transition-all"
                onClick={() => avatarRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => avatarRef.current?.click()}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Profile Photo
                </button>
                <p className="text-[11px] text-slate-400 mt-0.5">JPEG/PNG/WebP — max 2MB</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grace Kinyua"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Course / Department</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. BSc Computer Science, Year 2"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Stored locally on your device (not in database)</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Error message */}
            {saveError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {saveError}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 bg-brand-primary hover:bg-brand-blue text-white font-extrabold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Profile</>
                )}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-emerald-900 text-sm">Welcome to HouseHunt Chuka! 🎉</p>
            <p className="text-emerald-700 text-xs mt-0.5">
              Your account is ready. Complete your profile, then browse verified student houses around Chuka University — zero deposit scams guaranteed.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditMode(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all"
          >
            Complete My Profile
          </button>
          <Link href="/houses" className="bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Browse Houses Now
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">0</div>
            <div className="text-xs text-slate-500 font-medium">Saved Favourites</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">0</div>
            <div className="text-xs text-slate-500 font-medium">Viewing Bookings</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">0</div>
            <div className="text-xs text-slate-500 font-medium">Flagged Scam Alerts</div>
          </div>
        </div>
      </div>

      {/* Browse CTA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
          <Home className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Find Your Student House</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Browse verified bedsitters, single rooms, and 1-bedrooms near Gate A, Gate B, Mungoni, Lowlands, and Ndagani — all paid per semester or monthly.
        </p>
        <Link
          href="/houses"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-blue text-white font-extrabold text-sm px-8 py-3 rounded-xl transition-all shadow-md mt-2"
        >
          <Search className="w-4 h-4" /> Browse Verified Houses
        </Link>
      </div>

    </div>
  );
}
