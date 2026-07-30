"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Home, ShieldCheck, Mail, Lock, User, Phone, IdCard, ArrowRight, GraduationCap, Building2, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Role } from '@/lib/types';

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [role, setRole] = useState<Role>(() => {
    if (roleParam === 'landlord') return 'LANDLORD';
    if (roleParam === 'agent') return 'AGENT';
    return 'STUDENT';
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (roleParam === 'landlord') setRole('LANDLORD');
    else if (roleParam === 'agent') setRole('AGENT');
    else if (roleParam === 'student') setRole('STUDENT');
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Create the account
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role, nationalId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Step 2: Auto sign-in with the new credentials
      setSuccess(true);
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        // Step 3: Redirect to the correct role-based dashboard
        const dashboardUrl =
          role === 'ADMIN' ? '/dashboard/admin' :
          (role === 'LANDLORD' || role === 'AGENT') ? '/dashboard/landlord' :
          '/dashboard/student';
        setTimeout(() => {
          window.location.href = dashboardUrl;
        }, 1500);
      } else {
        // Fallback: go to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-200 shadow-elevated text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Account Created!</h2>
          <p className="text-sm text-slate-500">
            Welcome to HouseHunt Chuka! A welcome email has been sent to <strong>{email}</strong>. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-elevated space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">HouseHunt Chuka</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Join Chuka&apos;s #1 scam-free student housing network
          </p>
        </div>

        {/* Role Selector — large visual cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              role === 'STUDENT'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${role === 'STUDENT' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">I&apos;m a Student</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Find rooms near Chuka Uni</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('LANDLORD')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              role === 'LANDLORD'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${role === 'LANDLORD' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">I&apos;m a Landlord</div>
            <div className="text-[11px] text-slate-500 mt-0.5">List rooms &amp; get tenants</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder={role === 'STUDENT' ? 'e.g. Grace Kinyua' : 'e.g. Samuel Mwangi'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder={role === 'STUDENT' ? 'student@chuka.ac.ke' : 'landlord@gmail.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                placeholder="e.g. 0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Landlord: National ID required */}
          {(role === 'LANDLORD' || role === 'AGENT') && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government ID Verification Required</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All landlords must verify their National ID before listings go live. This protects students from scammers.
              </p>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Kenyan National ID Number</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 28475910"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition-colors p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-blue text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              <><span>Create {role === 'STUDENT' ? 'Student' : 'Landlord'} Account</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium pt-2">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
