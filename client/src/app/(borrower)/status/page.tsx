'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Loader2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
  DollarSign
} from 'lucide-react';

const formatRupee = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function StatusPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchLoanStatus = async () => {
      if (!user) return;
      try {
        const res = await api.get('/borrower/my-loan');
        setLoan(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('No loan application was found for your account.');
        } else {
          setError('Failed to load loan application. Ensure backend server is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLoanStatus();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading Loan Details...</p>
        </div>
      </div>
    );
  }

  const stages = [
    { key: 'applied', label: 'Applied', dateField: 'createdAt' },
    { key: 'sanctioned', label: 'Sanctioned', dateField: 'sanctionedAt' },
    { key: 'disbursed', label: 'Disbursed', dateField: 'disbursedAt' },
    { key: 'closed', label: 'Closed', dateField: 'closedAt' },
  ];

  // Map state logic to timeline progression
  const getStageIndex = (status: string) => {
    if (status === 'applied') return 0;
    if (status === 'sanctioned') return 1;
    if (status === 'disbursed') return 2;
    if (status === 'closed') return 3;
    return -1; // e.g. 'rejected'
  };

  const currentStageIndex = loan ? getStageIndex(loan.status) : -1;
  const isRejected = loan && loan.status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span>LMS Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl transition"
            >
              Home
            </button>
            <button
              onClick={logout}
              className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-950/80 hover:bg-red-950/20 px-3.5 py-1.5 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <HelpCircle className="h-12 w-12 text-slate-500 mx-auto" />
            <div>
              <h2 className="text-lg font-bold text-white">No Loan Active</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {error}
              </p>
            </div>
            <button
              onClick={() => router.push('/apply')}
              className="inline-flex h-10 items-center justify-center bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-xl text-white px-6 shadow transition"
            >
              Apply Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Stage/Status Banner */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-850 pb-5">
                <div>
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Application Tracking</span>
                  <h1 className="text-xl font-extrabold text-white mt-1">Application ID: {loan._id}</h1>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isRejected
                      ? 'bg-red-950/50 border-red-800 text-red-400'
                      : loan.status === 'closed'
                      ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
                      : 'bg-blue-950/50 border-blue-800 text-blue-400'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>

              {/* REJECTION CARD DETAILS */}
              {isRejected && (
                <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-5 flex gap-3 text-red-200">
                  <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Application Rejected</h3>
                    <p className="mt-1.5 text-xs text-red-300/90 leading-relaxed">
                      Reason: <span className="italic">{loan.rejectionReason || 'Criteria does not match internal standards.'}</span>
                    </p>
                    <button
                      onClick={() => router.push('/apply')}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
                    >
                      Resubmit Details
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TIMELINE */}
              {!isRejected && (
                <div className="py-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">Visual Timeline</h3>
                  <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
                    {/* Running Line (visible on md screens up) */}
                    <div className="absolute top-4.5 left-0 right-0 h-1 bg-slate-800 hidden md:block z-0" />
                    <div
                      className="absolute top-4.5 left-0 h-1 bg-blue-500 hidden md:block transition-all duration-300 z-0"
                      style={{ width: `${(currentStageIndex / 3) * 100}%` }}
                    />

                    {stages.map((stage, idx) => {
                      const isActive = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const dateVal = loan[stage.dateField];

                      return (
                        <div key={stage.key} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 z-10 md:w-1/4 relative">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold border transition ${
                              isCurrent
                                ? 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-900/60'
                                : isActive
                                ? 'bg-slate-900 border-blue-500 text-blue-400'
                                : 'bg-slate-950 border-slate-800 text-slate-650'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="text-left md:text-center">
                            <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                              {stage.label}
                            </p>
                            {dateVal ? (
                              <span className="text-xxs text-slate-500 flex items-center md:justify-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3 shrink-0" />
                                {formatDate(dateVal)}
                              </span>
                            ) : (
                              <span className="text-xxs text-slate-650 block mt-0.5">Pending</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Financial Ledger Details */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-400" />
                Loan Terms Summary
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                  <span className="text-xxs text-slate-500 font-semibold block uppercase">Principal</span>
                  <span className="text-sm font-bold text-white mt-1 block">{formatRupee(loan.principalAmount)}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                  <span className="text-xxs text-slate-500 font-semibold block uppercase">Tenure</span>
                  <span className="text-sm font-bold text-white mt-1 block">{loan.tenureDays} Days</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                  <span className="text-xxs text-slate-500 font-semibold block uppercase">Total Interest</span>
                  <span className="text-sm font-bold text-blue-400 mt-1 block">{formatRupee(loan.simpleInterest)}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                  <span className="text-xxs text-slate-500 font-semibold block uppercase">Repayment</span>
                  <span className="text-sm font-bold text-emerald-400 mt-1 block">{formatRupee(loan.totalRepayment)}</span>
                </div>
              </div>

              {loan.status === 'disbursed' && (
                <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Total Amount Settled</span>
                    <span className="font-semibold text-white">{formatRupee(loan.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Outstanding Balances</span>
                    <span className="font-bold text-amber-400">{formatRupee(loan.outstandingBalance)}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
