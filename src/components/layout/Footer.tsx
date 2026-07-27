import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Phone, Mail, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Safety Warning Banner */}
        <div className="mb-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">HouseHunt Safety Notice</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Never send MPesa booking fees or rent deposits to anyone before physically viewing the house and verifying the landlord badge.
              </p>
            </div>
          </div>
          <Link href="/faq" className="shrink-0 text-xs font-bold bg-amber-500 text-brand-dark px-4 py-2.5 rounded-lg hover:bg-amber-400 transition-colors">
            Read Safety Tips
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-brand-dark">
                <Home className="w-5 h-5 font-bold" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">HouseHunt Chuka</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              The #1 verified student housing platform for Chuka University students in Mariani, Tharaka Nithi. We cover <strong className="text-slate-300">Gate A (Main Entrance)</strong>, <strong className="text-slate-300">Gate B (KK Mwendwa Reservoir Road)</strong>, <strong className="text-slate-300">Ndia Ndoro (Gate C)</strong>, <strong className="text-slate-300">Mutunguruni–Ndagani Market</strong>, <strong className="text-slate-300">Mariani Ridge</strong>, and <strong className="text-slate-300">Chuka Town Center</strong> along the Nairobi-Meru Highway B6.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Expanding soon to Karatina, Juja, Eldoret & Maseno</span>
            </div>
          </div>

          {/* Column 2: Popular Chuka Zones */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Chuka Uni Neighborhoods</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/houses?area=Gate+A+(Main+Gate)" className="hover:text-emerald-400 transition-colors">Gate A — Main Entrance</Link></li>
              <li><Link href="/houses?area=Gate+B+(Ndagani)" className="hover:text-emerald-400 transition-colors">Gate B — KK Mwendwa Reservoir</Link></li>
              <li><Link href="/houses?area=Ndia+Ndoro+(Gate+C)" className="hover:text-emerald-400 transition-colors">Ndia Ndoro — Gate C</Link></li>
              <li><Link href="/houses?area=Mutunguruni+(Ndagani)" className="hover:text-emerald-400 transition-colors">Mutunguruni — Ndagani</Link></li>
              <li><Link href="/houses?area=Mariani+Ridge" className="hover:text-emerald-400 transition-colors">Mariani Ridge</Link></li>
              <li><Link href="/houses?area=Chuka+Town+Center" className="hover:text-emerald-400 transition-colors">Chuka Town Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Navigation & Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/houses" className="hover:text-emerald-400 transition-colors">Search All Houses</Link></li>
              <li><Link href="/dashboard/student" className="hover:text-emerald-400 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/dashboard/landlord" className="hover:text-emerald-400 transition-colors">Landlord Portal</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-emerald-400 transition-colors">Admin Verification</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Landlord Packages</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Support & Trust</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ & Verification</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Report a Scam Listing</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & contacts */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HouseHunt Kenya Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Mariani, Chuka Town — Tharaka Nithi County</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> +254 700 123 456</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
