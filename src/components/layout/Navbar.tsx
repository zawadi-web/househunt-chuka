"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Home, Search, MessageSquare, User, Menu, X, CheckCircle, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<{ name: string; role: string } | null>({
    name: "Alex Mutua",
    role: "STUDENT"
  });

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

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/pricing" 
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-brand-primary bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>List Your Property</span>
            </Link>

            {activeUser ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <Link
                  href={activeUser.role === 'ADMIN' ? '/dashboard/admin' : activeUser.role === 'LANDLORD' ? '/dashboard/landlord' : '/dashboard/student'}
                  className="flex items-center space-x-2.5 bg-brand-dark text-white px-4 py-2.5 rounded-xl hover:bg-brand-blue transition-all shadow-sm text-sm font-semibold"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/chat" className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors relative">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-brand-primary px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="bg-brand-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-brand-blue transition-all shadow-md">
                  Register
                </Link>
              </div>
            )}
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
              Student Reviews & Ratings
            </Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50">
              Landlord Plans & Pricing
            </Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-700">
              Anti-Scam Guidelines
            </Link>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link href="/dashboard/student" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-brand-dark text-white font-bold py-3 rounded-xl">
              Go to Dashboard
            </Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-xl">
              Post Listing (Landlord)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
