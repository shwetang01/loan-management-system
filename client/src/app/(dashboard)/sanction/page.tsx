'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Loader2,
  Calendar,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FolderOpen,
  FileSpreadsheet,
  Check,
  X,
  CheckSquare
} from 'lucide-react';

const formatRupee = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface LoanApplication {
  _id: string;
  principalAmount: number;
  tenureDays: number;
  totalRepayment: number;
  createdAt: string;
  borrowerId?: {
    name: string;
    email: string;
  };
  profileId?: {
    pan: string;
    monthlySalary: number;
    salarySlipUrl?: string;
  };
}

export default function SanctionPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rejection Modal States
  const [rejectingLoan, setRejectingLoan] = useState<LoanApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingRejection, setSubmittingRejection] = useState(false);

  // Alert/Toast Notification States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sanction/applications');
      setApps(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sanction applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Handle Sanction Approval
  const handleApprove = async (loanId: string) => {
    try {
      await api.patch(`/sanction/applications/${loanId}/approve`, {});
      
      // Optimistic UI update: Remove row
      setApps((prev) => prev.filter((a) => a._id !== loanId));
      triggerToast('Loan application successfully sanctioned & approved!', 'success');
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Approval operation failed.', 'error');
    }
  };

  // Trigger Rejection Modal Open
  const openRejectionModal = (loan: LoanApplication) => {
    setRejectingLoan(loan);
    setRejectionReason('');
  };

  // Submit Rejection Handler
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLoan || !rejectionReason.trim()) return;

    setSubmittingRejection(true);
    try {
      await api.patch(`/sanction/applications/${rejectingLoan._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });

      // Optimistic UI update: Remove row
      setApps((prev) => prev.filter((a) => a._id !== rejectingLoan._id));
      setRejectingLoan(null);
      triggerToast('Loan application rejected.', 'success');
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Rejection operation failed.', 'error');
    } finally {
      setSubmittingRejection(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Dynamic Toast System */}
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
            <CheckSquare className="h-6 w-6 text-blue-500" />
            Sanction Desk Worklist
          </h1>
          <p className="text-xs text-slate-455 mt-1">
            Review applicant financials and verify slips. Approve credit limits or reject underperforming profiles.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 px-4 py-2 rounded-xl transition"
        >
          Reload Applications
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse" />
            <div className="h-0.5 bg-slate-850 w-full my-4" />
            {[1, 2].map((n) => (
              <div key={n} className="grid grid-cols-7 gap-4 pt-4">
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
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
        ) : apps.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderOpen className="h-10 w-10 text-slate-650 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-white">Queue Empty</h3>
              <p className="text-xs text-slate-500 mt-1">There are currently no active applications awaiting sanction.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-850 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Applicant</th>
                  <th className="p-4">PAN</th>
                  <th className="p-4 text-right">Income</th>
                  <th className="p-4 text-right">Principal</th>
                  <th className="p-4 text-center">Tenure</th>
                  <th className="p-4 text-right">Repayment</th>
                  <th className="p-4">Docs</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-850">
                {apps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/20 transition duration-150">
                    <td className="p-4">
                      <p className="font-bold text-white">{app.borrowerId?.name || 'Borrower'}</p>
                      <p className="text-xxs text-slate-500 mt-0.5 truncate max-w-[150px]">{app.borrowerId?.email}</p>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-300 uppercase">{app.profileId?.pan || 'N/A'}</td>
                    <td className="p-4 text-right font-bold text-white">{app.profileId?.monthlySalary ? formatRupee(app.profileId.monthlySalary) : 'N/A'}</td>
                    <td className="p-4 text-right font-black text-blue-400">{formatRupee(app.principalAmount)}</td>
                    <td className="p-4 text-center font-medium text-slate-350">{app.tenureDays} Days</td>
                    <td className="p-4 text-right font-extrabold text-emerald-400">{formatRupee(app.totalRepayment)}</td>
                    <td className="p-4">
                      {app.profileId?.salarySlipUrl ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${app.profileId.salarySlipUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xxs font-semibold text-blue-400 hover:underline"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          View Slip
                        </a>
                      ) : (
                        <span className="text-xxs text-slate-650">No Document</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(app._id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 hover:text-emerald-300 transition"
                          title="Sanction Application"
                        >
                          <Check className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openRejectionModal(app)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 hover:text-red-300 transition"
                          title="Reject Application"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── REJECTION MODAL ────────────────────────────────────────────────────── */}
      {rejectingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form
            onSubmit={handleRejectSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150"
          >
            <div>
              <h3 className="text-lg font-extrabold text-white">Decline Application</h3>
              <p className="text-xs text-slate-400 mt-1">
                Applicant: <span className="font-semibold text-slate-350">{rejectingLoan.borrowerId?.name}</span> (PAN: {rejectingLoan.profileId?.pan})
              </p>
            </div>

            <div>
              <label htmlFor="rejection-reason" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Rejection Reason (Required)
              </label>
              <textarea
                id="rejection-reason"
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify the reason why this applicant fails credit standards..."
                rows={4}
                className="w-full bg-slate-950/40 border border-slate-850 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setRejectingLoan(null)}
                className="h-10 px-4 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingRejection || !rejectionReason.trim()}
                className="h-10 px-5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-xs font-bold rounded-xl text-white transition shadow-lg"
              >
                {submittingRejection ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
