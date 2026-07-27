"use client";

import React, { useState } from 'react';
import { MOCK_REVIEWS, MOCK_HOUSES } from '@/lib/mock-data';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, PlusCircle } from 'lucide-react';

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState(MOCK_HOUSES[0].id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev = {
      id: `r_${Date.now()}`,
      houseId: selectedHouseId,
      studentName: "Alex Mutua (BSc Computer Science)",
      studentAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      rating: Number(rating),
      landlordRating: Number(rating),
      comment: comment,
      verifiedTenant: true,
      createdAt: "Just now"
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsWriteModalOpen(false);
    setComment('');
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
            Student Reviews & Landlord Ratings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback on water availability, landlord responsiveness, and room conditions.
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
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={rev.studentAvatar} alt={rev.studentName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{rev.studentName}</div>
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Chuka Tenant
                    </div>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Posted {rev.createdAt}</span>
                <span className="flex items-center gap-1 text-slate-600 font-bold">
                  <ThumbsUp className="w-3.5 h-3.5 text-brand-primary" /> Helpful
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Student Reviews Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Only verified Chuka University students who have booked and inspected a house can post reviews. Be the first to leave a review after your viewing!
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-xl text-slate-900">Review Your Rental Experience</h3>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Property</label>
                <select 
                  value={selectedHouseId} 
                  onChange={(e) => setSelectedHouseId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {MOCK_HOUSES.map(h => (
                    <option key={h.id} value={h.id}>{h.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Star Rating (1 to 5)</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Scam / Terrible</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Detailed Comment</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about water flow, security, internet speed, and landlord behavior..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md"
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
