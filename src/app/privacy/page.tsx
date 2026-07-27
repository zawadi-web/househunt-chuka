import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Last updated: July 25, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
        <h3 className="font-bold text-slate-900 text-sm">1. Data We Collect</h3>
        <p>HouseHunt Chuka collects student and landlord verification data including email address, phone number, and encrypted National ID records for identity verification purposes.</p>

        <h3 className="font-bold text-slate-900 text-sm">2. Use of Information</h3>
        <p>Your identification documents are strictly utilized to prevent rental scams, verify house listings, and facilitate viewing bookings.</p>

        <h3 className="font-bold text-slate-900 text-sm">3. Security</h3>
        <p>All sensitive documents uploaded to Cloudinary are protected with tokenized access permissions and zero third-party disclosure.</p>
      </div>
    </div>
  );
}
