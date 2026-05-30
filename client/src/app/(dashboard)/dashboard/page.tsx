'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      const roleMap: Record<string, string> = {
        sales: '/sales',
        sanction: '/sanction',
        disbursement: '/disbursement',
        collection: '/collection',
        admin: '/sales',
        borrower: '/apply',
      };
      
      const target = roleMap[user.role] || '/unauthorized';
      router.push(target);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading workspace...</p>
      </div>
    </div>
  );
}
