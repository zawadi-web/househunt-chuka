"use client";

import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Building, ArrowRight, CreditCard } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>For Chuka Landlords & Property Managers</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Fill your vacant rooms faster with 100% verified Chuka University student tenants.
        </p>

        {/* Cycle Toggle */}
        <div className="flex items-center justify-center space-x-3 pt-4">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
            className="w-12 h-6 bg-brand-primary rounded-full p-1 transition-colors relative"
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'annually' ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-xs font-bold ${billingCycle === 'annually' ? 'text-slate-900' : 'text-slate-400'}`}>
            Annually <span className="text-emerald-600 text-[10px] uppercase font-black">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE TIER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="font-extrabold text-slate-900 text-xl">Free Starter</div>
            <p className="text-xs text-slate-500">Perfect for single property owners in Chuka.</p>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-slate-900">KSh 0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 Active Property Listing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Government ID Verification Badge</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 4 Verified Room Photos</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard Search Placement</span>
              </li>
            </ul>
          </div>

          <a
            href="/register"
            className="w-full py-4 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl transition-colors block"
          >
            Get Started Free
          </a>
        </div>

        {/* PREMIUM TIER */}
        <div className="bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl text-white space-y-6 flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-4 right-4 bg-emerald-500 text-brand-dark text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            MOST POPULAR
          </div>

          <div className="space-y-4">
            <div className="font-extrabold text-white text-xl flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Premium Host Pro</span>
            </div>
            <p className="text-xs text-slate-400">For landlords managing multiple student blocks.</p>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-emerald-400">
                {billingCycle === 'monthly' ? 'KSh 1,499' : 'KSh 1,199'}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-bold">Unlimited Active Listings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>FEATURED Tag & Top Search Priority</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Video Walkthrough Uploads</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time SMS & Chat Booking Alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Listing Performance Analytics</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => alert("Paystack Integration: Redirecting to secure MPesa / Card checkout portal...")}
            className="w-full py-4 text-center bg-emerald-500 hover:bg-emerald-600 text-brand-dark font-extrabold text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscribe via Paystack (MPesa / Card)</span>
          </button>
        </div>

      </div>

      {/* Future Expansion Teaser */}
      <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 max-w-4xl mx-auto text-center space-y-3">
        <h4 className="font-extrabold text-slate-900 text-base">Moving Companies, Internet Providers & Local Vendors</h4>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Interested in advertising your wifi services, gas cylinder delivery, or student furniture store on HouseHunt? Contact our Chuka business partnerships desk.
        </p>
      </div>

    </div>
  );
}
