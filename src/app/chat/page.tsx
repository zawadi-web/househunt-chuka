"use client";

import React, { useState } from 'react';
import { MOCK_LANDLORDS } from '@/lib/mock-data';
import { Send, ShieldAlert, CheckCircle2, Phone, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState(MOCK_LANDLORDS[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "landlord",
      content: "Habari Alex! Welcome to Greenwood Heights. Are you free for a physical inspection tomorrow at 10:00 AM?",
      time: "10:14 AM"
    },
    {
      id: "m2",
      sender: "student",
      content: "Habari Mr. Mwangi! Yes, 10 AM works right after my morning lecture at Gate B. Is the borehole water 24/7?",
      time: "10:16 AM"
    },
    {
      id: "m3",
      sender: "landlord",
      content: "Yes, 100% 24/7 borehole with instant shower. Come inspect in person first before making any commitments!",
      time: "10:18 AM"
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      sender: "student",
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* SECURITY CHAT BANNER WARNING */}
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-900 text-xs">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>HouseHunt Safety Notice:</strong> House viewings are FREE. Never send MPesa deposits or booking fees to anyone prior to physical viewing.
          </span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-3 h-[650px] overflow-hidden">
        
        {/* Left Contacts Sidebar */}
        <div className="border-r border-slate-200 p-4 space-y-4 bg-slate-50/50">
          <h3 className="font-extrabold text-lg text-slate-900 px-2">Landlord Chats</h3>
          
          <div className="space-y-2">
            {MOCK_LANDLORDS.map((landlord) => (
              <button
                key={landlord.id}
                onClick={() => setActiveContact(landlord)}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 ${
                  activeContact.id === landlord.id ? 'bg-white shadow-md border border-slate-200' : 'hover:bg-slate-100'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={landlord.image} alt={landlord.name} className="w-12 h-12 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                    <span>{landlord.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Greenwood Student Heights</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Window */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-3">
              <img src={activeContact.image} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <span>{activeContact.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-extrabold">VERIFIED</span>
                </h4>
                <p className="text-[10px] text-slate-500">Government ID Verified • Online</p>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              {activeContact.phone}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-brand-primary text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-3 bg-white">
            <input
              type="text"
              placeholder="Write a message to landlord..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-blue text-white px-5 py-3 rounded-2xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
