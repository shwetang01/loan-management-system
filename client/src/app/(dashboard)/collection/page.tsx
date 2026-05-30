'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Loader2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Plus,
  Coins,
  History,
  FileSpreadsheet
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

interface Payment {
  _id: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy?: string;
}

interface ActiveLoanItem {
  loan: {
    _id: string;
    principalAmount: number;
    totalRepayment: number;
    totalPaid: number;
    outstandingBalance: number;
    status: string;
    borrowerId?: {
      name: string;
      email: string;
    };
  };
  payments: Payment[];
}

export default function CollectionPage() {
  const [activeItems, setActiveItems] = useState<ActiveLoanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expandable row IDs
  const [expandedLoanIds, setExpandedLoanIds] = useState<Set<string>>(new Set());

  // Record Payment Modal states
  const [paymentLoan, setPaymentLoan] = useState<ActiveLoanItem['loan'] | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchActiveLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/collection/active');
      setActiveItems(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch collection data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleRow = (loanId: string) => {
    const next = new Set(expandedLoanIds);
    if (next.has(loanId)) {
      next.delete(loanId);
    } else {
      next.add(loanId);
    }
    setExpandedLoanIds(next);
  };

  const handleOpenPaymentModal = (loan: ActiveLoanItem['loan']) => {
    setPaymentLoan(loan);
    setUtrNumber('');
    setAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setInlineError(null);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!paymentLoan) return;
    if (!utrNumber.trim()) {
      setInlineError('UTR Number is required.');
      return;
    }

    const payAmt = Number(amount);
    if (isNaN(payAmt) || payAmt <= 0) {
      setInlineError('Amount must be a number greater than 0.');
      return;
    }

    if (payAmt > paymentLoan.outstandingBalance) {
      setInlineError(`Amount cannot exceed the remaining outstanding balance of ${formatRupee(paymentLoan.outstandingBalance)}.`);
      return;
    }

    const selectedDate = new Date(paymentDate);
    if (selectedDate.getTime() > Date.now()) {
      setInlineError('Payment date cannot be in the future.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await api.post(`/collection/${paymentLoan._id}/payment`, {
        utrNumber: utrNumber.trim(),
        amount: payAmt,
        paymentDate,
      });

      const { loan: updatedLoan, payment: newPayment } = res.data;

      // Update state
      setActiveItems((prev) => {
        return prev
          .map((item) => {
            if (item.loan._id === updatedLoan._id) {
              return {
                ...item,
                loan: updatedLoan,
                payments: [newPayment, ...item.payments],
              };
            }
            return item;
          })
          // If the loan is now closed, move it out of the active list
          .filter((item) => item.loan.status !== 'closed');
      });

      setPaymentLoan(null);
      
      if (updatedLoan.status === 'closed') {
        triggerToast(`Payment recorded. Loan successfully CLOSED and settled!`, 'success');
      } else {
        triggerToast(`Payment of ${formatRupee(payAmt)} successfully recorded!`, 'success');
      }
    } catch (err: any) {
      setInlineError(err.response?.data?.message || 'Failed to register transaction.');
    } finally {
      setSubmittingPayment(false);
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
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Collection Ledger & Payments
          </h1>
          <p className="text-xs text-slate-450 mt-1">
            Track active borrower balances, review repayment progress ratios, and record incoming collections.
          </p>
        </div>
        <button
          onClick={fetchActiveLoans}
          className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 px-4 py-2 rounded-xl transition"
        >
          Refresh Ledger
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse" />
            <div className="h-0.5 bg-slate-850 w-full my-4" />
            {[1, 2].map((n) => (
              <div key={n} className="grid grid-cols-6 gap-4 pt-4">
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-400">
            {error}
          </div>
        ) : activeItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderOpen className="h-10 w-10 text-slate-650 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-white">No Active Accounts</h3>
              <p className="text-xs text-slate-500 mt-1">There are currently no active disbursed loans undergoing collections.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-850 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 w-10"></th>
                  <th className="p-4">Borrower</th>
                  <th className="p-4 text-right">Principal</th>
                  <th className="p-4 text-right">Repayment</th>
                  <th className="p-4 text-right">Paid</th>
                  <th className="p-4 text-right">Outstanding</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4 text-center">Receipts</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-850">
                {activeItems.map((item) => {
                  const { loan, payments } = item;
                  const isExpanded = expandedLoanIds.has(loan._id);
                  const progressPct = Math.min(100, Math.round((loan.totalPaid / loan.totalRepayment) * 100));

                  return (
                    <React.Fragment key={loan._id}>
                      {/* Main Loan Row */}
                      <tr className="hover:bg-slate-900/20 transition duration-150">
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleRow(loan._id)}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-850 hover:text-white transition"
                          >
                            {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                          </button>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">{loan.borrowerId?.name || 'Borrower'}</p>
                          <p className="text-xxs text-slate-500 mt-0.5 truncate max-w-[150px]">{loan.borrowerId?.email}</p>
                        </td>
                        <td className="p-4 text-right text-slate-350">{formatRupee(loan.principalAmount)}</td>
                        <td className="p-4 text-right text-slate-350">{formatRupee(loan.totalRepayment)}</td>
                        <td className="p-4 text-right font-semibold text-emerald-400">{formatRupee(loan.totalPaid)}</td>
                        <td className="p-4 text-right font-bold text-amber-400">{formatRupee(loan.outstandingBalance)}</td>
                        <td className="p-4">
                          <div className="space-y-1.5 min-w-[100px]">
                            <div className="flex justify-between text-xxs text-slate-500 font-semibold">
                              <span>Ratio</span>
                              <span>{progressPct}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleOpenPaymentModal(loan)}
                            className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-xxs font-bold rounded-lg text-white shadow-md transition inline-flex items-center gap-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Payment
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Nest Row: Payments Ledger */}
                      {isExpanded && (
                        <tr className="bg-slate-950/20 border-b border-slate-850">
                          <td colSpan={8} className="p-5">
                            <div className="border border-slate-850 rounded-2xl p-4 bg-slate-950/30 space-y-4">
                              <h4 className="text-xxs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 border-b border-slate-850 pb-2">
                                <History className="h-3.5 w-3.5 text-blue-400" />
                                Payment Ledger History ({payments.length} Transactions)
                              </h4>
                              
                              {payments.length === 0 ? (
                                <p className="text-xs text-slate-600 italic">No payments have been recorded for this loan yet.</p>
                              ) : (
                                <div className="overflow-hidden rounded-xl border border-slate-850/80">
                                  <table className="w-full text-left text-xxs border-collapse bg-slate-900/10">
                                    <thead>
                                      <tr className="bg-slate-900/30 text-slate-550 border-b border-slate-850">
                                        <th className="p-3">Transaction Date</th>
                                        <th className="p-3">UTR Reference Number</th>
                                        <th className="p-3 text-right">Amount Received</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-850/60 text-slate-350">
                                      {payments.map((p) => (
                                        <tr key={p._id} className="hover:bg-slate-850/20">
                                          <td className="p-3 font-mono">
                                            <span className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3 text-slate-600" />
                                              {formatDate(p.paymentDate)}
                                            </span>
                                          </td>
                                          <td className="p-3 font-mono font-semibold text-slate-300">{p.utrNumber}</td>
                                          <td className="p-3 text-right font-bold text-emerald-400">{formatRupee(p.amount)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── RECORD PAYMENT MODAL ──────────────────────────────────────────────── */}
      {paymentLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form
            onSubmit={handleRecordPaymentSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150"
          >
            <div>
              <h3 className="text-lg font-extrabold text-white">Record EMI Receipt</h3>
              <p className="text-xs text-slate-400 mt-1">
                Loan ID: <span className="font-mono text-slate-300">{paymentLoan._id}</span> | Borrower: <span className="font-semibold text-slate-350">{paymentLoan.borrowerId?.name}</span>
              </p>
            </div>

            {inlineError && (
              <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 flex gap-3 text-red-200 text-xs">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <span>{inlineError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="utr-number" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  UTR Reference Number (Unique)
                </label>
                <input
                  id="utr-number"
                  type="text"
                  required
                  placeholder="e.g. UTR123456789012"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full mt-1.5 h-11 bg-slate-950/40 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="payment-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount Received (₹)
                  </label>
                  <input
                    id="payment-amount"
                    type="number"
                    required
                    step="0.01"
                    placeholder={`Max ${paymentLoan.outstandingBalance}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mt-1.5 h-11 bg-slate-950/40 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <p className="mt-1 text-xxs text-slate-500">Bal: {formatRupee(paymentLoan.outstandingBalance)}</p>
                </div>

                <div>
                  <label htmlFor="payment-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment Date
                  </label>
                  <input
                    id="payment-date"
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full mt-1.5 h-11 bg-slate-950/40 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setPaymentLoan(null)}
                className="h-10 px-4 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingPayment}
                className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold rounded-xl text-white transition shadow-lg inline-flex items-center gap-1.5"
              >
                {submittingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    Record Receipt
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
