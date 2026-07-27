"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Mail, Lock, User, Phone, IdCard, ArrowRight } from 'lucide-react';
import { Role } from '@/lib/types';

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'LANDLORD') {
      window.location.href = '/dashboard/landlord';
    } else {
      window.location.href = '/dashboard/student';
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-elevated space-y-6">
        
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
            Join Chuka's #1 scam-free student housing network
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'STUDENT' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('LANDLORD')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'LANDLORD' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Landlord
          </button>
          <button
            type="button"
            onClick={() => setRole('AGENT')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'AGENT' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Property Agent
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Mutua"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder={role === 'STUDENT' ? 'student@chuka.ac.ke' : 'landlord@gmail.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number (For OTP Verification)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                required
                placeholder="+254 712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          {/* If Landlord / Agent, require National ID field for verification */}
          {(role === 'LANDLORD' || role === 'AGENT') && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government ID Verification Required</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kenyan National ID Number
                </label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-blue text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs"
          >
            <span>Create {role.toLowerCase()} Account</span>
            <ArrowRight className="w-4 h-4" />
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
