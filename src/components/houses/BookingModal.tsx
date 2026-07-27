"use client";

import React, { useState } from 'react';
import { House } from '@/lib/types';
import { Calendar, Clock, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  house: House;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ house, isOpen, onClose }: BookingModalProps) {
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Viewing Appointment</span>
            </div>

            <h3 className="font-extrabold text-xl text-slate-900 leading-snug">
              Book Physical House Inspection
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Schedule a free guided visit with landlord <strong className="text-slate-800">{house.landlord.name}</strong> for {house.title}.
            </p>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Fee Guarantee:</strong> House viewing is completely FREE. Report any landlord or broker demanding money before physical inspection.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  >
                    <option>09:00 AM (Morning)</option>
                    <option>11:00 AM (Mid-Day)</option>
                    <option>02:00 PM (Afternoon CAT Free)</option>
                    <option>04:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Notes for Landlord
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Asking about deposit instalment or wifi speed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-brand-primary hover:bg-brand-blue rounded-xl transition-all shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Viewing Request Sent!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your appointment for <strong className="text-slate-900">{date} at {time}</strong> has been transmitted to {house.landlord.name}. Check your SMS/Dashboard for updates.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="w-full py-3 bg-brand-dark text-white font-bold text-xs rounded-xl hover:bg-brand-blue transition-colors"
            >
              Done & Return
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
