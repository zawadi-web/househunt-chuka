"use client";

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: "How does HouseHunt eliminate fake house listings & scams?",
      a: "Every landlord MUST submit their Kenyan National ID card and a live selfie match. Additionally, our Chuka field agents physically visit listings to verify photos, water supply, and exact walking distance to Chuka University gates."
    },
    {
      q: "Is house viewing completely free for students?",
      a: "YES. House viewing on HouseHunt Chuka is 100% free. Never pay anyone MPesa deposit or viewing money prior to physically inspecting the room."
    },
    {
      q: "Which areas around Chuka University are covered?",
      a: "We cover: Gate A (Main Entrance along Nairobi-Meru Highway B6), Gate B (KK Mwendwa Water Reservoir Road), Ndia Ndoro (Gate C Pathway), Mutunguruni & Ndagani Market, Mariani Ridge, and Chuka Town Center — all in Tharaka Nithi County."
    },
    {
      q: "Can HouseHunt expand to other universities in Kenya?",
      a: "Yes! Our platform architecture is built to support multi-town multi-tenancy. We are expanding next to Karatina University, Juja (JKUAT), Eldoret (Moi Uni), and Maseno."
    },
    {
      q: "How do I report a suspicious landlord or fake listing?",
      a: "Every listing has a 'Report Fake Listing' button. You can also file a report directly from your student dashboard or by contacting our 24/7 fraud moderation desk."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Anti-Scam & Trust Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Everything you need to know about finding verified student accommodation in Chuka.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-6 text-left font-extrabold text-slate-900 text-sm flex justify-between items-center space-x-4 hover:bg-slate-50 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIndex === idx ? 'rotate-180 text-brand-primary' : ''}`} />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
