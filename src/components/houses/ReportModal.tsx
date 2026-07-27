"use client";

import React, { useState } from 'react';
import { House } from '@/lib/types';
import { AlertTriangle, CheckCircle2, X, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  house: House;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ house, isOpen, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('Demanding Deposit Before Viewing');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-red-100">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center space-x-2 text-red-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Anti-Scam Protection</span>
            </div>

            <h3 className="font-extrabold text-xl text-slate-900 leading-snug">
              Report Fake or Suspect Listing
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Filing a report alerts Chuka HouseHunt security team to freeze the listing and audit the landlord's credentials.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scam Category / Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option>Demanding Deposit / Viewing Fee Before Seeing House</option>
                  <option>Fake / Stolen Room Photos</option>
                  <option>Incorrect Rent Price Advertised</option>
                  <option>House Is Not Available / Already Occupied</option>
                  <option>Unresponsive / Rude Landlord</option>
                  <option>Other Fraudulent Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Explanation & Evidence
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide any MPesa transaction requests, phone numbers used, or specific evidence..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
                  className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Scam Report</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Report Submitted</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for keeping Chuka University housing safe! Our admin security team is reviewing this report and will take immediate action within 2 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
