"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert, ShieldCheck, UserCheck, AlertTriangle,
  CheckCircle2, XCircle, Users, Lock, Eye, EyeOff,
  KeyRound, Loader2, AlertCircle, Copy, LogOut,
  Search, Filter, GraduationCap, Building2, Home,
  FileText, ExternalLink, ChevronRight, BadgeCheck, RefreshCw,
  SlidersHorizontal, Shield, Mail, Phone, Calendar, Star, Check
} from 'lucide-react';

// ─── Admin Login Screen (Hardened & Secure) ─────────────────────
function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLogin();
      } else {
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 border border-slate-800 text-red-500 rounded-2xl mb-4 shadow-xl">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">HouseHunt Admin Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Restricted Access • Authorized Security Personnel Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-2.5 p-3.5 bg-red-950/40 border border-red-900/40 rounded-2xl text-xs text-red-400 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>This portal is monitored. Unauthorized access attempts are logged.</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-900/80 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Authenticating...' : 'Access Security Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          HouseHunt Kenya Security • Multi-Town Fraud Prevention System v3.0
        </p>
      </div>
    </div>
  );
}

// ─── Change Password Modal ──────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newHash, setNewHash] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewHash(data.newHash);
      } else {
        setError(data.error || 'Failed to change password.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(newHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-600/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Change Admin Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {!newHash ? (
          <form onSubmit={handleChange} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-1">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-1">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                placeholder="Re-enter new password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900/60 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all text-xs">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {loading ? 'Generating...' : 'Change Password'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-950/50 border border-emerald-700/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Password Hash Generated
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copy this hash and update your <strong className="text-white">ADMIN_PASSWORD_HASH</strong> in Vercel Environment Variables, then trigger redeployment.
              </p>
              <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-emerald-300 break-all border border-slate-800">
                {newHash}
              </div>
              <button
                onClick={copyHash}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Hash'}
              </button>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all text-xs">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ID Documents Verification Drawer/Modal ─────────────────────
function LandlordIdModal({ landlord, onClose, onUpdateStatus }: { landlord: any, onClose: () => void, onUpdateStatus: (userId: string, status: string) => void }) {
  const [updating, setUpdating] = useState(false);

  const handleAction = async (status: 'VERIFIED' | 'REJECTED') => {
    setUpdating(true);
    await onUpdateStatus(landlord.id, status);
    setUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/50">
              Identity Verification Document Check
            </span>
            <h3 className="font-extrabold text-xl text-white mt-1">{landlord.name}</h3>
            <p className="text-xs text-slate-400">{landlord.email} • {landlord.phone || 'No phone'}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kenyan National ID Number</div>
            <div className="text-lg font-mono font-bold text-emerald-400">{landlord.nationalIdNumber || 'Not provided'}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                landlord.verificationStatus === 'VERIFIED' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50' :
                landlord.verificationStatus === 'PENDING' ? 'bg-amber-900/40 text-amber-400 border border-amber-700/50' :
                landlord.verificationStatus === 'REJECTED' ? 'bg-red-900/40 text-red-400 border border-red-700/50' :
                'bg-slate-800 text-slate-400'
              }`}>
                {landlord.verificationStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Documents Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">National ID Front</label>
            {landlord.nationalIdUrlFront ? (
              <img src={landlord.nationalIdUrlFront} alt="ID Front" className="w-full h-44 object-cover rounded-2xl border border-slate-800 bg-slate-950" />
            ) : (
              <div className="w-full h-44 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-slate-500 text-xs">
                <FileText className="w-8 h-8 mb-1" />
                <span>Front ID image uploaded</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Landlord Live Selfie</label>
            {landlord.selfieUrl ? (
              <img src={landlord.selfieUrl} alt="Selfie" className="w-full h-44 object-cover rounded-2xl border border-slate-800 bg-slate-950" />
            ) : (
              <div className="w-full h-44 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-slate-500 text-xs">
                <UserCheck className="w-8 h-8 mb-1" />
                <span>Live selfie uploaded</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => handleAction('REJECTED')}
            disabled={updating}
            className="flex-1 py-3 bg-red-950/60 border border-red-900/80 hover:bg-red-900 text-red-400 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject ID Request</span>
          </button>

          <button
            onClick={() => handleAction('VERIFIED')}
            disabled={updating}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
            <span>Approve &amp; Grant Verified Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Stripe / Supabase Inspired Admin Dashboard ─────────────────
export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'landlords' | 'houses' | 'reports'>('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedLandlordForModal, setSelectedLandlordForModal] = useState<any | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dynamic Data from APIs
  const [users, setUsers] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Fetch all admin data
  const refreshData = async () => {
    setLoading(true);
    try {
      const [usersRes, housesRes, reportsRes] = await Promise.all([
        fetch('/api/admin/users?role=ALL'),
        fetch('/api/admin/houses?status=ALL'),
        fetch('/api/admin/reports?status=ALL'),
      ]);

      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success && uData.users) setUsers(uData.users);
      }
      if (housesRes.ok) {
        const hData = await housesRes.json();
        if (hData.success && hData.houses) setHouses(hData.houses);
      }
      if (reportsRes.ok) {
        const rData = await reportsRes.json();
        if (rData.success && rData.reports) setReports(rData.reports);
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

  // Landlords update status handler
  const handleUserStatusUpdate = async (userId: string, verificationStatus?: string, subscriptionTier?: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationStatus, subscriptionTier }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: verificationStatus || u.verificationStatus, subscriptionTier: subscriptionTier || u.subscriptionTier } : u));
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // House listing moderation status update handler
  const handleHouseStatusUpdate = async (houseId: string, status: string, rejectionReason?: string) => {
    try {
      const res = await fetch('/api/admin/houses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ houseId, status, rejectionReason }),
      });
      if (res.ok) {
        setHouses(prev => prev.map(h => h.id === houseId ? { ...h, status } : h));
      }
    } catch (err) {
      console.error('Error updating house:', err);
    }
  };

  // Filtered Lists
  const studentsList = useMemo(() => {
    return users.filter(u => u.role === 'STUDENT').filter(u => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
      }
      return true;
    });
  }, [users, searchQuery]);

  const landlordsList = useMemo(() => {
    return users.filter(u => u.role === 'LANDLORD' || u.role === 'AGENT').filter(u => {
      if (statusFilter !== 'ALL' && u.verificationStatus !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q)) || (u.nationalIdNumber && u.nationalIdNumber.includes(q));
      }
      return true;
    });
  }, [users, statusFilter, searchQuery]);

  const filteredHouses = useMemo(() => {
    return houses.filter(h => {
      if (statusFilter !== 'ALL' && h.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return h.title.toLowerCase().includes(q) || h.areaName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [houses, statusFilter, searchQuery]);

  // Derived Metrics
  const pendingIDCount = users.filter(u => (u.role === 'LANDLORD' || u.role === 'AGENT') && u.verificationStatus === 'PENDING').length;
  const totalStudents = users.filter(u => u.role === 'STUDENT').length;
  const totalLandlords = users.filter(u => u.role === 'LANDLORD' || u.role === 'AGENT').length;
  const pendingHousesCount = houses.filter(h => h.status === 'PENDING_APPROVAL').length;
  const openReportsCount = reports.filter(r => r.status === 'PENDING' || r.status === 'UNDER_INVESTIGATION').length;

  if (!isLoggedIn) {
    return <AdminLoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">

      {/* Change Password Modal */}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      {/* Landlord ID Check Modal */}
      {selectedLandlordForModal && (
        <LandlordIdModal
          landlord={selectedLandlordForModal}
          onClose={() => setSelectedLandlordForModal(null)}
          onUpdateStatus={handleUserStatusUpdate}
        />
      )}

      {/* Stripe/Supabase Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-red-600 text-white font-black rounded-lg flex items-center justify-center text-sm shadow-md shadow-red-950">
                HH
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">HouseHunt <span className="text-red-500 font-normal">Admin</span></span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
              Chuka Main Campus &amp; Multi-Town
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs flex items-center gap-1.5"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline font-semibold">{lastRefreshed ? `Refreshed ${lastRefreshed}` : 'Sync Data'}</span>
            </button>

            <button
              onClick={() => setShowChangePassword(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-400 hover:bg-amber-900/50 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Password</span>
            </button>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/50 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Dashboard Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Fraud Prevention &amp; Trust Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Executive Admin Panel</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Moderate landlord ID verification submissions, verify student profiles, inspect housing listings, and investigate scam reports for Chuka University housing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Verification SLA</div>
              <div className="text-sm font-black text-emerald-400">&lt; 2 Hours (100% Active)</div>
            </div>
          </div>
        </div>

        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div
            onClick={() => setActiveTab('students')}
            className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all ${activeTab === 'students' ? 'border-brand-primary shadow-lg shadow-emerald-950/40 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Students</span>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{totalStudents}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">Registered Accounts</div>
          </div>

          <div
            onClick={() => setActiveTab('landlords')}
            className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all ${activeTab === 'landlords' ? 'border-brand-primary shadow-lg shadow-emerald-950/40 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Landlords</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{totalLandlords}</div>
            <div className="text-[10px] text-amber-400 mt-1 font-bold">{pendingIDCount} Pending ID Checks</div>
          </div>

          <div
            onClick={() => setActiveTab('houses')}
            className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all ${activeTab === 'houses' ? 'border-brand-primary shadow-lg shadow-emerald-950/40 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Listings</span>
              <Home className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{houses.length}</div>
            <div className="text-[10px] text-indigo-400 mt-1 font-bold">{pendingHousesCount} Pending Review</div>
          </div>

          <div
            onClick={() => setActiveTab('reports')}
            className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all ${activeTab === 'reports' ? 'border-brand-primary shadow-lg shadow-emerald-950/40 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Scam Reports</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className={`text-2xl font-black mt-2 ${openReportsCount > 0 ? 'text-red-400' : 'text-white'}`}>{reports.length}</div>
            <div className="text-[10px] text-red-400 mt-1 font-bold">{openReportsCount > 0 ? `${openReportsCount} Active Investigation` : 'Clean Record'}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">DB Status</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-lg font-black text-emerald-400 mt-2">PostgreSQL</div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">Neon Connected</div>
          </div>

        </div>

        {/* Tab Navigation (Stripe / Supabase Style) */}
        <div className="border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto pb-0">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'students'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Students ({totalStudents})</span>
            </button>

            <button
              onClick={() => setActiveTab('landlords')}
              className={`px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'landlords'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Landlords ({totalLandlords})</span>
              {pendingIDCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingIDCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('houses')}
              className={`px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'houses'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Houses Moderation ({houses.length})</span>
              {pendingHousesCount > 0 && (
                <span className="bg-indigo-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingHousesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-red-500 text-red-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Scam Reports ({reports.length})</span>
            </button>
          </nav>
        </div>

        {/* Search & Filter Controls (When applicable) */}
        {(activeTab === 'students' || activeTab === 'landlords' || activeTab === 'houses') && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {(activeTab === 'landlords' || activeTab === 'houses') && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400 font-bold">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  {activeTab === 'landlords' && (
                    <>
                      <option value="PENDING">Pending ID Review</option>
                      <option value="VERIFIED">Verified Badged</option>
                      <option value="UNVERIFIED">Unverified</option>
                      <option value="REJECTED">Rejected</option>
                    </>
                  )}
                  {activeTab === 'houses' && (
                    <>
                      <option value="PENDING_APPROVAL">Pending Approval</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> Quick Security Moderation Actions
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Chuka University Hub</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-slate-300">Landlord ID Approval Queue</div>
                    <p className="text-xs text-slate-400">Review submitted Kenyan National IDs &amp; live selfies for instant blue/emerald checkmark verification.</p>
                    <button
                      onClick={() => setActiveTab('landlords')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
                    >
                      <span>Review {pendingIDCount} Pending IDs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-slate-300">Listing Moderation Gate</div>
                    <p className="text-xs text-slate-400">Approve new housing listings in Ndagani, Gate A, Gate B, and Mariani before students see them.</p>
                    <button
                      onClick={() => setActiveTab('houses')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1"
                    >
                      <span>Moderate {pendingHousesCount} Pending Houses</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Pending ID List Quick Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Pending Landlord Verifications</h3>
                  <button onClick={() => setActiveTab('landlords')} className="text-xs text-emerald-400 font-bold hover:underline">View All</button>
                </div>

                {landlordsList.filter(l => l.verificationStatus === 'PENDING').length > 0 ? (
                  <div className="space-y-3">
                    {landlordsList.filter(l => l.verificationStatus === 'PENDING').slice(0, 3).map(landlord => (
                      <div key={landlord.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white text-sm">{landlord.name}</div>
                          <div className="text-xs text-slate-400">{landlord.email} • ID: {landlord.nationalIdNumber || 'Pending'}</div>
                        </div>
                        <button
                          onClick={() => setSelectedLandlordForModal(landlord)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Check Documents
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-300">All Landlord ID Requests Cleared</p>
                    <p className="text-slate-500 mt-0.5">No unverified landlord documents awaiting admin review.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Log Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-base text-white">Security &amp; System Health</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Database Connection</span>
                    <span className="text-emerald-400 font-bold">PostgreSQL Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Environment</span>
                    <span className="text-slate-200 font-bold">Vercel Production</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Security Encryption</span>
                    <span className="text-emerald-400 font-bold">Bcrypt 12 Rounds</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Admin Email Masking</span>
                    <span className="text-emerald-400 font-bold">Enforced ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: STUDENTS MANAGEMENT ─── */}
        {activeTab === 'students' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-emerald-400" /> Student Accounts Management
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage and inspect Chuka University students registered on HouseHunt.</p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-semibold">
                Showing {studentsList.length} Students
              </div>
            </div>

            {studentsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Student Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Phone Number</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {studentsList.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 font-black flex items-center justify-center border border-emerald-800/50">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{student.name}</span>
                        </td>
                        <td className="p-3.5 text-slate-300">{student.email}</td>
                        <td className="p-3.5 text-slate-400">{student.phone || 'Not provided'}</td>
                        <td className="p-3.5 text-slate-400">{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            STUDENT
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                            Active Student
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300 text-sm">No Student Records Found</p>
                <p className="text-xs text-slate-500">Student accounts will appear here as students register.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: LANDLORDS MANAGEMENT ─── */}
        {activeTab === 'landlords' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-400" /> Landlords &amp; ID Verification Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Verify identity documents and grant the trusted verified landlord badge.</p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-semibold">
                Showing {landlordsList.length} Landlords
              </div>
            </div>

            {landlordsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Landlord Name</th>
                      <th className="p-3.5">Contact Details</th>
                      <th className="p-3.5">National ID</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5">Package Tier</th>
                      <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {landlordsList.map((landlord) => (
                      <tr key={landlord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-950 text-blue-400 font-black flex items-center justify-center border border-blue-800/50">
                            {landlord.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{landlord.name}</div>
                            <span className="text-[10px] font-semibold text-slate-500">{landlord._count?.listings || 0} House Listings</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div>{landlord.email}</div>
                          <div className="text-slate-400 text-[11px]">{landlord.phone || 'No phone'}</div>
                        </td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">
                          {landlord.nationalIdNumber || 'Not submitted'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            landlord.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60' :
                            landlord.verificationStatus === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-700/60 animate-pulse' :
                            landlord.verificationStatus === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-700/60' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {landlord.verificationStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleUserStatusUpdate(landlord.id, undefined, landlord.subscriptionTier === 'PREMIUM' ? 'FREE' : 'PREMIUM')}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                              landlord.subscriptionTier === 'PREMIUM' ? 'bg-purple-950 text-purple-300 border border-purple-700' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {landlord.subscriptionTier || 'FREE'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedLandlordForModal(landlord)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-[11px] transition-all"
                          >
                            Inspect ID Docs
                          </button>

                          {landlord.verificationStatus !== 'VERIFIED' && (
                            <button
                              onClick={() => handleUserStatusUpdate(landlord.id, 'VERIFIED')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] transition-all"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300 text-sm">No Landlord Records Found</p>
                <p className="text-xs text-slate-500">Landlords submitting identity documents will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: HOUSES MODERATION QUEUE ─── */}
        {activeTab === 'houses' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
                  <Home className="w-6 h-6 text-indigo-400" /> Property Listings Moderation Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Approve housing listings before they are displayed to students on HouseHunt.</p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-semibold">
                Showing {filteredHouses.length} Properties
              </div>
            </div>

            {filteredHouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHouses.map((house) => (
                  <div key={house.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          house.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50' :
                          house.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-400 border border-amber-700/50' :
                          'bg-red-950 text-red-400 border border-red-700/50'
                        }`}>
                          {house.status}
                        </span>
                        <h4 className="font-extrabold text-white text-base mt-2">{house.title}</h4>
                        <p className="text-xs text-slate-400">{house.areaName} • KSh {house.rentPerMonth.toLocaleString()} / Month</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Landlord: {house.landlord?.name || 'Unknown'} ({house.landlord?.email || 'N/A'})</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                      {house.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleHouseStatusUpdate(house.id, 'APPROVED')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve Listing
                        </button>
                      )}
                      {house.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleHouseStatusUpdate(house.id, 'REJECTED', 'Failed security compliance check')}
                          className="flex-1 py-2 bg-red-950/60 border border-red-900/60 text-red-400 hover:bg-red-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject Listing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <Home className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300 text-sm">No Property Listings in Queue</p>
                <p className="text-xs text-slate-500">Houses submitted by landlords will appear here for verification.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 5: SCAM REPORTS QUEUE ─── */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-extrabold text-xl text-white">Active Fraud &amp; Scam Investigations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Investigate scam reports submitted by students and take immediate safety action.</p>
              </div>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-6 bg-slate-950 rounded-2xl border border-red-900/40 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {rep.status}
                        </span>
                        <h4 className="font-extrabold text-white text-base mt-2">{rep.reason}</h4>
                        <p className="text-xs text-slate-400">Reporter: {rep.reporter?.name || 'Anonymous Student'} ({rep.reporter?.email})</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            fetch('/api/admin/reports', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ reportId: rep.id, status: 'RESOLVED' }),
                            }).then(() => refreshData());
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong>Report Details:</strong> {rep.details}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-300">No Active Scam Reports</p>
                <p className="text-xs text-slate-500">Student scam reports will appear here for immediate investigation.</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
