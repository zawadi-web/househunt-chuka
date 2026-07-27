"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Home, Search, MessageSquare, User, Menu, X, CheckCircle, PlusCircle, GraduationCap, Building2, LogIn } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-slate-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-brand-blue transition-colors">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-brand-dark">HouseHunt</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Chuka
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">100% Scam-Free Student Housing</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <Link href="/houses" className="hover:text-brand-primary transition-colors flex items-center space-x-1.5">
              <Search className="w-4 h-4 text-brand-primary" />
              <span>Browse Houses</span>
            </Link>
            <Link href="/reviews" className="hover:text-brand-primary transition-colors">
              Student Reviews
            </Link>
            <Link href="/pricing" className="hover:text-brand-primary transition-colors">
              For Landlords
            </Link>
            <Link href="/faq" className="hover:text-brand-primary transition-colors flex items-center space-x-1 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span>Anti-Scam Guide</span>
            </Link>
          </nav>

          {/* Auth buttons — always visible, no mock user */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Post Listing */}
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-brand-primary bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>List Your Property</span>
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-primary px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>

            {/* Register — Role choice dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="bg-brand-primary text-white text-sm font-extrabold px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all shadow-md flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Register Free
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <Link
                      href="/register?role=student"
                      onClick={() => setShowRoleMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">I&apos;m a Student</div>
                        <div className="text-[10px] text-slate-400">Find rooms near Chuka Uni</div>
                      </div>
                    </Link>
                    <Link
                      href="/register?role=landlord"
                      onClick={() => setShowRoleMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">I&apos;m a Landlord</div>
                        <div className="text-[10px] text-slate-400">List rooms &amp; get tenants</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-semibold text-slate-800">
            <Link href="/houses" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50">
              Browse Houses around Chuka Uni
            </Link>
            <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50">
              Student Reviews &amp; Ratings
            </Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50">
              Landlord Plans &amp; Pricing
            </Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-700">
              Anti-Scam Guidelines
            </Link>
          </div>
          {/* Mobile Auth Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-slate-100 text-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link
              href="/register?role=student"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-blue-600 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> Register as Student
            </Link>
            <Link
              href="/register?role=landlord"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-600 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Register as Landlord
            </Link>
          </div>
        </div>
      )}

      {/* Click-outside close for role dropdown */}
      {showRoleMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRoleMenu(false)}
        />
      )}
    </header>
  );
}
