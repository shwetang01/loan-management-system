'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-950/40 border border-slate-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="h-16 w-16 bg-red-950 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Access Denied</h1>
          <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
            You do not possess the required security credentials to view this operations module. Please contact your administrator or sign in using a different account.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/login"
            className="flex h-11 items-center justify-center bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-xl text-white transition shadow-md gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/"
            className="flex h-11 items-center justify-center border border-slate-850 hover:bg-slate-900 text-sm font-semibold rounded-xl text-slate-350 transition gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
