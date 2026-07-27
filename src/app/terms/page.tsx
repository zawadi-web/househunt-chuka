import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
      <p className="text-xs text-slate-500">Last updated: July 25, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
        <h3 className="font-bold text-slate-900 text-sm">1. Anti-Scam Zero Advance Payment Rule</h3>
        <p>Landlords and agents registered on HouseHunt are strictly prohibited from requesting advance viewing fees or deposit payments prior to a student's physical house inspection.</p>

        <h3 className="font-bold text-slate-900 text-sm">2. Account Suspension</h3>
        <p>Any listing found to utilize fraudulent or duplicate photos will be immediately frozen and reported to relevant authorities.</p>
      </div>
    </div>
  );
}
