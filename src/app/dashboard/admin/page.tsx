"use client";

import React, { useState } from 'react';
import { MOCK_LANDLORDS, MOCK_HOUSES } from '@/lib/mock-data';
import { 
  ShieldAlert, ShieldCheck, UserCheck, AlertTriangle, 
  CheckCircle2, XCircle, FileText, Users, Eye, ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'listings' | 'reports'>('verifications');

  const [pendingLandlords, setPendingLandlords] = useState([
    {
      id: "pl1",
      name: "Joseph Kithinji",
      email: "kithinji.apartments@gmail.com",
      phone: "+254 711 223 344",
      nationalId: "31829401",
      idFrontUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      submittedAt: "2026-07-25"
    }
  ]);

  const [reports, setReports] = useState([
    {
      id: "rep1",
      houseTitle: "Ndagani Breeze Bedsitter",
      reporter: "Student: Kepha Maina",
      reason: "Landlord asked for KSh 500 viewing fee via M-Pesa",
      details: "Called number +254 722 000 111, person claimed I must send deposit before visiting.",
      status: "UNDER_INVESTIGATION",
      date: "2026-07-25"
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Top Header */}
      <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Fraud Control & Security Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">HouseHunt Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chuka University Moderation Queue • Scalable Multi-Town Administration
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-right">
          <div className="text-xs text-slate-400">Moderation SLA Response</div>
          <div className="text-xl font-extrabold text-emerald-400">100% On Time (&lt; 2 Hrs)</div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Users</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">1,420</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Chuka Students & Landlords</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="text-xs font-bold text-slate-400 uppercase">Pending ID Checks</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{pendingLandlords.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Needs Admin Approval</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="text-xs font-bold text-slate-400 uppercase">Active Verified Listings</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">18</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">0 Duplicate Photos</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="text-xs font-bold text-slate-400 uppercase">Scam Alerts</div>
          <div className="text-3xl font-extrabold text-red-600 mt-1">{reports.length}</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">Active Investigation</div>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'verifications' ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Landlord ID Approvals ({pendingLandlords.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'reports' ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Scam Reports Queue ({reports.length})
        </button>
      </div>

      {/* Tab 1: Landlord ID Approval Queue */}
      {activeTab === 'verifications' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h3 className="font-extrabold text-xl text-slate-900">Landlord National ID & Selfie Match</h3>

          {pendingLandlords.length > 0 ? (
            <div className="space-y-6">
              {pendingLandlords.map((landlord) => (
                <div key={landlord.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-extrabold text-slate-900 text-lg">{landlord.name}</div>
                      <div className="text-xs text-slate-500">{landlord.email} • Phone: {landlord.phone}</div>
                      <div className="text-xs font-bold text-emerald-700 mt-1">Kenyan ID: {landlord.nationalId}</div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setPendingLandlords([])}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Landlord</span>
                      </button>
                      <button 
                        onClick={() => setPendingLandlords([])}
                        className="bg-red-100 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* ID Document Previews */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">National ID Document Front</div>
                      <img src={landlord.idFrontUrl} alt="ID Front" className="w-full h-32 object-cover rounded-xl border border-slate-300" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Landlord Live Selfie</div>
                      <img src={landlord.selfieUrl} alt="Selfie Match" className="w-full h-32 object-cover rounded-xl border border-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 font-semibold">
              All landlord verification requests have been processed!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Scam Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h3 className="font-extrabold text-xl text-slate-900">Active Fraud Investigations</h3>
          
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {rep.status}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1">{rep.houseTitle}</h4>
                    <p className="text-xs text-slate-500">{rep.reporter} • Date: {rep.date}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setReports([])}
                      className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-700"
                    >
                      Freeze Listing
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-red-100 text-xs text-slate-700">
                  <strong>Reason:</strong> {rep.reason}<br/>
                  <strong>Details:</strong> {rep.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
