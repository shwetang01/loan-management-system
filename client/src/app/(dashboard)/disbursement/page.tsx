'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Loader2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Send
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

interface Loan {
  _id: string;
  principalAmount: number;
  totalRepayment: number;
  sanctionedAt?: string;
  borrowerId?: {
    name: string;
    email: string;
  };
}

export default function DisbursementPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Confirmation Modal states
  const [confirmingLoan, setConfirmingLoan] = useState<Loan | null>(null);
  const [disbursing, setDisbursing] = useState(false);

  // Toast States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchSanctionedLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/disbursement/sanctioned');
      setLoans(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sanctioned loans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanctionedLoans();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleDisburse = async () => {
    if (!confirmingLoan) return;

    setDisbursing(true);
    try {
      await api.patch(`/disbursement/${confirmingLoan._id}/disburse`, {});

      // Optimistic state update: Remove row
      setLoans((prev) => prev.filter((l) => l._id !== confirmingLoan._id));
      setConfirmingLoan(null);
      triggerToast('Funds successfully disbursed and loan is now active!', 'success');
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Disbursement processing failed.', 'error');
    } finally {
      setDisbursing(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 ${
          toast.type === 'success'
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
            : 'bg-red-950 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-red-400" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-500" />
            Disbursement Desk
          </h1>
          <p className="text-xs text-slate-450 mt-1">
            Track sanctioned applications and disburse capital, updating repayment conditions automatically.
          </p>
        </div>
        <button
          onClick={fetchSanctionedLoans}
          className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 px-4 py-2 rounded-xl transition"
        >
          Refresh Desk
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse" />
            <div className="h-0.5 bg-slate-850 w-full my-4" />
            {[1, 2].map((n) => (
              <div key={n} className="grid grid-cols-5 gap-4 pt-4">
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded col-span-2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-400">
            {error}
          </div>
        ) : loans.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderOpen className="h-10 w-10 text-slate-650 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-white">No Loans Sanctioned</h3>
              <p className="text-xs text-slate-500 mt-1">There are currently no active applications awaiting fund disbursal.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-850 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Borrower</th>
                  <th className="p-4 text-right">Principal Amount</th>
                  <th className="p-4 text-right">Total Repayment Amount</th>
                  <th className="p-4">Sanction Date</th>
                  <th className="p-4 text-center">Fund Disbursal</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-850">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-slate-900/20 transition duration-150">
                    <td className="p-4">
                      <p className="font-bold text-white">{loan.borrowerId?.name || 'Borrower'}</p>
                      <p className="text-xxs text-slate-500 mt-0.5 truncate max-w-[200px]">{loan.borrowerId?.email}</p>
                    </td>
                    <td className="p-4 text-right font-black text-blue-400">{formatRupee(loan.principalAmount)}</td>
                    <td className="p-4 text-right font-extrabold text-emerald-400">{formatRupee(loan.totalRepayment)}</td>
                    <td className="p-4 text-slate-450 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-650" />
                        {formatDate(loan.sanctionedAt)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setConfirmingLoan(loan)}
                        className="h-8.5 px-4 bg-blue-600 hover:bg-blue-500 text-xxs font-bold rounded-lg text-white shadow transition-all duration-150 inline-flex items-center gap-1.5"
                      >
                        <Send className="h-3 w-3" />
                        Disburse Funds
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── CONFIRMATION DIALOG MODAL ─────────────────────────────────────────── */}
      {confirmingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-blue-950 border border-blue-800 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Disburse Funds?</h3>
              <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
                You are about to disburse <span className="font-bold text-white">{formatRupee(confirmingLoan.principalAmount)}</span> to borrower <span className="font-bold text-white">{confirmingLoan.borrowerId?.name}</span>. This action is irreversible.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setConfirmingLoan(null)}
                className="h-10 w-1/2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-450 transition"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleDisburse}
                disabled={disbursing}
                className="h-10 w-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold rounded-xl text-white transition shadow-lg"
              >
                {disbursing ? 'Transferring...' : 'Yes, Disburse'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
