'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Users
} from 'lucide-react';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Lead {
  id: string;
  name: string;
  email: string;
  breStatus: 'passed' | 'failed' | 'pending';
  salarySlipUploaded: boolean;
  loanApplied: boolean;
  createdAt: string;
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const limit = 5;

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/sales/leads?page=${page}&limit=${limit}`);
      setLeads(res.data.leads || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalLeads(res.data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sales leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  // Clientside filtering by Name or Email
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Sales leads desk
          </h1>
          <p className="text-xs text-slate-450 mt-1">
            Review registered borrower accounts and verify their automated eligibility statuses.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 px-4 py-2 rounded-xl transition"
        >
          Refresh Leads
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-slate-950/40 border border-slate-850 rounded-xl pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-800 rounded-full w-1/4 animate-pulse" />
              <div className="h-4 bg-slate-800 rounded-full w-1/12 animate-pulse" />
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="grid grid-cols-6 gap-4 pt-4 border-t border-slate-850">
                <div className="h-3 bg-slate-800/80 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-800/80 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-slate-800/80 rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-slate-850 rounded-full w-1/3 animate-pulse" />
                <div className="h-3 bg-slate-800/80 rounded w-12 animate-pulse" />
                <div className="h-3 bg-slate-800/80 rounded w-12 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-400">
            {error}
          </div>
        ) : filteredLeads.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <Users className="h-10 w-10 text-slate-650 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-white">No Leads Available</h3>
              <p className="text-xs text-slate-500 mt-1">There are currently no borrower records found matching your filters.</p>
            </div>
          </div>
        ) : (
          /* Table Render */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-850 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">BRE Eligibility</th>
                  <th className="p-4 text-center">Income Proof</th>
                  <th className="p-4 text-center">Loan Status</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-850">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/20 transition-all duration-100">
                    <td className="p-4 font-bold text-white">{lead.name}</td>
                    <td className="p-4 text-slate-400 font-mono">{lead.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider ${
                        lead.breStatus === 'passed'
                          ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                          : lead.breStatus === 'failed'
                          ? 'bg-red-950 border-red-800 text-red-400'
                          : 'bg-slate-900 border-slate-750 text-slate-400'
                      }`}>
                        {lead.breStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {lead.salarySlipUploaded ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-950/40 text-emerald-400 px-2 py-0.5 text-xxs font-semibold">
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-900/40 text-slate-500 px-2 py-0.5 text-xxs">
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {lead.loanApplied ? (
                        <span className="inline-flex items-center rounded-full bg-blue-950/40 text-blue-400 px-2 py-0.5 text-xxs font-semibold">
                          Applied
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-900/40 text-slate-500 px-2 py-0.5 text-xxs">
                          Not Applied
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-450 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-650" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Panel */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-850 px-6 py-4 bg-slate-950/20 text-xs">
            <span className="text-slate-500 font-medium">
              Showing leads {((page - 1) * limit) + 1} - {Math.min(page * limit, totalLeads)} of {totalLeads}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-8 w-8 flex items-center justify-center border border-slate-800 hover:bg-slate-900 rounded-lg text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="h-8 w-8 flex items-center justify-center border border-slate-800 hover:bg-slate-900 rounded-lg text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
