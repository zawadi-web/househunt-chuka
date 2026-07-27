"use client";

import React, { useState } from 'react';
import { MOCK_REVIEWS, MOCK_HOUSES } from '@/lib/mock-data';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, PlusCircle, Building2, User } from 'lucide-react';

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState<any[]>(MOCK_REVIEWS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState(MOCK_HOUSES[0]?.id || 'custom');
  const [propertyName, setPropertyName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();

    let title = propertyName.trim();
    if (!title && selectedHouseId !== 'custom') {
      const found = MOCK_HOUSES.find(h => h.id === selectedHouseId);
      if (found) title = found.title;
    }
    if (!title) title = "Chuka Student Hostel";

    const newRev = {
      id: `r_${Date.now()}`,
      houseId: selectedHouseId,
      houseTitle: title,
      studentName: "Verified Chuka Student",
      studentAvatar: "",
      rating: Number(rating),
      landlordRating: Number(rating),
      comment: comment,
      verifiedTenant: true,
      createdAt: "Just now"
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsWriteModalOpen(false);
    setComment('');
    setPropertyName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Chuka Student Experiences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Reviews &amp; Landlord Ratings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback on water availability, landlord responsiveness, and room conditions around Chuka Uni.
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-blue text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews List */}
      {reviewsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {rev.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{rev.studentName}</span>
                      {rev.verifiedTenant && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Verified Tenant
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Reviewed: <strong className="text-slate-700">{rev.houseTitle || 'Student Hostel'}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-xs px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                &quot;{rev.comment}&quot;
              </p>

              <div className="text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Posted {rev.createdAt}</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Review
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquarePlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Student Reviews Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Be the first student to review a bedsitter or hostel in Chuka! Share your feedback on borehole water flow, security, and landlord responsiveness.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Write the First Review
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-extrabold text-xl text-slate-900">Review Your Rental Experience</h3>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs font-medium">
              
              {/* Select or Enter Property Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select or Enter Property Name</label>
                {MOCK_HOUSES.length > 0 ? (
                  <select 
                    value={selectedHouseId} 
                    onChange={(e) => setSelectedHouseId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary"
                  >
                    {MOCK_HOUSES.map(h => (
                      <option key={h.id} value={h.id}>{h.title}</option>
                    ))}
                    <option value="custom">-- Type Custom Hostel Name --</option>
                  </select>
                ) : null}

                {(MOCK_HOUSES.length === 0 || selectedHouseId === 'custom') && (
                  <div className="relative mt-2">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gate B Sunrise Hostel, Mariani"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                )}
              </div>

              {/* Star Rating */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Star Rating (1 to 5)</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-primary"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars - Good</option>
                  <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                  <option value={2}>⭐⭐ 2 Stars - Poor</option>
                  <option value={1}>⭐ 1 Star - Scam / Terrible</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Detailed Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about 24/7 borehole water flow, WiFi speed, security guards, and landlord behavior..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:bg-brand-blue transition-all"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
