"use client";

import React from 'react';
import { Mail, Phone, MapPin, Send, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact HouseHunt Chuka</h1>
        <p className="text-xs text-slate-500">
          Have questions or need to report a fraudulent landlord? Our Chuka team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Phone & WhatsApp</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">+254 700 123 456</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Official Email</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">support@househunt.co.ke</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Office Location</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">Mariani Road, Near Chuka Uni Gate A</div>
              <div className="text-[11px] text-slate-400">Tharaka Nithi County | Off Nairobi-Meru Hwy B6</div>
            </div>
          </div>

        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="font-extrabold text-xl text-slate-900">Send us a Direct Message</h3>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent to HouseHunt support."); }} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input type="text" required placeholder="Alex Mutua" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Email</label>
                <input type="email" required placeholder="alex@gmail.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <input type="text" required placeholder="General Inquiry / Report Scam" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message</label>
              <textarea rows={4} required placeholder="Write your message..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
            </div>

            <button type="submit" className="w-full py-3.5 bg-brand-primary hover:bg-brand-blue text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
