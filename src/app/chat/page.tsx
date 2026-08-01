"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Send, ShieldAlert, CheckCircle2, Phone, MessageSquare, Search, Loader2, CheckCheck, Check } from 'lucide-react';

function ChatContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const targetLandlordId = searchParams.get('landlord') || searchParams.get('landlordId');

  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms & messages
  const fetchChats = async (selectedRoomId?: string | null) => {
    try {
      const activeId = selectedRoomId !== undefined ? selectedRoomId : activeRoomId;
      let queryParams = [];
      if (targetLandlordId) queryParams.push(`landlordId=${targetLandlordId}`);
      if (activeId) queryParams.push(`markRead=${activeId}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await fetch(`/api/chat${queryString}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRooms(data.rooms || []);
          if (data.currentUserId) setCurrentUserId(data.currentUserId);

          // Auto-select room if not set or invalid
          if (data.rooms && data.rooms.length > 0) {
            if (!activeId || !data.rooms.some((r: any) => r.id === activeId)) {
              if (targetLandlordId) {
                const targetRoom = data.rooms.find((r: any) => r.contact.id === targetLandlordId);
                setActiveRoomId(targetRoom ? targetRoom.id : data.rooms[0].id);
              } else {
                setActiveRoomId(data.rooms[0].id);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(activeRoomId);
    const interval = setInterval(() => fetchChats(activeRoomId), 3000); // 3s live polling
    return () => clearInterval(interval);
  }, [targetLandlordId, activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rooms, activeRoomId]);

  const selectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    fetchChats(roomId);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRoom) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatRoomId: activeRoom.id,
          recipientId: activeRoom.contact.id,
          content: messageText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchChats(activeRoom.id);
      } else {
        alert(data.message || 'Failed to send message.');
      }
    } catch (err) {
      alert('Network error sending message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-extrabold text-slate-600">Connecting to live chat server...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* SECURITY CHAT BANNER WARNING */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-900 text-xs">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>HouseHunt Safety Notice:</strong> House viewings are FREE. Never send MPesa deposits or booking fees to anyone prior to physical viewing.
          </span>
        </div>
      </div>

      {/* Main Chat Container */}
      {rooms.length > 0 && activeRoom ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-3 h-[650px] overflow-hidden">
          
          {/* Left Contacts Sidebar */}
          <div className="border-r border-slate-200 p-4 space-y-4 bg-slate-50/50 overflow-y-auto">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-extrabold text-lg text-slate-900">Conversations</h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{rooms.length}</span>
            </div>
            
            <div className="space-y-2">
              {rooms.map((room) => {
                const isActive = room.id === activeRoom.id;
                const contact = room.contact;
                const lastMsg = room.messages[room.messages.length - 1];

                return (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 ${
                      isActive ? 'bg-white shadow-md border border-slate-200 ring-2 ring-emerald-500/20' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {contact.image ? (
                        <img src={contact.image} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-sm">
                          {contact.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                          <span>{contact.name}</span>
                          {contact.verificationStatus === 'VERIFIED' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>

                        {room.unreadCount > 0 && !isActive && (
                          <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shrink-0 animate-bounce">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === currentUserId && (
                              lastMsg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )
                            )}
                            <span className="truncate">{lastMsg.content}</span>
                          </>
                        ) : (
                          <span>Start a conversation</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Active Message Window */}
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
            
            {/* Active Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {activeRoom.contact.image ? (
                    <img src={activeRoom.contact.image} alt={activeRoom.contact.name} className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm">
                      {activeRoom.contact.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{activeRoom.contact.name}</span>
                    {activeRoom.contact.verificationStatus === 'VERIFIED' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-200">
                        VERIFIED
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Online • Active Now
                  </p>
                </div>
              </div>

              {activeRoom.contact.phone && (
                <a
                  href={`tel:${activeRoom.contact.phone}`}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{activeRoom.contact.phone}</span>
                </a>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/40">
              {activeRoom.messages && activeRoom.messages.length > 0 ? (
                activeRoom.messages.map((msg: any) => {
                  const isMe = msg.senderId === currentUserId;
                  const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-primary text-white rounded-br-none font-medium'
                          : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-none font-medium'
                      }`}>
                        {msg.content}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400 font-medium">
                        <span>{formattedTime}</span>
                        {isMe && (
                          msg.isRead ? (
                            <span className="flex items-center text-sky-500 font-bold text-[10px]" title="Read by recipient">
                              <CheckCheck className="w-3.5 h-3.5 text-sky-500" /> Read
                            </span>
                          ) : (
                            <span className="flex items-center text-slate-400 text-[10px]" title="Delivered">
                              <Check className="w-3.5 h-3.5" /> Delivered
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  Start a conversation with {activeRoom.contact.name}. Ask about room availability, deposit, or viewing times.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-3 bg-white">
              <input
                type="text"
                placeholder={`Write a message to ${activeRoom.contact.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="bg-brand-primary hover:bg-brand-blue text-white px-5 py-3 rounded-2xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

          </div>

        </div>
      ) : (
        /* Empty state when 0 conversations exist */
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Active Conversations Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Browse verified student houses and click <strong>"Chat with Landlord"</strong> on any property to start messaging directly.
          </p>
          <div className="pt-2">
            <Link
              href="/houses"
              className="bg-brand-primary text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-brand-blue transition-all inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Browse Houses Near Chuka Uni</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">Loading chat page...</div>}>
      <ChatContent />
    </Suspense>
  );
}
