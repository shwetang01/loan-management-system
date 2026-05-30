'use client';

import React from 'react';
import Badge from '../ui/Badge';

export default function SalesTable() {
  const dummyApplications = [
    { id: '1', appNo: 'LMS-2026-F1A9D', borrower: 'Alice Vance', amount: 25000, status: 'submitted' },
    { id: '2', appNo: 'LMS-2026-B8C2E', borrower: 'Bob Miller', amount: 50000, status: 'under_review' },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <th className="p-3">App Number</th>
            <th className="p-3">Borrower</th>
            <th className="p-3">Requested Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y">
          {dummyApplications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/50">
              <td className="p-3 font-semibold text-slate-700">{app.appNo}</td>
              <td className="p-3">{app.borrower}</td>
              <td className="p-3">${app.amount.toLocaleString()}</td>
              <td className="p-3">
                <Badge variant={app.status === 'submitted' ? 'info' : 'warning'}>
                  {app.status}
                </Badge>
              </td>
              <td className="p-3 text-right">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                  Review Files
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
