'use client';

import React from 'react';
import Badge from '../ui/Badge';

export default function SanctionTable() {
  const dummyApplications = [
    { id: '1', appNo: 'LMS-2026-Z7D1Q', borrower: 'Clara Oswald', amount: 35000, breDecision: 'Eligible', score: 720 },
    { id: '2', appNo: 'LMS-2026-Y4A2W', borrower: 'Danny Pink', amount: 15000, breDecision: 'Review Required', score: 610 },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <th className="p-3">App Number</th>
            <th className="p-3">Borrower</th>
            <th className="p-3">Requested Amount</th>
            <th className="p-3">Credit Score</th>
            <th className="p-3">BRE Suggestion</th>
            <th className="p-3 text-right">Decision</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y">
          {dummyApplications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/50">
              <td className="p-3 font-semibold text-slate-700">{app.appNo}</td>
              <td className="p-3">{app.borrower}</td>
              <td className="p-3">${app.amount.toLocaleString()}</td>
              <td className="p-3 font-mono">{app.score}</td>
              <td className="p-3">
                <Badge variant={app.breDecision === 'Eligible' ? 'success' : 'warning'}>
                  {app.breDecision}
                </Badge>
              </td>
              <td className="p-3 text-right space-x-2">
                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition">Sanction</button>
                <button className="text-xs font-semibold text-red-600 hover:text-red-800 transition">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
