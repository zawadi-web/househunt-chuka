"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

function getDashboardForRole(role?: string) {
  if (role === 'ADMIN') return '/dashboard/admin';
  if (role === 'LANDLORD' || role === 'AGENT') return '/dashboard/landlord';
  return '/dashboard/student';
}

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      window.location.href = '/login';
      return;
    }
    if (session?.user) {
      const role = (session.user as any).role;
      window.location.href = getDashboardForRole(role);
    }
  }, [session, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
        <p className="text-slate-300 text-sm font-semibold">Loading your dashboard...</p>
      </div>
    </div>
  );
}
