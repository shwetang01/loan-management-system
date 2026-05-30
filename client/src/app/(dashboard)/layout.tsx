'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  CheckSquare,
  BadgeDollarSign,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Sales Leads',
    href: '/sales',
    icon: Users,
    roles: ['admin', 'sales'],
  },
  {
    name: 'Sanction Desk',
    href: '/sanction',
    icon: CheckSquare,
    roles: ['admin', 'sanction'],
  },
  {
    name: 'Disbursements',
    href: '/disbursement',
    icon: BadgeDollarSign,
    roles: ['admin', 'disbursement'],
  },
  {
    name: 'Collections',
    href: '/collection',
    icon: TrendingUp,
    roles: ['admin', 'collection'],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enforce auth & redirect borrower
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'borrower') {
        router.push('/apply');
      }
    }
  }, [user, loading, router]);

  // Page level route guard based on active path
  useEffect(() => {
    if (!loading && user && user.role !== 'admin' && user.role !== 'borrower') {
      const activeItem = sidebarItems.find((item) => pathname.startsWith(item.href));
      if (activeItem && !activeItem.roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [pathname, user, loading, router]);

  if (loading || !user || user.role === 'borrower') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Filter items matching user role
  const allowedItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const getRoleColor = (role: string) => {
    const map: Record<string, string> = {
      admin: 'bg-indigo-950 border-indigo-800 text-indigo-400',
      sales: 'bg-emerald-950 border-emerald-800 text-emerald-400',
      sanction: 'bg-amber-950 border-amber-800 text-amber-400',
      disbursement: 'bg-blue-950 border-blue-800 text-blue-400',
      collection: 'bg-pink-950 border-pink-800 text-pink-400',
    };
    return map[role] || 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* ─── SIDEBAR NAVIGATION (Desktop) ────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-950/60 border-r border-slate-850 p-6 justify-between backdrop-blur-xl">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-lg">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span>LMS Dashboard</span>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700 uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-xxs font-extrabold tracking-wide uppercase mt-1 ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-950/30 hover:text-red-400 border border-transparent hover:border-red-900/30 transition w-full text-left"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </aside>

      {/* ─── SIDEBAR NAVIGATION (Mobile Panel) ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm">
          <div className="w-64 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-850 animate-in slide-in-from-left duration-200">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <span>LMS Desk</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xxs font-extrabold tracking-wide uppercase mt-1 ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {allowedItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-250'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition w-full text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT CONTAINER ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Header */}
        <header className="flex h-16 w-full items-center justify-between border-b border-slate-850 bg-slate-950/20 px-6 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest hidden sm:inline">
                Operations Management Console
              </span>
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest sm:hidden">
                LMS Ops Console
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-450 font-medium hidden md:inline">
              Workstation Active
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* Dashboard Views Main Render */}
        <main className="flex-1 p-6 md:p-8 bg-slate-900/60 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
